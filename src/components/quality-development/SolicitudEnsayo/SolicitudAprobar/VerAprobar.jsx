import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../../../history';
import { closeModal, openModal } from '../../../../store/actions/modalWaitAction';
import Adjuntos from '../Adjuntos';
import "../../../site.css";
import * as _ from "lodash";
import FormularioSELectura from '../FormularioSELectura';
import Historial from '../Historial';
import SolicitudEnsayoService from '../../../../service/SolicitudEnsayo/SolicitudEnsayoService';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import FormPlanAccion from '../SolicitudPlanesAccion/FormPlanAccion';
import SolicitudPlanAccionService from '../../../../service/SolicitudPlanAccion/SolicitudPlanAccionService';

const ESTADO = 'PENDIENTE_APROBACION';
const TIPO_SOLICITUD = 'SOLICITUD_ENSAYO';
class VerAprobar extends Component {

    constructor() {
        super();
        this.state = {
            tiposAprobacion: [],
            id: 0,
            observacion: null,
            estado: null,
            aprobacion: null,
            mostrarControles: false,
            requiereMateriaPrima: false,
            
            planesAccion: [],
            mostrarFormPlanAccion: false,
            planSeleccionado: null,
        };
        this.regresarSolicitud = this.regresarSolicitud.bind(this);
        this.aprobarSolicitud = this.aprobarSolicitud.bind(this);
        this.refrescarPlanesAccion = this.refrescarPlanesAccion.bind(this);
        this.eliminarPlan = this.eliminarPlan.bind(this);
        this.abrirDialogoPlanAccion = this.abrirDialogoPlanAccion.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);
        const tiposAprobacionData = await SolicitudEnsayoService.listarTiposAprobacion();
        this.setState({ id: this.props.match.params.idSolicitud, tiposAprobacion: tiposAprobacionData });
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudEnsayoService.listarPorId(idSolicitud);
            if (solicitud) {
                const planes = await SolicitudPlanAccionService.listarPorTipo('SOLICITUD_ENSAYOS', idSolicitud);
                this.setState({
                    id: solicitud.id,
                    estado: solicitud.estado,
                    mostrarControles: solicitud.estado === ESTADO,
                    planesAccion: planes,
                });
            }
        }
    }

    async regresarSolicitud() {
        if (_.isEmpty(this.state.observacion)) {
            this.growl.show({ severity: 'error', detail: 'Favor ingresa una Observación para regresar la solicitud.' });
            return false;
        }
        this.props.openModal();
        await SolicitudEnsayoService.regresarSolicitud(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Regresada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudse_aprobar`);
        }, 2000);
    }

    async aprobarSolicitud() {
        if (_.isEmpty(this.state.aprobacion)) {
            this.growl.show({ severity: 'error', detail: 'Favor seleccione un Tipo de Aprobación.' });
            return false;
        }
        this.props.openModal();
        await SolicitudEnsayoService.aprobarSolicitud(this.crearObjSolicitud());
        this.growl.show({ severity: 'success', detail: 'Solicitud Aprobada!' });
        this.props.closeModal();
        setTimeout(function () {
            history.push(`/quality-development_solicitudse_aprobar`);
        }, 2000);
    }

    crearObjSolicitud() {
        return {
            id: this.state.id,
            observacion: this.state.observacion,
            tipoAprobacion: this.state.aprobacion,
            requiereMateriaPrima: this.state.requiereMateriaPrima
        }
    }

    async refrescarPlanesAccion() {
        const planes = await SolicitudPlanAccionService.listarPorTipo('SOLICITUD_ENSAYOS', this.state.id);
        this.setState({ planesAccion: planes });
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.abrirDialogoPlanAccion(rowData)}></Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" style={{ marginLeft: '.5em' }} onClick={() => this.eliminarPlan(rowData.id)}></Button>
        </div>;
    }

    async eliminarPlan(idPlan) {
        await SolicitudPlanAccionService.eliminar(idPlan);
        this.refrescarPlanesAccion();
        this.growl.show({ severity: 'success', detail: 'Plan de acción eliminado!' });
    }

    abrirDialogoPlanAccion(plan) {
        this.setState({ planSeleccionado: plan, mostrarFormPlanAccion: true });
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '10%' }}>
                    <Button style={{ float: 'left' }} label="Agregar" icon="pi pi-plus" onClick={() => this.setState({ mostrarFormPlanAccion: true })} />
                </div>;
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <FormularioSELectura solicitud={this.props.match.params.idSolicitud} />
                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={"APROBAR_INFORME"} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD}/>
                            <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD}/>
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">OBSERVACIÓN</label>
                            <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                        </div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">TIPO APROBACIÓN</label>
                            <Dropdown options={this.state.tiposAprobacion} value={this.state.aprobacion} autoWidth={false} onChange={(event => this.setState({ aprobacion: event.value }))} placeholder="SELECCIONE" />
                        </div>
                        {this.state.aprobacion === 'REQUIERE_PRUEBA_PROCESO' &&
                        <div className='p-col-12 p-lg-12'>
                            <Checkbox checked={this.state.requiereMateriaPrima} onChange={(e)=> this.setState({requiereMateriaPrima: e.checked})}></Checkbox>
                            <label htmlFor="float-input">REQUIERE MATERIA PRIMA</label>
                        </div>
                        }
                        <br/>
                        {this.state.requiereMateriaPrima &&
                            <div>
                                <div className='p-col-12 p-lg-12 caja'>PLANES DE ACCIÓN</div>
                                <div className='p-col-12 p-lg-12'>                            
                                    <DataTable value={this.state.planesAccion} rows={15} header={header} >
                                        <Column field="descripcion" header="Descripción" />
                                        <Column field="fechaInicio" header="Fecha Inicio" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                                        <Column field="fechaFin" header="Fecha Proyectada" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                                        <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                                    </DataTable>
                                </div>
                            </div>
                        }
                        
                    </div>
                }
                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id > 0 && this.state.estado === ESTADO &&
                        < div >
                            <Button className="p-button-danger" label="APROBAR" onClick={this.aprobarSolicitud} />
                            <Button className='p-button-secondary' label="REGRESAR NOVEDAD EN INFORME" onClick={this.regresarSolicitud} />
                        </div>
                    }
                </div>
                <FormPlanAccion mostrar={this.state.mostrarFormPlanAccion} solicitudId={this.state.id} origen={this} tipo={'SOLICITUD_ENSAYOS'} />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerAprobar);
