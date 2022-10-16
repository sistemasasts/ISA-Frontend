import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../../../history';
import { closeModal, openModal } from '../../../../store/actions/modalWaitAction';
import "../../../site.css";
import FormularioSPPLectura from '../FormularioSPPLectura';
import Adjuntos from '../../SolicitudEnsayo/Adjuntos';
import Historial from '../../SolicitudEnsayo/Historial';
import SolicitudPruebasProcesoService from '../../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';
import { ToggleButton } from 'primereact/togglebutton';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';
import * as _ from "lodash";

const ORDEN = 'AJUSTE_MAQUINARIA'
const ESTADO = 'PENDIENTE_AJUSTE_MAQUINARIA';
const TIPO_SOLICITUD = 'SOLICITUD_PRUEBAS_PROCESO';

class VerAjusteMaquinaria extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false,
            factible: false,
            displayFactible: false
        };
        this.responderSolicitud = this.responderSolicitud.bind(this);
        this.redirigirInicio = this.redirigirInicio.bind(this);
        this.confirmarFinalizacion = this.confirmarFinalizacion.bind(this);
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

    async responderSolicitud() {
        this.props.openModal();
        await SolicitudPruebasProcesoService.procesar(this.crearObjSolicitud());
        this.growl.show({ severity: 'success', detail: 'Solicitud respondida!' });
        this.props.closeModal();
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_ajuste_maquinaria_principal`);
        }, 1000);
    }

    redirigirInicio() {
        history.push(`/quality-development_solicitudpp_ajuste_maquinaria_principal`);
    }

    crearObjSolicitud() {
        return {
            id: this.state.id,
            observacionFlujo: this.state.observacion,
            orden: ORDEN,
            ajusteMaquinariaFactible: this.state.factible
        }
    }

    confirmarFinalizacion() {
        if (!this.state.factible && _.isEmpty(this.state.observacion)) {
            this.growl.show({ severity: 'error', detail: 'La observación es obligatoria' });
            return false
        } else {
            this.setState({ displayFactible: true });
        }

    }

    render() {
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={this.responderSolicitud} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ displayFactible: false })} label="No" className="p-button-danger" />
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
                        <div className='p-col-12 p-lg-3'>
                            <label htmlFor="float-input" style={{ fontWeight: 'bold' }}>¿ES FACTIBLE?</label>
                            <ToggleButton style={{ width: '150px', marginLeft: '15px' }} onLabel='SI' checked={this.state.factible} onChange={(e) => this.setState({ factible: e.value })} />
                        </div>
                        <div className='p-col-12 p-lg-9'>
                            {this.state.factible &&
                                <Message severity="warn" text="Debe adjuntar el informe de los ajustes realizados para repetir la prueba." />
                            }
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
                            <Button className="p-button-primary" label="CONFIRMAR FINALIZACIÓN DE AJUSTES" onClick={this.confirmarFinalizacion} />
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.redirigirInicio} />
                        </div>
                    }
                </div>
                <Dialog header="Confirmación" visible={this.state.displayFactible} style={{ width: '25vw' }} onHide={() => this.setState({ displayPruebaNoEjecutada: false })} blockScroll footer={dialogFooter} >
                    {this.state.factible &&
                        <p>¿Está seguro de confirmar la finalización de los ajustes de maquinaria?</p>
                    }
                    {!this.state.factible &&
                        <p>¿Está seguro de notificar que los ajustes de maquinaria NO SON FACTIBLES?</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerAjusteMaquinaria);