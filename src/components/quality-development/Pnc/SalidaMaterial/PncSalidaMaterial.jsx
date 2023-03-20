import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import history from '../../../../history';
import PncSalidaMaterialService from '../../../../service/Pnc/PncSalidaMaterialService';
import { determinarColorPNC } from '../../SolicitudEnsayo/ClasesUtilidades';

class PncSalidaMaterial extends Component {

    constructor() {
        super();
        this.state = {
            idPnc: 0,
            salidas: [],
            mostrarForm: false,
            salidaSeleccionado: null,
            unidadesCatalogo: []
        }
    }

    async componentDidMount() {
        const pnc = this.props.idPnc;
        const salidasMaterial = await PncSalidaMaterialService.listarPorPncId(pnc);
        console.log(this.props);
        this.setState({
            idPnc: pnc, salidas: salidasMaterial
        });
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => history.push(`/quality-development_pnc_salida_material_edit/${rowData.idPnc}/${rowData.id}`)}></Button>
        </div>
    }

    bodyTemplateEstado(rowData) {
        return <span className={determinarColorPNC(rowData.estado)}>{rowData.estadoTexto}</span>;
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => history.push(`/quality-development_pnc_salida_material_nuevo/${this.state.idPnc}`)} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className='p-col-12 p-lg-12 caja' >DETALLE SALIDAS DE MATERIAL</div>

                <DataTable value={this.state.salidas} header={header}>
                    <Column body={this.actionTemplate} style={{ width: '7%', textAlign: 'center' }} />
                    <Column field="fecha" header="Fecha" style={{ width: '10%', textAlign: 'center' }} sortable />
                    <Column field="cantidad" header="Cantidad" style={{ width: '10%', textAlign: 'right' }} sortable />
                    <Column field="destino" header="Tipo Salida" style={{ width: '20%', textAlign: 'center' }} sortable />
                    <Column body={this.bodyTemplateEstado} header="Estado" style={{ width: '15%', textAlign: 'center' }} sortable />
                    <Column field="observacion" header="Descripción" style={{ width: '45%', textAlign: 'center' }} sortable />

                </DataTable>
            </div>
        )
    }
}

export default PncSalidaMaterial;