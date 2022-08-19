import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { Growl } from 'primereact/growl';
import {CatalogoService} from '../../../service/CatalogoService';
import ProveedorService from '../../../service/ProveedorService';

var that;
class ProveedorForm extends Component {
    static propTypes = {
        proveedor: PropTypes.object.isRequired
    }

    constructor() {
        super();
        this.state = {
            proveedorId: '',
            nombre: '',
            sapCode: '',
            tipoEstado: '',
            tipo: [],
            descripcion: '',
            camposObligatorios: []

        };
        that = this;
        this.catalogoService = new CatalogoService();

    }

    componentDidMount() {
        this.setState({
            proveedorId: this.props.proveedor.idProvider,
            nombre: this.props.proveedor.nameProvider,
            tipoEstado: this.props.proveedor.typeProvider,
            descripcion: this.props.proveedor.descProvider,
            sapCode: this.props.proveedor.sapProviderCode
        })

        this.catalogoService.getTipoEstadoProveedor().then(data => this.setState({ tipo: data }));
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.actualizarProveedor = this.actualizarProveedor.bind(this);
        this.crearProveedor = this.crearProveedor.bind(this);
        this.crearActualizarProveedor = this.crearActualizarProveedor.bind(this);
        this.cancelar = this.cancelar.bind(this);
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

    crearActualizarProveedor() {
        if (this.props.proveedor.idProvider === undefined || this.props.proveedor.idProvider === null) {
            this.crearProveedor();
        } else {
            this.actualizarProveedor();
        }
    }

    async actualizarProveedor() {

        if (this.validarCamposRequeridos()) {
            debugger
            var objProveedor = {
                idProvider: this.props.proveedor.idProvider,
                nameProvider: this.state.nombre,
                typeProvider: this.state.tipoEstado,
                sapProviderCode: this.state.sapCode,
                descProvider: this.state.descripcion
            }
            const proveedor = await ProveedorService.update(objProveedor);
            if (proveedor !== null) {
                let msg = { severity: 'success', summary: 'Proveedor', detail: 'Actualizado con éxito' };
                this.growl.show(msg);
                setTimeout(function () {
                    that.cancelar();
                }, 1500);
            }
        }
    }

    async crearProveedor() {
        debugger
        if (this.validarCamposRequeridos()) {
            var objProveedor = {
                nameProvider: this.state.nombre,
                typeProvider: this.state.tipoEstado,
                sapProviderCode: this.state.sapCode,
                descProvider: this.state.descripcion
            }

            const proveedor = await ProveedorService.create(objProveedor);
            if (proveedor !== null) {
                let msg = { severity: 'success', summary: 'Proveedor', detail: 'Creado con éxito' };
                this.growl.show(msg);
                setTimeout(function () {
                    that.cancelar();
                }, 1500);

            }
        }
    }

    cancelar() {
        let a = this.props._this;
        a.refrescarLista();
        a.setState({ editar: false, proveedorSeleccionado: false });
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
                                    <label htmlFor="input">Tipo</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Dropdown options={this.state.tipo} value={this.state.tipoEstado} onChange={event => this.setState({ tipoEstado: event.value })} autoWidth={false} />
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Descripción</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputTextarea id="textarea" rows={3} cols={30} autoResize={true} value={this.state.descripcion} onChange={(e) => this.setState({ descripcion: e.target.value })}></InputTextarea>
                                </div>
                            </div>

                            <div className="p-grid" style={{ marginTop: '20px' }}>
                                <div className="p-col-12 p-md-2" />
                                <div className="p-col-12 p-md-2">
                                    <Button className="p-button-success" icon='pi pi-save' label='Guardar' onClick={this.crearActualizarProveedor} />
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

export default ProveedorForm
