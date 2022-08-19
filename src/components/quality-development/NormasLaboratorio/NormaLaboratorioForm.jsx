import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { Growl } from 'primereact/growl';
import { Calendar } from 'primereact/calendar';
import NormasLaboratorioService from '../../../service/NormasLaboratorioService';
import { formattedDate, formattedStringtoDate } from '../../../utils/FormatDate';

var that;
class NormaLaboratorioForm extends Component {
    static propTypes = {
        proveedor: PropTypes.object.isRequired
    }

    constructor() {
        super();
        this.state = {
            id: null,
            nombre: '',
            titulo: '',
            estado: '',
            tipo: '',
            observacion: '',
            camposObligatorios: [],
            fechaConfirmacion: '',
            listaEstado: []
        };
        that = this;
        this.actualizarNorma = this.actualizarNorma.bind(this);
        this.crearNorma = this.crearNorma.bind(this);
        this.crearActualizarNorma = this.crearActualizarNorma.bind(this);
        this.cancelar = this.cancelar.bind(this);

    }

    async componentDidMount() {
        console.log(this.props.norma)
        const listadoEstados = await NormasLaboratorioService.listarEstadosNorma();        
        this.setState({
            id: this.props.norma.id,
            nombre: this.props.norma.name,
            tipoEstado: this.props.norma.state,
            observacion: this.props.norma.observation,
            titulo: this.props.norma.title,
            estado: this.props.norma.state,
            fechaConfirmacion: formattedStringtoDate(this.props.norma.confirmationDate),
            listaEstado: listadoEstados
        });     
        
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = [];
        debugger
        var obj = { campo: '', obligatorio: true }
        if (this.state.nombre === '' || this.state.nombre === undefined) {
            obj.campo = 'nombre'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }

        this.setState({ camposObligatorios: camposOblogatoriosDetectados })
        return camposOblogatoriosDetectados.length === 0 ? true : false;
    }

    determinarEsCampoRequerido(nombreCampo) {
        var resultado = false
        this.state.camposObligatorios.map(function (campo) {
            if (campo.campo === nombreCampo)
                resultado = true
        })

        return resultado;
    }

    crearActualizarNorma() {
        if (this.props.norma.id === undefined || this.props.norma.id === null) {
            this.crearNorma();
        } else {
            this.actualizarNorma();
        }
    }

    async actualizarNorma() {

        if (this.validarCamposRequeridos()) {
            debugger
            const proveedor = await NormasLaboratorioService.update(this.crearNormaLabortarorioObj());
            if (proveedor !== null) {
                let msg = { severity: 'success', summary: 'Norma Labortorio', detail: 'Actualizado con éxito' };
                this.growl.show(msg);
                setTimeout(function () {
                    that.cancelar();
                }, 1500);
            }
        }
    }

    async crearNorma() {
        debugger
        if (this.validarCamposRequeridos()) {

            const norma = await NormasLaboratorioService.create(this.crearNormaLabortarorioObj());
            if (norma !== null) {
                let msg = { severity: 'success', summary: 'Norma Laboratorio', detail: 'Creado con éxito' };
                this.growl.show(msg);
                setTimeout(function () {
                    that.cancelar();
                }, 1500);

            }
        }
    }

    crearNormaLabortarorioObj() {
        return {
            id: this.state.id,
            name: this.state.nombre,
            type: this.state.tipo,
            title: this.state.titulo,
            state: this.state.estado,
            observation: this.state.observacion,
            confirmationDate: formattedDate(this.state.fechaConfirmacion)
        }
    }

    cancelar() {
        let a = this.props._this;
        a.refrescarLista();
        a.setState({ editar: false, normaSeleccionada: false });
    }


    render() {
        const es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: "Hoy",
            clear: "Claro"
        };
        return (
            <div className="p-fluid">
                <div className='p-grid'>
                    <div className="p-col-12 p-lg-12">

                        <div className="card card-w-title">
                            <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Nombre</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" className={this.determinarEsCampoRequerido('nombre') && 'p-error'} value={this.state.nombre} onChange={(e) => this.setState({ nombre: e.target.value })} />
                                </div>
                                {this.determinarEsCampoRequerido('nombre') && <div className="p-col-12 p-md-3">
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>}
                            </div>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Tipo</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" value={this.state.tipo} onChange={(e) => this.setState({ tipo: e.target.value })} />
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Estado</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Dropdown options={this.state.listaEstado} value={this.state.estado} onChange={event => this.setState({ estado: event.value })} autoWidth={false} />
                                </div>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Fecha Confirmación</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Calendar value={this.state.fechaConfirmacion} onChange={(e) => this.setState({ fechaConfirmacion: e.value })} showIcon={true} locale={es} dateFormat="dd/mm/yy" />
                                </div>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Título</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputTextarea id="input" rows={3} cols={30} autoResize={true} value={this.state.titulo} onChange={(e) => this.setState({ titulo: e.target.value })} />
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Descripción</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputTextarea id="textarea" rows={3} cols={30} autoResize={true} value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })}></InputTextarea>
                                </div>
                            </div>

                            <div className="p-grid" style={{ marginTop: '20px' }}>
                                <div className="p-col-12 p-md-2" />
                                <div className="p-col-12 p-md-2">
                                    <Button className="p-button-success" icon='pi pi-save' label='Guardar' onClick={this.crearActualizarNorma} />
                                </div>
                                <div className="p-col-12 p-md-2">
                                    <Button className="p-button-secondary" icon='pi pi-times' label='Cancelar' onClick={this.cancelar} />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        )
    }
}

export default NormaLaboratorioForm
