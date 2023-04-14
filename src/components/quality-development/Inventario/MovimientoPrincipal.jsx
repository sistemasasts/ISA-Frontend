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

class MovimientoPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            inventario: [],
            productoSeleccionado: null,
            mostrarForm: false
        };

        this.actionTemplate = this.actionTemplate.bind(this);
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
    }

    componentDidMount() {
        this.actualizarLista();
    }

    async actualizarLista() {
        const solicitudes_data = await InventarioService.listar();
        this.setState({ inventario: solicitudes_data });
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

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => this.setState({ mostrarForm: true })} />
        </div>;
        //const statusFilter = this.renderStatusFilter();
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>INVENTARIO DE PRODUCTOS (REACTIVOS)</strong></h3>

                <DataTable value={this.state.inventario} paginator={true} rows={15} header={header} responsive={true} scrollable={true}
                    selectionMode="single"
                >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                    <Column field="productoNombre" header="Producto" sortable={true} style={{ textAlign: 'center', width: '25em' }} />
                    <Column field="unidad.abreviatura" header="Unidad" style={{ width: '10em' }} />
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

export default MovimientoPrincipal;