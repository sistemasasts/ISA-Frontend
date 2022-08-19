import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import ProveedorService from '../../../service/ProveedorService'
import { Button } from 'primereact/button'
import ProveedorForm from './ProveedorForm'
import { Toolbar } from 'primereact/toolbar'
import { Growl } from 'primereact/growl'
import { Dialog } from 'primereact/dialog'

var that;
class Proveedor extends Component {

    constructor() {
        super();
        this.state = {
            listProveedor: [],
            proveedorSeleccionado: {},
            editar: false,
            dataTableSelection1: {},
            display: false

        };
        that = this;
        this.editarProveedor = this.editarProveedor.bind(this);
        this.refrescarLista = this.refrescarLista.bind(this);
        this.eliminarProveedor = this.eliminarProveedor.bind(this);

    }

    async componentDidMount() {
        this.refrescarLista();
    }

    async refrescarLista() {
        const proveedores = await ProveedorService.list();
        this.setState({ listProveedor: proveedores, display: false, proveedorSeleccionado: {} })
    }

    editarProveedor(data) {
        this.setState({ editar: true, proveedorSeleccionado: data })
    }

    async eliminarProveedor() {
        debugger
        await ProveedorService.delete(this.state.proveedorSeleccionado.idProvider);
        this.refrescarLista();
        let msg = { severity: 'error', summary: 'Proveedor', detail: 'Eliminado. !' };
        this.growl.show(msg);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" onClick={() => that.editarProveedor(rowData)} className="p-button-warning" style={{ marginRight: '.5em' }} />
            <Button type="button" icon="pi pi-trash" className="p-button-secondary" onClick={() => that.setState({ display: true, proveedorSeleccionado: rowData})} />
        </div>;
    }

    render() {
        let actionHeader = <Button type="button" icon="pi pi-cog" />;
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-left">
                    <Button label='Nuevo' icon='pi pi-plus' onClick={() => this.setState({ editar: true })} />
                </div>
            </Toolbar>
        </div>

        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={() => this.eliminarProveedor()} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ display: false })} label="No" className="p-button-secondary" />
            </div>
        );
        return (
            <div className='p-grid'>
                <div className="p-col-12 p-lg-12">
                    <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                    {!this.state.editar &&
                        <div className="card card-w-title">
                            <h1>Proveedores</h1>
                            <DataTable ref={(el) => this.dt = el} value={this.state.listProveedor} selectionMode="single" header={header} paginator={true} rows={20}
                                responsive={true} selection={this.state.dataTableSelection1} onSelectionChange={event => this.setState({ dataTableSelection1: event.value })}>
                                <Column field="idProvider" header="Código" sortable={true} filter={true} style={{ width: '10%' }} />
                                <Column field="nameProvider" header="Nombre Proveedor" sortable={true} filter={true} />
                                <Column field="typeProvider" header="Tipo" sortable={true} filter={true} style={{ textAlign: 'center', width: '20%' }} />
                                <Column field="descProvider" header="Descripción" sortable={true} filter={true} style={{ width: '20%' }}  />
                                <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                            </DataTable>

                        </div>}
                    {this.state.editar && <div className="card card-w-title" >
                        <h1>Crear/Editar Proveedor</h1>
                        <Button icon='pi pi-arrow-left' onClick={() => this.setState({ editar: false })} />
                        <ProveedorForm proveedor={this.state.proveedorSeleccionado} _this={this} />

                    </div>}
                    <Dialog header="Confirmación" visible={this.state.display} modal={true} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => this.setState({ display: false })}>
                        <p>Esta seguro de eliminar el proveedor {this.state.proveedorSeleccionado && this.state.proveedorSeleccionado.nameProvider} ?</p>
                    </Dialog>
                </div>


            </div >
        )
    }
}

export default Proveedor
