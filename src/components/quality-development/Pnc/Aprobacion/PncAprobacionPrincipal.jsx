import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import history from '../../../../history';
import * as _ from "lodash";
import * as moment from 'moment';
import PncSalidaMaterialService from '../../../../service/Pnc/PncSalidaMaterialService';
import { InputText } from 'primereact/inputtext';

class PncAprobacionPrincipal extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
        };
        this.actionTemplate = this.actionTemplate.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    async componentDidMount() {
        const solicitudes_data = await PncSalidaMaterialService.listarPorEstado("PENDIENTE_APROBACION");
        console.log(solicitudes_data)
        this.setState({ solicitudes: solicitudes_data });
    }

    redirigirSolicitudEdicion(idSalidaMaterial) {
        history.push(`/quality-development_pnc_salida_material_aprobacion_ver/${idSalidaMaterial}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => this.redirigirSolicitudEdicion(rowData.id)}></Button>
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
                <h3><strong>PRODUCTO NO CONFORME SALIDA DE MATERIAL APROBACIÓN</strong></h3>

                <DataTable value={this.state.solicitudes} paginator={true}  header={header} rows={15} responsive={true} scrollable={true}
                    selectionMode="single" onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                    globalFilter={this.state.globalFilter}
                >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '4em' }} />
                    <Column field="numero" header="PNC #" style={{ textAlign: 'center', width: '10em' }} sortable={true} />
                    <Column field="fechaCreacion2" header="Fecha PNC" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="producto" header="Producto" style={{ width: '20em', textAlign: 'center' }} sortable={true}/>
                    <Column field="saldoPnc" header="Cantidad No Conforme" style={{ width: '9em', textAlign: 'right' }} sortable={true} />
                    <Column field="cantidad" header="Cantidad a Salir" style={{ width: '9em', textAlign: 'right' }} sortable={true} />
                    <Column field="unidad" header="Unidad" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="destinoDescripcion" header="Tipo Destino" style={{ width: '10em', textAlign: 'center' }} sortable={true} />
                    <Column field="lote" header="Lote" style={{ width: '10em', textAlign: 'center' }} />
                    <Column field="solicitante" header="Solicitante" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                </DataTable>
            </div>
        )
    }
}

export default PncAprobacionPrincipal;