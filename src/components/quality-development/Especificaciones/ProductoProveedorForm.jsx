import React, { Component } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import ProductoProveedorService from '../../../service/ProdProvService';

class ProductoProveedorForm extends Component {

    constructor() {
        super();
        this.state = {
            proveedorSeleccionado: {},
            proveedoresNoAsignados: [],
            display: false,

        };
        this.refrescarLista = this.refrescarLista.bind(this);
        this.asignarNuevoProveedor = this.asignarNuevoProveedor.bind(this);
    }

    async componentDidMount() {
        this.refrescarLista();
    }

    async refrescarLista() {
        console.log(this.props);
        const proveedores = await ProductoProveedorService.listarProveedoresNoAsigandos(this.props.product && this.props.product.idProduct);
        this.setState({ proveedoresNoAsignados: proveedores })
    }

    async asignarNuevoProveedor() {
        if (this.state.proveedorSeleccionado && this.state.proveedorSeleccionado.idProvider) {
            let proveedor = { idProduct: null, idProvider: null, nameProvider: '', asUser: '', typeProv: '' };
            proveedor.idProduct = this.props.product.idProduct;
            proveedor.idProvider = this.state.proveedorSeleccionado.idProvider;
            proveedor.nameProvider = this.state.proveedorSeleccionado.nameProvider;
            proveedor.typeProv = this.state.proveedorSeleccionado.typeProvider;
            proveedor.asUser = this.props._this.props.currentUser.nickName;

            await ProductoProveedorService.create(proveedor);

            this.props._this.refrescarLista();
            this.refrescarLista();
            this.props._this.growl.show({ severity: 'success', summary: 'Proveedor', detail: `${this.state.proveedorSeleccionado.nameProvider} asignado correctamente.` });
            this.setState({ display: false, proveedorSeleccionado: {} });

        } else {
            this.props._this.growl.show({ severity: 'error', summary: 'Error', detail: 'Seleccione un proveedor' });
        }
    }

    render() {
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={this.asignarNuevoProveedor} label="Seleccionar" />
                <Button icon="pi pi-times" onClick={() => this.setState({ display: false })} label="Cancelar" className="p-button-danger" />
            </div>
        );
        return (
            <div className="p-grid">
                <Button label='Nuevo' icon='pi pi-plus' onClick={() => this.setState({ display: true })} />
                <Dialog header="Búsqueda" visible={this.state.display} style={{ width: '50vw' }} onHide={() => this.setState({ display: false })} blockScroll footer={dialogFooter} >

                    <DataTable ref={(el) => this.dt = el} value={this.state.proveedoresNoAsignados} selectionMode="single" paginator={true} rows={10}
                        responsive={true} selection={this.state.proveedorSeleccionado} onSelectionChange={event => this.setState({ proveedorSeleccionado: event.value })} >

                        <Column field="nameProvider" header="Proveedor" sortable={true} filter={true} style={{ width: '30%' }} />
                        <Column field="typeProvider" header="Tipo" sortable={true} style={{ width: '15%' }} />
                        <Column field="sapCode" header="Código SAP" sortable={true} style={{ width: '15%' }} />

                    </DataTable>
                </Dialog>

            </div>
        )
    }
}

export default ProductoProveedorForm