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

const ESTADO = 'EN_PLANIFICACION';
const TIPO_SOLICITUD = 'SOLICITUD_PRUEBAS_PROCESO';

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
        if(this.state.responsable === null || this.state.fechaPrueba === null){
            this.growl.show({ severity: 'error', detail: 'Favor ingrese el responsable y fecha de la prueba a ejecutarse.' });
            return false;
        }
        this.props.openModal();
        await SolicitudPruebasProcesoService.asignarResponsable(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Aprobada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_validar`);
        }, 2000);
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
            history.push(`/quality-development_solicitudpp_validar`);
        }, 2000);
    }

    crearObjSolicitud() {
        return {
            id: this.state.id,
            observacion: this.state.observacion,
            usuarioAsignado: this.state.responsable.idUser,
            orden: 'ASIGNAR_RESPONSABLE',
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
        return (

            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <FormularioSPPLectura solicitud={this.props.match.params.idSolicitud} />
                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={"ASIGNAR_RESPONSABLE"} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD} />
                            <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD} />
                        </div>
                        <div className='p-col-12 p-lg-12 caja'>ASIGNACIÓN RESPONSABLE</div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">RESPONSABLE</label>
                            <Dropdown value={this.state.responsable} optionLabel='nickName' options={this.state.usuarios} onChange={(e) => this.setState({ responsable: e.value })} placeholder="Seleccione" />
                        </div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">FECHA REALIZACIÓN PPRUEBA</label>
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
                            <Button className="p-button-danger" label="ASIGNAR RESPONSABLE" onClick={this.asignarResponsable} />
                            <Button className='p-button-secondary' label="RECHAZAR" onClick={this.rechazarSolicitud} />
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

export default connect(mapStateToProps, mapDispatchToProps)(VerAsignarResponsableSPP);