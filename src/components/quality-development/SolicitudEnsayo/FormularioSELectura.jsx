import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import React, { Component } from 'react';
import { aplicationLine, unidadesMedida } from '../../../global/catalogs';

import "../../site.css";
import * as _ from "lodash";
import * as moment from 'moment';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import { connect } from 'react-redux';
import SolicitudEnsayoService from '../../../service/SolicitudEnsayo/SolicitudEnsayoService';

class FormularioSELectura extends Component {

    constructor() {
        super();
        this.state = {
            objectivos: [],
            proveedoresData: [],
            id: 0,
            codigo: null,
            nivelPrioridadData: [],
            filteredProveedoresSingle: null,
            proveedorSeleccionado: null,
            cantidad: null,
            unidad: null,
            materialEntregado: null,
            lineaAplicacion: null,
            uso: null,
            fechaEntrega: null,
            prioridad: null,
            tiempoEntrega: null,
            observacion: null,
            estado: null
        };
    }

    async componentDidMount() {
        this.refrescar(this.props.solicitud);
        const prioridadesNivel = await SolicitudEnsayoService.listarPrioridadNivel();
        this.setState({ nivelPrioridadData: prioridadesNivel });
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudEnsayoService.listarPorId(idSolicitud);
            if (solicitud) {
                let objetivosValor = _.split(solicitud.objetivo, ',');
                this.setState({
                    id: solicitud.id,
                    codigo: solicitud.codigo,
                    proveedorSeleccionado: solicitud.proveedorNombre,
                    cantidad: solicitud.cantidad,
                    unidad: solicitud.unidad,
                    materialEntregado: solicitud.detalleMaterial,
                    lineaAplicacion: solicitud.lineaAplicacion,
                    uso: solicitud.uso,
                    fechaEntrega: moment(solicitud.fechaEntrega, 'YYYY-MM-DD').toDate(),
                    prioridad: solicitud.prioridad,
                    tiempoEntrega: solicitud.tiempoEntrega,
                    objectivos: objetivosValor,
                    estado: solicitud.estado
                });
            }
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

            <div>
                <h3 className='text-titulo'><strong>SOLICITUD DE ENSAYO</strong></h3>
                <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN DE LA SOLICITUD</div>

                <div className="p-grid p-grid-responsive p-fluid">
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Código</label>
                        <InputText readOnly value={this.state.codigo} />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Fecha de Entrega</label>
                        <Calendar dateFormat="yy/mm/dd" disabled value={this.state.fechaEntrega} locale={es} onChange={(e) => this.setState({ fechaEntrega: e.value })} showIcon={true} />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Nivel Prioridad</label>
                        <Dropdown disabled options={this.state.nivelPrioridadData} value={this.state.prioridad} autoWidth={false} onChange={(event => this.setState({ prioridad: event.value }))} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Proveedor</label>
                        <InputText readOnly value={this.state.proveedorSeleccionado} />
                    </div>

                    <div className="p-col-12 p-lg-12" >
                        <div className="p-grid" >
                            <label className="p-col-12 p-lg-12" htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>OBJETIVO</label>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb1" value="Ahorro de Costos" checked={this.state.objectivos.indexOf('Ahorro de Costos') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Ahorro de Costos</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb2" value="Disponibilidad de Material" checked={this.state.objectivos.indexOf('Disponibilidad de Material') !== -1}></Checkbox>
                                <label htmlFor="cb2" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Disponibilidad de Material</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb3" value="Solicitud Interna" checked={this.state.objectivos.indexOf('Solicitud Interna') !== -1}></Checkbox>
                                <label htmlFor="cb3" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Solicitud Interna</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb4" value="Mejoramiento del Proceso" checked={this.state.objectivos.indexOf('Mejoramiento del Proceso') !== -1}></Checkbox>
                                <label htmlFor="cb4" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejoramiento del Proceso</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb5" value="Cambio de Normativa Vigente" checked={this.state.objectivos.indexOf('Cambio de Normativa Vigente') !== -1}></Checkbox>
                                <label htmlFor="cb5" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Cambio de Normativa Vigente</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb6" value="Restricción de Materia Prima" checked={this.state.objectivos.indexOf('Restricción de Materia Prima') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Restricción de Materia Prima</label>
                            </div>
                        </div>

                    </div>

                    <div className="p-col-12 p-lg-12" >
                        <div className='p-grid'>

                            <label className="p-col-12 p-lg-12" htmlFor="float-input"> <span style={{ color: '#CB3234' }}>*</span>TIEMPO DE ENTREGA</label>
                            <div className="p-col-12 p-lg-4">
                                <RadioButton inputId="rb1" name="deliverTime" value="INMEDIATO" checked={this.state.tiempoEntrega === 'INMEDIATO'} />
                                <label htmlFor="rb1" className="p-radiobutton-label">Inmediato (Tiempo de desarrollo 5 días)</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <RadioButton inputId="rb2" name="deliverTimerb2" value="MEDIO" checked={this.state.tiempoEntrega === 'MEDIO'} />
                                <label htmlFor="rb2" className="p-radiobutton-label">Medio (Tiempo de desarrollo 15 días)</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <RadioButton inputId="rb3" name="deliverTimerb3" value="BAJO" checked={this.state.tiempoEntrega === 'BAJO'} />
                                <label htmlFor="rb3" className="p-radiobutton-label">Bajo (Tiempo de desarrollo 2 meses)</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <RadioButton inputId="rb4" name="deliverTimerb4" value="CASOS_ESPECIALES" checked={this.state.tiempoEntrega === 'CASOS_ESPECIALES'} />
                                <label htmlFor="rb4" className="p-radiobutton-label">Casos Especiales</label>
                            </div>
                        </div>

                    </div>
                    <div className='p-col-12 p-lg-12'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Material Entregado (Descripción)</label>
                        <InputTextarea readOnly value={this.state.materialEntregado} onChange={(e) => this.setState({ materialEntregado: e.target.value })} rows={2} placeholder='Descripción' />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Cantidad</label>
                        <InputText readOnly value={this.state.cantidad} onChange={(e) => this.setState({ cantidad: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Unidad</label>
                        <Dropdown disabled options={unidadesMedida} value={this.state.unidad} autoWidth={false} onChange={(e) => this.setState({ unidad: e.value })} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Línea de Aplicación</label>
                        <Dropdown disabled options={aplicationLine} value={this.state.lineaAplicacion} autoWidth={false} onChange={(e) => this.setState({ lineaAplicacion: e.value })} placeholder="Seleccione " />
                    </div>
                    <div className='p-col-12 p-lg-12'>
                        <label htmlFor="float-input">Uso (Descripción)</label>
                        <InputTextarea readOnly value={this.state.uso} onChange={(e) => this.setState({ uso: e.target.value })} rows={2} placeholder='Descripción' />
                    </div>
                    {/* {this.state.id > 0 &&
                        <div className='p-col-12 p-lg-12'>
                            <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                            <div className='p-col-12 p-lg-12'>
                                <Adjuntos solicitud={this.props.match.params.idSolicitud} />
                                <Historial solicitud={this.props.match.params.idSolicitud} />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">OBSERVACIÓN</label>
                                <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                            </div>
                        </div>
                    }
                </div>

                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id > 0 && this.state.estado === 'ENVIADO_REVISION' &&
                        < div >
                            <Button className="p-button-danger" label="APROBAR" onClick={this.validarSolicitud} />
                            <Button className='p-button-secondary' label="RECHAZAR" />
                        </div>
                    }
                </div> */}
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
export default connect(mapStateToProps, mapDispatchToProps)(FormularioSELectura);