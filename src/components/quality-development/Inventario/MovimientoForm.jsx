import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';
import { Message } from 'primereact/message';
import React, { Component } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import InventarioService from '../../../service/Inventario/InventarioService';
import * as _ from "lodash";
import { Calendar } from 'primereact/calendar';
import * as moment from 'moment';

class MovimientoForm extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            inventarioId: null,
            fechaEnsayo: null,
            numeroEnsayo: null,
            cantidad: null,
            tipoMovimiento: { texto: 'EGRESO(CONSUMO)', valor: 'EGRESO' },

            tiposMovimientoCatalogo: [{ texto: 'INGRESO(COMPRA)', valor: 'INGRESO' }, { texto: 'EGRESO(CONSUMO)', valor: 'EGRESO' }],
            display: false
        };

        this.cerrarDialogo = this.cerrarDialogo.bind(this);
        this.operar = this.operar.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.origen);
        }
    }

    async componentDidMount() {
        this.fetchData(this.props.origen);
    }


    fetchData(data) {
        const mostrar = data.state.mostrarForm;
        const inventarioId = data.state.inventarioId;
        this.setState({ display: mostrar, inventarioId: inventarioId });

    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarForm: false })
        this.setState({
            id: null,
            inventarioId: null,
            fechaEnsayo: null,
            numeroEnsayo: null,
            cantidad: null,
            tipoMovimiento: { texto: 'EGRESO(CONSUMO)', valor: 'EGRESO' },
        })
    }

    async operar() {
        if (this.validarCamposRequeridos()) {
            await InventarioService.registrarMovimiento(this.crearObj());
            this.actualizarTablaCondiciones();
            this.growl.show({ severity: 'success', detail: 'Movimiento registrado!' });

            this.cerrarDialogo();
        }
    }

    actualizarTablaCondiciones() {
        this.props.origen.actualizarCabecera(this.state.inventarioId);
    }

    crearObj() {
        return {
            inventarioProductoId: this.state.inventarioId,
            fechaEnsayo: this.state.fechaEnsayo == null ? null : moment(this.state.fechaEnsayo).format("YYYY-MM-DD"),
            numeroEnsayo: this.state.numeroEnsayo,
            cantidad: this.state.cantidad,
            tipoMovimiento: this.state.tipoMovimiento.valor,
        }
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []
        if (this.state.tipoMovimiento && this.state.tipoMovimiento.valor === 'EGRESO') {
            if (this.state.fechaEnsayo === null) {
                let obj = { campo: 'fechaEnsayo', obligatorio: true }
                camposOblogatoriosDetectados.push(obj);
            }
            if (this.state.numeroEnsayo === null) {
                let obj = { campo: 'numeroEnsayo', obligatorio: true }
                camposOblogatoriosDetectados.push(obj);
            }
        }
        if (this.state.cantidad === null) {
            let obj = { campo: 'cantidad', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.tipoMovimiento === null) {
            let obj = { campo: 'tipoMovimiento', obligatorio: true }
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
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Guardar" icon="pi pi-check" onClick={this.operar} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={this.cerrarDialogo} />
        </div>;
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Dialog header={this.state.id > 0 ? "Editar" : "Nuevo"} visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Tipo Movimiento</label>
                            <Dropdown options={this.state.tiposMovimientoCatalogo} value={this.state.tipoMovimiento} autoWidth={false} onChange={(e) => this.setState({ tipoMovimiento: e.value })}
                                placeholder="Selecione" optionLabel='texto' optionValue='valor' />
                            {this.determinarEsCampoRequerido('tipoMovimiento') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        {this.state.tipoMovimiento.valor === 'EGRESO' &&
                            <div className='p-col-12 p-lg-12' >
                                <label htmlFor="float-input">Fecha de Ensayo</label>
                                <Calendar appendTo={document.body} dateFormat="yy/mm/dd" value={this.state.fechaEnsayo} locale={es} onChange={(e) => this.setState({ fechaEnsayo: e.value })} showIcon={true} />
                            </div>
                        }

                        {this.state.tipoMovimiento.valor === 'EGRESO' &&
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Número Ensayo</label>
                                <InputText value={this.state.numeroEnsayo} onChange={(e) => this.setState({ numeroEnsayo: e.target.value })} />
                                {this.determinarEsCampoRequerido('numeroEnsayo') &&
                                    <div style={{ marginTop: '8px' }}>
                                        <Message severity="error" text="Campo Obligatorio" />
                                    </div>
                                }
                            </div>
                        }
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Cantidad</label>
                            <InputText keyfilter="num" value={this.state.cantidad} onChange={(e) => this.setState({ cantidad: e.target.value })} />
                            {this.determinarEsCampoRequerido('cantidad') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}
export default MovimientoForm;