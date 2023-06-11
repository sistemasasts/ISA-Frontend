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


const ESTADO = 'PENDIENTE_REVISION';
const TIPO_SOLICITUD = 'SALIDA_MATERIAL';
const ORDEN = "VALIDAR_PLAN_ACCION";

class PncVerPAValidar extends Component {

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
        this.validarPlan = this.validarPlan.bind(this);
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
            console.log(plan)
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

    async validarPlan(aprobado) {
        let continuar = true;
        if (!aprobado) {
            if (_.isEmpty(this.state.observacion)) {
                this.growl.show({ severity: 'error', detail: 'Debe ingresar una observación' });
                continuar = false;
            }
        }
        if (continuar) {
            await PncPlanAccionService.procesar(this.crearObjSolicitud(aprobado));
            this.growl.show({ severity: 'success', detail: 'Plan de acción Validado!' });
            setTimeout(function () {
                history.push(`/quality-development_pnc_validarTarea`);
            }, 1000);
        }
    }

    crearObjSolicitud(aprobado) {
        return {
            id: this.state.planEnProceso.id,
            observacion: this.state.observacion,
            ordenFlujo: ORDEN,
            salidaMaterialId: this.state.id,
            aprobado: aprobado
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
                            <Adjuntos solicitud={this.props.match.params.idPncSalida} orden={ORDEN} controles={this.state.mostrarControles} 
                            estado={ESTADO} tipo={TIPO_SOLICITUD} planAccionId={this.state.planEnProceso.id}/>
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
                            <Button className="p-button" label="APROBAR" onClick={() => this.validarPlan(true)} />
                            <Button className="p-button-danger" label="RECHAZAR" onClick={() => this.validarPlan(false)} />
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.redirigirInicio} />
                        </div>
                    }
                </div>

            </div >
        )
    }
}

export default PncVerPAValidar;
