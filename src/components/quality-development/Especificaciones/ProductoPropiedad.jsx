import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';
import { Dialog } from 'primereact/dialog';
import { CatalogoService } from '../../../service/CatalogoService';
import EspecificacionForm from './EspecificacionForm';
import EspecificacionService from '../../../service/EspecificacionService';
import { Dropdown } from 'primereact/dropdown';


var that;
class ProductoPropiedad extends Component {

    constructor() {
        super();
        this.state = {
            especificaciones: [],
            especificaciones2: [],
            productoSeleccionado: {},
            especificacionSeleccionada: {},
            display: false,
            crearEspecificacion: false,
            unidadesMedida:[]

        };
        that = this;
        this.catalogoService = new CatalogoService();
        this.refrescarLista = this.refrescarLista.bind(this);
        this.actualizarEspecificacion = this.actualizarEspecificacion.bind(this);
        this.eliminarEspecificacion = this.eliminarEspecificacion.bind(this);

        this.clonedCars = {};
        this.editorForRowEditing = this.editorForRowEditing.bind(this);
        this.editorForRowEditingUnit = this.editorForRowEditingUnit.bind(this);
        this.onRowEditorValidator = this.onRowEditorValidator.bind(this);
        this.onRowEditInit = this.onRowEditInit.bind(this);
        this.onRowEditSave = this.onRowEditSave.bind(this);
        this.onRowEditCancel = this.onRowEditCancel.bind(this);

    }

    async componentDidMount() {
        this.catalogoService.getUnidadesMedida().then(data => this.setState({ unidadesMedida: data }));
        this.refrescarLista();
    }

    async refrescarLista() {
        const propiedadesEspecificacion = await EspecificacionService.list(this.props.producto && this.props.producto.idProduct);
        this.setState({ especificaciones: propiedadesEspecificacion, display: false, propiedadSeleccionada: {}, productoSeleccionado: this.props.producto })
    }

    async actualizarEspecificacion(data) {
        data['action'] = 'UPDATE';
        let especificacionAActualizar = [];
        especificacionAActualizar.push(data);

        await EspecificacionService.update(especificacionAActualizar);
    }

    async eliminarEspecificacion() {
        if (this.state.especificacionSeleccionada) {
            await EspecificacionService.delete(this.state.especificacionSeleccionada.idProduct, this.state.especificacionSeleccionada.idPropertyList);
            this.refrescarLista();
            this.growl.show({ severity: 'error', summary: 'Especificación', detail: this.state.especificacionSeleccionada.nameProperty + ' eliminada.' });
        }
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-trash" className="p-button-secondary" onClick={() => that.setState({ display: true, especificacionSeleccionada: rowData })} />
        </div>;
    }


    /* Row Editing */
    onEditorValueChangeForRowEditing = (props, value) => {
        let updatedCars = [...props.value];
        updatedCars[props.rowIndex][props.field] = value;
        this.setState({ especificaciones2: updatedCars });
    };

    editorForRowEditing(props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.target.value)} />;
    }

    editorForRowEditingUnit(props, field) {
        return <Dropdown value={props.rowData[field]} options={this.state.unidadesMedida} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.value)} autoWidth={false} />;
    }

    onRowEditorValidator(rowData) { /* VALIDAR LAS OPCIONES INGRESADAS*/
        let value = rowData['typeProperty'];
        return value.length > 0;
    }

    onRowEditInit(event) {
        this.clonedCars[event.data.idPropertyList] = { ...event.data };
    }

    async onRowEditSave(event) {
        if (this.onRowEditorValidator(event.data)) {
            await this.actualizarEspecificacion(event.data);
            delete this.clonedCars[event.data.idPropertyList];
            this.growl.show({ severity: 'success', summary: 'Especificación', detail: event.data.nameProperty + ' actualizada.' });
        }
        else {
            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Brand is required' });
        }
    }

    onRowEditCancel(event) {
        let cars = [...this.state.especificaciones2];
        cars[event.index] = this.clonedCars[event.data.idPropertyList];
        delete this.clonedCars[event.data.idPropertyList];
        this.setState({
            especificaciones2: cars
        })
    }

    render() {
        let actionHeader = <Button type="button" icon="pi pi-cog" />;
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-left">
                    <Button label='Nuevo' icon='pi pi-plus' onClick={() => this.setState({ crearEspecificacion: true })} />
                </div>
            </Toolbar>
        </div>
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={() => this.eliminarEspecificacion()} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ display: false })} label="No" className="p-button-danger" />
            </div>
        );
        return (
            <div className='p-fluid p-grid'>
                <Growl ref={(el) => this.growl = el} />
                {!this.state.crearEspecificacion &&
                    <DataTable ref={(el) => this.dt = el} value={this.state.especificaciones} selectionMode="single" header={header} paginator={true} rows={20}
                        responsive={true} selection={this.state.especificacionSeleccionada} onSelectionChange={event => this.setState({ especificacionSeleccionada: event.value })}
                        editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel} >
                        <Column field="nameProperty" header="Propiedad" sortable={true} filter={true} style={{ width: '30%' }} />
                        <Column field="propertyNorm" header="Norma" sortable={true} filter={true} style={{ width: '15%' }} />
                        <Column field="typeProperty" header="Tipo" sortable={true} filter={true} />
                        <Column field="unitProperty" header="Unidad" sortable={true} filter={true} editor={(props) => this.editorForRowEditingUnit(props, 'unitProperty')} />
                        <Column field="minProperty" header="Min" sortable={true} filter={true} editor={(props) => this.editorForRowEditing(props, 'minProperty')} />
                        <Column field="maxProperty" header="Max" sortable={true} filter={true} editor={(props) => this.editorForRowEditing(props, 'maxProperty')} />
                        <Column field="viewProperty" header="Visible" sortable={true} filter={true} editor={(props) => this.editorForRowEditing(props, 'viewProperty')} />
                        <Column rowEditor={true} style={{ 'width': '70px', 'textAlign': 'center' }} />
                        <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '70px' }} />
                    </DataTable>
                }
                {this.state.crearEspecificacion && <div className="p-col-12 p-lg-12">
                    <EspecificacionForm product = {this.state.productoSeleccionado} _this={this} />

                </div>

                }
                <Dialog header="Confirmación" visible={this.state.display} modal={true} footer={dialogFooter} onHide={() => this.setState({ display: false })}>
                    <p>Esta seguro de eliminar la especificación {this.state.especificacionSeleccionada && this.state.especificacionSeleccionada.nameProperty} ?</p>
                </Dialog>

            </div>
        )
    }
}

export default ProductoPropiedad;
