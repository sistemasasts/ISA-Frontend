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
import SolicitudPruebasProcesoService from '../../../../service/SolicitudEnsayo/SolicitudPruebasProcesoService';
import FormularioSPPLectura from '../FormularioSPPLectura';
import Adjuntos from '../../SolicitudEnsayo/Adjuntos';
import Historial from '../../SolicitudEnsayo/Historial';

const ESTADO = 'ENVIADO_REVISION';
const TIPO_SOLICITUD = 'SOLICITUD_PRUEBAS_PROCESO';

class VerValidar extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false
        };
        this.validarSolicitud = this.validarSolicitud.bind(this);
        this.rechazarSolicitud = this.rechazarSolicitud.bind(this);

    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);
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

    async validarSolicitud() {
        this.props.openModal();
        await SolicitudPruebasProcesoService.validarSolicitud(this.crearObjSolicitud());
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
            observacion: this.state.observacion
        }
    }

    render() {
        return (

            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <FormularioSPPLectura solicitud={this.props.match.params.idSolicitud} />
                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={"VALIDAR_SOLICITUD"} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD} />
                            <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD} />
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
                            <Button className="p-button-danger" label="APROBAR" onClick={this.validarSolicitud} />
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

export default connect(mapStateToProps, mapDispatchToProps)(VerValidar);