import React, { Component } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import { unidadesMedida, aplicationLine } from '../../../global/catalogs';
import { Button } from 'primereact/button';
import ProveedorService from '../../../service/ProveedorService';
import SolicitudEnsayoService from '../../../service/SolicitudEnsayo/SolicitudEnsayoService';
import "../../site.css";
import * as _ from "lodash";
import * as moment from 'moment';
import history from '../../../history';
import Adjuntos from './Adjuntos';
import Historial from './Historial';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { determinarColorActivo } from './ClasesUtilidades';
import { Toolbar } from 'primereact/toolbar';
import SolicitudDocumentoService from '../../../service/SolicitudEnsayo/SolicitudDocumentoService';
import SolicitudPlanAccionService from '../../../service/SolicitudPlanAccion/SolicitudPlanAccionService';

const TIPO_SOLICITUD = 'SOLICITUD_ENSAYO';
class FormularioSE extends Component {

    constructor() {
        super();
        this.state = {
            objectivos: [],
            proveedoresData: [],
            id: 0,
            codigo: null,
            nivelPrioridadData: [],
            filteredProveedoresSingle: null,
            proveedorSeleccionado: null,
            cantidad: null,
            unidad: null,
            materialEntregado: null,
            lineaAplicacion: null,
            uso: null,
            fechaEntrega: null,
            prioridad: null,
            tiempoEntrega: null,
            observacion: null,
            estado: null,
            mostrarControles: false,
            editar: true,
            muestraEntrega: null,
            muestraUbicacion: null,
            muestraImagenId: null,
            adjuntosRequeridos: [],
            archivos: [],
            adjuntoSeleccionado: null,

            planesAccion: []

        };
        this.filterProveedorSingle = this.filterProveedorSingle.bind(this);
        this.onObjectiveChange = this.onObjectiveChange.bind(this);
        this.guardar = this.guardar.bind(this);
        this.enviarSolicitud = this.enviarSolicitud.bind(this);
        this.anularSolicitud = this.anularSolicitud.bind(this);
        this.templateAdjunto = this.templateAdjunto.bind(this);
        this.myUploader = this.myUploader.bind(this);
        this.descargarAdjunto = this.descargarAdjunto.bind(this);
        this.eliminarAdjunto = this.eliminarAdjunto.bind(this);
        this.myUploaderImagenMuestra = this.myUploaderImagenMuestra.bind(this);
        this.leerImagenMuestra = this.leerImagenMuestra.bind(this);
        this.actionTemplateCumplido = this.actionTemplateCumplido.bind(this);
    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);
        const proveedores = await ProveedorService.list();
        const prioridadesNivel = await SolicitudEnsayoService.listarPrioridadNivel();
        this.setState({ proveedoresData: proveedores, nivelPrioridadData: prioridadesNivel });
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudEnsayoService.listarPorId(idSolicitud);
            if (solicitud) {
                console.log(solicitud);
                const planes = await SolicitudPlanAccionService.listarPorTipo('SOLICITUD_ENSAYOS', idSolicitud);
                let objetivosValor = _.split(solicitud.objetivo, ',');
                let proveedorValor = null;
                if (solicitud.proveedorId)
                    proveedorValor = { idProvider: solicitud.proveedorId, nameProvider: solicitud.proveedorNombre };
                else
                    proveedorValor = solicitud.proveedorNombre;
                if (solicitud.muestraImagenId)
                    this.leerImagenMuestra(solicitud.muestraImagenId);                
                this.setState({
                    id: solicitud.id,
                    codigo: solicitud.codigo,
                    proveedorSeleccionado: proveedorValor,
                    cantidad: solicitud.cantidad,
                    unidad: solicitud.unidad,
                    materialEntregado: solicitud.detalleMaterial,
                    lineaAplicacion: solicitud.lineaAplicacion,
                    uso: solicitud.uso,
                    fechaEntrega: moment(solicitud.fechaEntrega, 'YYYY-MM-DD').toDate(),
                    prioridad: solicitud.prioridad,
                    tiempoEntrega: solicitud.tiempoEntrega,
                    objectivos: objetivosValor,
                    estado: solicitud.estado,
                    muestraEntrega: moment(solicitud.muestraEntrega, 'YYYY-MM-DD').toDate(),
                    muestraUbicacion: solicitud.muestraUbicacion,
                    muestraImagenId: solicitud.muestraImagenId,
                    adjuntosRequeridos: solicitud.adjuntosRequeridos,
                    mostrarControles: solicitud.estado === 'NUEVO',
                    editar: solicitud.estado === 'NUEVO',
                    planesAccion: planes
                });
                this.listarArchivos(idSolicitud);
            }
        }
    }

    async listarArchivos(idSolicitud) {
        const archivosData = await SolicitudDocumentoService.listarArchivos('NUEVO', 'INGRESO_SOLICITUD', idSolicitud);
        this.setState({ archivos: archivosData });
    }

    filterProveedorSingle(event) {
        setTimeout(() => {
            let results = this.state.proveedoresData.filter((proveedor) => {
                return proveedor.nameProvider.toLowerCase().startsWith(event.query.toLowerCase());
            });
            this.setState({ filteredProveedoresSingle: results });
        }, 250);
    }


    /* Metodo para los checkBoxs */
    onObjectiveChange(e) {
        let selectedObjectives = [...this.state.objectivos];
        if (e.checked)
            selectedObjectives.push(e.value);
        else
            selectedObjectives.splice(selectedObjectives.indexOf(e.value), 1);
        this.setState({ objectivos: selectedObjectives });
    }

    async anularSolicitud() {
        this.props.openModal();
        const objSE = { id: this.state.id, observacion: this.state.observacion, orden: 'INGRESO_SOLICITUD' };
        await SolicitudEnsayoService.anularSolicitud(objSE);
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Anulada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudse`);
        }, 1000);
    }

    async guardar() {
        if (!this.formularioValido()) {
            this.growl.show({ severity: 'error', detail: 'Complete los campos requeridos.' });
            return false;
        }

        this.props.openModal();
        const solicitudCreada = await SolicitudEnsayoService.create(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Creada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudse_edit/${solicitudCreada.id}`);
        }, 1000);
    }

    crearObjSolicitud() {
        let Nombreproveedor = '';
        let IdProveedor = '';
        if (_.has(this.state.proveedorSeleccionado, 'idProvider')) {
            Nombreproveedor = this.state.proveedorSeleccionado.nameProvider;
            IdProveedor = this.state.proveedorSeleccionado.idProvider;
        } else {
            Nombreproveedor = this.state.proveedorSeleccionado;
        }
        return {
            id: this.state.id,
            fechaEntrega: moment(this.state.fechaEntrega).format("YYYY-MM-DD"),
            prioridad: this.state.prioridad,
            proveedorNombre: Nombreproveedor,
            proveedorId: IdProveedor,
            objetivo: _.join(this.state.objectivos, ','),
            tiempoEntrega: this.state.tiempoEntrega,
            detalleMaterial: this.state.materialEntregado,
            cantidad: this.state.cantidad,
            unidad: this.state.unidad,
            lineaAplicacion: this.state.lineaAplicacion,
            observacion: this.state.observacion,
            muestraEntrega: moment(this.state.muestraEntrega).format("YYYY-MM-DD"),
            muestraUbicacion: this.state.muestraUbicacion
        }
    }

    formularioValido() {
        debugger
        if (_.isEmpty(moment(this.state.fechaEntrega).format("YYYY-MM-DD")) || _.isEmpty(this.state.prioridad)
            || _.isEmpty(this.state.proveedorSeleccionado) || _.isEmpty(this.state.objectivos) || _.isEmpty(this.state.tiempoEntrega) || _.isEmpty(this.state.materialEntregado)
            || _.isEmpty(this.state.cantidad) || _.isEmpty(this.state.unidad) || _.isEmpty(this.state.lineaAplicacion) || _.isEmpty(moment(this.state.muestraEntrega).format("YYYY-MM-DD")) || _.isEmpty(this.state.muestraUbicacion))
            return false;

        return true;
    }

    async enviarSolicitud() {
        await SolicitudEnsayoService.actualizar(this.crearObjSolicitud());
        this.refrescar(this.state.id);
        await SolicitudEnsayoService.enviarSolicitud(this.crearObjSolicitud());
        this.growl.show({ severity: 'success', detail: 'Solicitud Enviada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudse`);
        }, 2000);
    }

    onChangeNivelPrioridad(value) {
        switch (value) {
            case 'ALTO':
                this.setState({ prioridad: value, tiempoEntrega: 'CASOS_ESPECIALES' });
                break;
            case 'MEDIO':
                this.setState({ prioridad: value, tiempoEntrega: value });
                break;
            case 'BAJO':
                this.setState({ prioridad: value, tiempoEntrega: value });
                break;
            default:
                this.setState({ prioridad: value, tiempoEntrega: value });
                break;
        }
    }

    onChangeAdjunto(valueCheck, adjunto) {
        this.setState({ value: valueCheck, adjuntoSeleccionado: adjunto });
    }

    templateAdjunto(row, column) {
        return (
            <div className="p-grid">
                <div className='p-col-12 p-lg-1' style={{ textAlign: 'center' }}>
                    <RadioButton disabled={row.documentoId > 0} value={row.id} name="city" onChange={(e) => this.onChangeAdjunto(e.value, row)} checked={this.state.value === row.id} />
                </div>
                <div className='p-col-12 p-lg-7'>
                    {row.nombre}
                </div>
                <div className='p-col-12 p-lg-3' style={{ textAlign: 'right' }}>
                    {row.obligatorio &&
                        <span className='customer-badge-danger'>{row.obligatorio ? 'Obligatorio' : ''}</span>
                    }
                </div>
                {row.documentoId > 0 &&
                    <div className='p-col-12 p-lg-1' style={{ textAlign: 'center' }}>
                        <span className='boton-archivo pi pi-download' onClick={() => this.descargarAdjunto(row.documentoId)} ></span>
                        {this.state.mostrarControles &&
                            < span className='boton-archivo pi pi-times' onClick={() => this.eliminarAdjunto(row.documentoId)} ></span>
                        }
                    </div>
                }

            </div>
        );
    }

    async descargarAdjunto(idAdjunto) {
        const nombreArchivo = this.state.archivos.find(x => x.id === idAdjunto).nombreArchivo;
        const data = await SolicitudDocumentoService.ver(idAdjunto);
        const ap = window.URL.createObjectURL(data)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = ap;
        a.download = `${nombreArchivo}`;
        a.click();
    }

    async eliminarAdjunto(id) {
        await SolicitudDocumentoService.eliminar(id);
        this.growl.show({ severity: 'success', detail: 'Archivo eliminado' });
        this.refrescar(this.state.id);
    }

    async myUploader(event) {
        if (!this.state.adjuntoSeleccionado) {
            this.growl.show({ severity: 'error', detail: 'Seleccione el documento a subir' });
            this.fileUploadRef.clear();
            return false;
        }
        await SolicitudDocumentoService.subirArchivo(this.crearSolicitudDocumento(event.files[0]));
        this.growl.show({ severity: 'success', detail: 'Archivo subido' });
        this.setState({ value: null, adjuntoSeleccionado: null });
        this.refrescar(this.state.id);
        this.fileUploadRef.clear();
    }

    crearSolicitudDocumento(archivo) {
        let infoAdicional = {};
        let formadata = new FormData();
        infoAdicional.orden = 'INGRESO_SOLICITUD';
        infoAdicional.idSolicitud = this.state.id;
        infoAdicional.adjuntoRequeridoId = this.state.adjuntoSeleccionado ? this.state.adjuntoSeleccionado.id : 0;
        formadata.append('file', archivo);
        formadata.append('info', JSON.stringify(infoAdicional));
        return formadata;
    }

    async myUploaderImagenMuestra(event) {
        const respuesta = await SolicitudDocumentoService.subirArchivoImagenMuestra(this.crearSolicitudDocumento(event.files[0]));
        this.setState({ muestraImagenId: respuesta.documentoEnsayo.id })
        document.getElementById("ItemPreview").src = `data:${respuesta.documentoEnsayo.tipo};base64,` + respuesta.imagen;
        this.fileUploadRefIM.clear();
    }

    async leerImagenMuestra(idDocumento) {
        const respuesta = await SolicitudDocumentoService.verImagenMuestra(idDocumento);
        if (respuesta) {
            console.log(respuesta);
            document.getElementById("ItemPreview").src = `data:${respuesta.documentoEnsayo.tipo};base64,` + respuesta.imagen;
        }
    }

    actionTemplateCumplido(rowData) {
        if (rowData.cumplido === null)
            return "";
        else
            return <span className={determinarColorActivo(rowData.cumplido)}>{rowData.cumplido ? 'SI' : 'NO'}</span>;
    }

    render() {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };

        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3 className='text-titulo'><strong>SOLICITUD DE ENSAYO</strong></h3>
                <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN DE LA SOLICITUD</div>

                <div className="p-grid p-grid-responsive p-fluid">
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Código</label>
                        <InputText readOnly value={this.state.codigo} />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Fecha de Entrega</label>
                        <Calendar disabled={!this.state.editar} dateFormat="yy/mm/dd" value={this.state.fechaEntrega} locale={es} onChange={(e) => this.setState({ fechaEntrega: e.value })} showIcon={true} />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Nivel Prioridad</label>
                        <Dropdown disabled={!this.state.editar} options={this.state.nivelPrioridadData} value={this.state.prioridad} autoWidth={false} onChange={(event => this.onChangeNivelPrioridad(event.value))} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Proveedor</label>
                        <AutoComplete disabled={!this.state.editar} field="nameProvider" value={this.state.proveedorSeleccionado} suggestions={this.state.filteredProveedoresSingle} completeMethod={this.filterProveedorSingle}
                            size={30} minLength={1} onChange={(e) => this.setState({ proveedorSeleccionado: e.value })} />
                    </div>

                    <div className="p-col-12 p-lg-12" >
                        <div className="p-grid" >
                            <label className="p-col-12 p-lg-12" htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>OBJETIVO</label>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox disabled={!this.state.editar} inputId="cb1" value="Ahorro de Costos" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Ahorro de Costos') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Ahorro de Costos</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox disabled={!this.state.editar} inputId="cb2" value="Disponibilidad de Material" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Disponibilidad de Material') !== -1}></Checkbox>
                                <label htmlFor="cb2" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Disponibilidad de Material</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox disabled={!this.state.editar} inputId="cb3" value="Solicitud Interna" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Solicitud Interna') !== -1}></Checkbox>
                                <label htmlFor="cb3" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Solicitud Interna</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox disabled={!this.state.editar} inputId="cb4" value="Mejoramiento del Proceso" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Mejoramiento del Proceso') !== -1}></Checkbox>
                                <label htmlFor="cb4" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejoramiento del Proceso</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox disabled={!this.state.editar} inputId="cb5" value="Cambio de Normativa Vigente" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Cambio de Normativa Vigente') !== -1}></Checkbox>
                                <label htmlFor="cb5" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Cambio de Normativa Vigente</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox disabled={!this.state.editar} inputId="cb6" value="Restricción de Materia Prima" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Restricción de Materia Prima') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Restricción de Materia Prima</label>
                            </div>
                        </div>

                    </div>

                    <div className="p-col-12 p-lg-12" >
                        <div className='p-grid'>

                            <label className="p-col-12 p-lg-12" htmlFor="float-input"> <span style={{ color: '#CB3234' }}>*</span>TIEMPO DE ENTREGA</label>
                            <div className="p-col-12 p-lg-4">
                                <RadioButton disabled={!this.state.editar} inputId="rb4" name="deliverTimerb4" value="CASOS_ESPECIALES" checked={this.state.tiempoEntrega === 'CASOS_ESPECIALES'} />
                                <label htmlFor="rb4" className="p-radiobutton-label">Casos Especiales (Tiempo de desarrollo hasta 10 días)</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <RadioButton disabled={!this.state.editar} inputId="rb2" name="deliverTimerb2" value="MEDIO" checked={this.state.tiempoEntrega === 'MEDIO'} />
                                <label htmlFor="rb2" className="p-radiobutton-label">Medio (Tiempo de desarrollo hasta 20 días)</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <RadioButton disabled={!this.state.editar} inputId="rb3" name="deliverTimerb3" value="BAJO" checked={this.state.tiempoEntrega === 'BAJO'} />
                                <label htmlFor="rb3" className="p-radiobutton-label">Bajo (Tiempo de desarrollo hasta 2 meses)</label>
                            </div>
                        </div>

                    </div>

                    <div className='p-col-12 p-lg-6'>
                        <div className="p-grid">
                            <div className='p-col-12 p-lg-12'>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Material Entregado (Descripción)</label>
                                <InputTextarea readOnly={!this.state.editar} value={this.state.materialEntregado} onChange={(e) => this.setState({ materialEntregado: e.target.value })} rows={4} placeholder='Descripción' />
                            </div>
                            <div className='p-col-12 p-lg-6'>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Cantidad</label>
                                <InputText readOnly={!this.state.editar} value={this.state.cantidad} onChange={(e) => this.setState({ cantidad: e.target.value })} />
                            </div>
                            <div className='p-col-12 p-lg-6'>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Unidad</label>
                                <Dropdown disabled={!this.state.editar} options={unidadesMedida} value={this.state.unidad} autoWidth={false} onChange={(e) => this.setState({ unidad: e.value })} placeholder="Selecione" />
                            </div>
                            <div className='p-col-12 p-lg-6'>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Línea de Aplicación</label>
                                <Dropdown disabled={!this.state.editar} options={aplicationLine} value={this.state.lineaAplicacion} autoWidth={false} onChange={(e) => this.setState({ lineaAplicacion: e.value })} placeholder="Seleccione " />
                            </div>

                            <div className='p-col-12 p-lg-6'>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Entrega de Muestra</label>
                                <Calendar disabled={!this.state.editar} dateFormat="yy/mm/dd" value={this.state.muestraEntrega} locale={es} onChange={(e) => this.setState({ muestraEntrega: e.value })} showIcon={true} />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Ubicación de la Muestra</label>
                                <InputTextarea readOnly={!this.state.editar} value={this.state.muestraUbicacion} onChange={(e) => this.setState({ muestraUbicacion: e.target.value })} rows={4} placeholder='Descripción' />
                            </div>
                        </div>
                    </div>

                    <div className='p-col-12 p-lg-6'>
                        <div className='p-col-12 p-lg-12'>
                            <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Imagen de la Muestra</label>
                            <div style={{ height: '335px', bottom: '0px', top: '0px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc', borderRadius: '4px' }}>
                                {this.state.muestraImagenId === null &&
                                    <img style={{ width: 'auto', maxHeight: '100%', display: 'block', margin: 'auto' }} alt="Logo" src="assets/layout/images/icon-img.jpg" />
                                }
                                {this.state.muestraImagenId > 0 &&
                                    <img style={{ width: 'auto', maxHeight: '100%', display: 'block', margin: 'auto' }} id="ItemPreview" src="" />
                                }
                            </div>
                            {this.state.id > 0 && _.includes(['NUEVO', 'REGRESADO_NOVEDAD_FORMA'], this.state.estado) &&
                                <FileUpload ref={(el) => this.fileUploadRefIM = el} mode="basic" name="demo" customUpload={true} uploadHandler={this.myUploaderImagenMuestra} accept="image/*" chooseLabel='Seleccione Imagen' uploadLabel='Subir Imagen' />
                            }
                        </div>
                    </div>

                    {this.state.id > 0 &&
                        <div className='p-col-12 p-lg-12'>
                            <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                            <h3>ADJUNTOS REQUERIDOS</h3>
                            <div className='p-col-12 p-lg-12'>
                                {/* <DataTable value={this.state.adjuntosRequeridos} id="tbAdjunto"
                                    selection={this.state.selectedCar2} onSelectionChange={e => this.setState({ selectedCar2: e.value })}>
                                    <Column selectionMode="single" style={{ width: '3em' }} disabled={(e) => this.habilitarSeleccionAdjunto(e)} />
                                    <Column field="nombre" />
                                    <Column field="obligatorio" />
                                </DataTable> */}

                                <DataTable value={this.state.adjuntosRequeridos} id="tbAdjunto"
                                    selection={this.state.adjuntoSeleccionado} onSelectionChange={e => this.setState({ adjuntoSeleccionado: e.value })}>
                                    <Column body={this.templateAdjunto} />
                                </DataTable>
                                {this.state.id > 0 && _.includes(['NUEVO', 'REGRESADO_NOVEDAD_FORMA'], this.state.estado) &&
                                    <Toolbar>
                                        <div className="p-toolbar-group-left">
                                            <FileUpload ref={(el) => this.fileUploadRef = el} mode="basic" customUpload={true} chooseLabel="Seleccione" uploadHandler={this.myUploader} auto={true} />
                                        </div>
                                    </Toolbar>
                                }
                                {/* <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={"INGRESO_SOLICITUD"} controles={this.state.mostrarControles} estado={'NUEVO'} tipo={TIPO_SOLICITUD} /> */}
                                <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD} />
                            </div>
                            {!_.isEmpty(this.state.planesAccion) &&
                                <div>
                                    <div className='p-col-12 p-lg-12 caja'>PLANES DE ACCIÓN</div>
                                    <div className='p-col-12 p-lg-12'>
                                        <DataTable value={this.state.planesAccion} rows={15} >
                                            <Column field="descripcion" header="Descripción" />
                                            <Column field="fechaInicio" header="Fecha Inicio" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                                            <Column field="fechaFin" header="Fecha Fin" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                                            <Column header="Cumplido" body={this.actionTemplateCumplido} style={{ textAlign: 'center', width: '8em' }} />
                                        </DataTable>
                                    </div>
                                </div>
                            }

                            {this.state.estado === 'NUEVO' &&
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">OBSERVACIÓN</label>
                                    <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                                </div>
                            }
                        </div>
                    }
                </div>

                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id === 0 &&
                        < Button label="GUARDAR" onClick={this.guardar} />
                    }
                    {this.state.id > 0 && this.state.estado === 'NUEVO' &&
                        < div >
                            <Button className="p-button-danger" label="ENVIAR" onClick={this.enviarSolicitud} />
                            <Button className='p-button-secondary' label="ANULAR" onClick={this.anularSolicitud} />
                        </div>
                    }
                </div>

            </div >
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        openModal: () => dispatch(openModal()),
        closeModal: () => dispatch(closeModal()) // will be wrapped into a dispatch call
    }

};


const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormularioSE);
