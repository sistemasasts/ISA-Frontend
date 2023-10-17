import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import history from '../../../../history';
import PncSalidaMaterialService from '../../../../service/Pnc/PncSalidaMaterialService';
import PncService from '../../../../service/Pnc/PncService';
import { determinarColorPNC } from '../../SolicitudEnsayo/ClasesUtilidades';
import * as _ from "lodash";
import { Dropdown } from 'primereact/dropdown';

class PncSalidaMaterial extends Component {

    constructor() {
        super();
        this.state = {
            idPnc: 0,
            salidas: [],
            mostrarForm: false,
            salidaSeleccionado: null,
            unidadesCatalogo: [],
            saldo: null,
            estadoSeleccionado: null,
            mostrarControles: true,

            estadosCatalodo: []
        }
        this.onEstadoChange = this.onEstadoChange.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);

    }

    async componentDidMount() {
        const pnc = this.props.idPnc;
        const salidasMaterial = await PncSalidaMaterialService.listarPorPncId(pnc);
        const saldo = await PncService.consultarSaldo(this.props.idPnc);
        const estados = await PncSalidaMaterialService.listarEstados();
        console.log(salidasMaterial);
        this.setState({
            idPnc: pnc, salidas: salidasMaterial, saldo: saldo, estadosCatalodo: estados, mostrarControles: this.props.mostrarControles
        });
    }

    async eliminar(id) {
        const salidasN = await PncSalidaMaterialService.eliminar(this.state.idPnc, id);
        this.growl.show({ severity: 'success', detail: 'Salida de Material Eliminada!' });
        this.setState({ salidas: salidasN })
    }

    onEstadoChange(event) {
        this.dt.filter(event.value, 'estado', 'equals');
        this.setState({ estadoSeleccionado: event.value });
    }

    actionTemplate(rowData, column) {
        return <div>
            {this.state.mostrarControles &&
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => history.push(`/quality-development_pnc_salida_material_edit/${rowData.idPnc}/${rowData.id}`)}></Button>}
            {rowData.estado === 'CREADO' &&
                <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => this.eliminar(rowData.id)}></Button>
            }
        </div>
    }

    bodyTemplateEstado(rowData) {
        return <span className={determinarColorPNC(rowData.estado)}>{rowData.estadoTexto}</span>;
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            {this.state.mostrarControles &&
                <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => history.push(`/quality-development_pnc_salida_material_nuevo/${this.state.idPnc}`)} />}
        </div>;
        const brandFilter = <Dropdown appendTo={document.body} style={{ width: '100%' }} placeholder="Selecione..." value={this.state.estadoSeleccionado} options={this.state.estadosCatalodo} onChange={this.onEstadoChange} showClear />;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className='p-col-12 p-lg-12 caja' >DETALLE SALIDAS DE MATERIAL</div>
                <div className='p-col-12 p-lg-12' style={{ textAlign: 'center' }} >
                    <span className='customer-badge-danger' style={{ fontSize: '15px' }}> STOCK: {this.state.saldo}</span>
                </div>
                <DataTable ref={(el) => this.dt = el} value={this.state.salidas} header={header}>
                    <Column body={this.actionTemplate} style={{ width: '7%', textAlign: 'center' }} />
                    <Column field="fecha" header="Fecha" style={{ width: '10%', textAlign: 'center' }} sortable />
                    <Column field="cantidad" header="Cantidad" style={{ width: '10%', textAlign: 'right' }} sortable />
                    <Column field="destinoDescripcion" header="Tipo Salida" style={{ width: '20%', textAlign: 'center' }} sortable />
                    <Column field="estado" filterField="estado" body={this.bodyTemplateEstado} header="Estado" style={{ width: '15%', textAlign: 'center' }} filter={true} filterElement={brandFilter} />
                    <Column field="observacion" header="Descripción" style={{ width: '45%', textAlign: 'center' }} sortable />

                </DataTable>
            </div>
        )
    }
}

export default PncSalidaMaterial;