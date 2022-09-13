import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { closeModal, openModal } from '../../../../store/actions/modalWaitAction';
import { determinarColor } from '../../SolicitudEnsayo/ClasesUtilidades';
import * as _ from "lodash";
import SolicitudPruebasProcesoService from '../../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';
import { SeleccionUsuario } from '../../../compartido/seleccion-usuario';

class AsignarResponsableMantenimiento extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
            seleccionSolicitud: []
        };
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.refrescar = this.refrescar.bind(this);
        this.asignarResponsable = this.asignarResponsable.bind(this);
    }

    componentDidMount() {
        this.refrescar();
    }

    async refrescar() {
        const solicitudes_data = await SolicitudPruebasProcesoService.listarPorAsignarResponsableCM('MANTENIMIENTO');
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
        await SolicitudPruebasProcesoService.asignarResponsable(this.crearObjSolicitud(idSolicitud, idUser));
        this.refrescar();
    }


    crearObjSolicitud(idSolicitud, idUser) {
        return {
            id: idSolicitud,
            usuarioAsignado: idUser,
            orden: 'MANTENIMIENTO',
        }
    }

    bodyTemplateEstado(rowData) {
        const estado = _.startCase(rowData.estado);
        return <span className={determinarColor(rowData.estado)}>{estado}</span>;
    }

    render() {

        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>ASIGNACIÓN SOLICITUD MANTENIMIENTO</strong></h3>
                <SeleccionUsuario origen={this}></SeleccionUsuario>
                <DataTable style={{ marginTop: '5px' }} value={this.state.solicitudes} paginator={true} rows={15} responsive={true}
                    selection={this.state.seleccionSolicitud} onSelectionChange={e => this.setState({ seleccionSolicitud: e.value })}>
                    <Column selectionMode="multiple" style={{ width: '3em' }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AsignarResponsableMantenimiento);