import React, { Component } from 'react';
import { Growl } from "primereact/growl";
import * as moment from 'moment';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import TestService from '../../../service/TestService';
import ProductoService from '../../../service/productoService';
import PropiedadService from '../../../service/PropiedadService';

class ConsultaTest extends Component {

    constructor() {
        super();
        this.state = {
            fechaInicio: new Date(),
            fechaFin: null,
            page: 0,
            size: 15,
            first: 0,
            rows: 0,
            totalRecords: 0,
            currenPage: '',
            datos: [],
            productosCatalogo: [],
            propiedadesCatalogo: [],
            productoSeleccionado: null,
            propiedadSeleccionado: null
        }
        this.consultar = this.consultar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    async componentDidMount() {
        //const usuarios_data = await UsuarioService.list();
        const productos_data = await ProductoService.list();
        const propiedades_data = await PropiedadService.list();

        this.setState({
            //usuarios: usuarios_data,
            productosCatalogo: productos_data,
            propiedadesCatalogo: propiedades_data
        });
    }

    crearObj() {
        return {
            fechaInicio: this.state.fechaInicio && moment(this.state.fechaInicio).format("YYYY-MM-DD hh:mm:ss.SSS"),
            fechaFin: this.state.fechaFin && moment(this.state.fechaFin).format("YYYY-MM-DD hh:mm:ss.SSS"),
            productoId: this.state.productoSeleccionado && this.state.productoSeleccionado.idProduct,
            propiedadId: this.state.propiedadSeleccionado && this.state.propiedadSeleccionado.idProperty
        }
    }

    limpiar() {
        var finiComponent = document.getElementById("fini");
        var ffinComponent = document.getElementById("ffin");
        finiComponent.value = null;
        ffinComponent.value = null;

        this.setState({
            fechaInicio: new Date(),
            fechaFin: null,
            productoSeleccionado: null,
            datos: [],
            page: 0,
            size: 15,
            first: 0,
            rows: 0,
            totalRecords: 0,
            currenPage: '',
        });
    }

    onPageChange(event) {
        this.obenerDatosConsulta(event.page, this.state.size);
        this.setState({
            first: event.first,
            rows: event.rows
        });
    }

    consultar() {
        this.obenerDatosConsulta(this.state.page, this.state.size);
    }

    async obenerDatosConsulta(page, size) {
        const solicitudesData = await TestService.consultar(page, size, this.crearObj());
        const currentReportAUX = `( pág. ${solicitudesData.number + 1} de ${solicitudesData.totalPages} )  Total ítems  ${solicitudesData.totalElements}`;
        this.setState({ datos: solicitudesData.content, totalRecords: solicitudesData.totalElements, currenPage: currentReportAUX });
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
        const header = <div className="p-clearfix" style={{ textAlign: 'left' }}>Resultados</div>;
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h1><strong>CONSULTA DE ENSAYOS</strong></h1>
                <h2>Parámetros de consulta</h2>
                <div className="p-grid p-grid-responsive p-fluid">
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Fecha Inicio</label>
                        <Calendar inputId='fini' dateFormat="yy/mm/dd" value={this.state.fechaInicio} locale={es} onChange={(e) => this.setState({ fechaInicio: e.value })} showIcon={true} />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Fecha Fin</label>
                        <Calendar inputId='ffin' dateFormat="yy/mm/dd" value={this.state.fechaFin} locale={es} onChange={(e) => this.setState({ fechaFin: e.value })} showIcon={true} />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Producto</label>
                        <Dropdown dataKey='idProduct' filter={true} showClear optionLabel='nameProduct' options={this.state.productosCatalogo} value={this.state.productoSeleccionado} autoWidth={false} onChange={(event => this.setState({ productoSeleccionado: event.value }))} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Propiedad</label>
                        <Dropdown showClear dataKey='idProperty' filter={true} optionLabel='nameProperty' options={this.state.propiedadesCatalogo} value={this.state.propiedadSeleccionado} autoWidth={false} onChange={(event => this.setState({ propiedadSeleccionado: event.value }))} placeholder="Selecione" />
                    </div>
                </div>
                <div className='p-col-12 p-lg-12 boton-opcion' >
                    <Button className="p-button-danger" label="CONSULTAR" onClick={this.consultar} />
                    <Button className='p-button-secondary' label="LIMPIAR" onClick={this.limpiar} />
                </div>

                <DataTable value={this.state.datos} rows={30} responsive={true} header={header} scrollable={true}
                >
                    <Column field="fecha" header="Fecha" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="lote" header="Lote" sortable={true} style={{ textAlign: 'center', width: '16em' }} />
                    <Column field="nombreProducto" header="Producto" sortable={true} style={{ textAlign: 'center', width: '20em' }} />
                    <Column field="nombrePropiedad" header="Propiedad" sortable={true} style={{ textAlign: 'center', width: '15em' }} />
                    <Column field="resultado" header="Resultado" sortable={true} style={{ textAlign: 'right', width: '12em', backgroundColor: '#bbdefb' }} />
                    <Column field="usuario" header="Responsable" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="comentario" header="Observación" style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="m1Ini" header="M1 Ini" style={{ textAlign: 'right', width: '8em' }} />
                    <Column field="m1End" header="M1 End" style={{ textAlign: 'right', width: '8em' }} />
                    <Column field="m2Ini" header="M2 Ini" style={{ textAlign: 'right', width: '8em' }} />
                    <Column field="m2End" header="M2 End" style={{ textAlign: 'right', width: '8em' }} />
                    <Column field="m3Ini" header="M3 Ini" style={{ textAlign: 'right', width: '8em' }} />
                    <Column field="m3End" header="M3 End" style={{ textAlign: 'right', width: '8em' }} />
                    <Column field="p1" header="P1" style={{ textAlign: 'right', width: '8em' }} />
                    <Column field="p2" header="P2" style={{ textAlign: 'right', width: '8em' }} />
                    <Column field="p3" header="P3" style={{ textAlign: 'right', width: '8em' }} />

                </DataTable>
                <Paginator first={this.state.first} rows={this.state.size} totalRecords={this.state.totalRecords} onPageChange={this.onPageChange}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" currentPageReportTemplate={this.state.currenPage}></Paginator>
            </div>
        )
    }
}
export default ConsultaTest;
