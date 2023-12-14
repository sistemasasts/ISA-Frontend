import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import * as moment from 'moment';
import * as _ from "lodash";
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import PncPlanAccionService from '../../../../service/Pnc/PncPlanAccionService';
import { InputText } from 'primereact/inputtext';
import UsuarioService from '../../../../service/UsuarioService';

const opcionesCumplimiento = [{ label: 'SI', value: 'SI' }, { label: 'NO', value: 'NO' }];
class PncFormPlanAccion extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            salidaMaterialId: null,
            descripcion: null,
            fechaInicio: null,
            fechaFin: null,
            responsable: null,
            llenarInfoAdicional: false,
            orden: null,
            cumplido: null,
            display: false,
            nombreVentana: '',
            tipo: null,
            cumplidoTexto: null,

            usuarios: [],
            camposObligatorios: []
        }
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
        this.operar = this.operar.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.origen);
        }
    }

    async fetchData(data) {
        const mostrar = data.state.mostrarFormPlanAccion;
        const itemSeleccionado = data.state.planSeleccionado;
        const informe = this.props.salidaMaterialId;
        console.log(itemSeleccionado);
        const catalogo_usuarios = await UsuarioService.listarActivos();
        const ordenSiguiente = this.recuperarSiguienteOrden(data);
        if (itemSeleccionado) {
            this.setState({
                salidaMaterialId: informe,
                display: mostrar,
                id: itemSeleccionado.id,
                descripcion: itemSeleccionado.descripcion,
                fechaInicio: moment(itemSeleccionado.fechaInicio, 'YYYY-MM-DD').toDate(),
                fechaFin: moment(itemSeleccionado.fechaFin, 'YYYY-MM-DD').toDate(),
                responsable: itemSeleccionado.responsable,
                orden: itemSeleccionado.orden,
                llenarInfoAdicional: itemSeleccionado.llenarInfoAdicional,
                usuarios: this.transformarDatos(catalogo_usuarios)
                /* cumplidoTexto: itemSeleccionado.cumplido === null ? null : itemSeleccionado.cumplido ? 'SI' : 'NO', */
            });
        } else {
            this.setState({ salidaMaterialId: informe, display: mostrar, usuarios: this.transformarDatos(catalogo_usuarios), orden: ordenSiguiente });
        }
    }

    componentDidMount() {
        this.fetchData(this.props.origen);
    }

    transformarDatos(data) {
        const usuairosCasteo = [];
        _.forEach(data, (x) => {
            usuairosCasteo.push({ 'label': `${x.idUser} - ${x.employee.completeName}`, 'value': x.idUser });
        });
        return usuairosCasteo;
    }

    recuperarSiguienteOrden(origen) {
        const mayor = _.maxBy(origen.state.planes, (o) => { return o.orden });
        return _.isEmpty(mayor) ? 1 : mayor.orden + 1;
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarFormPlanAccion: false, planSeleccionado: null })
        this.setState({
            display: false, id: null,
            salidaMaterialId: null,
            descripcion: null,
            fechaInicio: null,
            fechaFin: null,
            responsable: null,
            orden: null,
            cumplido: null,
            nombreVentana: '',
            camposObligatorios: []
        })
    }

    async operar() {
        if (this.validarCamposRequeridos()) {
            if (this.state.id && this.state.id > 0) {
                const data = await PncPlanAccionService.actualizar(this.crearObj());
                this.actualizarTablaCondiciones(data);
                this.growl.show({ severity: 'success', detail: 'Plan de acción actualizado!' });
            } else {
                const data = await PncPlanAccionService.registrar(this.crearObj());
                this.actualizarTablaCondiciones(data);
                this.growl.show({ severity: 'success', detail: 'Plan de acción agregado!' });
            }
            this.cerrarDialogo();
        }
    }

    actualizarTablaCondiciones(data) {
        this.props.origen.refrescarPlanesAccion(data);
    }

    crearObj() {
        return {
            id: this.state.id,
            descripcion: this.state.descripcion,
            fechaInicio: this.state.fechaInicio,
            fechaFin: this.state.fechaFin,
            salidaMaterialId: this.state.salidaMaterialId,
            responsable: this.state.responsable,
            orden: this.state.orden,
            llenarInfoAdicional: this.state.llenarInfoAdicional
        }
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []
        if (this.state.fechaInicio === null) {
            let obj = { campo: 'fechaInicio', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.fechaFin === null) {
            let obj = { campo: 'fechaFin', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (_.isEmpty(this.state.descripcion)) {
            let obj = { campo: 'descripcion', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (_.isEmpty(this.state.responsable)) {
            let obj = { campo: 'responsable', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.orden == null || this.state.orden === 0) {
            let obj = { campo: 'orden', obligatorio: true }
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
        /* this.state.camposObligatorios.map(function (campo) {
            if (campo.campo === nombreCampo)
                resultado = true
        }) */
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
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Guardar" icon="pi pi-check" onClick={this.operar} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={this.cerrarDialogo} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Dialog header={this.state.id > 0 ? "Editar Plan Acción" : "Nuevo Plan Acción"} visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Orden</label>
                            <InputText keyfilter="num" value={this.state.orden} onChange={(e) => this.setState({ orden: e.target.value })} />
                            {this.determinarEsCampoRequerido('orden') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Fecha Inicio</label>
                            <Calendar className={this.determinarEsCampoRequerido('fechaInicio') && 'p-error'} appendTo={document.body} dateFormat="yy/mm/dd" value={this.state.fechaInicio} locale={es} onChange={(e) => this.setState({ fechaInicio: e.value })} showIcon={true} />
                            {this.determinarEsCampoRequerido('fechaInicio') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Fecha Fin</label>
                            <Calendar className={this.determinarEsCampoRequerido('fechaFin') && 'p-error'} appendTo={document.body} dateFormat="yy/mm/dd" value={this.state.fechaFin} locale={es} onChange={(e) => this.setState({ fechaFin: e.value })} showIcon={true} />
                            {this.determinarEsCampoRequerido('fechaFin') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Descripción</label>
                            <InputTextarea className={this.determinarEsCampoRequerido('descripcion') && 'p-error'} value={this.state.descripcion} onChange={(e) => this.setState({ descripcion: e.target.value })} rows={3} />
                            {this.determinarEsCampoRequerido('descripcion') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Responsable</label>
                            <Dropdown className={this.determinarEsCampoRequerido('responsable') && 'p-error'} appendTo={document.body} value={this.state.responsable} options={this.state.usuarios} onChange={(e) => this.setState({ responsable: e.value })} placeholder="Seleccione..." />
                            {this.determinarEsCampoRequerido('responsable') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label style={{marginRight: '5px'}} htmlFor="float-input">Habilitar llenar información adicional</label>
                            <Checkbox onChange={e => this.setState({ llenarInfoAdicional: e.checked })} checked={this.state.llenarInfoAdicional}></Checkbox>                            
                        </div>

                    </div>
                </Dialog>
            </div>
        )
    }

}
export default PncFormPlanAccion;
