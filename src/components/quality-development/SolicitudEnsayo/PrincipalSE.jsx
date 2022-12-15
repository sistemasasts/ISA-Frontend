import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../../history';

import SolicitudEnsayoService from '../../../service/SolicitudEnsayo/SolicitudEnsayoService';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import "../../site.css";
import { determinarColor, determinarColorTipoAprobacion } from './ClasesUtilidades';
import * as _ from "lodash";

var that;
class PrincipalSE extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
        };
        that = this;
        this.actionTemplate = this.actionTemplate.bind(this);
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.bodyTemplateTipoAprobacion = this.bodyTemplateTipoAprobacion.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    async componentDidMount() {
        const solicitudes_data = await SolicitudEnsayoService.listarTodos();
        this.setState({ solicitudes: solicitudes_data });
    }

    redirigirSolicitudEdicion(solicitud) {
        if (_.isEqual(solicitud.estado, 'FINALIZADO'))
            history.push(`/quality-development_solicitudse_planesaccion/${solicitud.id}`);
        else
            history.push(`/quality-development_solicitudse_edit/${solicitud.id}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => that.redirigirSolicitudEdicion(rowData)}></Button>
        </div>;
    }

    bodyTemplateEstado(rowData) {
        const estado = _.startCase(rowData.estado);
        return <span className={determinarColor(rowData.estado)}>{estado}</span>;
    }

    bodyTemplateTipoAprobacion(rowData) {
        return <span className={determinarColorTipoAprobacion(rowData.tipoAprobacionTexto)}>{rowData.tipoAprobacionTexto}</span>;
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => history.push("/quality-development_solicitudse_new")} />
        </div>;
        //const statusFilter = this.renderStatusFilter();
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>INGRESO SOLICITUD DE ENSAYOS</strong></h3>

                <DataTable value={this.state.solicitudes} paginator={true} rows={15} header={header} responsive={true}
                    selectionMode="single" selection={this.state.selectedConfiguracion} onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                    onRowSelect={this.onCarSelect}>
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '5em' }} />
                    <Column field="codigo" header="Código" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="fechaSolicitud" header="Fecha Solicitud" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="proveedorNombre" header="Proveedor" sortable={true} />
                    <Column field="fechaEntrega" header="Fecha Entrega" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="detalleMaterial" header="Material" sortable={true} />
                    <Column field="tipoAprobacion" body={this.bodyTemplateTipoAprobacion} header="Aprobación" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field='estado' body={this.bodyTemplateEstado} header="Estado" sortable style={{ textAlign: 'center', width: '12em' }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalSE);
