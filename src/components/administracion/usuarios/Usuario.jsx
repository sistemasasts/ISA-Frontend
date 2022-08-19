import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

class Usuario extends Component {
    static propTypes = {
        prop: PropTypes
    }

    render() {
        let actionHeader = <Button type="button" icon="pi pi-cog" />;
        return (
            <div className='p-grid'>
                <div className="p-col-12 p-lg-12">

                    <div className="card card-w-title">
                        <h1>Usuarios</h1>
                        <DataTable ref={(el) => this.dt = el} value={this.state.listProveedor} selectionMode="single" header="Lista de usuarios" paginator={true} rows={20}
                            responsive={true} selection={this.state.dataTableSelection1} onSelectionChange={event => this.setState({ dataTableSelection1: event.value })}>
                            <Column field="idProvider" header="Código" sortable={true} filter={true} />
                            <Column field="nameProvider" header="Nombre Proveedor" sortable={true} filter={true} style={{ width: '30%' }} />
                            <Column field="sapProviderCode" header="Código SAP" sortable={true} filter={true} />
                            <Column field="typeProvider" header="Tipo" sortable={true} filter={true} />
                            <Column field="descProvider" header="Descripción" sortable={true} filter={true} />
                            <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                        </DataTable>

                    </div>
                </div>


            </div >
        )
    }
}

export default Usuario