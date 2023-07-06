import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import history from '../../../../history';
import "../../../site.css";
import * as _ from "lodash";

import Adjuntos from '../../SolicitudEnsayo/Adjuntos';

import PncSalidaMaterialService from '../../../../service/Pnc/PncSalidaMaterialService';
import PncHistorial from '../PncHistorial';
import FormLectura from '../FormLectura';
import PncSalidaMaterialFormLectura from '../SalidaMaterial/PncSalidaMaterialFormLectura';

const ESTADO = 'PENDIENTE_APROBACION';
const TIPO_SOLICITUD = 'SALIDA_MATERIAL';
const ORDEN = "APROBACION";

class PncVerAprobacion extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false,
            tiposAprobacion: [],
            aprobacion: null,
            pnc: null,
            salida: null
        };
        this.aprobarSolicitud = this.aprobarSolicitud.bind(this);
        this.redirigirInicio = this.redirigirInicio.bind(this);
        this.regresarSolicitud = this.regresarSolicitud.bind(this);

    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idPncSalida);
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const salidaMaterial = await PncSalidaMaterialService.listarPorIdCompleto(idSolicitud);
            console.log(salidaMaterial)
            if (salidaMaterial) {
                this.setState({
                    id: salidaMaterial.id,
                    estado: salidaMaterial.estado,
                    mostrarControles: salidaMaterial.estado === ESTADO,
                    pnc: salidaMaterial.productoNoConforme,
                    salida: salidaMaterial
                });
            }
        }
    }

    async aprobarSolicitud(aprobado) {
        let continuar = true;
        if (!aprobado) {
            if (_.isEmpty(this.state.observacion)) {
                this.growl.show({ severity: 'error', detail: 'Debe ingresar una observación' });
                continuar = false;
            }
        }
        if (continuar) {
            await PncSalidaMaterialService.aprobar(this.crearObjSolicitud(aprobado));
            this.growl.show({ severity: 'success', detail: 'Salida de Material Procesada!' });
            setTimeout(function () {
                history.push(`/quality-development_pnc_salida_material_aprobacion`);
            }, 1000);
        }
    }

    async regresarSolicitud() {
        let continuar = true;
        if (_.isEmpty(this.state.observacion)) {
            this.growl.show({ severity: 'error', detail: 'Debe ingresar una observación' });
            continuar = false;
        }
        if (continuar) {
            await PncSalidaMaterialService.regresar(this.crearObjSolicitud(false));
            this.growl.show({ severity: 'success', detail: 'Salida de Material Regresada!' });
            setTimeout(function () {
                history.push(`/quality-development_pnc_salida_material_aprobacion`);
            }, 1000);
        }
    }

    crearObjSolicitud(esAprobado) {
        return {
            id: this.state.id,
            observacionFlujo: this.state.observacion,
            orden: ORDEN,
            aprobado: esAprobado
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
                        <FormLectura pnc={this.state.pnc} />
                        <PncSalidaMaterialFormLectura salidaMaterial={this.state.salida} />
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idPncSalida} orden={ORDEN} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD} />
                            <PncHistorial solicitud={this.props.match.params.idPncSalida} />
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
                            <Button className="p-button" label="APROBAR" onClick={() => this.aprobarSolicitud(true)} />
                            <Button className="p-button-danger" label="RECHAZAR" onClick={() => this.aprobarSolicitud(false)} />
                            <Button className="p-button-danger" label="REGRESAR" onClick={() => this.regresarSolicitud()} />
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.redirigirInicio} />
                        </div>
                    }
                </div>

            </div >
        )
    }
}

export default PncVerAprobacion;
