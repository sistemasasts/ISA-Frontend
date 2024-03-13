import React, { Component } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { DataView } from 'primereact/dataview';
import * as moment from 'moment';
import "../../site.css";
import PncSalidaMaterialService from '../../../service/Pnc/PncSalidaMaterialService';
import PncDocumentoService from '../../../service/Pnc/PncDocumentoService';
import DesviacionRequisitoService from '../../../service/DesviacionRequisitos/DesviacionRequisitoService';
import DesviacionDocumentoService from '../../../service/DesviacionRequisitos/DesviacionDocumentoService';

class PncHistorial extends Component {

    constructor() {
        super();
        this.state = {
            historial: []
        };
        this.itemTemplate = this.itemTemplate.bind(this);
        this.descargarDocumentos = this.descargarDocumentos.bind(this);
    }

    async componentDidMount() {
        var historialData;
        if (this.props.tipo === 'DESVIACION_REQUISITOS')
            historialData = await DesviacionRequisitoService.listarHistorial(this.props.solicitud);
        else
            historialData = await PncSalidaMaterialService.listarHistorial(this.props.solicitud);
        this.setState({ historial: historialData });
    }

    async descargarDocumentos(historial) {
        if (historial) {
            var data;
            var nombreArchivo;
            const fecha = moment().format('yyyy-MM-DD');
            if (this.props.tipo === 'DESVIACION_REQUISITOS') {
                data = await DesviacionDocumentoService.descargarComprimido(historial.id);
                nombreArchivo = `DesviacionRequisito-${historial.desviacionRequisito.secuencial}-${fecha}.rar`;
            }
            else {
                data = await PncDocumentoService.descargarComprimido(historial.id);
                nombreArchivo = `SalidaMaterial-${historial.salidaMaterialId}-${fecha}.rar`;
            }
            const ap = window.URL.createObjectURL(data)
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = ap;
            a.download = nombreArchivo;
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

                    <DataView emptyMessage="" value={this.state.historial} itemTemplate={this.itemTemplate}></DataView>


                </Fieldset>
            </div>
        )
    }
}

export default (PncHistorial);
