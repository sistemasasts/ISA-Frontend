import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import history from '../../../../history';
import * as _ from "lodash";

import { InputText } from 'primereact/inputtext';
import ReclamoMPService from '../../../../service/ReclamoMPService';

class ReclamoAprobacionPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
            orden: null,
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    async componentDidMount() {
        const estado = this.props.match.params.estado;
        const estadoConsulta = estado === 'calidad' ? 'PENDIENTE_APROBACION_CALIDAD' : 'PENDIENTE_APROBACION_COMPRAS';
        const solicitudes_data = await ReclamoMPService.listarAsignadasPorEstado(estadoConsulta);
        console.log(solicitudes_data)
        this.setState({ solicitudes: solicitudes_data, orden: estado });
    }

    redirigirSolicitudEdicion(idSalidaMaterial) {
        history.push(`/quality-development_complaint_aprobacion_ver/${idSalidaMaterial}/${this.state.orden}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => this.redirigirSolicitudEdicion(rowData.id)}></Button>
        </div>;
    }


    render() {
        let header = (
            <div style={{ 'textAlign': 'right' }}>
                <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Búsqueda General" size="50" />
            </div>
        );

        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>RECLAMOS DE MATERIA PRIMA APROBACIÓN</strong></h3>

                <DataTable value={this.state.solicitudes} paginator={true} header={header} rows={15} responsive={true} scrollable={true}
                    selectionMode="single" onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                    globalFilter={this.state.globalFilter}
                >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '4em' }} />
                    <Column field="number" header="Reclamo #" style={{ textAlign: 'center', width: '10em' }} sortable={true} />
                    <Column field="dateComplaint" header="Fecha" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="nombreProducto" header="Producto" style={{ width: '20em', textAlign: 'center' }} sortable={true} />
                    <Column field="nombreProveedor" header="Proveedor" style={{ width: '20em', textAlign: 'center' }} sortable={true} />
                    <Column field="totalAmount" header="Cantidad Toal" style={{ width: '9em', textAlign: 'right' }} sortable={true} />
                    <Column field="affectedAmount" header="Cantidad Afectada" style={{ width: '9em', textAlign: 'right' }} sortable={true} />
                    <Column field="place" header="Lugar" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="solicitante" header="Solicitante" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                </DataTable>
            </div>
        )
    }
}

export default ReclamoAprobacionPrincipal;