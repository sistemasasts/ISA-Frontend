import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../../../store/actions/modalWaitAction';
import { determinarColor, determinarColorVigencia } from '../../SolicitudEnsayo/ClasesUtilidades';
import * as _ from "lodash";
import SolicitudPruebasProcesoService from '../../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';
import { SeleccionUsuario } from '../../../compartido/seleccion-usuario';

class ReasignarResponsableCalidad extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
            seleccionSolicitud: []
        };
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.bodyTemplateVigencia = this.bodyTemplateVigencia.bind(this);
        this.refrescar = this.refrescar.bind(this);
        this.asignarResponsable = this.asignarResponsable.bind(this);
    }

    componentDidMount() {
        this.refrescar();
    }

    async refrescar() {
        const solicitudes_data = await SolicitudPruebasProcesoService.listarPorReasignarResponsable('CALIDAD');
        this.setState({ solicitudes: solicitudes_data });
    }

    asignarResponsable(idUser) {
        this.props.openModal();
        _.forEach(this.state.seleccionSolicitud, (x) => {
            this.enviarSolicitudes(x.id, idUser);
        })
        this.props.closeModal();
    }

    async enviarSolicitudes(idSolicitud, idUser) {
        await SolicitudPruebasProcesoService.reasignarResponsable(this.crearObjSolicitud(idSolicitud, idUser));
        this.refrescar();
    }


    crearObjSolicitud(idSolicitud, idUser) {
        return {
            id: idSolicitud,
            usuarioAsignado: idUser,
            orden: 'CALIDAD',
        }
    }

    bodyTemplateEstado(rowData) {
        const estado = _.startCase(rowData.estado);
        return <span className={determinarColor(rowData.estado)}>{estado}</span>;
    }

    bodyTemplateVigencia(rowData) {
        return <span className={determinarColorVigencia(rowData.vigencia)}>{rowData.vigencia}Día(s)</span>;
    }

    render() {

        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>ASIGNACIÓN SOLICITUD DESARROLLO DE PRODUCTOS</strong></h3>
                <SeleccionUsuario origen={this}></SeleccionUsuario>
                <DataTable style={{ marginTop: '5px' }} value={this.state.solicitudes} paginator={true} rows={15} responsive={true} scrollable={true}
                    selection={this.state.seleccionSolicitud} onSelectionChange={e => this.setState({ seleccionSolicitud: e.value })}>
                    <Column selectionMode="multiple" style={{ width: '3em' }} />
                    <Column field="codigo" header="Código" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field='usuarioGestionCalidad' header="Usuario Responsable" sortable style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="fechaSolicitud" header="Fecha Solicitud" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="fechaEntregaInforme" header="Entrega Informe" sortable={true} style={{ textAlign: 'center', width: '12em', color: 'red' }} />
                    <Column field="vigencia" body={this.bodyTemplateVigencia} header="Vigencia" sortable={true} style={{ textAlign: 'center', width: '8em' }} />
                    <Column field="lineaAplicacion" header="Aplicación" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="fechaEntrega" header="Fecha Entrega" sortable={true} style={{ textAlign: 'center', width: '11em' }} />
                    <Column field="motivo" header="Motivo" sortable={true} style={{ width: '15em' }} />
                    <Column field="nombreSolicitante" header="Solicitante" sortable={true} style={{ textAlign: 'center', width: '12em' }} />                    
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

export default connect(mapStateToProps, mapDispatchToProps)(ReasignarResponsableCalidad);