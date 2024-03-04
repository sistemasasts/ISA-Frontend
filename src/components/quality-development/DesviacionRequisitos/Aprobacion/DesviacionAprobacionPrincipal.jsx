import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import history from '../../../../history';
import { InputText } from 'primereact/inputtext';
import DesviacionRequisitoService from '../../../../service/DesviacionRequisitos/DesviacionRequisitoService';

class DesviacionAprobacionPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    async componentDidMount() {
        const solicitudes_data = await DesviacionRequisitoService.listarPorEstado("PENDIENTE_APROBACION");
        console.log(solicitudes_data)
        this.setState({ solicitudes: solicitudes_data });
    }

    redirigirSolicitudEdicion(idSalidaMaterial) {
        history.push(`/quality-development_pnc_desviacion_req_view/${idSalidaMaterial}/aprobacion`);
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
                <h3><strong>DESVIACIÓN REQUISITOS APROBACIÓN</strong></h3>

                <DataTable value={this.state.solicitudes} paginator={true} header={header} rows={15} responsive={true} scrollable={true}
                    selectionMode="single" onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                    globalFilter={this.state.globalFilter}
                >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '4em' }} />
                    <Column field={"secuencial"} header={"PNC.04"} style={{ width: '7em', textAlign: 'center' }} />
                    <Column field={"productTypeText"} header={"Origen"} style={{ width: '15em', textAlign: 'center' }} />
                    <Column field={"fechaCreacion"} header={"Fecha"} style={{ width: '10em', textAlign: 'center' }} />
                    <Column field={"productoNombre"} header={"Material"} style={{ width: '30em', textAlign: 'center' }} />
                    <Column field={"seguimiento"} header={"Resp. seguimiento"} style={{ width: '30em', textAlign: 'center' }} />
                    <Column field={"afectacionText"} header={"Línea afectada"} style={{ width: '15em', textAlign: 'center' }} />
                    <Column field={"motivo"} header={"Motivo de la desviación"} style={{ width: '30em', textAlign: 'center' }} />
                    <Column field={"descripcion"} header={"Descripción de la desviación"} style={{ width: '30em', textAlign: 'center' }} />
                    <Column field={"control"} header={"Controles requeridos"} style={{ width: '20em', textAlign: 'center' }} />
                    <Column field={"alcance"} header={"Alcance y tiempo de la desviación"} style={{ width: '20em', textAlign: 'center' }} />
                </DataTable>
            </div>
        )
    }
}

export default DesviacionAprobacionPrincipal;