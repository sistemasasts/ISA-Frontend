import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DataView } from 'primereact/dataview';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import * as _ from "lodash";
import SolicitudDocumentoService from '../../../service/SolicitudEnsayo/SolicitudDocumentoService';
import { Button } from 'primereact/button';
import "../../site.css";
import SolicitudPruebaProcesoDocumentoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebaProcesoDocumentoService';
import PncDocumentoService from '../../../service/Pnc/PncDocumentoService';
import DesviacionRequsitoDocumentoService from '../../../service/DesviacionRequisitos/DesviacionDocumentoService';
class Adjuntos extends Component {

    constructor() {
        super();
        this.state = {
            archivos: [],
        };
        this.myUploader = this.myUploader.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.eliminar = this.eliminar.bind(this);
        this.descargar = this.descargar.bind(this);
    }

    async componentDidMount() {
        this.refrescar()
    }

    async myUploader(event) {
        this.props.openModal();
        if (this.props.tipo === 'SOLICITUD_ENSAYO')
            await SolicitudDocumentoService.subirArchivo(this.crearSolicitudDocumento(event.files[0]));
        if (this.props.tipo === 'SOLICITUD_PRUEBAS_PROCESO')
            await SolicitudPruebaProcesoDocumentoService.subirArchivo(this.crearSolicitudDocumento(event.files[0]));
        if (this.props.tipo === 'SALIDA_MATERIAL')
            await PncDocumentoService.subirArchivo(this.crearSolicitudDocumentoPnc(event.files[0]));
        if (this.props.tipo === 'PNC')
            await PncDocumentoService.subirArchivoPnc(this.crearSolicitudDocumentoPnc(event.files[0]));
        if (this.props.tipo === 'DESVIACION_REQUISITO')
            await DesviacionRequsitoDocumentoService.subirArchivo(this.crearSolicitudDocumentoDesviacion(event.files[0]));
        this.refrescar();
        this.fileUploadRef.clear();
        this.props.closeModal();
    }

    async refrescar() {
        if (this.props.solicitud) {
            console.log(this.props)
            let archivosData;
            if (this.props.tipo === 'SOLICITUD_ENSAYO')
                archivosData = await SolicitudDocumentoService.listarArchivos(this.props.estado, this.props.orden, this.props.solicitud);
            if (this.props.tipo === 'SOLICITUD_PRUEBAS_PROCESO')
                archivosData = await SolicitudPruebaProcesoDocumentoService.listarArchivos(this.props.estado, this.props.orden, this.props.solicitud);
            if (this.props.tipo === 'SALIDA_MATERIAL') {
                if (this.props.planAccionId && this.props.planAccionId > 0) {
                    archivosData = await PncDocumentoService.listarArchivosPlanesAccion(this.props.orden, this.props.solicitud, this.props.planAccionId);
                } else {
                    archivosData = await PncDocumentoService.listarArchivos(this.props.estado, this.props.orden, this.props.solicitud);
                }
            }
            if (this.props.tipo === 'PNC') {
                archivosData = await PncDocumentoService.listarArchivosPnc(this.props.solicitud);
            }
            if (this.props.tipo === 'DESVIACION_REQUISITO') {
                archivosData = await DesviacionRequsitoDocumentoService.listarArchivos(this.props.orden, this.props.solicitud);
            }
            this.setState({ archivos: archivosData });
        }
    }

    crearSolicitudDocumento(archivo) {
        let infoAdicional = {};
        let formadata = new FormData();
        if (this.props.tipo === 'SOLICITUD_ENSAYO')
            infoAdicional.orden = this.props.orden;
        if (this.props.tipo === 'SOLICITUD_PRUEBAS_PROCESO')
            infoAdicional.ordenPP = this.props.orden;
        infoAdicional.idSolicitud = this.props.solicitud;
        formadata.append('file', archivo);
        formadata.append('info', JSON.stringify(infoAdicional));
        return formadata;
    }

    crearSolicitudDocumentoPnc(archivo) {
        let infoAdicional = {};
        let formadata = new FormData();
        infoAdicional.salidaMaterialId = this.props.solicitud;
        infoAdicional.productoNoConformeId = this.props.solicitud;
        infoAdicional.orden = this.props.orden;
        infoAdicional.planAccionId = this.props.planAccionId;

        formadata.append('file', archivo);
        formadata.append('info', JSON.stringify(infoAdicional));
        return formadata;
    }

    crearSolicitudDocumentoDesviacion(archivo) {
        let infoAdicional = {};
        let formadata = new FormData();
        infoAdicional.solicitudId = this.props.solicitud;
        infoAdicional.orden = this.props.orden;
        formadata.append('file', archivo);
        formadata.append('info', JSON.stringify(infoAdicional));
        return formadata;
    }

    async eliminar(id) {
        this.props.openModal();
        var a = false;
        if (this.props.tipo === 'SOLICITUD_ENSAYO')
            a = await SolicitudDocumentoService.eliminar(id);
        if (this.props.tipo === 'SOLICITUD_PRUEBAS_PROCESO')
            a = await SolicitudPruebaProcesoDocumentoService.eliminar(id);
        if (this.props.tipo === 'SALIDA_MATERIAL' || this.props.tipo === 'PNC')
            a = await PncDocumentoService.eliminar(id);
        if (this.props.tipo === 'DESVIACION_REQUISITO')
            a = await DesviacionRequsitoDocumentoService.eliminar(id);
        this.props.closeModal();
        if (a) {
            this.refrescar();
        } else {

        }
    }

    async descargar(id, nombre) {
        this.props.openModal();
        var data;
        if (this.props.tipo === 'SOLICITUD_ENSAYO')
            data = await SolicitudDocumentoService.ver(id);
        if (this.props.tipo === 'SOLICITUD_PRUEBAS_PROCESO')
            data = await SolicitudPruebaProcesoDocumentoService.ver(id);
        if (this.props.tipo === 'SALIDA_MATERIAL' || this.props.tipo === 'PNC')
            data = await PncDocumentoService.ver(id);
        if (this.props.tipo === 'DESVIACION_REQUISITO')
            data = await DesviacionRequsitoDocumentoService.ver(id);
        this.props.closeModal();
        const ap = window.URL.createObjectURL(data)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = ap;
        a.download = `${nombre}`;
        a.click();
    }

    itemTemplate(archivo) {
        return (
            <div className="p-col-12 p-md-3">
                {archivo.nombreArchivo}
                <div style={{ float: 'right' }}>
                    <span className='boton-archivo pi pi-download' onClick={() => this.descargar(archivo.id, archivo.nombreArchivo)} ></span>
                    {this.puedeDescargar(archivo) &&
                        < span className='boton-archivo pi pi-times' onClick={() => this.eliminar(archivo.id)} ></span>
                    }
                </div>
            </div >
        );
    }

    puedeDescargar(archivo) {
        switch (this.props.tipo) {
            case 'SALIDA_MATERIAL':
                if (this.props.planAccionId && this.props.planAccionId > 0)
                    return this.props.controles && archivo.estadoPlanAccion === this.props.estado
                else
                    return this.props.controles && archivo.estado === this.props.estado;
            case 'PNC':
                return this.props.controles;
            case 'DESVIACION_REQUISITO':
                return this.props.controles;
            default:
                return this.props.controles && archivo.estado === this.props.estado;
        }
    }

    render() {
        return (
            <div>
                {this.props.solicitud &&
                    <div>
                        <h2 style={{ marginTop: '1px' }}>Archivos Adjuntos</h2>
                        {this.props.controles &&
                            <Toolbar>
                                <div className="p-toolbar-group-left">
                                    <FileUpload ref={(el) => this.fileUploadRef = el} mode="basic" customUpload={true} chooseLabel="Seleccione" uploadHandler={this.myUploader} auto={true} />
                                </div>
                            </Toolbar>
                        }
                        <DataView emptyMessage="" value={this.state.archivos} itemTemplate={this.itemTemplate}></DataView>
                    </div>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(Adjuntos);