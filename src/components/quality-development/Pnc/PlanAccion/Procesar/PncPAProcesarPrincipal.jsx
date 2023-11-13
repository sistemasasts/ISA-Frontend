import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import * as _ from "lodash";
import PncPlanAccionService from '../../../../../service/Pnc/PncPlanAccionService';
import history from '../../../../../history';
import { InputText } from 'primereact/inputtext';

class PncPAProcesarPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
            globalFilter: null
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    async componentDidMount() {
        const solicitudes_data = await PncPlanAccionService.listarPorEstado("ASIGNADO");
        this.setState({ solicitudes: solicitudes_data });
    }

    redirigirSolicitudEdicion(idSalidaMaterial, id) {
        history.push(`/quality-development_pnc_procesarTarea_ver/${idSalidaMaterial}/${id}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => this.redirigirSolicitudEdicion(rowData.salidaMaterialId, rowData.id)}></Button>
        </div>;
    }


    render() {
        let header = (
            <div style={{'textAlign':'right'}}>
                <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Búsqueda General" size="50"/>
            </div>
        );

        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>PROCESAR TAREAS ASIGNADAS PRODUCTO NO CONFORME</strong></h3>

                <DataTable value={this.state.solicitudes} paginator={true} header={header} rows={15} responsive={true} scrollable={true}
                    selectionMode="single" onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                    globalFilter={this.state.globalFilter}
                    emptyMessage="No existen tareas pendientes por procesar"
                >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '4em' }} />
                    <Column field="numeroPnc" header="PNC #" style={{ textAlign: 'center', width: '10em' }} sortable={true} />
                    <Column field="lote" header="Lote" style={{ textAlign: 'center', width: '10em' }} sortable={true} />
                    <Column field="fechaInicio" header="Fecha Inicio" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="fechaFin" header="Fecha Fin" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="nombreProducto" header="Producto" style={{ width: '20em', textAlign: 'center' }} sortable={true} />
                    <Column field="cantidad" header="Cantidad" style={{ width: '9em', textAlign: 'right' }} sortable={true} />
                    <Column field="unidad" header="Unidad" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="destino" header="Tipo Destino" style={{ width: '10em', textAlign: 'center' }} sortable={true} />
                    <Column field="descripcion" header="Descripción" style={{ width: '50em', textAlign: 'center' }} />
                </DataTable>
            </div>
        )
    }
}

export default PncPAProcesarPrincipal;