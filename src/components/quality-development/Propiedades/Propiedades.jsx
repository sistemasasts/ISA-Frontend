import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import PropiedadService from '../../../service/PropiedadService'
import { Button } from 'primereact/button'
import PropiedadForm from './PropiedadForm'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { Growl } from 'primereact/growl';

var that;

class Propiedades extends Component {
    constructor() {
        super();
        this.state = {
            listPropiedades: [],
            propiedadSeleccionada: {},
            editar: false,
            dataTableSelection1: {},
            display: false

        };
        that = this;
        this.editarPropiedad = this.editarPropiedad.bind(this);
        this.refrescarLista = this.refrescarLista.bind(this);
        this.eliminarPropiedad = this.eliminarPropiedad.bind(this);

    }

    async componentDidMount() {
        this.refrescarLista();
    }

    async refrescarLista() {
        const propiedades = await PropiedadService.list();
        this.setState({ listPropiedades: propiedades, display: false, propiedadSeleccionada: {} })
    }

    editarPropiedad(data) {
        this.setState({ editar: true, propiedadSeleccionada: data })
    }

    async eliminarPropiedad() {
        await PropiedadService.delete(this.state.propiedadSeleccionada.idProperty);
        this.refrescarLista();
        let msg = { severity: 'error', summary: 'Propiedad', detail: 'Eliminada. !' };
        this.growl.show(msg);        
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" onClick={() => that.editarPropiedad(rowData)} className="p-button-warning" style={{ marginRight: '.5em' }} />
            <Button type="button" icon="pi pi-trash" className="p-button-secondary" onClick={() => that.setState({ display: true, propiedadSeleccionada: rowData})} />
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
                <Button icon="pi pi-check" onClick={() => this.eliminarPropiedad()} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ display: false })} label="No" className="p-button-secondary" />
            </div>
        );
        return (
            <div className='p-grid'>
                <div className="p-col-12 p-lg-12">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                    {!this.state.editar &&
                        <div className="card card-w-title" >
                            <h1>Propiedades</h1>
                            <DataTable ref={(el) => this.dt = el} value={this.state.listPropiedades} selectionMode="single" header={header} paginator={true} rows={20}
                                responsive={true} selection={this.state.dataTableSelection1} onSelectionChange={event => this.setState({ dataTableSelection1: event.value })}>
                                <Column field="idProperty" header="Código" sortable={true} filter={true} />
                                <Column field="nameProperty" header="Nombre" sortable={true} filter={true} style={{ width: '30%' }} />
                                <Column field="periodicity" header="Periodicidad" sortable={true} filter={true} />
                                <Column field="typeProperty" header="Tipo" sortable={true} filter={true} />
                                <Column field="laboratory" header="Laboratorio" sortable={true} filter={true} />
                                <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                            </DataTable>


                        </div>}
                    {this.state.editar && <div className="card card-w-title" >
                        <h1>Crear/Editar Propiedad</h1>
                        <Button icon='pi pi-arrow-left' onClick={() => this.setState({ editar: false })} />
                        <PropiedadForm propiedad={this.state.propiedadSeleccionada} _this={this} />

                    </div>}
                    <Dialog header="Confirmación" visible={this.state.display} modal={true} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => this.setState({ display: false })}>
                        <p>Esta seguro de eliminar la propiedad {this.state.propiedadSeleccionada && this.state.propiedadSeleccionada.nameProperty} ?</p>
                    </Dialog>
                </div>


            </div >
        )
    }
}

export default Propiedades
