import { Growl } from 'primereact/growl';
import React, { Component } from 'react';

import * as moment from 'moment';
import * as _ from "lodash";
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import PncSalidaMaterialService from '../../../../service/Pnc/PncSalidaMaterialService';
import { InputTextarea } from 'primereact/inputtextarea';
import PncPlanAccion from '../PlanAccion/PncPlanAccion';


class PncSalidaMaterialFormLectura extends Component {

    constructor() {
        super();
        this.state = {
            idPnc: 0,
            id: 0,
            fecha: new Date(),
            cantidad: null,
            destinoFinal: null,
            observacion: null,
            observacion2: null,
            mostrarControles: true,
            verPlanesAccion: false,

            pnc: null,
            destinoFinalCatalogo: [],
            numero: null,
            nombreProducto: null,
            saldo: null,
            unidad: null,
            cantidadNoConforme: null,
            tipoProducto: null,
        }
    }

    async componentDidMount() {
        const salidaMaterial = this.props.salidaMaterial;
        const destinos = await PncSalidaMaterialService.listarDestinoFinal();
        this.refrescar(salidaMaterial);
        this.setState({
            destinoFinalCatalogo: destinos
        });
    }

    async refrescar(salida) {
        if (salida) {
            this.setState({
                id: salida.id,
                fecha: moment(salida.fecha, 'YYYY-MM-DD').toDate(),
                cantidad: salida.cantidad,
                destinoFinal: salida.destino,
                observacion: salida.observacion,
                verPlanesAccion: salida.verPlanesAccion
            });
        }
    }


    render() {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };

        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className="p-grid p-fluid">

                    <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN SALIDA DE MATERIAL</div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Fecha</label>
                        <Calendar disabled dateFormat="yy/mm/dd" value={this.state.fecha} locale={es} onChange={(e) => this.setState({ fecha: e.value })} showIcon={true} />

                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Cantidad</label>
                        <InputText readOnly keyfilter="num" value={this.state.cantidad} onChange={(e) => this.setState({ cantidad: e.target.value })} />

                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Destino Final</label>
                        <Dropdown disabled options={this.state.destinoFinalCatalogo} autoWidth={false} value={this.state.destinoFinal} onChange={(e) => this.setState({ destinoFinal: e.value })}
                            placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-12'>
                        <label htmlFor="float-input">Observación</label>
                        <InputTextarea readOnly value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                    </div>
                </div>
                {this.state.verPlanesAccion && this.state.id > 0 &&
                    <div className='p-col-12 p-lg-12'>
                        <PncPlanAccion idSalidaMaterial={this.state.id} mostrarControles={false} />
                    </div>
                }
            </div>
        )
    }
}

export default PncSalidaMaterialFormLectura;