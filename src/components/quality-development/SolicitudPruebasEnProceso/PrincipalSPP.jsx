import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../../history';

import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import "../../site.css";
import { determinarColor, determinarColorActivo, determinarColorTipoAprobacion } from '../SolicitudEnsayo/ClasesUtilidades';
import * as _ from "lodash";
import SolicitudPruebasProcesoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';

var that;
class PrincipalSPP extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
        };
        that = this;
        this.actionTemplate = this.actionTemplate.bind(this);
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    async componentDidMount() {
        const solicitudes_data = await SolicitudPruebasProcesoService.listarTodos();
        console.log(solicitudes_data);
        this.setState({ solicitudes: solicitudes_data });
    }

    redirigirSolicitudEdicion(idSolcicitud) {
        history.push(`/quality-development_solicitudpp_edit/${idSolcicitud}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => that.redirigirSolicitudEdicion(rowData.id)}></Button>
        </div>;
    }

    bodyTemplateEstado(rowData) {
        const estado = _.startCase(rowData.estado);
        return <span className={determinarColor(rowData.estado)}>{estado}</span>;
    }

    bodyTemplateActivo(rowData) {
        if (rowData.tipoAprobacion === null)
            return '';
        else
            return <span className={determinarColorActivo(rowData.aprobado)}>{rowData.aprobadoTexto}</span>;
    }

    bodyTemplateTipoAprobacion(rowData) {
        if (rowData.tipoAprobacion === null)
            return '';
        if (rowData.tipoAprobacion)
            return <span className={determinarColorTipoAprobacion(rowData.tipoAprobacionTexto)}>{rowData.tipoAprobacionTexto}</span>;

    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => history.push("/quality-development_solicitudpp_new")} />
        </div>;
        //const statusFilter = this.renderStatusFilter();
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>INGRESO SOLICITUD DE PRUEBAS EN PROCESO</strong></h3>

                <DataTable value={this.state.solicitudes} paginator={true} rows={15} header={header} responsive={true} scrollable={true}
                    selectionMode="single" selection={this.state.selectedConfiguracion} onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                    onRowSelect={this.onCarSelect} >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '4em' }} />
                    <Column field="codigo" header="Código" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="fechaSolicitud" header="Fecha Solicitud" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="lineaAplicacion" header="Aplicación" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="fechaEntrega" header="Fecha Entrega" sortable={true} style={{ textAlign: 'center', width: '11em' }} />
                    <Column field="motivo" header="Motivo" style={{ width: '20em' }} />
                    <Column field='estado' body={this.bodyTemplateEstado} header="Estado" sortable style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="aprobadoTexto" body={this.bodyTemplateActivo} header="Aprobado" sortable style={{ width: '6em', textAlign: 'center' }} />
                    <Column field="tipoAprobacionTexto" body={this.bodyTemplateTipoAprobacion} header="Tipo Aprobación" sortable style={{ textAlign: 'center', width: '15em' }} />
                </DataTable>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        openModal: () => dispatch(openModal()),
        closeModal: () => dispatch(closeModal()) // will be wrapped into a dispatch call
    }

};


const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalSPP);