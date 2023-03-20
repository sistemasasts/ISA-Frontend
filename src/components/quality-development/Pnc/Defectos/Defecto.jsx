import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import DefectoService from '../../../../service/Pnc/DefectoService'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Growl } from 'primereact/growl'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import * as _ from "lodash";
import { determinarColorActivo } from '../../SolicitudEnsayo/ClasesUtilidades'

class Defecto extends Component {

    constructor() {
        super();
        this.state = {
            listaDefectos: [],
            defectoSeleccionado: {},
            editar: false,
            dataTableSelection1: {},
            display: false,
            
            nombreDefecto: null,            

        };
        this.clonedCars = {};
        this.editarDefecto = this.editarDefecto.bind(this);
        this.refrescarLista = this.refrescarLista.bind(this);
        this.guardarNuevo = this.guardarNuevo.bind(this);
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.editorForRowEditing = this.editorForRowEditing.bind(this);
        this.editorForRowEditingBoolean = this.editorForRowEditingBoolean.bind(this);
        this.onRowEditorValidator = this.onRowEditorValidator.bind(this);
        this.onRowEditInit = this.onRowEditInit.bind(this);
        this.onRowEditSave = this.onRowEditSave.bind(this);
        this.onRowEditCancel = this.onRowEditCancel.bind(this);

    }

    async componentDidMount() {
        this.refrescarLista();
    }

    async refrescarLista() {
        const unidades = await DefectoService.list();
        this.setState({ listaDefectos: unidades, display: false, nombreDefecto: null})
    }

    async editarDefecto(data) {
        const resultado = await DefectoService.actualizar({
            id: data.id,
            nombre: data.nombre,
            activo: data.activo,
        });
        this.refrescarLista();
    }


    onRowEditorValidator(rowData) {        
        let descripcion = rowData['nombre'];
        return descripcion.length > 0;
    }

    editorForRowEditing(props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.target.value)} />;
    }

    editorForRowEditingBoolean(props, field) {
        return <Checkbox onChange={e => this.onEditorValueChangeForRowEditing(props, e.checked)} checked={props.rowData[field]}></Checkbox>
    }

    /* Row Editing */
    onEditorValueChangeForRowEditing(props, value) {
        let updatedCars = [...props.value];
        updatedCars[props.rowIndex][props.field] = value;
        this.setState({ listaUnidades: updatedCars });
    }

    onRowEditInit(event) {
        this.clonedCars[event.data.id] = { ...event.data };
        this.setState({ idUnidadOriginal: event.data.id })
    }

    onRowEditSave(event) {
        console.log(event)
        if (this.onRowEditorValidator(event.data)) {
            delete this.clonedCars[event.data.id];
            this.editarDefecto(event.data);
            this.growl.show({ severity: 'success', summary: 'Success', detail: 'Defecto actualizada' });
        }
        else {
            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios' });
        }
    }

    onRowEditCancel(event) {
        let cars = [...this.state.listaDefectos];
        cars[event.index] = this.clonedCars[event.data.id];
        delete this.clonedCars[event.data.id];
        this.setState({
            listaUnidades: cars
        })
    }

    async guardarNuevo() {
        if(_.isEmpty(this.state.nombreUnidad))
            return false;
        const defecto = await DefectoService.crear({            
            nombre: this.state.nombreUnidad
        })
        this.growl.show({ severity: 'success', detail: 'Defecto registrado.' });
        this.refrescarLista();
    }

    bodyTemplateEstado(rowData) {
        const estado = rowData.activo ? 'SI' : 'NO';
        return <span className={determinarColorActivo(rowData.activo)}>{estado}</span>;
    }

    render() {
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-left">
                    <Button label='Nuevo' icon='pi pi-plus' onClick={() => this.setState({ display: true })} />
                </div>
            </Toolbar>
        </div>
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={() => this.guardarNuevo()} label="Guardar" />
                <Button icon="pi pi-times" onClick={() => this.setState({ display: false })} label="Cancelar" className="p-button-secondary" />
            </div>
        );

        return (
            <div className='p-grid'>
                <div className="p-col-12 p-lg-12">
                    <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                    <div className="card card-w-title">
                        <h1>Defectos PNC</h1>
                        <DataTable header={header} value={this.state.listaDefectos} editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave}
                            onRowEditCancel={this.onRowEditCancel} paginator={true} rows={20}>                            
                            <Column field="nombre" header="Nombre" sortable={true} filter={true} editor={(props) => this.editorForRowEditing(props, 'nombre')} />
                            <Column field="activo" header="Activo" sortable={true} editor={(props) => this.editorForRowEditingBoolean(props, 'activo')} style={{ width: '13.5em', textAlign: 'center' }} body={this.bodyTemplateEstado} />
                            <Column rowEditor={true} style={{ 'width': '100px', 'textAlign': 'center' }}></Column>
                        </DataTable>
                        <Dialog header="Nuevo" visible={this.state.display} modal={true} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => this.setState({ display: false })}>
                            <div className="p-grid p-fluid">                                
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">Nombre</label>
                                    <InputText value={this.state.nombreUnidad} onChange={(e) => this.setState({ nombreUnidad: e.target.value })} />
                                </div>
                                {_.isEmpty(this.state.codigoUnidad) && _.isEmpty(this.state.defectoSeleccionado) &&
                                    <div className='p-col-12 p-lg-12'>
                                        <div className="alert alert-danger" role="alert">
                                            Los campos son obligatorios...
                                        </div>
                                    </div>
                                }
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div >
        )
    }
}

export default Defecto
