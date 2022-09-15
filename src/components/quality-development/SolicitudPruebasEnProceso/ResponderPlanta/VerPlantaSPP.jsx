import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
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

const ESTADO = 'EN_PROCESO';
const TIPO_SOLICITUD = 'SOLICITUD_PRUEBAS_PROCESO';
const ORDEN = 'PRODUCCION';

class VerPlantaSPP extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false,
            displayPruebaNoEjecutada: false,
            pruebaRealizada: false,
            fechaNotificacionPruebaRealizada: null
        };
        this.procesarSolicitud = this.procesarSolicitud.bind(this);
        this.marcarComoNoRealizada = this.marcarComoNoRealizada.bind(this);
        this.marcarComoRealizada = this.marcarComoRealizada.bind(this);

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
                    mostrarControles: solicitud.estado === ESTADO,
                    pruebaRealizada: solicitud.pruebaRealizada,
                    fechaNotificacionPruebaRealizada: solicitud.fechaNotificacionPruebaRealizada
                });
            }
        }
    }

    async procesarSolicitud() {
        this.props.openModal();
        await SolicitudPruebasProcesoService.procesar(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Aprobada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_planta_principal`);
        }, 2000);
    }


    async marcarComoNoRealizada() {
        if (_.isEmpty(this.state.observacion)) {
            this.growl.show({ severity: 'error', detail: 'Favor ingresa una Observación para marcar como prueba no ejecutada.' });
            return false;
        }
        this.props.openModal();
        await SolicitudPruebasProcesoService.marcarPruebaNoRealizada(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud marcada como no ejecutadad!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_planta_principal`);
        }, 2000);
    }

    async marcarComoRealizada() {
        this.props.openModal();
        await SolicitudPruebasProcesoService.marcarPruebaRealizada(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Prueba ejecutada notificada!' });
        this.setState({ pruebaRealizada: true, fechaNotificacionPruebaRealizada: moment.now() })
    }

    crearObjSolicitud() {
        return {
            id: this.state.id,
            observacionFlujo: this.state.observacion,
            orden: ORDEN
        }
    }

    render() {
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={this.marcarComoNoRealizada} label="Si" />
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
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">OBSERVACIÓN</label>
                            <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                        </div>
                    </div>
                }

                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id > 0 && this.state.estado === ESTADO &&
                        <div>
                            {this.state.pruebaRealizada &&
                                <Button className="p-button-primary" label="RESPONDER" onClick={this.procesarSolicitud} />
                            }
                            {!this.state.fechaNotificacionPruebaRealizada &&
                                <Button className='p-button-success' label="NOTIFICAR PRUEBA REALIZADA" onClick={this.marcarComoRealizada} />
                            }
                            {!this.state.fechaNotificacionPruebaRealizada &&
                                <Button className='p-button-secondary' label="PRUEBA NO REALIZADA" onClick={() => this.setState({ displayPruebaNoEjecutada: true })} />
                            }
                        </div>
                    }
                </div>
                <Dialog header="Confirmación" visible={this.state.displayPruebaNoEjecutada} style={{ width: '25vw' }} onHide={() => this.setState({ displayPruebaNoEjecutada: false })} blockScroll footer={dialogFooter} >
                    <p>¿Está seguro de no realizar la prueba solicitada?</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerPlantaSPP);