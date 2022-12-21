import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import SolicitudPlanAccionService from '../../../../service/SolicitudPlanAccion/SolicitudPlanAccionService';
import { Growl } from 'primereact/growl';
import { CatalogoService } from '../../../../service/CatalogoService';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import * as moment from 'moment';
import * as _ from "lodash";
import { Dropdown } from 'primereact/dropdown';

const opcionesCumplimiento = [{ label: 'SI', value: 'SI' }, { label: 'NO', value: 'NO' }];
class FormPlanAccion extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            solicitudId: null,
            descripcion: null,
            fechaInicio: null,
            fechaFin: null,
            cumplido: null,
            display: false,
            nombreVentana: '',
            tipo: null,
            cumplidoTexto: null
        }
        this.catalogoService = new CatalogoService();
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
        this.operar = this.operar.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.origen);
        }
    }

    fetchData(data) {
        const mostrar = data.state.mostrarFormPlanAccion;
        const itemSeleccionado = data.state.planSeleccionado;
        const informe = this.props.solicitudId;
        const tipo = this.props.tipo;
        console.log(itemSeleccionado);
        if (itemSeleccionado) {
            this.setState({
                solicitudId: informe,
                display: mostrar,
                id: itemSeleccionado.id,
                descripcion: itemSeleccionado.descripcion,
                fechaInicio: moment(itemSeleccionado.fechaInicio, 'YYYY-MM-DD').toDate(),
                fechaFin: moment(itemSeleccionado.fechaFin, 'YYYY-MM-DD').toDate(),
                cumplidoTexto: itemSeleccionado.cumplido === null ? null : itemSeleccionado.cumplido ? 'SI' : 'NO',
                tipo: tipo
            });
        } else {
            this.setState({ solicitudId: informe, display: mostrar, tipo: tipo });
        }
    }

    componentDidMount() {
        this.fetchData(this.props.origen);
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarFormPlanAccion: false, planSeleccionado: null })
        this.setState({
            display: false, id: null,
            solicitudId: null,
            descripcion: null,
            fechaInicio: null,
            fechaFin: null,
            cumplido: null,
            nombreVentana: '',
            tipo: null,
        })
    }

    async operar() {
        if (this.state.id && this.state.id > 0) {
            await SolicitudPlanAccionService.actualizar(this.crearObj());
            this.actualizarTablaCondiciones();
            this.growl.show({ severity: 'success', detail: 'Plan de acción actualizado!' });
        } else {
            await SolicitudPlanAccionService.create(this.crearObj());
            this.actualizarTablaCondiciones();
            this.growl.show({ severity: 'success', detail: 'Plan de acción agregado!' });
        }
        this.cerrarDialogo();
    }

    actualizarTablaCondiciones() {
        this.props.origen.refrescarPlanesAccion();
    }

    crearObj() {
        return {
            id: this.state.id,
            descripcion: this.state.descripcion,
            fechaInicio: this.state.fechaInicio,
            fechaFin: this.state.fechaFin,
            cumplido: _.isEmpty(this.state.cumplidoTexto) ? null : _.isEqual(this.state.cumplidoTexto, 'SI') ? true : false,
            solicitudId: this.state.solicitudId,
            tipoSolicitud: this.state.tipo
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
                            <label htmlFor="float-input">Fecha Inicio</label>
                            <Calendar appendTo={document.body} dateFormat="yy/mm/dd" value={this.state.fechaInicio} locale={es} onChange={(e) => this.setState({ fechaInicio: e.value })} showIcon={true} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Fecha Fin</label>
                            <Calendar appendTo={document.body} dateFormat="yy/mm/dd" value={this.state.fechaFin} locale={es} onChange={(e) => this.setState({ fechaFin: e.value })} showIcon={true} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Descripción</label>
                            <InputTextarea value={this.state.descripcion} onChange={(e) => this.setState({ descripcion: e.target.value })} rows={3} />
                        </div>
                        {/* <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Cumplido</label>
                            <Dropdown appendTo={document.body} value={this.state.cumplidoTexto} options={opcionesCumplimiento}
                                onChange={(e) => { this.setState({ cumplidoTexto: e.value }) }} placeholder="Seleccione.." showClear={true} />
                        </div> */}
                    </div>
                </Dialog>
            </div>
        )
    }

}
export default FormPlanAccion;
