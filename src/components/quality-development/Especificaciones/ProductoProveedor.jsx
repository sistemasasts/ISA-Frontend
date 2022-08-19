import React, { Component } from 'react'
import ProductoProveedorService from '../../../service/ProdProvService';
import { Growl } from 'primereact/growl';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { connect } from 'react-redux';
import ProductoProveedorForm from './ProductoProveedorForm';
import { Dropdown } from 'primereact/dropdown';

var that;
class ProductoProveedor extends Component {

    constructor() {
        super();
        this.state = {
            proveedores: [],
            proveedores2: [],
            productoSeleccionado: {},
            proveedorSeleccionado: {},
            display: false,
            crearProveedor: false,
            statusCatalogo: []

        };
        that = this;
        this.refrescarLista = this.refrescarLista.bind(this);
        this.actualizarProveedor = this.actualizarProveedor.bind(this);
        this.eliminarProveedor = this.eliminarProveedor.bind(this);

        this.clonedCars = {};
        this.editorForRowEditing = this.editorForRowEditing.bind(this);
        this.editorForRowEditingStatus = this.editorForRowEditingStatus.bind(this);
        this.onRowEditorValidator = this.onRowEditorValidator.bind(this);
        this.onRowEditInit = this.onRowEditInit.bind(this);
        this.onRowEditSave = this.onRowEditSave.bind(this);
        this.onRowEditCancel = this.onRowEditCancel.bind(this);

    }

    async componentDidMount() {
        this.refrescarLista();
    }

    async refrescarLista() {
        const statusList = await ProductoProveedorService.listarStatusProveedor();
        const proveedoresAsignados = await ProductoProveedorService.list(this.props.producto && this.props.producto.idProduct);
        this.setState({ proveedores: proveedoresAsignados, display: false, proveedorSeleccionado: {}, productoSeleccionado: this.props.producto, statusCatalogo: statusList });
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-trash" className="p-button-secondary" onClick={() => that.setState({ display: true, proveedorSeleccionado: rowData })} />
        </div>;
    }

    async actualizarProveedor(data) {
        debugger
        data['action'] = 'UPDATE';
        data.asUser = this.props.currentUser.nickName;
        await ProductoProveedorService.update(data);
    }

    async eliminarProveedor() {
        if (this.state.proveedorSeleccionado) {
            await ProductoProveedorService.delete(this.state.proveedorSeleccionado.idProduct, this.state.proveedorSeleccionado.idProvider);
            this.refrescarLista();
            this.growl.show({ severity: 'error', summary: 'Proveedor', detail: this.state.proveedorSeleccionado.nameProvider + ' eliminado.' });
        }
    }


    /* Row Editing */
    onEditorValueChangeForRowEditing = (props, value) => {
        let updatedCars = [...props.value];
        updatedCars[props.rowIndex][props.field] = value;
        this.setState({ proveedores2: updatedCars });
    };

    editorForRowEditing(props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.target.value)} />;
    }

    editorForRowEditingStatus(props, field) {
        return <Dropdown value={props.rowData[field]} options={this.state.statusCatalogo} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.value)} autoWidth={false} />;
    }

    onRowEditorValidator(rowData) { /* VALIDAR LAS OPCIONES INGRESADAS*/
        let value = rowData['status'];
        return value.length > 0;
    }

    onRowEditInit(event) {
        this.clonedCars[event.data.idProvider] = { ...event.data };
    }

    async onRowEditSave(event) {
        if (this.onRowEditorValidator(event.data)) {
            await this.actualizarProveedor(event.data);
            delete this.clonedCars[event.data.idProvider];
            this.growl.show({ severity: 'success', summary: 'Proveedor', detail: event.data.nameProvider + ' actualizado.' });
        }
        else {
            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Brand is required' });
        }
    }

    onRowEditCancel(event) {
        let cars = [...this.state.proveedores2];
        cars[event.index] = this.clonedCars[event.data.idProvider];
        delete this.clonedCars[event.data.idProvider];
        this.setState({
            proveedores2: cars
        })
    }

    render() {
        let actionHeader = <Button type="button" icon="pi pi-cog" />;
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px', fontWeight: 'normal' }}>
                <div className="p-toolbar-group-left">
                    {/* <Button label='Nuevo' icon='pi pi-plus' onClick={() => this.setState({ crearProveedor: true })} /> */}
                    <ProductoProveedorForm product={this.props.producto && this.props.producto} _this={this} />
                </div>
            </Toolbar>
        </div>
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={() => this.eliminarProveedor()} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ display: false })} label="No" className="p-button-danger" />
            </div>
        );
        return (
            <div className='p-grid'>
                <Growl ref={(el) => this.growl = el} />

                <DataTable ref={(el) => this.dt = el} value={this.state.proveedores} selectionMode="single" header={header} paginator={true} rows={20}
                    responsive={true} selection={this.state.proveedorSeleccionado} onSelectionChange={event => this.setState({ proveedorSeleccionado: event.value })}
                    editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel} >
                    <Column field="nameProvider" header="Proveedor" sortable={true} filter={true} />
                    <Column field="typeProv" header="TipoProveedor" sortable={true} filter={true} style={{ width: '15%' }} />
                    <Column field="status" header="Estatus" sortable={true} filter={true} style={{ width: '20%' }} editor={(props) => this.editorForRowEditingStatus(props, 'status')} />
                    <Column rowEditor={true} style={{ 'width': '70px', 'textAlign': 'center' }} />
                    <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '70px' }} />
                </DataTable>


                <Dialog header="Confirmación" visible={this.state.display} modal={true} footer={dialogFooter} onHide={() => this.setState({ display: false })}>
                    <p>Esta seguro de eliminar al proveedor {this.state.proveedorSeleccionado && this.state.proveedorSeleccionado.nameProvider} ?</p>
                </Dialog>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps)(ProductoProveedor);
