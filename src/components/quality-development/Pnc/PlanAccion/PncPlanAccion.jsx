import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import history from '../../../../history';
import PncPlanAccionService from '../../../../service/Pnc/PncPlanAccionService';
import { determinarColorPNC } from '../../SolicitudEnsayo/ClasesUtilidades';
import PncFormPlanAccion from './PncFormPlanAccion';

class PncPlanAccion extends Component {

    constructor() {
        super();
        this.state = {
            idSalidaMaterial: 0,
            planes: [],
            mostrarFormPlanAccion: false,
            planSeleccionado: null,
            mostrarControles: false,
        }

        this.actionTemplate = this.actionTemplate.bind(this);
        this.eliminarPlan = this.eliminarPlan.bind(this);
        this.abrirDialogoPlanAccion = this.abrirDialogoPlanAccion.bind(this);
    }

    async componentDidMount() {
        const salidaMaterialId = this.props.idSalidaMaterial;
        const planesAccion = await PncPlanAccionService.listarPorSalidaMaterialId(salidaMaterialId);
        console.log(this.props);
        this.setState({
            idSalidaMaterial: salidaMaterialId, planes: planesAccion, mostrarControles: this.props.mostrarControles
        });
    }

    abrirDialogoPlanAccion(plan) {
        this.setState({ planSeleccionado: plan, mostrarFormPlanAccion: true });
    }

    async eliminarPlan(idPlan) {
        const data = await PncPlanAccionService.eliminar(this.state.idSalidaMaterial, idPlan);
        this.growl.show({ severity: 'success', detail: 'Plan de acción eliminado!' });
        this.refrescarPlanesAccion(data);
    }

    refrescarPlanesAccion(data) {
        this.setState({ planes: data });
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.abrirDialogoPlanAccion(rowData)}></Button>
            <Button type="button" icon="pi pi-trash" className="p-button-danger" style={{ marginLeft: '.5em' }} onClick={() => this.eliminarPlan(rowData.id)}></Button>
        </div>;
    }

    bodyTemplateEstado(rowData) {
        return <span className={determinarColorPNC(rowData.estado)}>{rowData.estadoTexto}</span>;
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            {this.state.mostrarControles &&
                <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => this.setState({ mostrarFormPlanAccion: true })} />
            }
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className='p-col-12 p-lg-12 caja' >DETALLE PLANES DE ACCIÓN</div>

                <DataTable value={this.state.planes} header={header}  >
                    <Column field="orden" header="Orden" style={{ width: '8%', textAlign: 'center' }} />
                    <Column field="fechaInicio" header="Fecha Inicio" style={{ width: '10%', textAlign: 'center' }} />
                    <Column field="fechaFin" header="Fecha Fin" style={{ width: '10%', textAlign: 'center' }} />
                    <Column field="responsableNombre" header="Responsable" style={{ width: '12%', textAlign: 'center' }} />
                    <Column field="descripcion" header="Plan de Acción" style={{ width: '45%', textAlign: 'center' }} />
                    {/* <Column body={this.bodyTemplateEstado} header="Estado" style={{ width: '15%', textAlign: 'center' }} /> */}
                    {this.state.mostrarControles &&
                        <Column body={this.actionTemplate} style={{ width: '7%', textAlign: 'center' }} />
                    }

                </DataTable>
                <PncFormPlanAccion mostrar={this.state.mostrarFormPlanAccion} salidaMaterialId={this.state.idSalidaMaterial} origen={this} />
            </div>
        )
    }
}

export default PncPlanAccion;