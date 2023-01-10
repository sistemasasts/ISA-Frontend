import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { Component } from 'react';
import { LineDDP04 } from '../../../global/catalogs';

import "../../site.css";
import * as _ from "lodash";
import * as moment from 'moment';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import { connect } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import SolicitudPruebasProcesoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';
import InformeSPPService from '../../../service/SolicitudPruebaProceso/InformeSPPService';
import SolicitudPruebaProcesoDocumentoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebaProcesoDocumentoService';
import { Button } from 'primereact/button';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { RadioButton } from 'primereact/radiobutton';

class FormularioSPPLectura extends Component {

    constructor() {
        super();
        this.state = {
            objectivos: [],
            detalleMaterial: [],
            id: 0,
            codigo: null,
            detalleMaterialOtro: null,
            motivoOtro: null,
            linea: null,
            descripcionProducto: null,
            fechaEntrega: null,
            variablesProceso: null,
            verificacionAdicional: null,
            observacion: null,
            estado: null,
            origen: null,
            area: null,
            requiereInforme: false,
            imagen1Id: null,
            materialesFormula: [],
            cantidadRequeridaProducir: null,
            unidadRequeridaProducir: null,
            mostrarMaterialesFormula: false,
            contieneAdjunto: null
        };
        this.leerImagen = this.leerImagen.bind(this);
        this.descargarReporte = this.descargarReporte.bind(this);
        this.descargarReporteDPP05 = this.descargarReporteDPP05.bind(this);
        this.habilitarDDP05 = this.habilitarDDP05.bind(this);
        this.habilitarDDP04 = this.habilitarDDP04.bind(this);
    }

    async componentDidMount() {
        this.refrescar(this.props.solicitud);
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudPruebasProcesoService.listarPorId(idSolicitud);
            console.log(solicitud);
            if (solicitud.imagen1Id)
                this.leerImagen(solicitud.imagen1Id);
            if (solicitud) {
                let objetivosValor = _.split(solicitud.motivo, ',');
                let detalleMaterialValor = _.split(solicitud.materialLineaProceso, ',');
                this.setState({
                    id: solicitud.id,
                    codigo: solicitud.codigo,
                    fechaEntrega: moment(solicitud.fechaEntrega, 'YYYY-MM-DD').toDate(),
                    detalleMaterial: detalleMaterialValor,
                    objectivos: objetivosValor,
                    linea: solicitud.lineaAplicacion,
                    detalleMaterialOtro: solicitud.materialLineaProcesoOtro,
                    descripcionProducto: solicitud.descripcionProducto,
                    variablesProceso: solicitud.variablesProceso,
                    verificacionAdicional: solicitud.verificacionAdicional,
                    motivoOtro: solicitud.motivoOtro,
                    observacion: solicitud.observacion,
                    estado: solicitud.estado,
                    area: solicitud.area.nameArea,
                    origen: solicitud.origen,
                    requiereInforme: solicitud.requiereInforme,
                    imagen1Id: solicitud.imagen1Id,
                    cantidadRequeridaProducir: solicitud.cantidadRequeridaProducir,
                    unidadRequeridaProducir: solicitud.unidadRequeridaProducir ? solicitud.unidadRequeridaProducir.abreviatura : "",
                    materialesFormula: solicitud.materialesFormula,
                    mostrarMaterialesFormula: solicitud.area && _.startsWith(solicitud.area.nameArea, 'I+D'),
                    contieneAdjunto: solicitud.contieneAdjuntoDescripcionProducto ? 'SI' : 'NO'
                });
            }
        }
    }

    async leerImagen(idDocumento) {
        const respuesta = await SolicitudPruebaProcesoDocumentoService.verImagen(idDocumento);        
        if (respuesta) {
            document.getElementById("ItemPreview1").src = `data:${respuesta.documento.tipo};base64,` + respuesta.imagen;
        }
    }

    async descargarReporte() {
        this.props.openModal();
        var data = await SolicitudPruebasProcesoService.generarReporte(this.state.id);
        this.props.closeModal();
        const ap = window.URL.createObjectURL(data)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = ap;
        a.download = `ReporteDPP04_${this.state.codigo}.pdf`;
        a.click();
    }

    async descargarReporteDPP05() {
        var data = await InformeSPPService.generarReporte(this.state.id);
        const ap = window.URL.createObjectURL(data)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = ap;
        a.download = `ReporteDDP05_${this.state.codigo}.pdf`;
        a.click();
    }

    habilitarDDP05() {
        return _.includes(['PENDIENTE_APROBACION', 'FINALIZADO', 'PENDIENTE_AJUSTE_MAQUINARIA'], this.state.estado);
    }

    habilitarDDP04() {
        return _.includes(['PENDIENTE_APROBACION', 'FINALIZADO', 'PENDIENTE_AJUSTE_MAQUINARIA', 'ENVIADO_REVISION', 'EN_PROCESO', 'PRUEBA_NO_EJECUTADA'], this.state.estado);
    }

    bodyTemplateCantidad(rowData) {
        const cantidad = (rowData.cantidad).toFixed(2);
        return <span>{cantidad}</span>;
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
        let footerGroup = <ColumnGroup>
            <Row>
                <Column style={{ backgroundColor: '#A5D6A7', fontWeight: 'bold' }} footer="FORMULA TOTAL" />
                <Column style={{ backgroundColor: '#A5D6A7', fontWeight: 'bold' }} footer={(_.sumBy(this.state.materialesFormula, (o) => { return o.porcentaje })).toFixed(2)} />
                <Column style={{ backgroundColor: '#A5D6A7', fontWeight: 'bold' }} footer={(_.sumBy(this.state.materialesFormula, (o) => { return o.cantidad })).toFixed(2)} />
                <Column style={{ backgroundColor: '#A5D6A7', fontWeight: 'bold' }} footer={_.isEmpty(this.state.materialesFormula) ? '' : this.state.materialesFormula[0].unidad ? this.state.materialesFormula[0].unidad.abreviatura : ""} />
            </Row>
        </ColumnGroup>;
        return (

            <div>
                <h3 className='text-titulo'><strong>SOLICITUD DE PRUEBAS EN PROCESO</strong></h3>
                <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN DE LA SOLICITUD
                    <div style={{ float: 'right', padding: '0', marginTop: '-4px' }}>
                        {this.habilitarDDP04() &&
                            <Button style={{ fontSize: '13px', fontWeight: 'bold', backgroundColor: '#A5D6A7', color: 'black' }} className=" p-button-rounded p-button-success" icon="pi pi-download" label="DDP04" tooltip="Descargar" tooltipOptions={{ position: 'bottom' }} onClick={() => this.descargarReporte()} />
                        }
                        {this.habilitarDDP05() &&
                            <Button style={{ fontSize: '13px', fontWeight: 'bold', backgroundColor: '#A5D6A7', color: 'black' }} className=" p-button-rounded p-button-success" icon="pi pi-download" label="DDP05" tooltip="Descargar" tooltipOptions={{ position: 'bottom' }} onClick={() => this.descargarReporteDPP05()} />
                        }
                    </div>
                </div>

                <div className="p-grid p-grid-responsive p-fluid">
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Código</label>
                        <InputText readOnly value={this.state.codigo} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Fecha de Entrega</label>
                        <Calendar disabled dateFormat="yy/mm/dd" value={this.state.fechaEntrega} locale={es} onChange={(e) => this.setState({ fechaEntrega: e.value })} showIcon={true} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Línea</label>
                        <Dropdown disabled options={LineDDP04} value={this.state.linea} autoWidth={false} onChange={(e) => this.setState({ linea: e.value })} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Tipo Solicitud</label>
                        <InputText readOnly value={this.state.origen} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Área</label>
                        <InputText readOnly value={this.state.area} />
                    </div>
                    <div className='p-col-12 p-lg-4' style={{ marginTop: '20px' }}>
                        <Checkbox inputId="cbri" checked={this.state.requiereInforme}></Checkbox>
                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Requiere Informe</label>
                    </div>
                    <div className="p-col-12 p-lg-12" >
                        <div className='p-grid'>
                            <label className="p-col-12 p-lg-12" style={{ fontWeight: 'bold' }} htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Motivo del Ensayo</label>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb1" value="Desarrollo Proveedores" checked={this.state.objectivos.indexOf('Desarrollo Proveedores') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Proveedores</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb2" value="Desarrollo Materias Primas" checked={this.state.objectivos.indexOf('Desarrollo Materias Primas') !== -1}></Checkbox>
                                <label htmlFor="cb2" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Materias Primas</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb3" value="Desarrollo Productos" checked={this.state.objectivos.indexOf('Desarrollo Productos') !== -1}></Checkbox>
                                <label htmlFor="cb3" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Productos</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb4" value="Reingeniería" checked={this.state.objectivos.indexOf('Reingeniería') !== -1}></Checkbox>
                                <label htmlFor="cb4" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reingeniería</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb5" value="Reclamos Clientes" checked={this.state.objectivos.indexOf('Reclamos Clientes') !== -1}></Checkbox>
                                <label htmlFor="cb5" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reclamos Clientes</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb6" value="Reducción Costos" checked={this.state.objectivos.indexOf('Reducción Costos') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reducción Costos</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb6" value="Mejora de Producto" checked={this.state.objectivos.indexOf('Mejora de Producto') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejora de Producto</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb6" value="Mejora del Proceso" checked={this.state.objectivos.indexOf('Mejora del Proceso') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejora del Proceso</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb6" value="Verificación de Equipos" checked={this.state.objectivos.indexOf('Verificación de Equipos') !== -1}></Checkbox>
                                <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Verificación de Equipos</label>
                            </div>
                            <div className="p-col-12 p-lg-12">
                                <label htmlFor="float-input">Otro (Describa)</label>
                                <InputTextarea readOnly value={this.state.motivoOtro} onChange={(e) => this.setState({ motivoOtro: e.target.value })} rows={2} placeholder='Descripción' />
                            </div>
                        </div>

                    </div>
                    {/* <div className="p-col-12 p-lg-12" >
                        <div className='p-grid'>
                            <label className="p-col-12 p-lg-12" style={{ fontWeight: 'bold' }} htmlFor="float-input"> <span style={{ color: '#CB3234' }}>*</span>Descripción del Material y Línea de Proceso de Prueba (Marque según corresponda)</label>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb11" value="Materia Prima" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Materia Prima') !== -1}></Checkbox>
                                <label htmlFor="cb11" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Materia Prima</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb12" value="Láminas Impermeabilizantes" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Láminas Impermeabilizantes') !== -1}></Checkbox>
                                <label htmlFor="cb12" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Láminas Impermeabilizantes</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb13" value="Prod. en Proceso" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Prod. en Proceso') !== -1}></Checkbox>
                                <label htmlFor="cb13" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. en Proceso</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb14" value="Prod. Terminado" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Prod. Terminado') !== -1}></Checkbox>
                                <label htmlFor="cb14" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Terminado</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb15" value="Suministros" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Suministros') !== -1}></Checkbox>
                                <label htmlFor="cb15" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Suministros</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb16" value="Accesorios" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Accesorios') !== -1}></Checkbox>
                                <label htmlFor="cb16" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Accesorios</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb17" value="Prod. Viales" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Prod. Viales') !== -1}></Checkbox>
                                <label htmlFor="cb17" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Viales</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb17" value="Rev. Líquidos" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Rev. Líquidos') !== -1}></Checkbox>
                                <label htmlFor="cb17" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Rev. Líquidos</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb18" value="Pinturas" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Pinturas') !== -1}></Checkbox>
                                <label htmlFor="cb18" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Pinturas</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb19" value="Prod. Metálicos" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Prod. Metálicos') !== -1}></Checkbox>
                                <label htmlFor="cb19" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Metálicos</label>
                            </div>
                            <div className="p-col-12 p-lg-3">
                                <Checkbox inputId="cb20" value="Paneles PUR" onChange={this.onDescriptionMaterialLPChange} checked={this.state.detalleMaterial.indexOf('Paneles PUR') !== -1}></Checkbox>
                                <label htmlFor="cb20" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Paneles PUR</label>
                            </div>
                            <div className="p-col-12 p-lg-12">
                                <label htmlFor="float-input">Otro (Describa)</label>
                                <InputTextarea readOnly value={this.state.detalleMaterialOtro} onChange={(e) => this.setState({ detalleMaterialOtro: e.target.value })} rows={2} placeholder='Descripción' />
                            </div>
                        </div>
                    </div> */}

                    <div className='p-col-12 p-lg-12'>
                        <div className='p-grid'>
                            <div className='p-col-12 p-lg-6'>
                                <div className='p-grid'>
                                    <div className='p-col-12 p-lg-12'>
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Descripción del Producto que se quiere obtener</label>
                                        <InputTextarea readOnly value={this.state.descripcionProducto} onChange={(e) => this.setState({ descripcionProducto: e.target.value })} rows={8} placeholder='Descripción' />
                                    </div>
                                    <div className="p-col-12">
                                        <label style={{ marginRight: '10px', fontWeight: 'bold', color: 'red' }} htmlFor="rb1" className="p-radiobutton-label">Contiene Adjunto</label>
                                        <RadioButton inputId="rb1" name="si" value="SI" checked={this.state.contieneAdjunto === 'SI'} />
                                        <label htmlFor="rb1" className="p-radiobutton-label">SI</label>
                                        <RadioButton style={{ marginLeft: '10px' }} inputId="rb2" name="no" value="NO" checked={this.state.contieneAdjunto === 'NO'} />
                                        <label htmlFor="rb2" className="p-radiobutton-label">NO</label>
                                    </div>
                                    <div className='p-col-12 p-lg-12'>
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Información sobre Variables de Proceso que deben ser controladas</label>
                                        <InputTextarea readOnly value={this.state.variablesProceso} onChange={(e) => this.setState({ variablesProceso: e.target.value })} rows={8} placeholder='Descripción' />
                                    </div>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-6'>
                                <div className='p-grid'>
                                    <div className='p-col-12 p-lg-12'>
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Imagen especificaciones y variables</label>
                                        <div style={{ height: '365px', bottom: '0px', top: '0px', display: 'flex', justifyContent: 'center', border: '1px solid #cccccc', borderRadius: '4px' }}>
                                            {this.state.imagen1Id > 0 &&
                                                <img style={{ width: 'auto', maxHeight: '100%', maxWidth: '100%', display: 'block', margin: 'auto' }} id="ItemPreview1" src="" />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.mostrarMaterialesFormula &&
                        <div className="p-col-12 p-lg-12" >
                            <div className='p-grid'>
                                <label className="p-col-12 p-lg-12" style={{ fontWeight: 'bold' }} htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Material Detalle Formulación</label>
                                <div className='p-col-12 p-lg-4'>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="float-input">Cantidad Requerida Para Producir</label>
                                    <InputText keyfilter="num" value={this.state.cantidadRequeridaProducir} onChange={(e) => this.setState({ cantidadRequeridaProducir: e.target.value })} />
                                </div>
                                <div className='p-col-12 p-lg-3'>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="float-input">Unidad</label>
                                    <InputText value={this.state.unidadRequeridaProducir} />
                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <DataTable value={this.state.materialesFormula} rows={15} footerColumnGroup={footerGroup}
                                        selectionMode="single" selection={this.state.selectedConfiguracion} onSelectionChange={e => this.setState({ selectedMaterialFormula: e.value })}
                                        onRowSelect={this.onCarSelect}>
                                        <Column field="nombre" header="Material" sortable={true} />
                                        <Column field="porcentaje" header="Porcentaje(%)" sortable={true} style={{ textAlign: 'center' }} />
                                        <Column field="cantidad" body={this.bodyTemplateCantidad} header="Cantidad" sortable={true} style={{ textAlign: 'center' }} />
                                        <Column field="unidad.abreviatura" header="Unidad" style={{ textAlign: 'center' }} />
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    }

                    <div className='p-col-12 p-lg-12'>
                        <label style={{ fontWeight: 'bold' }} htmlFor="float-input">Se requieren verificaciones adicionales u otras en especial</label>
                        <InputTextarea readOnly value={this.state.verificacionAdicional} onChange={(e) => this.setState({ verificacionAdicional: e.target.value })} rows={4} placeholder='Descripción' />
                    </div>

                    <div className='p-col-12 p-lg-12'>
                        <label style={{ fontWeight: 'bold' }} htmlFor="float-input">Secuencial y motivo de prueba</label>
                        <InputTextarea readOnly value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={2} placeholder='Descripción' />
                    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(FormularioSPPLectura);
