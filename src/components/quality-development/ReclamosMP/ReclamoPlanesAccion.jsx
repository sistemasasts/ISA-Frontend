import React, { Component } from 'react'
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import ReclamoMPService from '../../../service/ReclamoMPService';
import "../../site.css";
import * as _ from "lodash";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import UsuarioService from '../../../service/UsuarioService'
import * as moment from 'moment';
import ReclamoPlanAccionProcesar from './ReclamoPlanAccionProcesar';
import { usuarioSesion } from '../../../service/UsuarioSesionService';

var PROCESO = 'ASIGNAR';
class ReclamoPlanesAccion extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            idReclamo: 0,
            planesAccion: [],
            planAccionSeleccionado: null,
            mostrarControles: true,
            description: null,
            viewModalImg: false,
            srcImageVM: null,

            descripcion: null,
            fechaInicio: null,
            fechaFin: null,
            responsable: null,
            abrirProcesar: false,

            usuarios: [],
            camposObligatorios: []
        }
        this.actionTemplate = this.actionTemplate.bind(this);

        this.limpiarUpload = this.limpiarUpload.bind(this);
        this.myUploader = this.myUploader.bind(this);
        this.operar = this.operar.bind(this);
        this.eliminarProblema = this.eliminarProblema.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.prepararDatosEditar = this.prepararDatosEditar.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.procesar = this.procesar.bind(this);
    }

    async componentDidMount() {
        const pnc = this.props.idReclamo;
        const problemas = this.props.problemas;
        PROCESO = this.props.proceso;

        const catalogo_usuarios = await UsuarioService.listarActivos();
        this.setState({
            idReclamo: pnc, planesAccion: problemas, mostrarControles: this.props.mostrarControles, usuarios: this.transformarDatos(catalogo_usuarios)
        });
    }

    transformarDatos(data) {
        const usuairosCasteo = [];
        _.forEach(data, (x) => {
            usuairosCasteo.push({ 'label': `${x.idUser} - ${x.employee.completeName}`, 'value': x.idUser });
        });
        return usuairosCasteo;
    }

    actionTemplate(rowData, column) {
        return <div>
            {rowData.estado === 'CREADA' &&
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.prepararDatosEditar(rowData)}></Button>}
            {rowData.estado === 'CREADA' &&
                <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => this.eliminarProblema(rowData.id)}></Button>}
            {this.puedeProcesar(rowData) &&
                <Button type="button" icon="fa fa-external-link-square" className="p-button-danger" onClick={() => this.procesar(rowData)}></Button>}
        </div>
    }

    puedeProcesar(planAccion) {
        switch (planAccion.estado) {
            case 'PENDIENTE_APROBACION':
                return PROCESO === 'VALIDAR' ? true : false;
            case 'ASIGNADA':
            case 'REGRESADO':
                usuarioSesion();
                return planAccion.responsable === usuarioSesion();
            default:
                return false;
        }
    }

    prepararDatosEditar(plan) {
        this.setState({
            id: plan.id,
            fechaInicio: moment(plan.dateStart, 'YYYY-MM-DD').toDate(),
            fechaFin: moment(plan.dateLimit, 'YYYY-MM-DD').toDate(),
            descripcion: plan.description,
            responsable: plan.responsable,
            display: true
        })
    }

    cancelar() {
        this.setState({
            id: 0,
            fechaInicio: null,
            fechaFin: null,
            descripcion: null,
            responsable: null,
            display: false
        })
    }

    limpiarUpload() {
        this.fileUploadRef.clear();
        this.setState({ descripcionImagen: '', imagenSubir: '', display: false })
    }

    myUploader(event) {
        this.setState({ imagenSubir: event.files[0] })
    }

    procesar(planAccion) {
        console.log('ejecutnado procesar');
        this.setState({ abrirProcesar: true, id: planAccion.id, planAccionSeleccionado: planAccion });
    }

    async operar() {
        if (this.validarCamposRequeridos()) {
            var data;
            if (this.state.id && this.state.id > 0) {
                data = await ReclamoMPService.actualizarPlanAccion(this.crearObj());
                this.growl.show({ severity: 'success', detail: 'Plan de acción actualizado!' });
            } else {
                data = await ReclamoMPService.crearPlanAccion(this.crearObj());
                this.growl.show({ severity: 'success', detail: 'Plan de acción agregado!' });
            }

            this.setState({ planesAccion: data, display: false, fechaInicio: null, fechaFin: null, descripcion: null, responsable: null });
        }
    }

    crearObj() {
        console.log(this.state)
        return {
            id: this.state.id,
            idReclamo: this.state.idReclamo,
            description: this.state.descripcion,
            dateStart: this.state.fechaInicio,
            dateLimit: this.state.fechaFin,
            responsable: this.state.responsable
        }
    }


    async eliminarProblema(problemaId) {
        const problemas = await ReclamoMPService.eliminarPlanAccion(this.state.idReclamo, problemaId);
        this.growl.show({ severity: 'success', detail: 'Registro eliminado!' });
        this.setState({ planesAccion: problemas });
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []
        if (this.state.fechaInicio === null) {
            let obj = { campo: 'fechaInicio', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.fechaFin === null) {
            let obj = { campo: 'fechaFin', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (_.isEmpty(this.state.descripcion)) {
            let obj = { campo: 'descripcion', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (_.isEmpty(this.state.responsable)) {
            let obj = { campo: 'responsable', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        this.setState({ camposObligatorios: camposOblogatoriosDetectados })
        return camposOblogatoriosDetectados.length === 0 ? true : false;
    }

    determinarEsCampoRequerido(nombreCampo) {
        var resultado = false
        _.forEach(this.state.camposObligatorios, (x) => {
            if (x.campo === nombreCampo)
                resultado = true
        })
        return resultado;
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
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            {PROCESO === 'VALIDAR' &&
                <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => this.setState({ display: true })} />
            }
        </div>;
        let dialogFooterP = <div className="p-dialog-buttonpane p-helper-clearfix">
            <Button className='p-button-success' label="Guardar" icon="pi pi-save" onClick={this.operar} />
            <Button className='p-button-danger' icon="fa fa-trash" label="Cancelar" onClick={this.cancelar} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className='p-col-12 p-lg-12 caja' >PLANES DE ACCIÓN</div>

                <DataTable value={this.state.planesAccion} header={header}>
                    {this.state.mostrarControles && <Column body={this.actionTemplate} style={{ width: '10%', textAlign: 'center' }} />}
                    <Column field="description" header="Descripción" />
                    <Column field="estado" header="Estado" style={{ width: '15%', textAlign: 'center' }} />
                    <Column field="responsable" header="Responsable" style={{ width: '15%', textAlign: 'center' }} />
                    <Column field="dateStart" header="Fecha Inicio" style={{ width: '10%', textAlign: 'center' }} />
                    <Column field="dateLimit" header="Fecha Proyectada" style={{ width: '10%', textAlign: 'center' }} />
                </DataTable>


                <Dialog visible={this.state.display} header="Crear/Editar Planes de acción" style={{ width: '30vw' }} footer={dialogFooterP} onHide={this.cancelar}
                >
                    <div className="p-grid p-grid-responsive p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Fecha Inicio</label>
                            <Calendar className={this.determinarEsCampoRequerido('fechaInicio') && 'p-error'} appendTo={document.body} dateFormat="yy/mm/dd" value={this.state.fechaInicio} locale={es} onChange={(e) => this.setState({ fechaInicio: e.value })} showIcon={true} />
                            {this.determinarEsCampoRequerido('fechaInicio') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Fecha Proyectada</label>
                            <Calendar className={this.determinarEsCampoRequerido('fechaFin') && 'p-error'} appendTo={document.body} dateFormat="yy/mm/dd" value={this.state.fechaFin} locale={es} onChange={(e) => this.setState({ fechaFin: e.value })} showIcon={true} />
                            {this.determinarEsCampoRequerido('fechaFin') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Descripción</label>
                            <InputTextarea className={this.determinarEsCampoRequerido('descripcion') && 'p-error'} value={this.state.descripcion} onChange={(e) => this.setState({ descripcion: e.target.value })} rows={3} />
                            {this.determinarEsCampoRequerido('descripcion') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Responsable</label>
                            <Dropdown className={this.determinarEsCampoRequerido('responsable') && 'p-error'} appendTo={document.body} value={this.state.responsable} options={this.state.usuarios} onChange={(e) => this.setState({ responsable: e.value })} placeholder="Seleccione..." />
                            {this.determinarEsCampoRequerido('responsable') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>

                    </div>
                </Dialog>
                <ReclamoPlanAccionProcesar mostrar={this.state.abrirProcesar} origen={this} idReclamo={this.state.idReclamo} id={this.state.id} proceso={this.props.proceso}></ReclamoPlanAccionProcesar>
            </div>

        )
    }
}

export default ReclamoPlanesAccion;