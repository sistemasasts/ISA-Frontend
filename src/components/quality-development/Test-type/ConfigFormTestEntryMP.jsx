import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';
import { Messages } from 'primereact/messages';
import { Toolbar } from 'primereact/toolbar';
import React, { Component } from 'react';

import ConfigEntryMPService from '../../../service/ConfigEntryMPServices';
import PropiedadService from '../../../service/PropiedadService';

var that;
class ConfigFormTestEntryMP extends Component {
    constructor() {
        super();
        this.state = {
            listCatalog: [],
            listProperties: [],
            productTypeTextSelected: null,
            dialogConfig: false,
            propertySelected: null,
            configurations: [],
            dialogConfirmacion: false,
            configSelected: null,
        }
        that = this;

        this.guardar = this.guardar.bind(this);
        this.onDropdownChangeGrupo = this.onDropdownChangeGrupo.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.eliminar = this.eliminar.bind(this);
    }

    async componentDidMount() {
        const catalog = await ConfigEntryMPService.listCatalog();
        const properties = await PropiedadService.list();
        this.setState({
            listCatalog: catalog,
            listProperties: properties
        });
    }

    async onDropdownChangeGrupo(event) {
        const config = await ConfigEntryMPService.listByProductTypeText(event.value);
        this.setState({ productTypeTextSelected: event.value, configurations: config });
    }

    async refrescarLista() {
        const listConfigurations = await ConfigEntryMPService.listByProductTypeText(this.state.productTypeTextSelected);
        this.setState({ configurations: listConfigurations })
    }

    async guardar() {
        if (this.state.productTypeTextSelected && this.state.propertySelected) {
            const config = await ConfigEntryMPService.create(this.crearConfigObj());
            let msg = { severity: 'success', summary: 'Configuración', detail: 'Creada con éxito' };
            this.growl.show(msg);
            this.setState({ dialogConfig: false, propertySelected: null });
            this.refrescarLista();

        } else {
            this.messages.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar el grupo y una propiedad.' });
        }
    }

    crearConfigObj() {
        return {
            productTypeText: this.state.productTypeTextSelected,
            property: this.state.propertySelected
        }
    }

    async eliminar() {
        await ConfigEntryMPService.delete(this.state.configSelected.id);
        let msg = { severity: 'success', summary: 'Configuración', detail: 'Eliminada con éxito' };
        this.growl.show(msg);
        this.refrescarLista();
        this.setState({ dialogConfirmacion: false, configSelected: null });
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => this.setState({ configSelected: rowData, dialogConfirmacion: true })}></Button>
        </div>;
    }

    render() {
        let actionHeader = <Button type="button" icon="pi pi-cog" />;
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-left">
                    <Button label='Nuevo' icon='pi pi-plus' onClick={() => this.setState({ dialogConfig: true })} />
                </div>
            </Toolbar>
        </div>
        const dialogFooterConfig = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" onClick={() => this.guardar()} />
                <Button label="Cancelar" className='p-button-secondary' icon="pi pi-times" onClick={() => this.setState({ dialogConfig: false })} />
            </div>
        );
        const dialogFooterConfirmacion = (
            <div>
                <Button label="Sí" icon="pi pi-check" onClick={() => this.eliminar()} />
                <Button label="No" className='p-button-secondary' icon="pi pi-times" onClick={() => this.setState({ dialogConfirmacion: false })} />
            </div>
        );
        return (
            <div className='p-grid'>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className="p-col-12 p-lg-12">
                    <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                    <div className="card card-w-title">
                        <h1>Configuración Formulario Ingreso de MP</h1>
                        <div className='p-fluid p-grid' style={{ marginTop: '5px' }}>
                            <div className="p-col-12 p-lg-4">
                                <label htmlFor="float-input">Grupo</label>
                                <Dropdown options={this.state.listCatalog} value={this.state.productTypeTextSelected} onChange={this.onDropdownChangeGrupo} autoWidth={false} />
                            </div>
                        </div>

                        <DataTable ref={(el) => this.dt = el} value={this.state.configurations} header={header} responsive={true}>
                            <Column field="productTypeText" header="Grupo" />
                            <Column field="property.nameProperty" header="Nombre Propiedad" sortable={true} filter={true} />
                            <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                        </DataTable>
                    </div>
                </div>
                <Dialog header="Configuración Asociar Propiedad" visible={this.state.dialogConfig} style={{ width: '50vw' }} footer={dialogFooterConfig} onHide={() => this.setState({ dialogConfig: false })}>
                    <div className="p-grid p-fluid">
                        <div className="p-col-12"><span>Seleccione el <strong>GRUPO</strong> y la <strong>PROPIEDAD</strong> a asociar para el ingreso de materias primas.</span></div>
                        <div className="p-col-12">
                            <label htmlFor="float-input">Grupo</label>
                            <Dropdown options={this.state.listCatalog} value={this.state.productTypeTextSelected} onChange={event => this.setState({ productTypeTextSelected: event.value })} autoWidth={false} />
                        </div>
                        <div className="p-col-12">
                            <label htmlFor="float-input">Propiedad</label>
                            <DataTable ref={(el) => this.dt = el} value={this.state.listProperties} selectionMode="single" responsive={true} selection={this.state.propertySelected}
                                onSelectionChange={event => this.setState({ propertySelected: event.value })} scrollable={true} scrollHeight="200px">
                                <Column field="idProperty" header="Codigo" style={{ width: '15%' }} />
                                <Column field="nameProperty" header="Nombre Propiedad" sortable={true} filter={true} style={{ width: '50%' }} />
                                <Column field="typeProperty" header="Tipo" sortable={true} style={{ width: '15%', textAlign: 'center' }} />
                                <Column field="periodicity" header="Periodicidad" style={{ width: '20%' }} />
                            </DataTable>
                        </div>
                        <div className="p-col-12">
                            <Messages ref={(el) => this.messages = el} />
                        </div>
                    </div>
                </Dialog>
                <Dialog header="Confirmación" visible={this.state.dialogConfirmacion} style={{ width: '25vw' }} footer={dialogFooterConfirmacion} onHide={() => this.setState({ dialogConfirmacion: false })}>
                    <span> ¿Está seguro de eliminar la propiedad <strong>{this.state.configSelected && this.state.configSelected.property.nameProperty}</strong> del grupo <strong>{this.state.configSelected && this.state.configSelected.productTypeText}</strong>?</span>
                </Dialog>
            </div>
        )
    }

}

export default (ConfigFormTestEntryMP);