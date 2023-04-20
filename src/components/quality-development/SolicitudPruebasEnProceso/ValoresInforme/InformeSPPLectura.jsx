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
import { getDecodedToken } from '../../../../config/auth/credentialConfiguration';

var lineaFabricacionCatalogo = [];
class InformeSPPLectura extends Component {

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
        this.rowExpansionTemplateMatenimiento = this.rowExpansionTemplateMatenimiento.bind(this);
        this.guardar = this.guardar.bind(this);
        this.regresar = this.regresar.bind(this);
    }

    async componentDidMount() {
        const id = this.props.match.params.idSolicitud;
        const tipo = this.props.match.params.tipo;
        lineaFabricacionCatalogo = [];
        const informe = await InformeSPPService.obtenerPorIdSolicitud(this.props.match.params.idSolicitud);
        this.setState({ solicitudId: id, tipo: tipo })
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

    puedeEditar() {
        const user = getDecodedToken();
        return _.includes(user.authorities, 'ADMIN')
    }

    rowExpansionTemplate(data) {
        return (
            <div className="p-grid p-fluid" style={{ padding: '1em 1em 1em 2em' }}>
                <div className="p-col-12 p-md-9">
                    <DataTable value={data.condiciones} rows={15} selectionMode="single" selection={this.state.seleccionadoCondicion}
                        onSelectionChange={e => this.setState({ seleccionadoCondicion: e.value })}>
                        <Column field="nombre" header="Condición" sortable={true} />
                        <Column field="valor" header="Valor" style={{ textAlign: 'center' }} />
                        <Column field="unidad.abreviatura" header="Unidad" sortable={true} style={{ textAlign: 'center' }} />
                    </DataTable>
                </div>
            </div>
        );
    }

    rowExpansionTemplateMatenimiento(data) {
        return (
            <div className="p-grid p-fluid" style={{ padding: '1em 1em 1em 2em' }}>
                <div className="p-col-12 p-md-9">
                    <DataTable value={data.condiciones} rows={15} selectionMode="single" selection={this.state.seleccionadoCondicion}
                        onSelectionChange={e => this.setState({ seleccionadoCondicion: e.value })}>
                        <Column field="maquinaria" header="Maquinaria" sortable={true} />
                        <Column field="nombre" header="Condición" sortable={true} />
                        <Column field="valor" header="Valor" style={{ textAlign: 'center' }} />
                        <Column field="unidad.abreviatura" header="Unidad" sortable={true} style={{ textAlign: 'center' }} />
                    </DataTable>
                </div>
            </div>
        );
    }


    async guardar() {
        await InformeSPPService.actualizarAdministrador(this.crearObj2());
        this.growl.show({ severity: 'success', detail: 'Datos Informe Actualizado!' });
    }

    crearObj2() {
        return {
            id: this.state.id,
            observacionProduccion: this.state.observacionProduccion,
            observacionMantenimiento: this.state.observacionMantenimiento,
            observacionCalidad: this.state.observacionCalidad
        }
    }

    regresar() {

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


    render() {

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
                            <Calendar disabled dateFormat="yy/mm/dd" value={this.state.fechaPrueba} onChange={(e) => this.setState({ fechaPrueba: e.value })} showIcon={true} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Cantidad Producida</label>
                            <InputText readOnly keyfilter="num" value={this.state.cantidadProducida} onChange={(e) => this.setState({ cantidadProducida: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Orden de Fabricación</label>
                            <InputText readOnly value={this.state.ordenFabricacion} onChange={(e) => this.setState({ ordenFabricacion: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Producto</label>
                            <InputText readOnly value={this.state.producto} onChange={(e) => this.setState({ producto: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Lote</label>
                            <InputText readOnly value={this.state.lote} onChange={(e) => this.setState({ lote: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-4 p-grid'>

                            <div className='p-col-12 p-lg-10'>
                                <label htmlFor="float-input">Línea Fabricación</label>
                                <Dropdown disabled value={this.state.lineaFabricacion} optionLabel='label' editable={true} options={lineaFabricacionCatalogo}
                                    onChange={(e) => this.onChangeLineaFabricacion(e.value)} />
                            </div>
                            <div className='p-col-12 p-lg-2'>
                                <label htmlFor="float-input">Unidad</label>
                                <InputText readOnly value={this.state.lineaFabricacionUnidad} onChange={(e) => this.setState({ lineaFabricacionUnidad: e.target.value })} />
                            </div>
                        </div>

                    </div>
                </div>
                {_.includes(['PRODUCCION', 'APROBADOR_FINAL'], this.state.tipo) &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>DETALLE DE MATERIALES UTILIZADOS</div>
                            <div className='p-col-12 p-lg-12'>
                                <DataTable value={this.state.materialesUtilizado} rows={15}>
                                    <Column field="nombre" header="Material" sortable={true} />
                                    <Column field="unidad.abreviatura" header="Unidad" style={{ textAlign: 'center' }} />
                                    <Column field="cantidadSolicitada" header="Cantidad Solicitada" sortable={true} style={{ textAlign: 'center' }} />
                                    <Column field="cantidadUtilizada" header="Cantidad Utilizada" sortable={true} style={{ textAlign: 'center' }} />
                                    <Column field="porcentajeVariacion" header="Variación (%)" sortable={true} style={{ textAlign: 'center' }} />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                }
                {_.includes(['PRODUCCION', 'APROBADOR_FINAL'], this.state.tipo) &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>DETALLE DE CONDICIONES DE OPERACIÓN</div>
                            <div className='p-col-12 p-lg-12'>
                                <div className="dataview-demo">
                                    <DataTable value={this.state.condicionesOperacion} expandedRows={this.state.expandedRows}
                                        onRowToggle={(e) => this.setState({ expandedRows: e.data })} rowExpansionTemplate={this.rowExpansionTemplate} dataKey="id">
                                        <Column expander={true} style={{ width: '3em' }} />
                                        <Column field="proceso" header="Proceso" />
                                        <Column field="observacion" header="Observación" />
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {_.includes(['PRODUCCION', 'APROBADOR_FINAL'], this.state.tipo) &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>REGISTRO DE PRODUCCIÓN</div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Producto Terminado</label>
                                <div className="p-inputgroup">
                                    <InputText readOnly keyfilter="num" value={this.state.cantidadProductoTerminado} onChange={(e) => this.setState({ cantidadProductoTerminado: e.target.value })} />
                                    <span className="p-inputgroup-addon">{this.state.lineaFabricacionUnidad}</span>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Producto No Conforme</label>
                                <div className="p-inputgroup">
                                    <InputText readOnly keyfilter="num" value={this.state.cantidadProductoNoConforme} onChange={(e) => this.setState({ cantidadProductoNoConforme: e.target.value })} />
                                    <span className="p-inputgroup-addon">{this.state.lineaFabricacionUnidad}</span>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Desperdicio</label>
                                <div className="p-inputgroup">
                                    <InputText readOnly keyfilter="num" value={this.state.cantidadDesperdicio} onChange={(e) => this.setState({ cantidadDesperdicio: e.target.value })} />
                                    <span className="p-inputgroup-addon">{this.state.lineaFabricacionUnidad}</span>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Producto de Prueba</label>
                                <div className="p-inputgroup">
                                    <InputText readOnly keyfilter="num" value={this.state.cantidadProductoPrueba} onChange={(e) => this.setState({ cantidadProductoPrueba: e.target.value })} />
                                    <span className="p-inputgroup-addon">{this.state.lineaFabricacionUnidad}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {_.includes(['PRODUCCION', 'APROBADOR_FINAL'], this.state.tipo) &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>CONCLUSIONES Y RECOMENDACIONES</div>
                            <div className='p-col-12 p-lg-12'>
                                <InputTextarea readOnly={this.puedeEditar} value={this.state.observacionProduccion} onChange={(e) => this.setState({ observacionProduccion: e.target.value })} rows={3} placeholder='Conclusiones' />
                            </div>
                        </div>
                    </div>
                }

                {_.includes(['MANTENIMIENTO', 'APROBADOR_FINAL'], this.state.tipo) &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>MANTENIMIENTO OPERACIÓN EN MAQUINARIA</div>
                            <div className='p-col-12 p-lg-12'>
                                <div className="dataview-demo">
                                    <DataTable value={this.state.condicionesMantenimiento} expandedRows={this.state.expandedRows}
                                        onRowToggle={(e) => this.setState({ expandedRows: e.data })} rowExpansionTemplate={this.rowExpansionTemplateMatenimiento} dataKey="id">
                                        <Column expander={true} style={{ width: '3em' }} />
                                        <Column field="proceso" header="Proceso" />
                                        <Column field="observacion" header="Observación" />
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {_.includes(['MANTENIMIENTO', 'APROBADOR_FINAL'], this.state.tipo) &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>CONCLUSIONES Y RECOMENDACIONES</div>
                            <div className='p-col-12 p-lg-12'>
                                <InputTextarea readOnly={this.puedeEditar} value={this.state.observacionMantenimiento} onChange={(e) => this.setState({ observacionMantenimiento: e.target.value })} rows={3} placeholder='Conclusiones' />
                            </div>
                        </div>
                    </div>
                }
                {_.includes(['CALIDAD', 'APROBADOR_FINAL'], this.state.tipo) &&
                    <div className="card card-w-title">
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-12 caja'>INVESTIGACIÓN Y DESARROLLO</div>
                            <div className='p-col-12 p-lg-12'>
                                <InputTextarea readOnly={this.puedeEditar} value={this.state.observacionCalidad} onChange={(e) => this.setState({ observacionCalidad: e.target.value })} rows={3} placeholder='Conclusiones' />
                            </div>
                        </div>
                        {this.puedeEditar &&
                            <div className='p-col-12 p-lg-12 boton-opcion' >
                                <Button className='p-button-success' label="ACTUALIZAR DATOS" onClick={this.guardar} />
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }

}

export default InformeSPPLectura;
