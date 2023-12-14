import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import * as _ from "lodash";
import PncSalidaMaterialService from '../../../../../service/Pnc/PncSalidaMaterialService';
import history from '../../../../../history';
import FormLectura from '../../FormLectura';
import PncSalidaMaterialFormLectura from '../../SalidaMaterial/PncSalidaMaterialFormLectura';
import Adjuntos from '../../../SolicitudEnsayo/Adjuntos';
import PncHistorial from '../../PncHistorial';
import PncPlanAccionService from '../../../../../service/Pnc/PncPlanAccionService';
import PncSalidaMaterialInfoAdd from './PncSalidaMaterialInfoAdd';


const ESTADO = 'ASIGNADO';
const TIPO_SOLICITUD = 'SALIDA_MATERIAL';
const ORDEN = "PROCESAR_PLAN_ACCION";

class PncVerPAProcesar extends Component {

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
            salida: null,
            planEnProceso: null,
        };
        this.procesarPlan = this.procesarPlan.bind(this);
        this.redirigirInicio = this.redirigirInicio.bind(this);

    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idPncSalida, this.props.match.params.idPlan);
    }

    async refrescar(idSolicitud, idPlan) {
        if (idSolicitud) {
            const salidaMaterial = await PncSalidaMaterialService.listarPorIdCompleto(idSolicitud);
            const plan = await PncPlanAccionService.listarPorId(idPlan);
            console.log(salidaMaterial)
            if (salidaMaterial) {
                this.setState({
                    id: salidaMaterial.id,
                    estado: plan.estado,
                    mostrarControles: plan.estado === ESTADO,
                    pnc: salidaMaterial.productoNoConforme,
                    salida: salidaMaterial,
                    planEnProceso: plan
                });
            }
        }
    }

    async procesarPlan() {
        await PncPlanAccionService.procesar(this.crearObjSolicitud());
        this.growl.show({ severity: 'success', detail: 'Plan de acción Procesado!' });
        setTimeout(function () {
            history.push(`/quality-development_pnc_procesarTarea`);
        }, 1000);

    }

    crearObjSolicitud() {
        return {
            id: this.state.planEnProceso.id,
            observacion: this.state.observacion,
            ordenFlujo: ORDEN,
            salidaMaterialId: this.state.id
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
                        <FormLectura pnc={this.state.pnc} reporte={true} />
                        <PncSalidaMaterialFormLectura salidaMaterial={this.state.salida} />
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <PncSalidaMaterialInfoAdd salidaMaterial={this.state.salida} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idPncSalida} orden={ORDEN} controles={this.state.mostrarControles}
                                estado={ESTADO} tipo={TIPO_SOLICITUD} planAccionId={this.state.planEnProceso.id} />
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
                            <Button className="p-button" label="PROCESAR" onClick={this.procesarPlan} />
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.redirigirInicio} />
                        </div>
                    }
                </div>

            </div >
        )
    }
}

export default PncVerPAProcesar;
