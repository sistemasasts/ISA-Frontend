import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import history from '../../../../history';
import "../../../site.css";
import * as _ from "lodash";

import Adjuntos from '../../SolicitudEnsayo/Adjuntos';

import ReclamoFormLectura from '../ReclamoFormLectura';
import ReclamoMPService from '../../../../service/ReclamoMPService';
import PncHistorial from '../../Pnc/PncHistorial';
import ReclamoPlanesAccion from '../ReclamoPlanesAccion';

var ESTADO = 'PENDIENTE_APROBACION_CALIDAD';
const TIPO_SOLICITUD = 'RECLAMO_MP';
var ORDEN = "APROBACION_CALIDAD";

class ReclamoVerPlanAccion extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false,
            tiposAprobacion: [],
            aprobacion: null,
            reclamo: null,
            planesAccion: [],
            accionesEjecutadas: []

        };
        this.procesar = this.procesar.bind(this);
        this.redirigirInicio = this.redirigirInicio.bind(this);

    }

    async componentDidMount() {
        console.log(this.props.match.params)
        if (this.props.match.params.orden === 'compras') {
            ORDEN = "APROBACION_COMPRAS";
            ESTADO = 'PENDIENTE_APROBACION_COMPRAS';
        }
        this.refrescar(this.props.match.params.idReclamo);
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const reclamoMP = await ReclamoMPService.listarPorId(idSolicitud);
            console.log(reclamoMP)
            if (reclamoMP) {
                this.setState({
                    id: reclamoMP.id,
                    estado: reclamoMP.state,
                    mostrarControles: reclamoMP.state === ESTADO,
                    reclamo: reclamoMP,
                    planesAccion: reclamoMP.listActionsPlanProvider,
                    accionesEjecutadas: reclamoMP.listExecutedActons,
                });
            }
        }
    }

    async procesar(accion) {
        console.log(ORDEN);
        let continuar = true;
        if (_.includes(['RECHAZADO', 'REGRESADO'], accion)) {
            if (_.isEmpty(this.state.observacion)) {
                this.growl.show({ severity: 'error', detail: 'Debe ingresar una observación' });
                continuar = false;
            }
        }
        if (continuar) {
            if (ORDEN === 'APROBACION_CALIDAD')
                await ReclamoMPService.procesarCalidad(this.crearObjSolicitud(accion));
            if (ORDEN === 'APROBACION_COMPRAS')
                await ReclamoMPService.procesarCompras(this.crearObjSolicitud('APROBADO'));
            this.growl.show({ severity: 'success', detail: 'Reclamo Procesado!' });
            setTimeout(function () {
                const parametro = ORDEN === 'APROBACION_CALIDAD' ? 'calidad' : 'compras';
                history.push(`/quality-development_complaint_aprobacion/${parametro}`);
            }, 1000);
        }
    }

    crearObjSolicitud(accion) {
        return {
            id: this.state.id,
            observacion: this.state.observacion,
            orden: ORDEN,
            accion: accion
        }
    }

    redirigirInicio() {
        history.goBack();
    }

    render() {
        return (

            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />

                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <ReclamoFormLectura reclamo={this.state.reclamo} />
                        <ReclamoPlanesAccion idReclamo={this.state.id} mostrarControles={true} problemas={this.state.planesAccion} proceso={'EJECUTAR'}></ReclamoPlanesAccion>

                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idReclamo} orden={ORDEN} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD} />
                            <PncHistorial solicitud={this.props.match.params.idReclamo} tipo={TIPO_SOLICITUD} />
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
                            <Button className="p-button" label="APROBAR" onClick={() => this.procesar('APROBADO')} />
                            <Button className="p-button-danger" label="RECHAZAR" onClick={() => this.procesar('RECHAZADO')} />
                            {ORDEN === 'APROBACION_CALIDAD' && <Button className="p-button-danger" label="REGRESAR" onClick={() => this.procesar('REGRESADO')} />}
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.redirigirInicio} />
                        </div>
                    }
                </div>

            </div >
        )
    }
}

export default ReclamoVerPlanAccion;
