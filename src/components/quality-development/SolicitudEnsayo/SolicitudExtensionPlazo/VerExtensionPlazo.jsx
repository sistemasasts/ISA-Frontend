import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
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
import * as moment from 'moment';
import { InputText } from 'primereact/inputtext';

const ESTADO = 'PENDIENTE_APROBACION_EXTENSION_PLAZO';
const TIPO_SOLICITUD = 'SOLICITUD_ENSAYO';
class VerExtensionPlazo extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            extensionFecha: null,
            mostrarControles: false,
            fechaSolicitudExtension: null,
            motivoSolicitudExtension: null,
            fechaEntregaInforme: null,
        };
        this.ejecutarAccion = this.ejecutarAccion.bind(this);
        this.regresar = this.regresar.bind(this);
    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);
        this.setState({ id: this.props.match.params.idSolicitud });
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudEnsayoService.listarPorId(idSolicitud);
            if (solicitud) {
                this.setState({
                    id: solicitud.id,
                    estado: solicitud.estado,
                    mostrarControles: solicitud.estado === ESTADO,
                    fechaSolicitudExtension: solicitud.fechaSolicitudExtension,
                    motivoSolicitudExtension: this.obtenerMotivo(solicitud),
                    fechaEntregaInforme: solicitud.fechaEntrega,
                });
            }
        }
    }

    obtenerMotivo(solicitud){
        var extensiones = _.filter(solicitud.extensionesPlazo, (x)=> {return x.estado === 'PENDIENTE'}) ;
        if(extensiones.length > 0)
            return extensiones[0].motivo;
        return '';
    }

    regresar() {
        history.goBack();
    }


    async ejecutarAccion(aprobar) {
        debugger
        if (!aprobar && _.isEmpty(this.state.observacion)) {
            this.growl.show({ severity: 'error', detail: 'La observación es oblogatoria.' });
            return false;
        }

        if (aprobar && this.state.extensionFecha == null) {
            this.growl.show({ severity: 'error', detail: 'Ingrese la nueva fecha de entrega.' });
            return false;
        }

        this.props.openModal();
        await SolicitudEnsayoService.ejecutarAccionExtensionPlazo(this.crearObjSolicitud(aprobar));
        this.growl.show({ severity: 'success', detail: 'Solicitud Procesada!' });
        this.props.closeModal();
        setTimeout(function () {
            history.push(`/quality-development_solicitudse_aprobar_extensionplazo`);
        }, 2000);
    }

    crearObjSolicitud(aprobar) {
        let fechaNueva = this.state.extensionFecha != null ? moment(this.state.extensionFecha).format("YYYY-MM-DD") : null;
        if(!aprobar)
            fechaNueva = null;
        return {
            id: this.state.id,
            observacion: this.state.observacion,
            extensionFecha: fechaNueva
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
                <FormularioSELectura solicitud={this.props.match.params.idSolicitud} />
                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={"APROBACION_EXTENSION_PLAZO"} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD}/>
                            <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD}/>
                        </div>
                        <div className='p-col-12 p-lg-12 caja'>EXTENSIÓN DE PLAZO</div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">FECHA DE SOLICITUD EXTENSIÓN</label>
                            <InputText readOnly value={this.state.fechaSolicitudExtension} />
                        </div>

                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">FECHA ENTREGA INFORME</label>
                            <InputText readOnly value={this.state.fechaEntregaInforme} />
                        </div>

                        <div className='p-col-12 p-lg-4'>
                            <label style={{color:'red'}} htmlFor="float-input">INGRESE NUEVA FECHA DE ENTREGA DE INFORME</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.extensionFecha} locale={es} onChange={(e) => this.setState({ extensionFecha: e.value })} showIcon={true} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">MOTIVO EXTENSIÓN DE PLAZO</label>
                            <InputTextarea value={this.state.motivoSolicitudExtension} rows={3} readOnly />
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
                            <Button className="p-button" label="APROBAR" onClick={() => this.ejecutarAccion(true)} />
                            <Button className='p-button-danger' label="RECHAZAR" onClick={() => this.ejecutarAccion(false)} />
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.regresar} />
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

export default connect(mapStateToProps, mapDispatchToProps)(VerExtensionPlazo);
