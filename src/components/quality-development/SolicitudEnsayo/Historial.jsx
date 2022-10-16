import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Fieldset } from 'primereact/fieldset';
import { DataView } from 'primereact/dataview';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import SolicitudHistorialService from '../../../service/SolicitudEnsayo/SolicitudHistorialService';
import SolicitudPruebaProcesoHistorialService from '../../../service/SolicitudPruebaProceso/SolicitudPruebaProcesoHistorialService';
import SolicitudDocumentoService from '../../../service/SolicitudEnsayo/SolicitudDocumentoService';
import * as moment from 'moment';
import "../../site.css";
import SolicitudPruebaProcesoDocumentoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebaProcesoDocumentoService';
import { TabPanel, TabView } from 'primereact/tabview';
import { Accordion, AccordionTab } from 'primereact/accordion';

class Historial extends Component {

    constructor() {
        super();
        this.state = {
            panelCollapsed: true,
            historial: [],
            historialCompleto: [],
        };
        this.itemTemplate = this.itemTemplate.bind(this);
        this.descargarDocumentos = this.descargarDocumentos.bind(this);
    }

    async componentDidMount() {
        let historialData;
        let historialComletoData;
        if (this.props.tipo === 'SOLICITUD_ENSAYO'){
            historialData = await SolicitudHistorialService.listarPorIdSolicitud(this.props.solicitud);
            historialComletoData = [];
        }            
        if (this.props.tipo === 'SOLICITUD_PRUEBAS_PROCESO') {
            historialData = await SolicitudPruebaProcesoHistorialService.listarPorIdSolicitud(this.props.solicitud);
            historialComletoData = await SolicitudPruebaProcesoHistorialService.listarCompletoPorIdSolicitud(this.props.solicitud);
            console.log(historialComletoData);
        }
        this.setState({ historial: historialData, historialCompleto: historialComletoData });
    }

    async descargarDocumentos(historial) {
        if (historial) {
            this.props.openModal();
            var data;
            if (this.props.tipo === 'SOLICITUD_ENSAYO')
                data = await SolicitudDocumentoService.descargarComprimido(historial.id);
            if (this.props.tipo === 'SOLICITUD_PRUEBAS_PROCESO')
                data = await SolicitudPruebaProcesoDocumentoService.descargarComprimido(historial.id);
            this.props.closeModal();
            const ap = window.URL.createObjectURL(data)
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = ap;
            a.download = `${historial.solicitudEnsayo ? historial.solicitudEnsayo.codigo : historial.solicitudPruebasProceso.codigo}.rar`;
            a.click();
        }
    }

    itemTemplate(historial) {
        var fechaFormat = moment(historial.fechaRegistro, 'YYYY-MM-DD hh:mm:ss');
        const fechaRegistro = moment(fechaFormat).format('YYYY-MM-DD hh:mm:ss');
        return (
            <div className="p-col-12 p-md-3">
                <div style={{ float: 'right' }}>
                    <p className='fecha'>{fechaRegistro}</p>
                    {historial.tieneAdjuntos &&
                        <div style={{ textAlign: 'center' }}><span className='boton-historial pi pi-download' onClick={() => this.descargarDocumentos(historial)}></span></div>
                    }
                </div>
                <div>
                    <p className='orden'>{historial.orden}</p>
                    <p className='observacion'>{historial.observacion}</p>
                    <span className='badge'>{historial.usuarioNombeCompleto}</span>
                </div>

            </div>
        );
    }

    render() {
        return (
            <div>
                <br />
                <Fieldset legend="Historial de solicitud" toggleable={true} collapsed={this.state.panelCollapsed} onToggle={(e) => this.setState({ panelCollapsed: e.value })}>
                    <TabView style={{ marginTop: '10px' }} >
                        <TabPanel header="Actual" leftIcon="pi pi-star" >
                            <DataView emptyMessage="" value={this.state.historial} itemTemplate={this.itemTemplate}></DataView>
                        </TabPanel>
                        <TabPanel header="Completo" leftIcon="pi pi-list" >
                            <Accordion multiple={true}>
                                {this.state.historialCompleto.map(item => <AccordionTab header={item.codigo}>
                                    <DataView emptyMessage="" value={item.historial} itemTemplate={this.itemTemplate}></DataView>
                                </AccordionTab>
                                )}
                            </Accordion>
                        </TabPanel>

                    </TabView>
                </Fieldset>
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

export default connect(mapStateToProps, mapDispatchToProps)(Historial);