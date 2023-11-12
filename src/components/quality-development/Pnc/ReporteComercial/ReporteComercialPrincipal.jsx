import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import * as moment from 'moment';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import PncService from '../../../../service/Pnc/PncService';
import ProductoService from '../../../../service/productoService';
import DetalleDefectos from './DetalleDefectos';

class ReporteComercialPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            listadoPnc: [],
            page: 0,
            size: 10,
            first: 0,
            rows: 0,
            totalRecords: 0,
            currenPage: '',
            pncSeleccionado: null,
            defectoSeleccionado: null,
            mostrarDefectos: false
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.consultar = this.consultar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    async componentDidMount() {
        this.consultar();
    }

    consultar() {
        this.obtenerDatosConsulta(this.state.page, this.state.size);
    }

    async obtenerDatosConsulta(page, size) {
        const solicitudesData = await PncService.reporteComercial(page, size, this.crearObj());
        const currentReportAUX = `( pág. ${solicitudesData.number + 1} de ${solicitudesData.totalPages} )  Total ítems  ${solicitudesData.totalElements}`;
        this.setState({ listadoPnc: solicitudesData.content, totalRecords: solicitudesData.totalElements, currenPage: currentReportAUX });
    }

    crearObj() {
        return {
            numero: this.state.codigo,
            fechaInicio: this.state.fechaInicio && moment(this.state.fechaInicio).format("YYYY-MM-DD hh:mm:ss.SSS"),
            fechaFin: this.state.fechaFin && moment(this.state.fechaFin).format("YYYY-MM-DD hh:mm:ss.SSS"),
            productoId: this.state.producto && this.state.producto.idProduct,
            estados: this.estado
        }
    }

    limpiar() {
       /*  var finiComponent = document.getElementById("fini");
        var ffinComponent = document.getElementById("ffin");
        finiComponent.value = null;
        ffinComponent.value = null; */
        this.setState({
            fechaInicio: null,
            fechaFin: null,
            estado: null,
            producto: null,
            codigo: null,
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


    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-eye" label='Defectos' className="p-button-success" onClick={() => this.setState({ defectoSeleccionado: rowData.defectoId, pncSeleccionado: rowData.id, mostrarDefectos: true })}></Button>
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

        return (
            <div className="card card-w-title">
                <h1>PRODUCTO NO CONFORME EN EXISTENCIA</h1>
                <Growl ref={(el) => this.growl = el} />
                <h2>Parámetros de consulta</h2>
                <div className="p-grid p-grid-responsive p-fluid">
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Número PNC</label>
                        <InputText value={this.state.codigo} onChange={(e) => this.setState({ codigo: e.target.value })} />
                    </div>
                    <div className='p-col-9'>
                        <label htmlFor="float-input">Producto</label>
                        <AutoComplete field="nameProduct" minLength={3} suggestions={this.state.productosSugeridos}
                            completeMethod={(e) => this.buscarProductos(e)} value={this.state.producto} onChange={(e) => this.setState({ producto: e.value })}
                        />
                    </div>
                    {/*  <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Fecha Inicio</label>
                                <Calendar dateFormat="yy/mm/dd" inputId='fini' value={this.state.fechaInicio} locale={es} onChange={(e) => this.setState({ fechaInicio: e.value })} showIcon={true} />
                            </div>
                            <div className='p-col-12 p-lg-3'>
                                <label htmlFor="float-input">Fecha Fin</label>
                                <Calendar dateFormat="yy/mm/dd" inputId='ffin' value={this.state.fechaFin} locale={es} onChange={(e) => this.setState({ fechaFin: e.value })} showIcon={true} />
                            </div> */}

                </div>
                <div className='p-col-12 p-lg-12 boton-opcion' >
                    <Button className="p-button-danger" label="CONSULTAR" onClick={this.consultar} />
                    <Button className='p-button-secondary' label="LIMPIAR" onClick={this.limpiar} />
                </div>
                <DataTable value={this.state.listadoPnc} scrollable={true} responsive={true}
                    selectionMode="single" onSelectionChange={(e) => { this.setState({ selectedPNC: e.value }); }}
                >
                    <Column body={this.actionTemplate} style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="numero" header="PNC #" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="lote" header="Lote" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="nombreProducto" header="Producto" style={{ width: '20em', textAlign: 'center' }} />
                    <Column field="unidad" header="Unidad" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="cantidadExistente" header="Cantidad Existente" style={{ width: '10em', textAlign: 'right' }} />
                    <Column field="validez" header="Validez (%)" style={{ width: '10em', textAlign: 'right' }} />
                    <Column field="ubicacion" header="Ubicación" style={{ width: '15em', textAlign: 'center' }} />


                </DataTable>
                <Paginator first={this.state.first} rows={this.state.size} totalRecords={this.state.totalRecords} onPageChange={this.onPageChange}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" currentPageReportTemplate={this.state.currenPage}></Paginator>
                <DetalleDefectos idDefecto={this.state.defectoSeleccionado} mostrar={this.state.mostrarDefectos} that={this}></DetalleDefectos>
            </div>
        )
    }
}

export default ReporteComercialPrincipal;