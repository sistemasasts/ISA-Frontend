import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import "../../site.css";
import { determinarColor, determinarColorActivo, determinarColorTipoAprobacion } from '../SolicitudEnsayo/ClasesUtilidades';
import * as _ from "lodash";
import InventarioService from '../../../service/Inventario/InventarioService';
import history from '../../../history';
import InventarioForm from './InventarioForm';
import { InputText } from 'primereact/inputtext';

class InventarioPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            inventario: [],
            productoSeleccionado: null,
            mostrarForm: false
        };

        this.actionTemplate = this.actionTemplate.bind(this);
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    componentDidMount() {
        this.actualizarLista();
    }

    async actualizarLista() {
        const solicitudes_data = await InventarioService.listar();
        this.setState({ inventario: solicitudes_data });
    }

    redirigirSolicitudEdicion(idSolcicitud) {
        history.push(`/quality-development_inventario_detalle/${idSolcicitud}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => this.redirigirSolicitudEdicion(rowData.id)}></Button>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.editar(rowData)}></Button>
        </div>;
    }

    bodyTemplateEstado(rowData) {
        const estado = _.startCase(rowData.estado);
        return <span className={determinarColor(rowData.estado)}>{estado}</span>;
    }

    bodyTemplateActivo(rowData) {
        if (rowData.tipoAprobacion === null)
            return '';
        else
            return <span className={determinarColorActivo(rowData.aprobado)}>{rowData.aprobadoTexto}</span>;
    }

    bodyTemplateTipoAprobacion(rowData) {
        if (rowData.tipoAprobacion === null)
            return '';
        if (rowData.tipoAprobacion)
            return <span className={determinarColorTipoAprobacion(rowData.tipoAprobacionTexto)}>{rowData.tipoAprobacionTexto}</span>;

    }

    editar(rowData) {
        this.setState({ mostrarForm: true, productoSeleccionado: rowData });
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => this.setState({ mostrarForm: true })} />
            <div style={{'textAlign':'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Búsqueda General" size="50"/>
            </div>
        </div>;
        //const statusFilter = this.renderStatusFilter();
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>INVENTARIO DE PRODUCTOS (REACTIVOS)</strong></h3>

                <DataTable value={this.state.inventario} paginator={true} rows={15} header={header} responsive={true} scrollable={true}
                    selectionMode="single" globalFilter={this.state.globalFilter}
                >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                    <Column field="productoNombre" header="Producto" sortable={true} style={{ textAlign: 'center', width: '25em' }} />
                    <Column field="tipoProducto" header="Tipo" sortable={true} style={{ textAlign: 'center', width: '20em' }} />
                    <Column field="unidad.abreviatura" header="Unidad" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="minimo" header="Mínimo" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="maximo" header="Máximo" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="cantidadAlertar" header="Alertar" sortable={true} style={{ textAlign: 'center', width: '11em' }} />
                    <Column field='stock' header="Stock" sortable style={{ textAlign: 'center', width: '12em' }} />
                </DataTable>
                <InventarioForm mostrar={this.state.mostrarForm} origen={this} />
            </div>
        )
    }
}

export default InventarioPrincipal;