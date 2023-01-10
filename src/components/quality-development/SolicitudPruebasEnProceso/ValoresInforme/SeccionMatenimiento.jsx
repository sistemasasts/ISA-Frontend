import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { Component } from 'react';
import FormCondicionOperacion from './FormCondicionOperacion';
import InformeSPPService from '../../../../service/SolicitudPruebaProceso/InformeSPPService';
import { Growl } from 'primereact/growl';
import FormCondicion from './FormCondicion';
class SeccionMantenimiento extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            informeId: null,
            condicionesOperacion: [],
            mostrarFormCondicionOperacion: false,
            mostrarFormCondicion: false,
            seleccionadoCondicionOperacion: null,
            seleccionadoCondicion: null,
            condicionOperacionId: null,
            expandedRows: null,

        }
        this.actionTemplateCondicion = this.actionTemplateCondicion.bind(this);
        this.actionTemplateCondicionesOperacion = this.actionTemplateCondicionesOperacion.bind(this);
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.informeId !== prevProps.informeId) {
            this.fetchData();
        }
    }

    fetchData() {
        const detalleMaquinaria = this.props.detalle;
        const informeID = this.props.informeId
        this.setState({ condicionesOperacion: detalleMaquinaria, informeId: informeID });
    }

    componentDidMount() {
        this.fetchData();
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
                        <Column field="maquinaria" header="Maquinaria" sortable={true} />
                        <Column field="nombre" header="Condición" sortable={true} />
                        <Column field="valor" header="Valor" style={{ textAlign: 'center' }} />
                        <Column field="unidad.abreviatura" header="Unidad" sortable={true} style={{ textAlign: 'center' }} />
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
        const detalleActualizado = await InformeSPPService.eliminarCondicion(condicionOperacionId, id, this.state.informeId, 'MANTENIMIENTO');
        this.growl.show({ severity: 'success', detail: 'Condición Eliminada!' });
        this.setState({ condicionesOperacion: detalleActualizado });
    }

    abrirDialogoCondicion(condicion, condicionOId) {
        this.setState({ seleccionadoCondicion: condicion, condicionOperacionId: condicionOId, mostrarFormCondicion: true });
    }

    actionTemplateCondicionesOperacion(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.abrirDialogoCondicionOperacion(rowData)}></Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" style={{ marginLeft: '.5em' }} onClick={() => this.eliminarCondicionOperacion(rowData.id)}></Button>
        </div>;
    }

    async eliminarCondicionOperacion(id) {
        const detalleActualizado = await InformeSPPService.eliminarCondicionOperacion(id, this.state.informeId, 'MANTENIMIENTO');
        this.growl.show({ severity: 'success', detail: 'Condición Operación Eliminado!' });
        this.setState({ condicionesOperacion: detalleActualizado });
    }

    abrirDialogoCondicionOperacion(condicionOperacion) {
        this.setState({ seleccionadoCondicionOperacion: condicionOperacion, mostrarFormCondicionOperacion: true });
    }

    render() {
        let headerCondicionesOperacion = <div className="p-clearfix" style={{ width: '10%' }}>
            <Button style={{ float: 'left' }} label="Agregar" icon="pi pi-plus" onClick={() => this.setState({ mostrarFormCondicionOperacion: true })} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <DataTable value={this.state.condicionesOperacion} expandedRows={this.state.expandedRows} header={headerCondicionesOperacion}
                    onRowToggle={(e) => this.setState({ expandedRows: e.data })} rowExpansionTemplate={this.rowExpansionTemplate} dataKey="id">
                    <Column expander={true} style={{ width: '3em' }} />
                    <Column field="proceso" header="Proceso" />
                    <Column field="observacion" header="Observación" />
                    <Column body={this.actionTemplateCondicionesOperacion} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>
                <FormCondicionOperacion mostrar={this.state.mostrarFormCondicionOperacion} informeId={this.state.informeId} origen={this} tipo={"MANTENIMIENTO"} />
                <FormCondicion mostrar={this.state.mostrarFormCondicion} informeId={this.state.informeId} condicionOperacionId={this.state.condicionOperacionId} origen={this} tipo={"MANTENIMIENTO"} />
            </div>
        );
    }
}

export default SeccionMantenimiento;
