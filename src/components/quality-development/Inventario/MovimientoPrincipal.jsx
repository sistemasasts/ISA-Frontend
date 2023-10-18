import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import "../../site.css";
import { determinarTipoMovimiento } from '../SolicitudEnsayo/ClasesUtilidades';
import * as _ from "lodash";
import InventarioService from '../../../service/Inventario/InventarioService';
import history from '../../../history';
import MovimientoForm from './MovimientoForm';
import * as moment from 'moment';
import { Paginator } from 'primereact/paginator';
import { Calendar } from 'primereact/calendar';
import { Accordion, AccordionTab } from 'primereact/accordion';

class MovimientoPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            inventarioId: null,
            movimientos: [],
            producto: null,
            minimo: null,
            maximo: null,
            unidad: null,
            stock: null,
            mostrarForm: false,

            page: 0,
            size: 10,
            first: 0,
            rows: 0,
            totalRecords: 0,
            currenPage: '',
        };

        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.consultar = this.consultar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    componentDidMount() {
        const inventarioId = this.props.match.params.idInventario;
        console.log(inventarioId);
        //this.actualizarLista();
        this.actualizarCabecera(inventarioId);

    }

    async actualizarCabecera(id) {
        const inventario = await InventarioService.listarPorId(id);
        this.setState({
            inventarioId: inventario.id,
            producto: inventario.productoNombre,
            minimo: inventario.minimo,
            maximo: inventario.maximo,
            stock: inventario.stock,
            unidad: inventario.unidad.abreviatura,
        })
        this.consultar();
    }

    async actualizarLista() {
        const solicitudes_data = await InventarioService.listar();
        this.setState({ inventario: solicitudes_data });
    }

    consultar() {
        this.obtenerDatosConsulta(this.state.page, this.state.size);
    }

    limpiar() {
        var finiComponent = document.getElementById("fini");
        var ffinComponent = document.getElementById("ffin");
        finiComponent.value = null;
        ffinComponent.value = null;
        this.setState({
            fechaInicio: null,
            fechaFin: null,
            listPnc: []
        });
    }

    onPageChange(event) {
        this.obtenerDatosConsulta(event.page, this.state.size);
        this.setState({
            first: event.first,
            rows: event.rows
        });
    }

    async obtenerDatosConsulta(page, size) {
        const a = this.crearObj();
        console.log(a)
        const solicitudesData = await InventarioService.listarDetallePorCriterios(page, size, this.crearObj());
        const currentReportAUX = `( pág. ${solicitudesData.number + 1} de ${solicitudesData.totalPages} )  Total ítems  ${solicitudesData.totalElements}`;
        this.setState({ movimientos: solicitudesData.content, totalRecords: solicitudesData.totalElements, currenPage: currentReportAUX });
    }

    crearObj() {
        return {
            inventarioId: this.state.inventarioId,
            fechaInicio: this.state.fechaInicio && moment(this.state.fechaInicio).format("YYYY-MM-DD hh:mm:ss.SSS"),
            fechaFin: this.state.fechaFin && moment(this.state.fechaFin).format("YYYY-MM-DD hh:mm:ss.SSS"),
        }
    }


    bodyTemplateEstado(rowData) {
        return <span className={determinarTipoMovimiento(rowData.tipoMovimiento)}>{rowData.tipoMovimiento}</span>;
    }

    bodyTemplateCantidad(rowData) {
        const signo = rowData.tipoMovimiento === 'EGRESO' ? '(-)' : '(+)';
        const color = rowData.tipoMovimiento === 'EGRESO' ? ' #c63737' : '#256029';
        return <span><span style={{ color: color }}>{signo} </span>{rowData.cantidad}</span>;
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
        //const statusFilter = this.renderStatusFilter();
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className='p-col-12 p-grid dashboard'>

                    <div className="p-col-12 p-md-6 p-lg-6">
                        <div className="p-grid overview-box overview-box-1">
                            <div className="overview-box-title">
                                <i className="fa fa-product-hunt"></i>
                                <span>PRODUCTO</span>
                            </div>
                            <div className="overview-box-count">{this.state.producto}</div>
                            {/* <div className="overview-box-stats">{this.state.tipoProducto}</div> */}
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6 p-lg-2">
                        <div className="p-grid overview-box overview-box-5" style={{ background: '#f44336' }}>
                            <div className="overview-box-title">
                                <i className="fa fa-sort-amount-asc"></i>
                                <span>MÍNIMO</span>
                            </div>
                            <div className="overview-box-count">{this.state.minimo} {this.state.unidad}</div>
                            {/* <div className="overview-box-stats"> Cantidad no conforme total {this.state.cantidadNoConforme} {this.state.unidad}</div> */}
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6 p-lg-2">
                        <div className="p-grid overview-box overview-box-5" style={{ background: '#f44336' }}>
                            <div className="overview-box-title">
                                <i className="fa fa-sort-amount-asc"></i>
                                <span>MÁXIMO</span>
                            </div>
                            <div className="overview-box-count">{this.state.maximo} {this.state.unidad}</div>
                            {/* <div className="overview-box-stats"> Cantidad no conforme total {this.state.cantidadNoConforme} {this.state.unidad}</div> */}
                        </div>
                    </div>

                    <div className="p-col-12 p-md-6 p-lg-2">
                        <div className="p-grid overview-box overview-box-5" style={{ background: '#f44336' }}>
                            <div className="overview-box-title">
                                <i className="fa fa-sort-amount-asc"></i>
                                <span>STOCK</span>
                            </div>
                            <div className="overview-box-count">{this.state.stock} {this.state.unidad}</div>
                            {/* <div className="overview-box-stats"> Cantidad no conforme total {this.state.cantidadNoConforme} {this.state.unidad}</div> */}
                        </div>
                    </div>
                </div>

                <div className="p-clearfix" style={{ width: '100%' }}>
                    <Button className="p-button-warning" style={{ float: 'left' }} label="Regresar" icon="pi pi-arrow-left" onClick={() => history.goBack()} />
                    <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => this.setState({ mostrarForm: true })} />
                </div>
                <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                    <AccordionTab header="Consulta avanzada">
                        <h2>Parámetros de consulta</h2>
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-3'></div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Fecha Inicio</label>
                                <Calendar dateFormat="yy/mm/dd" inputId='fini' value={this.state.fechaInicio} locale={es} onChange={(e) => this.setState({ fechaInicio: e.value })} showIcon={true} />
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Fecha Fin</label>
                                <Calendar dateFormat="yy/mm/dd" inputId='ffin' value={this.state.fechaFin} locale={es} onChange={(e) => this.setState({ fechaFin: e.value })} showIcon={true} />
                            </div>
                        </div>
                        <div className='p-col-12 p-lg-12 boton-opcion' >
                            <Button className="p-button-danger" label="CONSULTAR" onClick={this.consultar} />
                            <Button className='p-button-secondary' label="LIMPIAR" onClick={this.limpiar} />
                        </div>
                    </AccordionTab>
                </Accordion>

                <DataTable value={this.state.movimientos} responsive={true} header={'DETALLE DE ENRADAS Y SALIDAS'} scrollable={true} selectionMode="single"
                >
                    <Column field="fechaRegistro2" header="Fecha" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="fechaEnsayo" header="Fecha Ensayo" style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="numeroEnsayo" header="# Ensayo" style={{ textAlign: 'center', width: '15em' }} />
                    <Column field="tipoMovimiento" body={this.bodyTemplateEstado} header="Tipo" style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="cantidad" body={this.bodyTemplateCantidad} header="Cantidad" style={{ textAlign: 'right', width: '12em' }} />
                    <Column field="responsable" header="Responsable" style={{ width: '25em', textAlign: 'center' }} />
                    {/* <Column field='stockActual' header="Stock" sortable style={{ textAlign: 'center', width: '12em' }} /> */}
                </DataTable>
                <Paginator first={this.state.first} rows={this.state.size} totalRecords={this.state.totalRecords} onPageChange={this.onPageChange}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" currentPageReportTemplate={this.state.currenPage}></Paginator>
                <MovimientoForm mostrar={this.state.mostrarForm} origen={this} />
            </div>
        )
    }
}

export default MovimientoPrincipal;