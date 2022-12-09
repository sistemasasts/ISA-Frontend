import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import history from '../../../../history';
import "../../../site.css";
import * as _ from "lodash";
import Adjuntos from '../../SolicitudEnsayo/Adjuntos';
import Historial from '../../SolicitudEnsayo/Historial';
import SolicitudEnsayoService from '../../../../service/SolicitudEnsayo/SolicitudEnsayoService';
import FormularioSELectura from '../../SolicitudEnsayo/FormularioSELectura';

const ORDEN = 'REVISION_INFORME'
const ESTADO = 'REVISION_INFORME';
const TIPO_SOLICITUD = 'SOLICITUD_ENSAYO';

class VerAprobarSE extends Component {

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
    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudEnsayoService.listarPorId(idSolicitud);
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
        if (aprobado) {
            await SolicitudEnsayoService.aprobarInforme(this.crearObjSolicitud());
            this.growl.show({ severity: 'success', detail: 'Solicitud Aprobado!' });
        }
        else {
            if (_.isEmpty(this.state.observacion)) {
                this.growl.show({ severity: 'error', detail: 'El campo observación es obligatorio.' });
                return false;
            }
            await SolicitudEnsayoService.rechazarInforme(this.crearObjSolicitud());
            this.growl.show({ severity: 'success', detail: 'Solicitud Rechazada!' });
        }
        setTimeout(function () {
            history.push(`/quality-development_solicitudpp_calidad_aprobar_principal`);
        }, 2000);
    }

    redirigirInicio() {
        history.push(`/quality-development_solicitudpp_calidad_aprobar_principal`);
    }

    crearObjSolicitud() {
        return {
            id: this.state.id,
            observacion: this.state.observacion,
            orden: ORDEN
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
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.redirigirInicio} />
                        </div>
                    }
                </div>

            </div >
        )
    }
}


export default VerAprobarSE;
