import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import * as _ from "lodash";
import PncPlanAccionService from '../../../../../service/Pnc/PncPlanAccionService';
import history from '../../../../../history';

class PncPAValidarPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    async componentDidMount() {
        const solicitudes_data = await PncPlanAccionService.listarPorEstado("PENDIENTE_REVISION");
        this.setState({ solicitudes: solicitudes_data });
    }

    redirigirSolicitudEdicion(idSalidaMaterial, id) {
        history.push(`/quality-development_pnc_validarTarea_ver/${idSalidaMaterial}/${id}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => this.redirigirSolicitudEdicion(rowData.salidaMaterialId, rowData.id)}></Button>
        </div>;
    }


    render() {

        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>VALIDACIÓN TAREAS COMPLETADAS PRODUCTO NO CONFORME</strong></h3>

                <DataTable value={this.state.solicitudes} paginator={true} rows={15} responsive={true} scrollable={true}
                    selectionMode="single" onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                    emptyMessage="No existen tareas pendientes por procesar"
                >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '4em' }} />
                    <Column field="numeroPnc" header="PNC #" style={{ textAlign: 'center', width: '10em' }} sortable={true} filter={true} />
                    <Column field="fechaInicio" header="Fecha Inicio" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="fechaFin" header="Fecha Fin" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="nombreProducto" header="Producto" style={{ width: '20em', textAlign: 'center' }} sortable={true} filter={true} />
                    <Column field="cantidad" header="Cantidad" style={{ width: '9em', textAlign: 'right' }} sortable={true} />
                    <Column field="unidad" header="Unidad" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="destino" header="Tipo Destino" style={{ width: '10em', textAlign: 'center' }} sortable={true} />
                    <Column field="responsableNombre" header="Responsable" style={{ width: '15em', textAlign: 'center' }} />
                    <Column field="descripcion" header="Descripción" style={{ width: '50em', textAlign: 'center' }} />
                </DataTable>
            </div>
        )
    }
}

export default PncPAValidarPrincipal;