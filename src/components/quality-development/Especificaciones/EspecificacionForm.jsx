import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EspecificacionService from '../../../service/EspecificacionService';
import BuscarPropiedadForm from './BuscarPropiedadForm';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';

import { CatalogoService } from '../../../service/CatalogoService';
import { connect } from 'react-redux';

var that;
class EspecificacionForm extends Component {
    static propTypes = {
        prop: PropTypes
    }

    constructor() {
        super();
        this.state = {
            unidadesMedida: [],
            propiedadesNoAsignadas: [],
            propiedadesNoAsignadasDropDown: [],
            propiedadSeleccionada: {},
            norma: '',
            tipo: '',
            unidad: '',
            minimo: 0,
            maximo: 0,
            visibleDetalle: '',
            habilitarCamposPropiedadTecnica: false,
            habilitarCamposPropiedadVisible: false,
            camposObligatorios: []
        };
        that = this;
        this.catalogoService = new CatalogoService();
        this.cargarInformacionPropiedadSeleccionada = this.cargarInformacionPropiedadSeleccionada.bind(this);
        this.crearEspecificacion = this.crearEspecificacion.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.redirectEspecificaciones = this.redirectEspecificaciones.bind(this);

    }

    componentDidMount() {
        this.catalogoService.getUnidadesMedida().then(data => this.setState({ unidadesMedida: data }));
    }

    cargarInformacionPropiedadSeleccionada(propiedad) {
        this.setState({
            propiedadSeleccionada: propiedad,
            norma: propiedad.propertyNorm,
            tipo: propiedad.typeProperty === 'T' ? 'Técnica' : 'Visible',
            habilitarCamposPropiedadTecnica: propiedad.typeProperty === 'T' ? false : true,
            habilitarCamposPropiedadVisible: propiedad.typeProperty === 'V' ? false : true,
        });
    }

    async crearEspecificacion() {
        if (this.validarCamposRequeridos()) {
            let productPropertyDTO = {
                idProduct: '',
                idPropertyList: '',
                nameProperty: '',
                action: '',
                minProperty: '',
                maxProperty: '',
                unitProperty: '',
                propertyNorm: '',
                asUser: '',
                typeProperty: '',
                viewProperty: ''
            }

            productPropertyDTO.idProduct = this.props.product.idProduct;
            productPropertyDTO.idPropertyList = this.state.propiedadSeleccionada.idProperty;
            productPropertyDTO.nameProperty = this.state.propiedadSeleccionada.nameProperty;
            productPropertyDTO.action = 'CREATE';
            productPropertyDTO.minProperty = this.state.minimo;
            productPropertyDTO.maxProperty = this.state.maximo;
            productPropertyDTO.unitProperty = this.state.unidad;
            productPropertyDTO.propertyNorm = this.state.norma;
            productPropertyDTO.asUser = this.props.currentUser.nickName;
            productPropertyDTO.typeProperty = this.state.propiedadSeleccionada.typeProperty;
            productPropertyDTO.viewProperty = this.state.visibleDetalle;
            let listaPropiedades = [];
            listaPropiedades.push(productPropertyDTO);
            await EspecificacionService.update(listaPropiedades);
            this.messages.show({ severity: 'success', summary: '', detail: `Especificación ${this.state.propiedadSeleccionada.nameProperty} guardada` });
            setTimeout(function () {
                that.redirectEspecificaciones();
            }, 1500);



        }
    }

    redirectEspecificaciones() {
        this.props._this.setState({ crearEspecificacion: false });
        this.props._this.refrescarLista();
    }

    cancelar() {
        this.props._this.setState({ crearEspecificacion: false });
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = [];
        debugger

        if (this.state.propiedadSeleccionada.idProperty === undefined) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'propiedad'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }

        if (this.state.tipo === 'Técnica') {
            if (this.state.unidad === "") {
                let obj = { campo: '', obligatorio: true }
                obj.campo = 'unidad'; obj.obligatorio = true
                camposOblogatoriosDetectados.push(obj);
            }

            if (this.state.minimo === "") {
                let obj = { campo: '', obligatorio: true }
                obj.campo = 'minimo'; obj.obligatorio = true
                camposOblogatoriosDetectados.push(obj);
            }

            if (this.state.maximo === "") {
                let obj = { campo: '', obligatorio: true }
                obj.campo = 'maximo'; obj.obligatorio = true
                camposOblogatoriosDetectados.push(obj);
            }

        } else {
            if (this.state.visibleDetalle === "") {
                let obj = { campo: '', obligatorio: true }
                obj.campo = 'visibleDetalle'; obj.obligatorio = true
                camposOblogatoriosDetectados.push(obj);
            }
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


    render() {
        return (
            <div className="p-fluid">
                <Messages ref={(el) => this.messages = el} />
                <div className='p-grid'>
                    <div className="p-col-12 p-lg-12">
                        <div className="card">
                            <h1>Nueva Especificación</h1>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Propiedad</label>
                                </div>

                                <div className="p-col-12 p-md-4">
                                    <BuscarPropiedadForm product={this.props.product} _this={this} />
                                </div>
                                {this.determinarEsCampoRequerido('propiedad') && <div className="p-col-12 p-md-3">
                                    <Message severity="error" text="Seleccione una propiedad" />
                                </div>}


                            </div>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Norma</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" value={this.state.norma} disabled={true}/>
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Tipo</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" value={this.state.tipo} disabled={true} />
                                </div>
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Unidad</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <Dropdown className={this.determinarEsCampoRequerido('unidad') && 'p-error'} value={this.state.unidad} options={this.state.unidadesMedida} onChange={(event) => this.setState({ unidad: event.value })} autoWidth={false} placeholder="Selecione UM" disabled={this.state.habilitarCamposPropiedadTecnica} />
                                </div>
                                {this.determinarEsCampoRequerido('unidad') && <div className="p-col-12 p-md-3">
                                    <Message severity="error" text="Campo obligatorio" />
                                </div>}
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Mínimo</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" className={this.determinarEsCampoRequerido('minimo') && 'p-error'} keyfilter="num" value={this.state.minimo} onChange={(e) => this.setState({ minimo: e.target.value })} disabled={this.state.habilitarCamposPropiedadTecnica} />
                                </div>
                                {this.determinarEsCampoRequerido('minimo') && <div className="p-col-12 p-md-3">
                                    <Message severity="error" text="Campo obligatorio" />
                                </div>}
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Máximo</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" className={this.determinarEsCampoRequerido('maximo') && 'p-error'} keyfilter="num" value={this.state.maximo} onChange={(e) => this.setState({ maximo: e.target.value })} disabled={this.state.habilitarCamposPropiedadTecnica} />
                                </div>
                                {this.determinarEsCampoRequerido('maximo') && <div className="p-col-12 p-md-3">
                                    <Message severity="error" text="Campo obligatorio" />
                                </div>}
                            </div>

                            <div className="p-grid">
                                <div className="p-col-12 p-md-2">
                                    <label htmlFor="input">Detalle visible</label>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <InputText id="input" className={this.determinarEsCampoRequerido('visibleDetalle') && 'p-error'} value={this.state.visibleDetalle} onChange={(e) => this.setState({ visibleDetalle: e.target.value })} disabled={this.state.habilitarCamposPropiedadVisible} />
                                </div>
                                {this.determinarEsCampoRequerido('visibleDetalle') && <div className="p-col-12 p-md-3">
                                    <Message severity="error" text="Campo obligatorio" />
                                </div>}
                            </div>

                            <div className="p-grid" style={{ marginTop: '20px' }}>
                                <div className="p-col-12 p-md-2" />
                                <div className="p-col-12 p-md-2">
                                    <Button className="p-button-success" icon='pi pi-save' label='Guardar' onClick={this.crearEspecificacion} />
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

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps)(EspecificacionForm);
