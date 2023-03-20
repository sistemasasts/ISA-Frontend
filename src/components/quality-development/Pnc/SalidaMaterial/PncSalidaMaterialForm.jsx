import { Growl } from 'primereact/growl';
import React, { Component } from 'react';


import PncSalidaMaterialService from '../../../../service/Pnc/PncSalidaMaterialService';
import PncService from '../../../../service/Pnc/PncService';
import * as moment from 'moment';
import * as _ from "lodash";
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import history from '../../../../history';
import Adjuntos from '../../SolicitudEnsayo/Adjuntos';
import PncHistorial from '../PncHistorial';

const ESTADO = 'CREADO';
const TIPO_SOLICITUD = 'SALIDA_MATERIAL';
const ORDEN = "INGRESO_SALIDA_MATERIAL";

class PncSalidaMaterialForm extends Component {

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
            editar: true,

            pnc: null,
            destinoFinalCatalogo: [],
            numero: null,
            nombreProducto: null,
            saldo: null,
            unidad: null,
            cantidadNoConforme: null,
            tipoProducto: null,
        }

        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.guardar = this.guardar.bind(this);
        this.regresar = this.regresar.bind(this);
        this.enviar = this.enviar.bind(this);
    }

    async componentDidMount() {
        const pnc = this.props.idPnc;
        const destinos = await PncSalidaMaterialService.listarDestinoFinal();
        console.log(this.props.match.params);
        this.refrescar(this.props.match.params.idPnc, this.props.match.params.idPncSalida);
        this.setState({
            idPnc: pnc, destinoFinalCatalogo: destinos
        });
    }

    async refrescar(idPnc, idPncSalida) {
        if (idPnc) {
            const pnc = await PncService.listarPorId(idPnc);
            if (pnc) {
                console.log(pnc)
                if (idPncSalida) {
                    const salida = await PncSalidaMaterialService.listarPorId(idPncSalida);
                    console.log(salida);
                    this.setState({
                        idPnc: pnc.id,
                        id: salida.id,
                        fecha: moment(salida.fecha, 'YYYY-MM-DD').toDate(),
                        cantidad: salida.cantidad,
                        destinoFinal: salida.destino,
                        observacion: salida.observacion,

                        pnc: pnc,
                        numero: pnc.numero,
                        nombreProducto: pnc.producto.nameProduct,
                        saldo: pnc.saldo,
                        unidad: pnc.unidad.abreviatura,
                        cantidadNoConforme: pnc.cantidadNoConforme,
                        tipoProducto: pnc.producto.typeProduct,
                        editar: salida.estado === 'CREADO',
                        mostrarControles: salida.estado === 'CREADO'
                    });

                } else {
                    this.setState({
                        idPnc: pnc.id,
                        pnc: pnc,
                        numero: pnc.numero,
                        nombreProducto: pnc.producto.nameProduct,
                        saldo: pnc.saldo,
                        unidad: pnc.unidad.abreviatura,
                        cantidadNoConforme: pnc.cantidadNoConforme,
                        tipoProducto: pnc.producto.typeProduct
                    });
                }
            }
        }
    }

    async guardar() {
        if (this.validarCamposRequeridos()) {
            const salida = await PncSalidaMaterialService.crear(this.crearObj());
            this.growl.show({ severity: 'success', detail: 'Salida de materia registrado!' });
            setTimeout(function () {
                history.push(`/quality-development_pnc_salida_material_edit/${salida.idPnc}/${salida.id}`);
            }, 1000);
        } else {
            this.growl.show({ severity: 'error', detail: 'Ingrese todos los campos obligatorios!' });
        }
    }

    async enviar() {
        const obj = { id: this.state.id, observacionFlujo: this.state.observacion2 }
        const salida = await PncSalidaMaterialService.enviar(obj);
        const pncId = this.state.idPnc;
        this.growl.show({ severity: 'success', detail: 'Salida de materia enviada!' });
        setTimeout(function () {
            history.push(`/quality-development_pnc_edit/${pncId}`);
        }, 1000);

    }

    regresar() {
        history.goBack();
    }

    crearObj() {
        return {
            id: this.state.id > 0 ? this.state.id : null,
            fecha: moment(this.state.fecha).format("YYYY-MM-DD"),
            cantidad: this.state.cantidad,
            destino: this.state.destinoFinal,
            idPnc: this.state.idPnc,
            observacion: this.state.observacion
        }
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []
        if (this.state.cantidad === null) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'cantidad'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.destinoFinal === null) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'destinoFinal'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.fecha == null) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'fecha'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        this.setState({ camposObligatorios: camposOblogatoriosDetectados })
        return camposOblogatoriosDetectados.length === 0 ? true : false;
    }

    determinarEsCampoRequerido(nombreCampo) {
        var resultado = false
        _.forEach(this.state.camposObligatorios, (x) => {
            if (x.campo === nombreCampo)
                resultado = true
        })
        return resultado;
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
                    <div className='p-col-12 p-grid dashboard'>

                        <div className="p-col-12 p-md-6 p-lg-4">
                            <div className="p-grid overview-box overview-box-1">
                                <div className="overview-box-title">
                                    <i className="fa fa-file-text"></i>
                                </div>
                                <div className="overview-box-count">Código PNC: {this.state.numero}</div>
                                <div className="overview-box-stats">Producto no conforme</div>
                            </div>
                        </div>

                        <div className="p-col-12 p-md-6 p-lg-4">
                            <div className="p-grid overview-box overview-box-1">
                                <div className="overview-box-title">
                                    <i className="fa fa-product-hunt"></i>
                                    <span>PRODUCTO</span>
                                </div>
                                <div className="overview-box-count">{this.state.nombreProducto}</div>
                                <div className="overview-box-stats">{this.state.tipoProducto}</div>
                            </div>
                        </div>

                        <div className="p-col-12 p-md-6 p-lg-4">
                            <div className="p-grid overview-box overview-box-5" style={{ background: '#f44336' }}>
                                <div className="overview-box-title">
                                    <i className="fa fa-sort-amount-asc"></i>
                                    <span>CANTIDAD STOCK</span>
                                </div>
                                <div className="overview-box-count">{this.state.saldo} {this.state.unidad}</div>
                                <div className="overview-box-stats"> Cantidad no conforme total {this.state.cantidadNoConforme} {this.state.unidad}</div>
                            </div>
                        </div>
                    </div>

                    <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN SALIDA DE MATERIAL</div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Fecha</label>
                        <Calendar disabled={!this.state.editar} dateFormat="yy/mm/dd" value={this.state.fecha} locale={es} onChange={(e) => this.setState({ fecha: e.value })} showIcon={true} />
                        {this.determinarEsCampoRequerido('fecha') &&
                            <div style={{ marginTop: '8px' }}>
                                <Message severity="error" text="Campo Obligatorio" />
                            </div>
                        }
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Cantidad</label>
                        <InputText readOnly={!this.state.editar} keyfilter="num" value={this.state.cantidad} onChange={(e) => this.setState({ cantidad: e.target.value })} />
                        {this.determinarEsCampoRequerido('cantidad') &&
                            <div style={{ marginTop: '8px' }}>
                                <Message severity="error" text="Campo Obligatorio" />
                            </div>
                        }
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Destino Final</label>
                        <Dropdown disabled={!this.state.editar} options={this.state.destinoFinalCatalogo} autoWidth={false} value={this.state.destinoFinal} onChange={(e) => this.setState({ destinoFinal: e.value })}
                            placeholder="Selecione" />
                        {this.determinarEsCampoRequerido('destinoFinal') &&
                            <div style={{ marginTop: '8px' }}>
                                <Message severity="error" text="Campo Obligatorio" />
                            </div>
                        }
                    </div>
                    <div className='p-col-12 p-lg-12'>
                        <label htmlFor="float-input">Observación</label>
                        <InputTextarea readOnly={!this.state.editar} value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                        {this.determinarEsCampoRequerido('observacion') &&
                            <div style={{ marginTop: '8px' }}>
                                <Message severity="error" text="Campo Obligatorio" />
                            </div>
                        }
                    </div>

                </div>
                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id === 0 &&
                        < div >
                            <Button style={{ marginRight: '15px' }} className="p-button" label="GUARDAR" onClick={this.guardar} />
                            <Button className="p-button-danger" label="CANCELAR" onClick={this.regresar} />
                        </div>
                    }
                </div>


                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.state.id} orden={ORDEN} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD} />
                            <PncHistorial solicitud={this.state.id} tipo={TIPO_SOLICITUD} />
                            {this.state.mostrarControles &&
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">OBSERVACIÓN</label>
                                    <InputTextarea value={this.state.observacion2} onChange={(e) => this.setState({ observacion2: e.target.value })} rows={3} />
                                </div>
                            }
                        </div>

                    </div>

                }

                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id > 0 &&
                        < div >
                            {this.state.mostrarControles && <Button style={{ marginRight: '15px' }} className="p-button" label="ENVIAR" onClick={this.enviar} />}
                            {this.state.mostrarControles && <Button style={{ marginRight: '15px' }} className="p-button-danger" label="ANULAR" onClick={this.regresar} />}
                            <Button className="p-button-secondary" label="ATRÁS" onClick={this.regresar} />
                        </div>
                    }


                </div>

            </div>
        )
    }
}

export default PncSalidaMaterialForm;