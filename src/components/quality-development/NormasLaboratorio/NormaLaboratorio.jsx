import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import NormasLaboratorioService from '../../../service/NormasLaboratorioService'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Growl } from 'primereact/growl'
import { Dialog } from 'primereact/dialog'
import NormaLaboratorioForm from './NormaLaboratorioForm'

var that;
class NormaLaboratorio extends Component {

    constructor() {
        super();
        this.state = {
            listNormas: [],
            normaSeleccionada: {},
            editar: false,
            dataTableSelection1: {},
            display: false

        };
        that = this;
        this.editarNorma = this.editarNorma.bind(this);
        this.refrescarLista = this.refrescarLista.bind(this);
        this.eliminarNorma = this.eliminarNorma.bind(this);

    }

    async componentDidMount() {
        this.refrescarLista();
    }

    async refrescarLista() {
        const normas = await NormasLaboratorioService.list();
        this.setState({ listNormas: normas, display: false, normaSeleccionada: {} })
    }

    editarNorma(data) {
        this.setState({ editar: true, normaSeleccionada: data })
    }

    async eliminarNorma() {
        await NormasLaboratorioService.delete(this.state.normaSeleccionada.id);
        this.refrescarLista();
        let msg = { severity: 'error', summary: 'Norma', detail: 'Eliminada. !' };
        this.growl.show(msg);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" onClick={() => that.editarNorma(rowData)} className="p-button-warning" style={{ marginRight: '.5em' }} />
            <Button type="button" icon="pi pi-trash" className="p-button-secondary" onClick={() => that.setState({ display: true, normaSeleccionada: rowData })} />
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
                <Button icon="pi pi-check" onClick={() => this.eliminarNorma()} label="Si" />
                <Button icon="pi pi-times" onClick={() => this.setState({ display: false })} label="No" className="p-button-secondary" />
            </div>
        );
        return (
            <div className='p-grid'>
                <div className="p-col-12 p-lg-12">
                    <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                    {!this.state.editar &&
                        <div className="card card-w-title">
                            <h1>Normas de Laboratorio</h1>
                            <DataTable ref={(el) => this.dt = el} value={this.state.listNormas} selectionMode="single" header={header} paginator={true} rows={20}
                                responsive={true} selection={this.state.normaSeleccionada} onSelectionChange={event => this.setState({ normaSeleccionada: event.value })}>
                                <Column field="name" header="Nombre" sortable={true} filter={true} />
                                <Column field="type" header="Tipo" sortable={true} filter={true} style={{ width: '15%', textAlign: 'center' }} />
                                <Column field="state" header="Estado" sortable={true} filter={true} style={{ width: '15%', textAlign: 'center' }} />
                                <Column field="confirmationDate" header="Confirmación" sortable={true} style={{ width: '15%', textAlign: 'center' }} />
                                <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                            </DataTable>

                        </div>}
                    {this.state.editar && <div className="card card-w-title" >
                        <h1>Crear/Editar Normas</h1>
                        <Button icon='pi pi-arrow-left' onClick={() => this.setState({ editar: false })} />
                        <NormaLaboratorioForm norma={this.state.normaSeleccionada} _this={this} />

                    </div>}
                    <Dialog header="Confirmación" visible={this.state.display} modal={true} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => this.setState({ display: false })}>
                        <p>Está seguro de eliminar la norma <strong>{this.state.normaSeleccionada && this.state.normaSeleccionada.name} </strong>?</p>
                    </Dialog>
                </div>


            </div >
        )
    }
}

export default NormaLaboratorio
