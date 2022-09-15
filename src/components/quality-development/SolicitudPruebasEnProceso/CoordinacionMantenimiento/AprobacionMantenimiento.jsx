import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../../../store/actions/modalWaitAction';
import { determinarColor } from '../../SolicitudEnsayo/ClasesUtilidades';
import * as _ from "lodash";
import SolicitudPruebasProcesoService from '../../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';
import { Button } from 'primereact/button';
import history from '../../../../history';

class AprobacionMantenimiento extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
            seleccionSolicitud: []
        };
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.refrescar = this.refrescar.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
    }

    componentDidMount() {
        this.refrescar();
    }

    async refrescar() {
        const solicitudes_data = await SolicitudPruebasProcesoService.listarPorAprobar('MANTENIMIENTO');
        this.setState({ solicitudes: solicitudes_data });
    }

    redirigirSolicitudEdicion(idSolcicitud) {
        history.push(`/quality-development_solicitudpp_mantenimiento_aprobar_ver/${idSolcicitud}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => this.redirigirSolicitudEdicion(rowData.id)}></Button>
        </div>;
    }

    bodyTemplateEstado(rowData) {
        const estado = _.startCase(rowData.estado);
        return <span className={determinarColor(rowData.estado)}>{estado}</span>;
    }

    render() {
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>APROBACIÓN SOLICITUD MANTENIMIENTO</strong></h3>
                <DataTable style={{ marginTop: '5px' }} value={this.state.solicitudes} paginator={true} rows={15} responsive={true}
                    selection={this.state.seleccionSolicitud} onSelectionChange={e => this.setState({ seleccionSolicitud: e.value })}>
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '4em' }} />
                    <Column field="codigo" header="Código" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="fechaSolicitud" header="Fecha Solicitud" sortable={true} />
                    <Column field="lineaAplicacion" header="Aplicación" sortable={true} style={{ textAlign: 'center', width: '15em' }} />
                    <Column field="fechaEntrega" header="Fecha Entrega" sortable={true} />
                    <Column field="motivo" header="Motivo" sortable={true} />
                    <Column field="nombreSolicitante" header="Solicitante" sortable={true} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AprobacionMantenimiento);