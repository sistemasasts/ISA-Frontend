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

const ORDEN = 'PRODUCCION'
const ESTADO = 'EN_PROCESO';
const TIPO_SOLICITUD = 'SOLICITUD_PRUEBAS_PROCESO';

class VerAprobarPlantaSPP extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false
        };
        this.responderSolicitud = this.responderSolicitud.bind(this);
        this.redirigirInicio = this.redirigirInicio.bind(this);
        this.abrirInformeDatos = this.abrirInformeDatos.bind(this);
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

    async responderSolicitud(aprobado) {
        this.props.openModal();
        await SolicitudPruebasProcesoService.procesarAprobacion(this.crearObjSolicitud(aprobado));
        if (aprobado)
            this.growl.show({ severity: 'success', detail: 'Solicitud Aprobado!' });
        else
            this.growl.show({ severity: 'success', detail: 'Solicitud Rechazada!' });
        this.props.closeModal();
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_planta_aprobar_principal`);
        }, 2000);
    }

    redirigirInicio() {
        history.push(`/quality-development_solicitudpp_planta_aprobar_principal`);
    }

    crearObjSolicitud(aprobado) {
        return {
            solicitudId: this.state.id,
            observacion: this.state.observacion,
            orden: ORDEN,
            aprobar: aprobado
        }
    }

    abrirInformeDatos() {
        window.open(`${window.location.origin}/#quality-development_solicitudpp_informe/${this.state.id}/PRODUCCION/APROBAR`)
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
                        < div >
                            <Button className="p-button-primary" label="APROBAR" onClick={() => this.responderSolicitud(true)} />
                            <Button className="p-button-danger" label="RECHAZAR" onClick={() => this.responderSolicitud(false)} />
                            <Button className='p-button-success' label="VER DATOS DDP05" onClick={() => this.abrirInformeDatos()} />
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.redirigirInicio} />
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

export default connect(mapStateToProps, mapDispatchToProps)(VerAprobarPlantaSPP);
