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

const ESTADO = ['EN_PROCESO', 'REGRESADO_NOVEDAD_INFORME'];
const TIPO_SOLICITUD = 'SOLICITUD_ENSAYO';
let ESTADO_SOLICITUD;
class VerResponder extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false
        };
        this.responderSolicitud = this.responderSolicitud.bind(this);
        this.anularSolicitud = this.anularSolicitud.bind(this);
    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);        
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudEnsayoService.listarPorId(idSolicitud);
            if (solicitud) {
                ESTADO_SOLICITUD = solicitud.estado;
                this.setState({
                    id: solicitud.id,
                    estado: solicitud.estado,
                    mostrarControles: _.includes(ESTADO, solicitud.estado)
                });
            }
        }
    }

    async responderSolicitud() {
        this.props.openModal();
        await SolicitudEnsayoService.responderSolicitud(this.crearObjSolicitud());
        this.growl.show({ severity: 'success', detail: 'Informe Enviado!' });
        this.props.closeModal();
        setTimeout(function () {
            history.push(`/quality-development_solicitudse_procesar`);
        }, 2000);
    }

    async anularSolicitud() {
        this.props.openModal();
        const objSE = { id: this.state.id, observacion: this.state.observacion, orden: 'RESPONDER_SOLICITUD' };
        await SolicitudEnsayoService.anularSolicitud(objSE);
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Anulada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudse_procesar`);
        }, 1000);
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
                <FormularioSELectura solicitud={this.props.match.params.idSolicitud} />
                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={"RESPONDER_SOLICITUD"} controles={this.state.mostrarControles} estado={ESTADO_SOLICITUD} tipo={TIPO_SOLICITUD} />
                            <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">OBSERVACIÓN</label>
                            <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                        </div>
                    </div>
                }
                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id > 0 && _.includes(ESTADO, this.state.estado) &&
                        < div >
                            <Button className="p-button-danger" label="ENVIAR INFORME" onClick={this.responderSolicitud} />
                            <Button className='p-button-secondary' label="ANULAR" onClick={this.anularSolicitud} />
                        </div>
                    }
                </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(VerResponder);