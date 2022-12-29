import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import history from '../../../../history';
import Adjuntos from '../Adjuntos';
import "../../../site.css";
import * as _ from "lodash";
import FormularioSELectura from '../FormularioSELectura';
import Historial from '../Historial';
import SolicitudEnsayoService from '../../../../service/SolicitudEnsayo/SolicitudEnsayoService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import SolicitudPlanAccionService from '../../../../service/SolicitudPlanAccion/SolicitudPlanAccionService';
import { determinarColorActivo } from '../ClasesUtilidades';
import Confirmacion from '../../Shared/Confirmacion';

const ESTADO = 'PLANES_ACCION_REVISADOS';
const TIPO_SOLICITUD = 'SOLICITUD_ENSAYO';
const ORDEN = 'SOLICITANTE_PLANES_ACCION';
class SEPlanesAccionRev extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            aprobacion: null,
            mostrarControles: false,
            mostrarControlesPlanesAccion: false,
            mostrarFormPlanAccion: false,
            planSeleccionado: null,
            planesAccion: [],

            mostrarConfirmacion: false,
            contenidoConfirmacion: null,
            identificadorConfirmacion: null,
            
        };
        this.regresarSolicitud = this.regresarSolicitud.bind(this);        
        this.refrescarPlanesAccion = this.refrescarPlanesAccion.bind(this);
        this.actionTemplateCumplido = this.actionTemplateCumplido.bind(this);
        this.confirmarEnviarNuevaSolicitud = this.confirmarEnviarNuevaSolicitud.bind(this);
        this.confirmarFinalizarProceso = this.confirmarFinalizarProceso.bind(this);
        this.respuestaConfirmacion = this.respuestaConfirmacion.bind(this);
    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);
        this.setState({ id: this.props.match.params.idSolicitud });
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudEnsayoService.listarPorId(idSolicitud);
            if (solicitud) {
                const planes = await SolicitudPlanAccionService.listarPorTipo('SOLICITUD_ENSAYOS', idSolicitud);
                this.setState({
                    id: solicitud.id,
                    estado: solicitud.estado,
                    planesAccion: planes,
                    mostrarControles: _.isEqual('PLANES_ACCION_REVISADOS', solicitud.estado),
                });
            }
        }
    }

    async refrescarPlanesAccion() {
        const planes = await SolicitudPlanAccionService.listarPorTipo('SOLICITUD_ENSAYOS', this.state.id);
        this.setState({ planesAccion: planes });
    }

    actionTemplateCumplido(rowData) {
        if (rowData.cumplido === null)
            return "";
        else
            return <span className={determinarColorActivo(rowData.cumplido)}>{rowData.cumplido ? 'SI' : 'NO'}</span>;
    }


    regresarSolicitud() {
        history.push(`/quality-development_solicitudse`);
    }

    async respuestaConfirmacion(identificador) {
        console.log(identificador)
        switch (identificador) {
            case 'finalizarProceso':
                await SolicitudEnsayoService.finalizarProceso(this.crearObjSolicitud());
                this.growl.show({ severity: 'success', detail: 'Proceso finalizado.' });
                setTimeout(() => {
                    this.regresarSolicitud();
                }, 400);
                break;
            case 'nuevaSolicitud':
                const nuevaSolicitud = await SolicitudEnsayoService.crearAPartirSolicitudPadre(this.state.id);
                this.growl.show({ severity: 'success', detail: 'Solicitud creada.' });
                setTimeout(() => {
                    history.push(`/quality-development_solicitudse_edit/${nuevaSolicitud.id}`);
                }, 400);
                break;

            default:
                break;
        }
    }

    confirmarFinalizarProceso() {
        this.setState({ mostrarConfirmacion: true, contenidoConfirmacion: '¿Está seguro de finalizar el proceso?', identificadorConfirmacion: 'finalizarProceso' });
    }

    confirmarEnviarNuevaSolicitud() {
        this.setState({ mostrarConfirmacion: true, contenidoConfirmacion: '¿Está seguro de enviar una nueva solicitud?', identificadorConfirmacion: 'nuevaSolicitud' });
    }

    crearObjSolicitud() {
        return {
            id: this.state.id,
            observacion: this.state.observacion
        }
    }

    planesAccionTodosCumplidos() {
        const cumplidosNo = _.filter(this.state.planesAccion, (o) => { return !o.cumplido });
        return !cumplidosNo.length > 0;
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
                        <div className='p-col-12 p-lg-12 caja'>PLANES DE ACCIÓN</div>
                        <div className='p-col-12 p-lg-12'>
                            <DataTable value={this.state.planesAccion} rows={15} >
                                <Column field="descripcion" header="Descripción" />
                                <Column field="fechaInicio" header="Fecha Inicio" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                                <Column field="fechaFin" header="Fecha Fin" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                                <Column header="Cumplido" body={this.actionTemplateCumplido} style={{ textAlign: 'center', width: '8em' }} />
                            </DataTable>
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
                            {this.planesAccionTodosCumplidos() &&
                                <Button className='p-button' label="ENVIAR NUEVA SOLICITUD" onClick={this.confirmarEnviarNuevaSolicitud} />
                            }
                            <Button className='p-button-danger' label="FINALIZAR PROCESO" onClick={this.confirmarFinalizarProceso} />
                            <Button className='p-button-secondary' label="ATRÁS" onClick={this.regresarSolicitud} />
                        </div>
                    }

                </div>                
                <Confirmacion mostrar={this.state.mostrarConfirmacion} contenido={this.state.contenidoConfirmacion} origen={this} identificador={this.state.identificadorConfirmacion} />
                
            </div>
        )
    }
}

export default SEPlanesAccionRev;
