import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import * as _ from "lodash";
import * as moment from 'moment';
import InformeSPPService from '../../../../service/SolicitudPruebaProceso/InformeSPPService';
import FormCondicionOperacion from './FormCondicionOperacion';
import FormMaterialUtilizado from './FormMaterialUtilizado';
import { CatalogoService } from '../../../../service/CatalogoService';
import { Dropdown } from 'primereact/dropdown';
import FormCondicion from './FormCondicion';
import { InputTextarea } from 'primereact/inputtextarea';
import SeccionMantenimiento from './SeccionMatenimiento';
import history from '../../../../history';

var lineaFabricacionCatalogo = [];
class InformeSPP extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            solicitudId: null,
            codigo: null,
            tipoSolicitud: null,
            area: null,
            fechaPrueba: null,
            producto: null,
            cantidadProducida: null,
            lote: null,
            ordenFabricacion: null,
            lineaFabricacion: null,
            lineaFabricacionUnidad: null,
            cantidadProductoTerminado: null,
            cantidadProductoNoConforme: null,
            cantidadDesperdicio: null,
            cantidadProductoPrueba: null,
            observacionProduccion: null,
            observacionMantenimiento: null,
            observacionCalidad: null,
            expandedRows: null,
            condicionesOperacion: [],
            condicionesMantenimiento: [],
            materialesUtilizado: [],
            mostrarFormCondicionOperacion: false,
            mostrarFormMaterialUtilizado: false,
            mostrarFormCondicion: false,
            seleccionadoMaterial: null,
            seleccionadoCondicionOperacion: null,
            seleccionadoCondicion: null,
            condicionOperacionId: null,

            accion: null,
            tipo: null
        }
        this.catalogoService = new CatalogoService();
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.guardar = this.guardar.bind(this);
        this.regresar = this.regresar.bind(this);
        this.actionTemplateMateriales = this.actionTemplateMateriales.bind(this);
        this.actionTemplateCondicionesOperacion = this.actionTemplateCondicionesOperacion.bind(this);
        this.actionTemplateCondicion = this.actionTemplateCondicion.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.idSolicitud;
        const tipo = this.props.match.params.tipo;
        const accion = this.props.match.params.accion;
        lineaFabricacionCatalogo = [];
        const informe = await InformeSPPService.obtenerPorIdSolicitud(this.props.match.params.idSolicitud);
        this.catalogoService.getLineaFabricacion().then(data => { _.map(data, (o) => lineaFabricacionCatalogo.push(o)) });
        this.setState({ solicitudId: id, tipo: tipo, accion: accion })
        this.refrescar(informe);
    }

    async refrescar(informe) {
        if (informe) {
            this.setState({
                solicitudId: this.props.match.params.idSolicitud,
                id: informe.id,
                codigo: informe.solicitudPruebasProceso.codigo,
                tipoSolicitud: informe.solicitudPruebasProceso.origen,
                area: informe.solicitudPruebasProceso.area.nameArea,
                fechaPrueba: moment(informe.fechaPrueba, 'YYYY-MM-DD').toDate(),
                producto: informe.producto,
                cantidadProducida: informe.cantidadProducida,
                lote: informe.lote,
                ordenFabricacion: informe.ordenFabricacion,
                lineaFabricacion: informe.lineaFabricacion,
                lineaFabricacionUnidad: informe.lineaFabricacionUnidad,
                condicionesOperacion: informe.condicionesProduccion,
                condicionesMantenimiento: informe.condicionesMantenimiento,
                materialesUtilizado: informe.materialesUtilizado,
                cantidadProductoTerminado: informe.cantidadProductoTerminado,
                cantidadProductoNoConforme: informe.cantidadProductoNoConforme,
                cantidadDesperdicio: informe.cantidadDesperdicio,
                cantidadProductoPrueba: informe.cantidadProductoPrueba,
                observacionProduccion: informe.observacionProduccion,
                observacionMantenimiento: informe.observacionMantenimiento,
                observacionCalidad: informe.observacionCalidad
            });
        }
    }

    rowExpansionTemplate(data) {
        let header = <div className="p-clearfix">
            <Button style={{ float: 'left' }} icon="pi pi-plus" onClick={() => this.setState({ mostrarFormCondicion: true, condicionOperacionId: data.id })} />
        </div>;
        return (
            <div className="p-grid p-fluid" style={{ padding: '1em 1em 1em 2em' }}>
                <div className="p-col-12 p-md-9">
                    <DataTable value={data.condiciones} rows={15} header={header} selectionMode="single" selection={this.state.seleccionadoCondicion}
                        onSelectionChange={e => this.setState({ seleccionadoCondicion: e.value })}>
                        <Column field="nombre" header="Condición" sortable={true} />
                        <Column field="valor" header="Valor" style={{ textAlign: 'center' }} />
                        <Column field="unidad" header="Unidad" sortable={true} style={{ textAlign: 'center' }} />
                        <Column body={(e) => this.actionTemplateCondicion(e, data.id)} style={{ textAlign: 'center', width: '8em' }} />
                    </DataTable>
                </div>
            </div>
        );
    }

    actionTemplateCondicion(rowData, condicionOperacionId) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.abrirDialogoCondicion(rowData, condicionOperacionId)}></Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" style={{ marginLeft: '.5em' }} onClick={() => this.eliminarCondicion(rowData.id, condicionOperacionId)}></Button>
        </div>;
    }

    async eliminarCondicion(id, condicionOperacionId) {
        const detalleActualizado = await InformeSPPService.eliminarCondicion(condicionOperacionId, id, this.state.id);
        this.growl.show({ severity: 'success', detail: 'Condición Eliminada!' });
        this.setState({ condicionesOperacion: detalleActualizado });
    }

    abrirDialogoCondicion(condicion, condicionOId) {
        this.setState({ seleccionadoCondicion: condicion, condicionOperacionId: condicionOId, mostrarFormCondicion: true });
    }

    async guardar() {
        debugger
        switch (this.state.tipo) {
            case 'MANTENIMIENTO':
                await InformeSPPService.actualizarMantenimiento(this.crearObjMantenimiento());
                break;
            case 'PRODUCCION':
                await InformeSPPService.actualizar(this.crearObj());
                break;
            case 'CALIDAD':
                await InformeSPPService.actualizarCalidad(this.crearObjCalidad());
                break;
            default:
                break;
        }
        this.growl.show({ severity: 'success', detail: 'Datos Informe Actualizado!' });
    }

    regresar() {
        switch (this.state.tipo) {
            case 'MANTENIMIENTO':
                history.push(`/quality-development_solicitudpp_mantenimiento_ver/${this.state.solicitudId}`);
                break;
            case 'PRODUCCION':
                history.push(`/quality-development_solicitudpp_planta_ver/${this.state.solicitudId}`);
                break;
            case 'CALIDAD':
                history.push(`/quality-development_solicitudpp_procesar_solicitud/${this.state.solicitudId}`);
                break;
            default:
                break;
        }

    }

    crearObj() {
        return {
            id: this.state.id,
            fechaPrueba: this.state.fechaPrueba,
            cantidadProducida: this.state.cantidadProducida,
            lote: this.state.lote,
            producto: this.state.producto,
            ordenFabricacion: this.state.ordenFabricacion,
            lineaFabricacion: this.state.lineaFabricacion,
            lineaFabricacionUnidad: this.state.lineaFabricacionUnidad,
            cantidadProductoTerminado: this.state.cantidadProductoTerminado,
            cantidadProductoNoConforme: this.state.cantidadProductoNoConforme,
            cantidadDesperdicio: this.state.cantidadDesperdicio,
            cantidadProductoPrueba: this.state.cantidadProductoPrueba,
            observacionProduccion: this.state.observacionProduccion,
            observacionMantenimiento: this.state.observacionMantenimiento,
            observacionCalidad: this.state.observacionCalidad
        }
    }

    crearObjMantenimiento() {
        return {
            id: this.state.id,
            observacionMantenimiento: this.state.observacionMantenimiento
        }
    }

    crearObjCalidad() {
        return {
            id: this.state.id,
            observacionCalidad: this.state.observacionCalidad
        }
    }

    onChangeLineaFabricacion(e) {
        if (_.isObject(e))
            this.setState({ lineaFabricacion: e.value, lineaFabricacionUnidad: e.unidad });
        else
            this.setState({ lineaFabricacion: e });
    }

    actionTemplateMateriales(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.abrirDialogoMaterial(rowData)}></Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" style={{ marginLeft: '.5em' }} onClick={() => this.eliminarMaterial(rowData.id)}></Button>
        </div>;
    }

    async eliminarMaterial(id) {
        const detalleActualizado = await InformeSPPService.eliminarMaterialUtilizado(id, this.state.id);
        this.growl.show({ severity: 'success', detail: 'Material Eliminado!' });
        this.setState({ materialesUtilizado: detalleActualizado });
    }

    abrirDialogoMaterial(material) {
        this.setState({ seleccionadoMaterial: material, mostrarFormMaterialUtilizado: true });
    }

    actionTemplateCondicionesOperacion(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.abrirDialogoCondicionOperacion(rowData)}></Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" style={{ marginLeft: '.5em' }} onClick={() => this.eliminarCondicionOperacion(rowData.id)}></Button>
        </div>;
    }

    async eliminarCondicionOperacion(id) {
        const detalleActualizado = await InformeSPPService.eliminarCondicionOperacion(id, this.state.id, 'PRODUCCION');
        this.growl.show({ severity: 'success', detail: 'Condición Operación Eliminado!' });
        this.setState({ condicionesOperacion: detalleActualizado });
    }

    abrirDialogoCondicionOperacion(condicionOperacion) {
        this.setState({ seleccionadoCondicionOperacion: condicionOperacion, mostrarFormCondicionOperacion: true });
    }

    render() {
        let header = <div>
            <div className="p-clearfix" style={{ width: '10%' }}>
                <Button style={{ float: 'left' }} label="Agregar" icon="pi pi-plus" onClick={() => this.setState({ mostrarFormMaterialUtilizado: true })} />
            </div>
        </div>
        let headerCondicionesOperacion = <div className="p-clearfix" style={{ width: '10%' }}>
            <Button style={{ float: 'left' }} label="Agregar" icon="pi pi-plus" onClick={() => this.setState({ mostrarFormCondicionOperacion: true })} />
        </div>;

        return (
            <div>
                <div className="card card-w-title">
                    <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                    <div className="p-grid p-grid-responsive p-fluid">
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN DATOS PRUEBAS</div>

                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Código</label>
                            <InputText readOnly value={this.state.codigo} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Tipo Solicitud</label>
                            <InputText readOnly value={this.state.tipoSolicitud} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Área</label>
                            <InputText readOnly value={this.state.area} />
                        </div>

                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Fecha Prueba</label>
                            <Calendar disabled={this.state.tipo !== 'PRODUCCION'} dateFormat="yy/mm/dd" value={this.state.fechaPrueba} onChange={(e) => this.setState({ fechaPrueba: e.value })} showIcon={true} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Cantidad Producida</label>
                            <InputText readOnly={this.state.tipo !== 'PRODUCCION'} keyfilter="num" value={this.state.cantidadProducida} onChange={(e) => this.setState({ cantidadProducida: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Orden de Fabricación</label>
                            <InputText readOnly={this.state.tipo !== 'PRODUCCION'} value={this.state.ordenFabricacion} onChange={(e) => this.setState({ ordenFabricacion: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Producto</label>
                            <InputText readOnly={this.state.tipo !== 'PRODUCCION'} value={this.state.producto} onChange={(e) => this.setState({ producto: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Lote</label>
                            <InputText readOnly={this.state.tipo !== 'PRODUCCION'} value={this.state.lote} onChange={(e) => this.setState({ lote: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-4 p-grid'>

                            <div className='p-col-12 p-lg-10'>
                                <label htmlFor="float-input">Línea Fabricación</label>
                                <Dropdown disabled={this.state.tipo !== 'PRODUCCION'} value={this.state.lineaFabricacion} optionLabel='label' editable={true} options={lineaFabricacionCatalogo}
                                    onChange={(e) => this.onChangeLineaFabricacion(e.value)} />
                            </div>
                            <div className='p-col-12 p-lg-2'>
                                <label htmlFor="float-input">Unidad</label>
                                <InputText readOnly={this.state.tipo !== 'PRODUCCION'} value={this.state.lineaFabricacionUnidad} onChange={(e) => this.setState({ lineaFabricacionUnidad: e.target.value })} />
                            </div>
                        </div>

                    </div>
                </div>
                {this.state.tipo === 'PRODUCCION' &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>DETALLE DE MATERIALES UTILIZADOS</div>
                            <div className='p-col-12 p-lg-12'>
                                <DataTable value={this.state.materialesUtilizado} rows={15} header={header}
                                    selectionMode="single" selection={this.state.seleccionadoMaterial} onSelectionChange={e => this.setState({ seleccionadoMaterial: e.value })}
                                >
                                    <Column field="nombre" header="Material" sortable={true} />
                                    <Column field="unidad" header="Unidad" style={{ textAlign: 'center' }} />
                                    <Column field="cantidadSolicitada" header="Cantidad Solicitada" sortable={true} style={{ textAlign: 'center' }} />
                                    <Column field="cantidadUtilizada" header="Cantidad Utilizada" sortable={true} style={{ textAlign: 'center' }} />
                                    <Column field="porcentajeVariacion" header="Variación (%)" sortable={true} style={{ textAlign: 'center' }} />
                                    <Column body={this.actionTemplateMateriales} style={{ textAlign: 'center', width: '8em' }} />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                }
                {this.state.tipo === 'PRODUCCION' &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>DETALLE DE CONDICIONES DE OPERACIÓN</div>
                            <div className='p-col-12 p-lg-12'>
                                <div className="dataview-demo">
                                    <DataTable value={this.state.condicionesOperacion} expandedRows={this.state.expandedRows} header={headerCondicionesOperacion}
                                        onRowToggle={(e) => this.setState({ expandedRows: e.data })} rowExpansionTemplate={this.rowExpansionTemplate} dataKey="id">
                                        <Column expander={true} style={{ width: '3em' }} />
                                        <Column field="proceso" header="Proceso" />
                                        <Column field="observacion" header="Observación" />
                                        <Column body={this.actionTemplateCondicionesOperacion} style={{ textAlign: 'center', width: '8em' }} />
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {this.state.tipo === 'PRODUCCION' &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>REGISTRO DE PRODUCCIÓN</div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Producto Terminado</label>
                                <div className="p-inputgroup">
                                    <InputText keyfilter="num" value={this.state.cantidadProductoTerminado} onChange={(e) => this.setState({ cantidadProductoTerminado: e.target.value })} />
                                    <span className="p-inputgroup-addon">{this.state.lineaFabricacionUnidad}</span>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Producto No Conforme</label>
                                <div className="p-inputgroup">
                                    <InputText keyfilter="num" value={this.state.cantidadProductoNoConforme} onChange={(e) => this.setState({ cantidadProductoNoConforme: e.target.value })} />
                                    <span className="p-inputgroup-addon">{this.state.lineaFabricacionUnidad}</span>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Desperdicio</label>
                                <div className="p-inputgroup">
                                    <InputText keyfilter="num" value={this.state.cantidadDesperdicio} onChange={(e) => this.setState({ cantidadDesperdicio: e.target.value })} />
                                    <span className="p-inputgroup-addon">{this.state.lineaFabricacionUnidad}</span>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Producto de Prueba</label>
                                <div className="p-inputgroup">
                                    <InputText keyfilter="num" value={this.state.cantidadProductoPrueba} onChange={(e) => this.setState({ cantidadProductoPrueba: e.target.value })} />
                                    <span className="p-inputgroup-addon">{this.state.lineaFabricacionUnidad}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {this.state.tipo === 'PRODUCCION' &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>CONCLUSIONES Y RECOMENDACIONES</div>
                            <div className='p-col-12 p-lg-12'>
                                <InputTextarea value={this.state.observacionProduccion} onChange={(e) => this.setState({ observacionProduccion: e.target.value })} rows={3} placeholder='Conclusiones' />
                            </div>
                        </div>
                    </div>
                }
                {this.state.tipo === 'MANTENIMIENTO' &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>MANTENIMIENTO OPERACIÓN EN MAQUINARIA</div>
                            <div className='p-col-12 p-lg-12'>
                                <div className="dataview-demo">
                                    <SeccionMantenimiento detalle={this.state.condicionesMantenimiento} informeId={this.state.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {this.state.tipo === 'MANTENIMIENTO' &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>CONCLUSIONES Y RECOMENDACIONES</div>
                            <div className='p-col-12 p-lg-12'>
                                <InputTextarea value={this.state.observacionMantenimiento} onChange={(e) => this.setState({ observacionMantenimiento: e.target.value })} rows={3} placeholder='Conclusiones' />
                            </div>
                        </div>
                    </div>
                }
                {this.state.tipo === 'CALIDAD' &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>INVESTIGACIÓN Y DESARROLLO</div>
                            <div className='p-col-12 p-lg-12'>
                                <InputTextarea value={this.state.observacionCalidad} onChange={(e) => this.setState({ observacionCalidad: e.target.value })} rows={3} placeholder='Conclusiones' />
                            </div>
                        </div>
                    </div>
                }
                {this.state.accion === 'EDITAR' &&
                    <div className='p-col-12 p-lg-12 boton-opcion' >
                        <Button className='p-button-success' label="GUARDAR" onClick={this.guardar} />
                        <Button className='p-button-secondary' label="ATRÁS" onClick={() => this.regresar()} />
                    </div>
                }
                <FormMaterialUtilizado mostrar={this.state.mostrarFormMaterialUtilizado} informeId={this.state.id} origen={this} />
                <FormCondicionOperacion mostrar={this.state.mostrarFormCondicionOperacion} informeId={this.state.id} origen={this} tipo={"PRODUCCION"} />
                <FormCondicion mostrar={this.state.mostrarFormCondicion} informeId={this.state.id} condicionOperacionId={this.state.condicionOperacionId} origen={this} tipo={"PRODUCCION"} />
            </div>
        )
    }

}

export default InformeSPP;
