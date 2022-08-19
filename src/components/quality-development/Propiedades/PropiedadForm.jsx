import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { Growl } from 'primereact/growl';
import { CatalogoService } from '../../../service/CatalogoService';
import PropiedadService from '../../../service/PropiedadService';
import NormasLaboratorioService from '../../../service/NormasLaboratorioService';
import { PickList } from 'primereact/picklist';
import * as _ from "lodash";

var that;
class PropiedadForm extends Component {
    static propTypes = {
        propiedad: PropTypes.object.isRequired
    }

    constructor() {
        super();
        this.state = {
            propid: '',
            nombre: '',
            laboratorio: '',
            periodicidad: '',
            tipo: '',
            lineaAplicacion: '',
            equipo: '',
            muestreo: '',
            metodo: '',
            periodicidadData: [],
            camposObligatorios: [],
            normasLista: [],
            source: [],
            target: []

        };
        that = this;
        this.catalogoService = new CatalogoService();
        this.cargarCatalogos = this.cargarCatalogos.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.actualizarPropiedad = this.actualizarPropiedad.bind(this);
        this.crearPropiedad = this.crearPropiedad.bind(this);
        this.crearActualizarPropiedad = this.crearActualizarPropiedad.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.normTemplate = this.normTemplate.bind(this);
    }



    async componentDidMount() {
        this.setState({
            propid: this.props.propiedad.idProperty,
            nombre: this.props.propiedad.nameProperty,
            laboratorio: this.props.propiedad.laboratory,
            lineaAplicacion: this.props.propiedad.lineApplication,
            periodicidad: this.props.propiedad.periodicity,
            tipo: this.props.propiedad.typeProperty,
            equipo: this.props.propiedad.machine,
            metodo: this.props.propiedad.method,
            muestreo: this.props.propiedad.samplingPlan,
            target: this.obtenerTarget(this.props.propiedad.norms),
        });
        this.cargarCatalogos();
    }

    async cargarCatalogos() {
        this.catalogoService.getPeriodicidad().then(data => this.setState({ periodicidadData: data }));
        const normas = await PropiedadService.listNormsNOAsignadas(this.props.propiedad.idProperty);
        this.setState({ normasLista: normas })
    }

    obtenerTarget(normas) {
        let targetNuevo = []
        _.forEach(normas, (o) => { targetNuevo.push(o.laboratoryNorm) })
        return targetNuevo;
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = [];
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

    crearActualizarPropiedad() {
        if (this.props.propiedad.idProperty === undefined || this.props.propiedad.idProperty === null) {
            this.crearPropiedad();
        } else {
            this.actualizarPropiedad();
        }
    }

    async actualizarPropiedad() {

        if (this.validarCamposRequeridos()) {
            const a = this.crearPropiedadObj();
            const propiedad = await PropiedadService.update(a);
            if (propiedad !== null) {
                let msg = { severity: 'success', summary: 'Propiedad', detail: 'Actualizada con éxito' };
                this.growl.show(msg);
                setTimeout(function () {
                    that.cancelar();
                }, 1500);
            }
        }
    }

    async crearPropiedad() {
        if (this.validarCamposRequeridos()) {
            const propiedad = await PropiedadService.create(this.crearPropiedadObj());
            if (propiedad !== null) {
                let msg = { severity: 'success', summary: 'Propiedad', detail: 'Creado con éxito' };
                this.growl.show(msg);
                setTimeout(function () {
                    that.cancelar();
                }, 1500);

            }
        }
    }

    crearPropiedadObj() {
        return {
            idProperty: this.state.propid,
            laboratory: this.state.laboratorio,
            lineApplication: this.state.lineaAplicacion,
            machine: this.state.equipo,
            method: this.state.metodo,
            nameProperty: this.state.nombre,
            periodicity: this.state.periodicidad,
            samplingPlan: this.state.muestreo,
            typeProperty: this.state.tipo,
            norms: this.crearDetalleNormas()
        }
    }

    crearDetalleNormas() {
        let normasSeleccionadas = [];
        _.forEach(this.state.target, (o) => {
            const item = {
                laboratoryNorm: o,
                propertyList: { idProperty: this.state.propid }
            }
            return normasSeleccionadas.push(item);
        });
        return normasSeleccionadas;
    }

    normTemplate(norm) {
        return <span>{norm.name}</span>
    }

    cancelar() {
        let a = this.props._this;
        a.refrescarLista();
        a.setState({ editar: false, propiedadSeleccionada: false });
    }


    render() {
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
                                {this.determinarEsCampoRequerido('nombre') && <div className="p-col-12 p-md-2">
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>}
                            </div>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Periodicidad</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Dropdown options={this.state.periodicidadData} value={this.state.periodicidad} onChange={event => this.setState({ periodicidad: event.value })} autoWidth={false} />
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Tipo</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <div className="p-grid">
                                        <div className="p-col-12">
                                            <RadioButton value="T" inputId="rb1" onChange={event => this.setState({ tipo: event.value })} checked={this.state.tipo === "T"} />
                                            <label htmlFor="rb1" className="p-radiobutton-label">Técnica</label>
                                        </div>
                                        <div className="p-col-12">
                                            <RadioButton value="V" inputId="rb2" onChange={event => this.setState({ tipo: event.value })} checked={this.state.tipo === "V"} />
                                            <label htmlFor="rb2" className="p-radiobutton-label">Visual</label>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Laboratorio</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" value={this.state.laboratorio} onChange={(e) => this.setState({ laboratorio: e.target.value })} />
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Línea de aplicación</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" value={this.state.lineaAplicacion} onChange={(e) => this.setState({ lineaAplicacion: e.target.value })} />
                                </div>
                            </div>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Método</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" value={this.state.metodo} onChange={(e) => this.setState({ metodo: e.target.value })} />
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Equipo/Maquinaria</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" value={this.state.equipo} onChange={(e) => this.setState({ equipo: e.target.value })} />
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">P. Muestreo</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputTextarea id="textarea" rows={3} cols={30} autoResize={true} value={this.state.muestreo} onChange={(e) => this.setState({ muestreo: e.target.value })}></InputTextarea>
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Normas</label>
                                </div>
                                <div className="p-col-12 p-md-8">
                                    <PickList source={this.state.normasLista} target={this.state.target} itemTemplate={this.normTemplate}
                                        onChange={(e) => this.setState({ normasLista: e.source, target: e.target })} responsive={true} sourceHeader="Disponible" targetHeader="Seleccionadas" />
                                </div>
                            </div>

                            <div className="p-grid" style={{ marginTop: '20px' }}>
                                <div className="p-col-12 p-md-2" />
                                <div className="p-col-12 p-md-2">
                                    <Button className="p-button-success" icon='pi pi-save' label='Guardar' onClick={this.crearActualizarPropiedad} />
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

export default PropiedadForm
