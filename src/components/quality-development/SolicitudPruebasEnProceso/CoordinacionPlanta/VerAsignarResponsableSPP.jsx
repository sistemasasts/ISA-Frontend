import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../../../history';
import { closeModal, openModal } from '../../../../store/actions/modalWaitAction';
import "../../../site.css";
import * as _ from "lodash";
import * as moment from 'moment';
import FormularioSPPLectura from '../FormularioSPPLectura';
import Adjuntos from '../../SolicitudEnsayo/Adjuntos';
import Historial from '../../SolicitudEnsayo/Historial';
import SolicitudPruebasProcesoService from '../../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import UsuarioService from '../../../../service/UsuarioService';
import { Dialog } from 'primereact/dialog';

const ESTADO = 'EN_PROCESO';
const TIPO_SOLICITUD = 'SOLICITUD_PRUEBAS_PROCESO';
const ORDEN = 'PRODUCCION';

class VerAsignarResponsableSPP extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false,
            usuarios: [],
            responsable: null,
            fechaPrueba: null
        };
        this.asignarResponsable = this.asignarResponsable.bind(this);
        this.rechazarSolicitud = this.rechazarSolicitud.bind(this);
        this.marcarComoNoRealizadaDefinitiva = this.marcarComoNoRealizadaDefinitiva.bind(this);

    }

    async componentDidMount() {
        const catalogo_usuarios = await UsuarioService.list();
        this.refrescar(this.props.match.params.idSolicitud);
        this.setState({ usuarios: catalogo_usuarios });
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudPruebasProcesoService.listarPorId(idSolicitud);
            if (solicitud) {
                this.setState({
                    id: solicitud.id,
                    estado: solicitud.estado,
                    mostrarControles: solicitud.estado === ESTADO
                });
            }
        }
    }

    async asignarResponsable() {
        if (this.state.responsable === null || this.state.fechaPrueba === null) {
            this.growl.show({ severity: 'error', detail: 'Favor ingrese el responsable y fecha de la prueba a ejecutarse.' });
            return false;
        }
        this.props.openModal();
        await SolicitudPruebasProcesoService.asignarResponsable(this.crearObjSolicitud());
        this.growl.show({ severity: 'success', detail: 'Solicitud asignada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_asignar`);
        }, 1000);
        this.props.closeModal();
    }

    async rechazarSolicitud() {
        if (_.isEmpty(this.state.observacion)) {
            this.growl.show({ severity: 'error', detail: 'Favor ingresa una Observación para rechazar la solicitud.' });
            return false;
        }
        this.props.openModal();
        await SolicitudPruebasProcesoService.rechazarSolicitud(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Rechazada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_asignar`);
        }, 1000);
    }

    async marcarComoNoRealizadaDefinitiva() {
        if (_.isEmpty(this.state.observacion)) {
            this.growl.show({ severity: 'error', detail: 'Favor ingresa una Observación para marcar como prueba no ejecutada.' });
            return false;
        }
        this.props.openModal();
        await SolicitudPruebasProcesoService.marcarPruebaNoRealizadaDefinitiva(this.crearObjSolicitud());
        this.props.closeModal();
        this.setState({ displayPruebaNoEjecutada: false });
        this.growl.show({ severity: 'success', detail: 'Solicitud marcada como no ejecutadad!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_planta_principal`);
        }, 1000);
    }

    crearObjSolicitud() {
        return {
            id: this.state.id,
            observacionFlujo: this.state.observacion,
            usuarioAsignado: _.isEmpty(this.state.responsable) ? null : this.state.responsable.idUser,
            orden: ORDEN,
            fechaPrueba: this.state.fechaPrueba
        }
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
                <Button icon="pi pi-check" onClick={this.marcarComoNoRealizadaDefinitiva} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ displayPruebaNoEjecutada: false })} label="No" className="p-button-danger" />
            </div>
        );
        return (

            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <FormularioSPPLectura solicitud={this.props.match.params.idSolicitud} />
                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={ORDEN} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD} />
                            <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD} />
                        </div>
                        <div className='p-col-12 p-lg-12 caja'>ASIGNACIÓN RESPONSABLE</div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">RESPONSABLE</label>
                            <Dropdown value={this.state.responsable} optionLabel='nickName' options={this.state.usuarios} onChange={(e) => this.setState({ responsable: e.value })} placeholder="Seleccione" />
                        </div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">FECHA REALIZACIÓN PRUEBA</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.fechaPrueba} locale={es} onChange={(e) => this.setState({ fechaPrueba: e.value })} showIcon={true} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">OBSERVACIÓN</label>
                            <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                        </div>
                    </div>
                }

                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id > 0 && this.state.estado === ESTADO &&
                        < div >
                            <Button className="p-button-primary" label="ASIGNAR RESPONSABLE" onClick={this.asignarResponsable} />
                            {/* <Button className='p-button-secondary' label="RECHAZAR" onClick={this.rechazarSolicitud} /> */}
                            <Button className='p-button-danger' label="PRUEBA NO REALIZADA DEFINITIVA" onClick={() => this.setState({ displayPruebaNoEjecutada: true })} />
                        </div>
                    }
                </div>
                <Dialog header="Confirmación" visible={this.state.displayPruebaNoEjecutada} style={{ width: '25vw' }} onHide={() => this.setState({ displayPruebaNoEjecutada: false })} blockScroll footer={dialogFooter} >
                    <p>¿Está seguro de finalizar la solicitud y marcar definitivamente PRUEBA NO REALIZADA?</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerAsignarResponsableSPP);