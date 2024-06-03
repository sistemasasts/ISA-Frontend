import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import { Accordion, AccordionTab } from 'primereact/accordion';
import React, { Component } from 'react';
import history from '../../../history';
import PncService from '../../../service/Pnc/PncService';
import * as moment from 'moment';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { AutoComplete } from 'primereact/autocomplete';
import ProductoService from '../../../service/productoService';
import ProveedorService from '../../../service/ProveedorService';
import { determinarColorPNC } from '../SolicitudEnsayo/ClasesUtilidades';
import ReclamoMPService from '../../../service/ReclamoMPService';
import * as _ from 'lodash';

class ReclamoPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            estados: [],
            listadoPnc: [],
            page: 0,
            size: 10,
            first: 0,
            rows: 0,
            totalRecords: 0,
            currenPage: '',
            codigo: null,
            lote: null,
            estado: []
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.consultar = this.consultar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    async componentDidMount() {
        const estadosCatalogo = await ReclamoMPService.obtenerEstados();
        this.setState({ estados: estadosCatalogo });
        this.consultar();
    }

    consultar() {
        this.obtenerDatosConsulta(this.state.page, this.state.size);
    }

    async obtenerDatosConsulta(page, size) {
        const solicitudesData = await ReclamoMPService.listarPorCriterios(page, size, this.crearObj());
        console.log(solicitudesData)
        const currentReportAUX = `( pág. ${solicitudesData.number + 1} de ${solicitudesData.totalPages} )  Total ítems  ${solicitudesData.totalElements}`;
        this.setState({ listadoPnc: solicitudesData.content, totalRecords: solicitudesData.totalElements, currenPage: currentReportAUX });
    }

    crearObj() {
        return {
            numero: this.state.codigo,
            fechaInicio: this.state.fechaInicio && moment(this.state.fechaInicio).format("YYYY-MM-DD hh:mm:ss.SSS"),
            fechaFin: this.state.fechaFin && moment(this.state.fechaFin).format("YYYY-MM-DD hh:mm:ss.SSS"),
            productoId: this.state.producto && this.state.producto.idProduct,
            proveedorId: this.state.proveedor && this.state.proveedor.idProvider,
            //lote: this.state.lote,
            estados: this.state.estado
        }
    }

    limpiar() {
        var finiComponent = document.getElementById("fini");
        var ffinComponent = document.getElementById("ffin");
        var numeroComponent = document.getElementById("numero");
        finiComponent.value = null;
        ffinComponent.value = null;
        numeroComponent.value = null;
        this.setState({
            fechaInicio: null,
            fechaFin: null,
            fechaInicioDeteccion: null,
            fechaFinDeteccion: null,
            estado: [],
            producto: null,
            proveedor: null,
            codigo: null,
            lote: null,
            listadoPnc: []
        });
    }

    onPageChange(event) {
        this.obtenerDatosConsulta(event.page, this.state.size);
        this.setState({
            first: event.first,
            rows: event.rows
        });
    }

    async buscarProductos(event) {
        const resultados = await ProductoService.listarPorNombreCriterio(event.query);
        this.setState({ productosSugeridos: resultados });
    }

    async buscarProveedores(event) {
        const resultados = await ProveedorService.listarPorNombreCriterio(event.query);
        this.setState({ proveedorSugeridos: resultados });
    }

    async generarReportePNC(pnc) {
        var data = await ReclamoMPService.generarReporte(pnc.id);
        const ap = window.URL.createObjectURL(data)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = ap;
        a.download = `ReclamoMP${pnc.numero}_${pnc.nombreProducto}.pdf`;
        a.click();
        this.growl.show({ severity: 'success', detail: 'Reporte generado!' });
    }

    bodyTemplateEstado(rowData) {
        return <span className={determinarColorPNC(rowData.state)}>{rowData.estadoTexto}</span>;
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => history.push(`/quality-development_complaint_edit/${rowData.id}`)}></Button>
            {_.includes(['APROBADO', 'CERRADO'], rowData.state) &&
                <Button type="button" icon="pi pi-file-pdf" className="p-button-success" onClick={() => this.generarReportePNC(rowData)}></Button>
            }
        </div>
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
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => history.push("/quality-development_pnc_nuevo")} />
        </div>;

        return (
            <div className="card card-w-title">
                <h1>Reclamos de Materia Prima</h1>
                <Growl ref={(el) => this.growl = el} />
                <div className="p-clearfix" style={{ width: '100%' }}>

                    <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => history.push("/quality-development_complaint_registro")} />
                </div>
                <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                    <AccordionTab header="Consulta avanzada">
                        <h2>Parámetros de consulta</h2>
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Número Reclamo</label>
                                <InputText id='numero' value={this.state.codigo} onChange={(e) => this.setState({ codigo: e.target.value })} />
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Lote</label>
                                <InputText value={this.state.lote} onChange={(e) => this.setState({ lote: e.target.value })} />
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Fecha Emisión Inicio</label>
                                <Calendar dateFormat="yy/mm/dd" inputId='fini' value={this.state.fechaInicio} locale={es} onChange={(e) => this.setState({ fechaInicio: e.value })} showIcon={true} />
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Fecha Emisión Fin</label>
                                <Calendar dateFormat="yy/mm/dd" inputId='ffin' value={this.state.fechaFin} locale={es} onChange={(e) => this.setState({ fechaFin: e.value })} showIcon={true} />
                            </div>
                            <div className='p-col-6'>
                                <label htmlFor="float-input">Producto</label>
                                <AutoComplete field="nameProduct" minLength={3} suggestions={this.state.productosSugeridos}
                                    completeMethod={(e) => this.buscarProductos(e)} value={this.state.producto} onChange={(e) => this.setState({ producto: e.value })}
                                />
                            </div>
                            <div className='p-col-6'>
                                <label htmlFor="float-input">Proveedor</label>
                                <AutoComplete field="nameProvider" minLength={3} suggestions={this.state.proveedorSugeridos}
                                    completeMethod={(e) => this.buscarProveedores(e)} value={this.state.proveedor} onChange={(e) => this.setState({ proveedor: e.value })}
                                />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Estado</label>
                                <MultiSelect value={this.state.estado} options={this.state.estados} onChange={(e) => this.setState({ estado: e.value })} />
                            </div>
                        </div>
                        <div className='p-col-12 p-lg-12 boton-opcion' >
                            <Button className="p-button-danger" label="CONSULTAR" onClick={this.consultar} />
                            <Button className='p-button-secondary' label="LIMPIAR" onClick={this.limpiar} />
                        </div>
                    </AccordionTab>
                </Accordion>
                <DataTable value={this.state.listadoPnc} scrollable={true} responsive={true}
                    selectionMode="single" onSelectionChange={(e) => { this.setState({ selectedPNC: e.value }); }}
                >
                    <Column body={this.actionTemplate} style={{ width: '7em', textAlign: 'center' }} />
                    <Column field="number" header="PNC" style={{ width: '10em', textAlign: 'center' }} />
                    <Column body={this.bodyTemplateEstado} header="Estado" style={{ width: '15em', textAlign: 'center' }} />
                    <Column field="nombreProducto" header="Materia Prima" style={{ width: '20em', textAlign: 'center' }} />
                    <Column field="detailNCP" header="Detalle PNC" style={{ width: '30em' }} />
                    <Column field="nombreProveedor" header="Proveedor" style={{ width: '20em', textAlign: 'center' }} />
                    <Column field="totalAmount" header="Cantidad Total" style={{ width: '10em', textAlign: 'right' }} />
                    <Column field="affectedAmount" header="Canidad Afectada" style={{ width: '10em', textAlign: 'right' }} />
                    <Column field="porcentComplaint" header="% PNC" style={{ width: '10em', textAlign: 'right' }} />
                    <Column field="kpiTime" header="I. Tiempo(Días)" style={{ width: '10em', textAlign: 'center' }} />

                </DataTable>
                <Paginator first={this.state.first} rows={this.state.size} totalRecords={this.state.totalRecords} onPageChange={this.onPageChange}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" currentPageReportTemplate={this.state.currenPage}></Paginator>
            </div>
        )
    }
}

export default ReclamoPrincipal;