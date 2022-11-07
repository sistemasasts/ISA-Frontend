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

const ESTADO = 'PENDIENTE_APROBACION';
const TIPO_SOLICITUD = 'SOLICITUD_PRUEBAS_PROCESO';
const ORDEN = "APROBAR_SOLICITUD";
class VerAprobacionSPP extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false,
            tiposAprobacion: [],
            aprobacion: null
        };
        this.aprobarSolicitud = this.aprobarSolicitud.bind(this);
        this.rechazarSolicitud = this.rechazarSolicitud.bind(this);
        this.redirigirInicio = this.redirigirInicio.bind(this);
        this.abrirInformeDatos = this.abrirInformeDatos.bind(this);

    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);
        this.cargarCatalogos();
    }

    async cargarCatalogos() {
        const aprobaciones = await SolicitudPruebasProcesoService.listarTipoAprobacion();
        this.setState({ tiposAprobacion: aprobaciones });
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

    async aprobarSolicitud() {
        if (_.isEmpty(this.state.aprobacion)) {
            this.growl.show({ severity: 'error', detail: 'Favor seleccione un Tipo de Aprobación.' });
            return false;
        }
        if (this.validarRequiereObservacion()) {
            if (_.isEmpty(this.state.observacion)) {
                this.growl.show({ severity: 'error', detail: 'Favor ingresa una observación.' });
                return false;
            }
        }
        this.props.openModal();
        await SolicitudPruebasProcesoService.procesarAprobacion(this.crearObjSolicitud());
        this.props.closeModal();
        this.growl.show({ severity: 'success', detail: 'Solicitud Aprobada!' });
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_aprobar_principal`);
        }, 1000);
    }

    validarRequiereObservacion() {
        if (_.isEqual(this.state.aprobacion, 'REPETIR_PRUEBA') || _.isEqual(this.state.aprobacion, 'MATERIAL_NO_VALIDO')
            || _.isEqual(this.state.aprobacion, 'AJUSTE_MAQUINARIA'))
            return true;
        return false;
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
            history.push(`/quality-development_solicitudpp_aprobar_principal`);
        }, 1000);
    }

    crearObjSolicitud() {
        return {
            solicitudId: this.state.id,
            observacion: this.state.observacion,
            orden: ORDEN,
            tipoAprobacion: this.state.aprobacion
        }
    }

    abrirInformeDatos() {
        window.open(`${window.location.origin}/#quality-development_solicitudpp_informe_final/${this.state.id}/APROBADOR_FINAL`)
    }

    redirigirInicio() {
        history.push(`/quality-development_solicitudpp_procesar`);
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
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">TIPO APROBACIÓN</label>
                            <Dropdown options={this.state.tiposAprobacion} value={this.state.aprobacion} autoWidth={false} onChange={(event => this.setState({ aprobacion: event.value }))} placeholder="SELECCIONE" />
                        </div>
                    </div>
                }

                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id > 0 && this.state.estado === ESTADO &&
                        < div >
                            <Button className="p-button-danger" label="APROBAR" onClick={this.aprobarSolicitud} />
                            <Button className='p-button-secondary' label="RECHAZAR" onClick={this.rechazarSolicitud} />
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

export default connect(mapStateToProps, mapDispatchToProps)(VerAprobacionSPP);
