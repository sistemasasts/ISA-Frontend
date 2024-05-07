import React, { Component } from 'react'
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import ReclamoMPService from '../../../service/ReclamoMPService';
/* import "../../site.css"; */
import * as _ from "lodash";
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import * as moment from 'moment';
import { Messages } from 'primereact/messages';
import Adjuntos from '../SolicitudEnsayo/Adjuntos';

var ORDEN = 'PROCESAR_PLANES_ACCION';
var ESTADO = 'APROBADO';
var TIPO_SOLICITUD = 'RECLAMO_MP';
var PROCESO = "EJECUTAR";

class ReclamoPlanAccionProcesar extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            idReclamo: 0,
            observacion: null,
            camposObligatorios: []
        }

        this.operar = this.operar.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.origen);
        }
    }

    fetchData(data) {
        PROCESO = this.props.proceso;
        if (data.state.planAccionSeleccionado)
            ESTADO = data.state.planAccionSeleccionado.estado;

        this.setState({
            display: data.state.abrirProcesar,
            idReclamo: data.state.idReclamo,
            id: data.state.id
        });

    }

    componentDidMount() {
        this.fetchData(this.props.origen);

    }

    cerrarDialogo(planesAtualizado) {
        debugger
        if(planesAtualizado)
            this.props.origen.setState({ abrirProcesar: false, planesAccion: planesAtualizado })
        else
            this.props.origen.setState({ abrirProcesar: false})
        this.setState({
            display: false, id: null, destinos: [], asunto: null, mensaje: null
        })
    }

    async operar(accion) {
        debugger;
        var planes= [];
        switch (PROCESO) {
            case 'VALIDAR':
                planes = await ReclamoMPService.validarPlanAccion(this.crearObj(accion))
                break;
            case 'EJECUTAR':
                planes = await ReclamoMPService.procesarPlanAccion(this.crearObj(accion))
                break;

            default:
                break;
        }

        this.growl.show({ severity: 'success', detail: 'Plan de acción procesado!' });
        this.cerrarDialogo(planes);

    }

    crearObj(accion) {
        return {
            id: this.state.id,
            idReclamo: this.state.idReclamo,
            observacion: this.state.observacion,
            estado: accion
        }
    }


    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = [];
        this.setState({ camposObligatorios: camposOblogatoriosDetectados })
        return camposOblogatoriosDetectados.length === 0 ? true : false;
    }

    determinarEsCampoRequerido(nombreCampo) {
        var resultado = false
        _.forEach(this.state.camposObligatorios, (x) => {
            if (x.campo === nombreCampo)
                resultado = true
        })
        return resultado;
    }



    render() {
        let footer = <div className="p-dialog-buttonpane p-helper-clearfix">
            {_.includes(['ASIGNADA', 'REGRESADO'], ESTADO) && <Button className='p-button-success' label="FINALIZAR TAREA" onClick={() => this.operar('FINALIZADO')} />}
            {_.includes(['PENDIENTE_APROBACION'], ESTADO) && <Button className='p-button-success' label="APROBAR TAREA" onClick={() => this.operar('FINALIZADO')} />}
            {_.includes(['PENDIENTE_APROBACION'], ESTADO) && <Button className='p-button-danger' label="REGRESAR TAREA" onClick={() => this.operar('REGRESADO')} />}
            <Button className='p-button-danger' label="CANCELAR" onClick={()=>this.cerrarDialogo(null)} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />

                <Dialog header="Finalizar Tarea" visible={this.state.display} style={{ width: '40vw' }} footer={footer} modal={true} onHide={() => this.setState({ visibleModalEmail: false })}>
                    <Messages ref={(el) => this.messages = el} />
                    <div className="p-grid p-grid-responsive p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.idReclamo} id={this.props.id} orden={ORDEN} controles={true} estado={ESTADO} tipo={TIPO_SOLICITUD} />
                        </div>

                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">OBSERVACIÓN</label>
                            <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                        </div>
                    </div>
                </Dialog>
            </div>

        )
    }
}

export default ReclamoPlanAccionProcesar;