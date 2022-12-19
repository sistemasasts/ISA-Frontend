import React, { Component } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import { LineDDP04 } from '../../../global/catalogs';
import { Button } from 'primereact/button';
import "../../site.css";
import * as _ from "lodash";
import * as moment from 'moment';
import history from '../../../history';
import Adjuntos from '../SolicitudEnsayo/Adjuntos';
import Historial from '../SolicitudEnsayo/Historial';
import SolicitudPruebasProcesoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import SolicitudPruebaProcesoDocumentoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebaProcesoDocumentoService';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CatalogoService } from '../../../service/CatalogoService';
import ProductoService from '../../../service/productoService';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { RadioButton } from 'primereact/radiobutton';

const TIPO_SOLICITUD = "SOLICITUD_PRUEBAS_PROCESO";
class FormularioSPP extends Component {

    constructor() {
        super();
        this.state = {
            objectivos: [],
            detalleMaterial: [],
            id: 0,
            codigo: null,
            detalleMaterialOtro: null,
            motivoOtro: null,
            linea: null,
            descripcionProducto: null,
            fechaEntrega: null,
            variablesProceso: null,
            verificacionAdicional: null,
            observacion: null,
            estado: null,
            mostrarControles: false,
            editar: true,
            observacionFlujo: null,
            origen: null,
            area: null,
            requiereInforme: false,
            imagen1Id: null,
            catalogoOrigen: [],
            catalogoArea: [],
            puedeRepetirPrueba: false,
            displayRepetirPrueba: false,
            displayAnular: false,
            catalogoProductos: [],
            materialesFormula: [],
            cantidadRequeridaProducir: null,
            unidadRequeridaProducir: null,
            unidadesCatalogo: [],
            materialFormula: null,
            mostrarMaterialesFormula: false,
            contieneAdjunto: "NO",
        };
        this.catalogoService = new CatalogoService();
        this.onObjectiveChange = this.onObjectiveChange.bind(this);
        this.onDescriptionMaterialLPChange = this.onDescriptionMaterialLPChange.bind(this);
        this.guardar = this.guardar.bind(this);
        this.actualizar = this.actualizar.bind(this);
        this.enviarSolicitud = this.enviarSolicitud.bind(this);
        this.myUploader = this.myUploader.bind(this);
        this.leerImagen = this.leerImagen.bind(this);
        this.repetirPrueba = this.repetirPrueba.bind(this);
        this.confirmarAnular = this.confirmarAnular.bind(this);
        this.anular = this.anular.bind(this);
        this.addNew = this.addNew.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onCarSelect = this.onCarSelect.bind(this);
    }

    async componentDidMount() {
        const catalogAreas = await SolicitudPruebasProcesoService.listarAreas();
        const catalogoOrigen = await SolicitudPruebasProcesoService.listarOrigen();
        this.catalogoService.getUnidadesMedida().then(data => this.setState({ unidadesCatalogo: data }));
        let catalogoMateriales = await ProductoService.list();
        const productos = _.map(_.uniqBy(catalogoMateriales, 'nameProduct'), (o) => { return { label: o.nameProduct, value: o.nameProduct } });
        this.refrescar(this.props.match.params.idSolicitud);
        this.setState({ catalogoOrigen: catalogoOrigen, catalogoArea: catalogAreas, catalogoProductos: productos });
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudPruebasProcesoService.listarPorId(idSolicitud);
            if (solicitud) {
                let objetivosValor = _.split(solicitud.motivo, ',');
                let detalleMaterialValor = _.split(solicitud.materialLineaProceso, ',');
                console.log(solicitud)
                if (solicitud.imagen1Id)
                    this.leerImagen(solicitud.imagen1Id);
                this.setState({
                    id: solicitud.id,
                    codigo: solicitud.codigo,
                    fechaEntrega: moment(solicitud.fechaEntrega, 'YYYY-MM-DD').toDate(),
                    detalleMaterial: detalleMaterialValor,
                    objectivos: objetivosValor,
                    linea: solicitud.lineaAplicacion,
                    detalleMaterialOtro: solicitud.materialLineaProcesoOtro,
                    descripcionProducto: solicitud.descripcionProducto,
                    variablesProceso: solicitud.variablesProceso,
                    verificacionAdicional: solicitud.verificacionAdicional,
                    motivoOtro: solicitud.motivoOtro,
                    observacion: solicitud.observacion,
                    estado: solicitud.estado,
                    requiereInforme: solicitud.requiereInforme,
                    area: solicitud.area,
                    origen: solicitud.origen,
                    imagen1Id: solicitud.imagen1Id,
                    mostrarControles: _.includes(['NUEVO', 'REGRESADO_NOVEDAD_FORMA'], solicitud.estado),
                    editar: _.includes(['NUEVO', 'REGRESADO_NOVEDAD_FORMA'], solicitud.estado),
                    puedeRepetirPrueba: solicitud.puedeRepetirPrueba,
                    cantidadRequeridaProducir: solicitud.cantidadRequeridaProducir,
                    unidadRequeridaProducir: solicitud.unidadRequeridaProducir,
                    materialesFormula: solicitud.materialesFormula,
                    mostrarMaterialesFormula: solicitud.area && _.startsWith(solicitud.area.nameArea, 'I+D'),
                    contieneAdjunto: solicitud.contieneAdjuntoDescripcionProducto ? 'SI' : 'NO'
                });
            }
        }
    }

    async leerImagen(idDocumento) {
        debugger
        const respuesta = await SolicitudPruebaProcesoDocumentoService.verImagen(idDocumento);
        if (respuesta) {
            console.log(respuesta);
            document.getElementById("ItemPreview").src = `data:${respuesta.documento.tipo};base64,` + respuesta.imagen;
        }
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

    onDescriptionMaterialLPChange(e) {
        let selectedDescriptionMaterial = [...this.state.detalleMaterial];
        if (e.checked)
            selectedDescriptionMaterial.push(e.value);
        else
            selectedDescriptionMaterial.splice(selectedDescriptionMaterial.indexOf(e.value), 1);
        this.setState({ detalleMaterial: selectedDescriptionMaterial });
    }

    async guardar() {
        if (!this.formularioValido()) {
            this.growl.show({ severity: 'error', detail: 'Complete los campos requeridos.' });
            return false;
        }
        this.props.openModal();
        const solicitudCreada = await SolicitudPruebasProcesoService.create(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Creada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_edit/${solicitudCreada.id}`);
        }, 1000);
    }

    async actualizar() {
        if (!this.formularioValido()) {
            this.growl.show({ severity: 'error', detail: 'Complete los campos requeridos.' });
            return false;
        }
        const solicitudActualizada = await SolicitudPruebasProcesoService.actualizar(this.crearObjSolicitud());
        this.growl.show({ severity: 'success', detail: 'Solicitud Actualizada!' });
    }

    crearObjSolicitud() {
        return {
            id: this.state.id,
            fechaEntrega: moment(this.state.fechaEntrega).format("YYYY-MM-DD"),
            lineaAplicacion: this.state.linea,
            motivo: _.join(this.state.objectivos, ','),
            motivoOtro: this.state.motivoOtro,
            materialLineaProceso: _.join(this.state.detalleMaterial, ','),
            materialLineaProcesoOtro: this.state.detalleMaterialOtro,
            descripcionProducto: this.state.descripcionProducto,
            variablesProceso: this.state.variablesProceso,
            verificacionAdicional: this.state.verificacionAdicional,
            origen: this.state.origen,
            area: this.state.area,
            requiereInforme: this.state.requiereInforme,
            observacion: this.state.observacion,
            observacionFlujo: this.state.observacionFlujo,
            cantidadRequeridaProducir: this.state.cantidadRequeridaProducir,
            unidadRequeridaProducir: this.state.unidadRequeridaProducir,
            contieneAdjuntoDescripcionProducto: _.isEqual(this.state.contieneAdjunto, "SI") ? true : false
        }
    }

    formularioValido() {
        var valido = true;
        if (_.isEmpty(moment(this.state.fechaEntrega).format("YYYY-MM-DD"))
            || _.isEmpty(this.state.objectivos)
            || _.isEmpty(this.state.linea)
            || _.isEmpty(this.state.origen)
            || _.isEmpty(this.state.area))
            valido = false;
        if (this.state.mostrarMaterialesFormula) {
            if ((this.state.cantidadRequeridaProducir <= 0) || _.isEmpty(this.state.unidadRequeridaProducir))
                valido = false;
        }
        return valido;
    }

    async enviarSolicitud() {
        this.props.openModal();
        await SolicitudPruebasProcesoService.enviarSolicitud(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Enviada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp`);
        }, 1000);
    }

    async myUploader(event) {
        this.props.openModal();
        const respuesta = await SolicitudPruebaProcesoDocumentoService.subirArchivoImagen1(this.crearSolicitudDocumento(event.files[0]));
        this.setState({ imagen1Id: respuesta.documento.id })
        document.getElementById("ItemPreview").src = `data:${respuesta.documento.tipo};base64,` + respuesta.imagen;
        this.fileUploadRef.clear();
        this.props.closeModal();
    }

    crearSolicitudDocumento(archivo) {
        let infoAdicional = {};
        let formadata = new FormData();
        infoAdicional.idSolicitud = this.state.id;
        formadata.append('file', archivo);
        formadata.append('info', JSON.stringify(infoAdicional));
        return formadata;
    }

    async repetirPrueba() {
        this.props.openModal();
        const solicitudNueva = await SolicitudPruebasProcesoService.repetirPrueba(this.state.id);
        this.setState({ displayRepetirPrueba: false });
        this.growl.show({ severity: 'success', detail: 'Solicitud Creada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_edit/${solicitudNueva.id}`);
            window.location.reload();
        }, 1000);
        this.props.closeModal();
    }

    confirmarAnular() {
        if (_.isEmpty(this.state.observacionFlujo)) {
            this.growl.show({ severity: 'error', detail: 'La observación es obligatoria' });
            return false;
        }
        this.setState({ displayAnular: true });
    }

    async anular() {
        this.props.openModal();
        await SolicitudPruebasProcesoService.anularSolicitud({ id: this.state.id, observacionFlujo: this.state.observacionFlujo });
        this.setState({ displayAnular: false });
        this.growl.show({ severity: 'success', detail: 'Solicitud Anulada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp`);
        }, 1000);
        this.props.closeModal();
    }

    async onSave() {
        if (this.state.materialFormula !== null) {
            let solicitudActualizada;
            if (this.state.materialFormula.id > 0) {
                solicitudActualizada = await SolicitudPruebasProcesoService.editarMaterialFomula(this.state.id, this.state.materialFormula);
                let msg = { severity: 'success', summary: 'Material', detail: 'Modificado con éxito' };
                this.growl.show(msg);
            } else {
                solicitudActualizada = await SolicitudPruebasProcesoService.agregarMaterialFomula(this.state.id, this.state.materialFormula);
                let msg = { severity: 'success', summary: 'Material', detail: 'Agregado con éxito' };
                this.growl.show(msg);
            }
            this.setState({ materialesFormula: solicitudActualizada.materialesFormula, selectedMaterialFormula: null, materialFormula: null, displayDialog: false });

        } else {
            this.messages.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar el grupo y una propiedad.' });
        }

    }

    async onDelete() {
        const solicitudRecargada = await SolicitudPruebasProcesoService.eliminarMaterialFomula(this.state.id, this.state.materialFormula.id);
        this.growl.show({ severity: 'success', summary: 'Material', detail: 'Eliminado' });
        this.setState({
            materialesFormula: solicitudRecargada.materialesFormula,
            materialFormula: null,
            displayDialog: false
        });
    }

    findSelectedCarIndex() {
        return this.state.materialesFormula.indexOf(this.state.selectedMaterialFormula);
    }

    updateProperty(property, value) {
        debugger
        let car = this.state.materialFormula;
        car[property] = value;
        this.setState({ materialFormula: car });
    }

    onCarSelect(e) {
        this.newCar = false;
        this.setState({
            displayDialog: true,
            materialFormula: Object.assign({}, e.data)
        });
    }


    addNew() {
        this.newCar = true;
        this.setState({
            materialFormula: { id: 0, nombre: '', porcentaje: '' },
            displayDialog: true
        });
    }

    onChangeArea(value) {
        this.setState({
            area: value,
            mostrarMaterialesFormula: _.startsWith(value.nameArea, 'I+D')
        });
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
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={this.repetirPrueba} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ displayRepetirPrueba: false })} label="No" className="p-button-danger" />
            </div>
        );
        const dialogFooterAnular = (
            <div>
                <Button icon="pi pi-check" onClick={this.anular} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ displayAnular: false })} label="No" className="p-button-danger" />
            </div>
        );

        let header = <div className="p-clearfix" style={{ width: '10%' }}>
            <Button style={{ float: 'left' }} label="Agregar" icon="pi pi-plus" onClick={this.addNew} />
        </div>;

        let dialogFooterFormula = <div className="ui-dialog-buttonpane p-clearfix">
            {!this.newCar &&
                <Button label="Eliminar" icon="pi pi-times" className="p-button-danger" onClick={this.onDelete} />
            }
            <Button label="Guardar" icon="pi pi-check" onClick={this.onSave} />
            <Button label="Cancelar" icon="pi pi-check" className="p-button-secondary" onClick={() => this.setState({ displayDialog: false })} />
        </div>;

        let footerGroup = <ColumnGroup>
            <Row>
                <Column style={{ backgroundColor: '#A5D6A7', fontWeight: 'bold' }} footer="FORMULA TOTAL" />
                <Column style={{ backgroundColor: '#A5D6A7', fontWeight: 'bold' }} footer={_.sumBy(this.state.materialesFormula, (o) => { return o.porcentaje })} />
                <Column style={{ backgroundColor: '#A5D6A7', fontWeight: 'bold' }} footer={_.sumBy(this.state.materialesFormula, (o) => { return o.cantidad })} />
                <Column style={{ backgroundColor: '#A5D6A7', fontWeight: 'bold' }} footer={_.isEmpty(this.state.materialesFormula) ? '' : this.state.materialesFormula[0].unidad} />
            </Row>
        </ColumnGroup>;

        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3 className='text-titulo'><strong>SOLICITUD DE PRUEBAS EN PROCESO</strong></h3>
                <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN DE LA SOLICITUD</div>

                <div className="p-grid p-grid-responsive p-fluid">
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Código</label>
                        <InputText readOnly value={this.state.codigo} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Fecha de Entrega</label>
                        <Calendar disabled={!this.state.editar} dateFormat="yy/mm/dd" value={this.state.fechaEntrega} locale={es} onChange={(e) => this.setState({ fechaEntrega: e.value })} showIcon={true} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Línea</label>
                        <Dropdown disabled={!this.state.editar} options={LineDDP04} value={this.state.linea} autoWidth={false} onChange={(e) => this.setState({ linea: e.value })} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Tipo Solicitud</label>
                        <Dropdown disabled={!this.state.editar} options={this.state.catalogoOrigen} value={this.state.origen} autoWidth={false} onChange={(e) => this.setState({ origen: e.value })} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Área</label>
                        <Dropdown disabled={!this.state.editar} optionLabel='nameArea' options={this.state.catalogoArea} value={this.state.area} autoWidth={false} onChange={(e) => this.onChangeArea(e.value)} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-4' style={{ marginTop: '20px' }}>
                        <Checkbox disabled={!this.state.editar} inputId="cbri" onChange={e => this.setState({ requiereInforme: e.checked })} checked={this.state.requiereInforme}></Checkbox>
                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Requiere Informe</label>
                    </div>
                    <div className="p-col-12 p-lg-12" >
                        <div className='p-grid'>
                            <label className="p-col-12 p-lg-12" style={{ fontWeight: 'bold' }} htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Motivo del Ensayo</label>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb1" value="Desarrollo Proveedores" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Desarrollo Proveedores') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Proveedores</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb2" value="Desarrollo Materias Primas" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Desarrollo Materias Primas') !== -1}></Checkbox>
                                <label htmlFor="cb2" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Materias Primas</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb3" value="Desarrollo Productos" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Desarrollo Productos') !== -1}></Checkbox>
                                <label htmlFor="cb3" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Productos</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb4" value="Reingeniería" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Reingeniería') !== -1}></Checkbox>
                                <label htmlFor="cb4" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reingeniería</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb5" value="Reclamos Clientes" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Reclamos Clientes') !== -1}></Checkbox>
                                <label htmlFor="cb5" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reclamos Clientes</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb6" value="Reducción Costos" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Reducción Costos') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reducción Costos</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb6" value="Mejora de Producto" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Mejora de Producto') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejora de Producto</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb6" value="Mejora del Proceso" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Mejora del Proceso') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejora del Proceso</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb6" value="Verificación de Equipos" onChange={this.onObjectiveChange} checked={this.state.objectivos.indexOf('Verificación de Equipos') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Verificación de Equipos</label>
                            </div>
                            <div className="p-col-12 p-lg-12">
                                <label htmlFor="float-input">Otro (Describa)</label>
                                <InputTextarea readOnly={!this.state.editar} value={this.state.motivoOtro} onChange={(e) => this.setState({ motivoOtro: e.target.value })} rows={2} placeholder='Descripción' />
                            </div>
                        </div>

                    </div>
                    {/* <div className="p-col-12 p-lg-12" >
                        <div className='p-grid'>
                            <label className="p-col-12 p-lg-12" style={{ fontWeight: 'bold' }} htmlFor="float-input"> <span style={{ color: '#CB3234' }}>*</span>Descripción del Material y Línea de Proceso de Prueba (Marque según corresponda)</label>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb11" value="Materia Prima" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Materia Prima') !== -1}></Checkbox>
                                <label htmlFor="cb11" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Materia Prima</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb12" value="Láminas Impermeabilizantes" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Láminas Impermeabilizantes') !== -1}></Checkbox>
                                <label htmlFor="cb12" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Láminas Impermeabilizantes</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb13" value="Prod. en Proceso" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Prod. en Proceso') !== -1}></Checkbox>
                                <label htmlFor="cb13" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. en Proceso</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb14" value="Prod. Terminado" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Prod. Terminado') !== -1}></Checkbox>
                                <label htmlFor="cb14" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Terminado</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb15" value="Suministros" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Suministros') !== -1}></Checkbox>
                                <label htmlFor="cb15" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Suministros</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb16" value="Accesorios" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Accesorios') !== -1}></Checkbox>
                                <label htmlFor="cb16" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Accesorios</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb17" value="Prod. Viales" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Prod. Viales') !== -1}></Checkbox>
                                <label htmlFor="cb17" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Viales</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb17" value="Rev. Líquidos" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Rev. Líquidos') !== -1}></Checkbox>
                                <label htmlFor="cb17" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Rev. Líquidos</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb18" value="Pinturas" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Pinturas') !== -1}></Checkbox>
                                <label htmlFor="cb18" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Pinturas</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb19" value="Prod. Metálicos" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Prod. Metálicos') !== -1}></Checkbox>
                                <label htmlFor="cb19" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Metálicos</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox disabled={!this.state.editar} inputId="cb20" value="Paneles PUR" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Paneles PUR') !== -1}></Checkbox>
                                <label htmlFor="cb20" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Paneles PUR</label>
                            </div>
                            <div className="p-col-12 p-lg-12">
                                <label htmlFor="float-input">Otro (Describa)</label>
                                <InputTextarea readOnly={!this.state.editar} value={this.state.detalleMaterialOtro} onChange={(e) => this.setState({ detalleMaterialOtro: e.target.value })} rows={2} placeholder='Descripción' />
                            </div>
                        </div>
                    </div> */}

                    <div className='p-col-12 p-lg-12'>
                        <div className='p-grid'>
                            <div className='p-col-12 p-lg-6'>
                                <div className='p-grid'>
                                    <div className='p-col-12 p-lg-12'>
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Descripción del Producto que se quiere obtener</label>
                                        <InputTextarea readOnly={!this.state.editar} value={this.state.descripcionProducto} onChange={(e) => this.setState({ descripcionProducto: e.target.value })} rows={8} placeholder='Descripción' />
                                    </div>
                                    <div className="p-col-12">
                                        <label style={{ marginRight: '10px', fontWeight:'bold', color:'red' }} htmlFor="rb1" className="p-radiobutton-label">Contiene Adjunto</label>
                                        <RadioButton inputId="rb1" name="si" value="SI" onChange={(e) => this.setState({ contieneAdjunto: e.value })} checked={this.state.contieneAdjunto === 'SI'} />
                                        <label htmlFor="rb1" className="p-radiobutton-label">SI</label>
                                        <RadioButton style={{ marginLeft: '10px' }} inputId="rb2" name="no" value="NO" onChange={(e) => this.setState({ contieneAdjunto: e.value })} checked={this.state.contieneAdjunto === 'NO'} />
                                        <label htmlFor="rb2" className="p-radiobutton-label">NO</label>
                                    </div>
                                    <div className='p-col-12 p-lg-12'>
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Información sobre Variables de Proceso que deben ser controladas</label>
                                        <InputTextarea readOnly={!this.state.editar} value={this.state.variablesProceso} onChange={(e) => this.setState({ variablesProceso: e.target.value })} rows={8} placeholder='Descripción' />
                                    </div>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-6'>
                                <div className='p-grid'>
                                    <div className='p-col-12 p-lg-12'>
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Imagen especificaciones y variables</label>
                                        <div style={{ height: '335px', bottom: '0px', top: '0px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc', borderRadius: '4px' }}>
                                            {this.state.imagen1Id === null &&
                                                <img style={{ width: 'auto', maxHeight: '100%', display: 'block', margin: 'auto' }} alt="Logo" src="assets/layout/images/icon-img.jpg" />
                                            }
                                            {this.state.imagen1Id > 0 &&

                                                <img style={{ width: 'auto', maxHeight: '100%', display: 'block', margin: 'auto' }} id="ItemPreview" src="" />
                                            }
                                        </div>
                                        {this.state.id > 0 && _.includes(['NUEVO', 'REGRESADO_NOVEDAD_FORMA'], this.state.estado) &&
                                            <FileUpload ref={(el) => this.fileUploadRef = el} mode="basic" name="demo" customUpload={true} uploadHandler={this.myUploader} accept="image/*" chooseLabel='Seleccione Imagen' uploadLabel='Subir Imagen' />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.mostrarMaterialesFormula &&

                        <div className="p-col-12 p-lg-12" >
                            <div className='p-grid'>
                                <label className="p-col-12 p-lg-12" style={{ fontWeight: 'bold' }} htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Material Detalle Formulación</label>
                                <div className='p-col-12 p-lg-4'>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="float-input">Cantidad Requerida Para Producir</label>
                                    <InputText keyfilter="num" value={this.state.cantidadRequeridaProducir} onChange={(e) => this.setState({ cantidadRequeridaProducir: e.target.value })} />
                                </div>
                                <div className='p-col-12 p-lg-3'>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="float-input">Unidad</label>
                                    <Dropdown disabled={!this.state.editar} options={this.state.unidadesCatalogo} value={this.state.unidadRequeridaProducir} autoWidth={false} onChange={(e) => this.setState({ unidadRequeridaProducir: e.value })} placeholder="Selecione" />
                                </div>

                                {this.state.id > 0 && _.includes(['NUEVO', 'REGRESADO_NOVEDAD_FORMA'], this.state.estado) &&
                                    <div className='p-col-12 p-lg-12'>
                                        <DataTable value={this.state.materialesFormula} rows={15} header={header} footerColumnGroup={footerGroup}
                                            selectionMode="single" selection={this.state.selectedConfiguracion} onSelectionChange={e => this.setState({ selectedMaterialFormula: e.value })}
                                            onRowSelect={this.onCarSelect}>
                                            <Column field="nombre" header="Material" sortable={true} />
                                            <Column field="porcentaje" header="Porcentaje(%)" sortable={true} style={{ textAlign: 'center' }} />
                                            <Column field="cantidad" header="Cantidad" sortable={true} style={{ textAlign: 'center' }} />
                                            <Column field="unidad" header="Unidad" style={{ textAlign: 'center' }} />
                                        </DataTable>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    <div className='p-col-12 p-lg-12'>
                        <label style={{ fontWeight: 'bold' }} htmlFor="float-input">Se requieren verificaciones adicionales u otras en especial</label>
                        <InputTextarea readOnly={!this.state.editar} value={this.state.verificacionAdicional} onChange={(e) => this.setState({ verificacionAdicional: e.target.value })} rows={4} placeholder='Descripción' />
                    </div>

                    <div className='p-col-12 p-lg-12'>
                        <label style={{ fontWeight: 'bold' }} htmlFor="float-input">Secuencial y motivo de prueba</label>
                        <InputTextarea readOnly={!this.state.editar} value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={2} placeholder='Descripción' />
                    </div>

                    {this.state.id > 0 &&
                        <div className='p-col-12 p-lg-12'>
                            <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                            <div className='p-col-12 p-lg-12'>
                                <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={"INGRESO_SOLICITUD"} controles={this.state.mostrarControles} estado={this.state.estado} tipo={TIPO_SOLICITUD} />
                                <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD} />
                            </div>
                            {_.includes(['NUEVO', 'REGRESADO_NOVEDAD_FORMA'], this.state.estado) &&
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">OBSERVACIÓN</label>
                                    <InputTextarea value={this.state.observacionFlujo} onChange={(e) => this.setState({ observacionFlujo: e.target.value })} rows={3} />
                                </div>
                            }
                        </div>
                    }
                </div>

                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id === 0 &&
                        < Button label="GUARDAR" onClick={this.guardar} />
                    }
                    {this.state.id > 0 && _.includes(['NUEVO', 'REGRESADO_NOVEDAD_FORMA'], this.state.estado) &&
                        < div >
                            <Button className="p-button" label="ACTUALIZAR" onClick={this.actualizar} />
                            <Button className="p-button-danger" label="ENVIAR" onClick={this.enviarSolicitud} />
                            <Button className='p-button-secondary' label="ANULAR" onClick={this.confirmarAnular} />
                        </div>
                    }
                    {this.state.id > 0 && this.state.puedeRepetirPrueba &&
                        < div >
                            <Button className="p-button-danger" label="REPETIR PRUEBA" onClick={() => this.setState({ displayRepetirPrueba: true })} />
                        </div>
                    }
                </div>
                <Dialog header="Confirmación" visible={this.state.displayRepetirPrueba} style={{ width: '25vw' }} onHide={() => this.setState({ displayRepetirPrueba: false })} blockScroll footer={dialogFooter} >
                    <p>¿Está seguro de repetir la prueba en donde se creará una nueva solicitud.?</p>
                </Dialog>
                <Dialog header="Confirmación" visible={this.state.displayAnular} style={{ width: '25vw' }} onHide={() => this.setState({ displayAnular: false })} blockScroll footer={dialogFooterAnular} >
                    <p>¿Está seguro de ANULAR la solicitud?</p>
                </Dialog>
                <Dialog visible={this.state.displayDialog} style={{ width: '500px' }} header="Agregar Editar" modal={true} footer={dialogFooterFormula} onHide={() => this.setState({ displayDialog: false })}
                    blockScroll={false}>
                    {
                        this.state.materialFormula &&

                        <div className="p-grid p-fluid">
                            <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="vin">Material</label></div>
                            <div className="p-col-8" style={{ padding: '.5em' }}>
                                <Dropdown appendTo={document.body} value={this.state.materialFormula.nombre} editable={true} options={this.state.catalogoProductos} filter={true}
                                    onChange={(e) => { this.updateProperty('nombre', e.value) }} />
                            </div>

                            <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="brand">Valor(%)</label></div>
                            <div className="p-col-8" style={{ padding: '.5em' }}>
                                <InputText keyfilter="num" value={this.state.materialFormula.porcentaje} onChange={(e) => this.updateProperty('porcentaje', e.target.value)} />
                            </div>
                        </div>
                    }
                </Dialog>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormularioSPP);
