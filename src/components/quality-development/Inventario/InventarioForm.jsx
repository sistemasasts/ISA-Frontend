import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';
import { Message } from 'primereact/message';
import React, { Component } from 'react';
import ProductoService from '../../../service/productoService';
import { Dropdown } from 'primereact/dropdown';
import UnidadMedidaService from '../../../service/UnidadMedidaService';
import { InputText } from 'primereact/inputtext';
import InventarioService from '../../../service/Inventario/InventarioService';
import * as _ from "lodash";

class InventarioForm extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            producto: null,
            unidad: null,
            minimo: null,
            maximo: null,
            cantidadAlertar: null,
            productosSugeridos: [],
            unidadesCatalogo: [],
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
        const unidades = await UnidadMedidaService.listarActivos();
        this.setState({ unidadesCatalogo: unidades })
    }


    fetchData(data) {
        const mostrar = data.state.mostrarForm;
        const itemSeleccionado = data.state.productoSeleccionado;
        console.log(itemSeleccionado);

        if (itemSeleccionado) {
            const prodcuto = { productId: itemSeleccionado.prodcutoId, nameProduct: itemSeleccionado.productoNombre }
            this.setState({
                id: itemSeleccionado.id,
                producto: prodcuto,
                unidad: itemSeleccionado.unidad ? itemSeleccionado.unidad.id : null,
                minimo: itemSeleccionado.minimo,
                maximo: itemSeleccionado.maximo,
                cantidadAlertar: itemSeleccionado.cantidadAlertar,
                display: mostrar
            });
        } else {
            this.setState({ display: mostrar });
        }
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarForm: false, productoSeleccionado: null })
        this.setState({
            id: null,
            producto: null,
            unidad: null,
            minimo: null,
            maximo: null,
            cantidadAlertar: null,
            productosSugeridos: [],
            camposObligatorios: []
        })
    }

    async operar() {
        if (this.validarCamposRequeridos()) {
            if (this.state.id && this.state.id > 0) {
                await InventarioService.actualizar(this.crearObj());
                this.actualizarTablaCondiciones();
                this.growl.show({ severity: 'success', detail: 'Plan de acción actualizado!' });
            } else {
                await InventarioService.registrar(this.crearObj());
                this.actualizarTablaCondiciones();
                this.growl.show({ severity: 'success', detail: 'Plan de acción agregado!' });
            }
            this.cerrarDialogo();
        }
    }

    actualizarTablaCondiciones() {
        this.props.origen.actualizarLista();
    }

    crearObj() {
        return {
            id: this.state.id,
            productoId: this.state.producto.idProduct,
            productoNombre: this.state.producto.nameProduct,
            minimo: this.state.minimo,
            maximo: this.state.maximo,
            cantidadAlertar: this.state.cantidadAlertar,
            unidad: this.state.unidad ? { id: this.state.unidad } : null,
        }
    }


    async buscarProductos(event) {
        const resultados = await ProductoService.listarPorNombreCriterio(event.query);
        this.setState({ productosSugeridos: resultados });
    }

    validarCamposRequeridos() {
        console.log(this.state)
        var camposOblogatoriosDetectados = []
        if (this.state.producto === null) {
            let obj = { campo: 'producto', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.unidad === null) {
            let obj = { campo: 'unidad', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.minimo === null) {
            let obj = { campo: 'minimo', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.maximo === null) {
            let obj = { campo: 'maximo', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.cantidadAlertar === null) {
            let obj = { campo: 'cantidadAlertar', obligatorio: true }
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
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Dialog header={this.state.id > 0 ? "Editar" : "Nuevo"} visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Producto</label>
                            <AutoComplete field="nameProduct" minLength={3} placeholder="Ingrese criterio de búsqueda..." suggestions={this.state.productosSugeridos}
                                completeMethod={(e) => this.buscarProductos(e)} value={this.state.producto} onChange={(e) => this.setState({ producto: e.value })}
                            />
                            {this.determinarEsCampoRequerido('producto') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Unidad</label>
                            <Dropdown options={this.state.unidadesCatalogo} value={this.state.unidad} autoWidth={false} onChange={(e) => this.setState({ unidad: e.value })} placeholder="Selecione" />
                            {this.determinarEsCampoRequerido('unidad') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Mínimo</label>
                            <InputText keyfilter="num" value={this.state.minimo} onChange={(e) => this.setState({ minimo: e.target.value })} />
                            {this.determinarEsCampoRequerido('minimo') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Máximo</label>
                            <InputText keyfilter="num" value={this.state.maximo} onChange={(e) => this.setState({ maximo: e.target.value })} />
                            {this.determinarEsCampoRequerido('maximo') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Alertar</label>
                            <InputText keyfilter="num" value={this.state.cantidadAlertar} onChange={(e) => this.setState({ cantidadAlertar: e.target.value })} />
                            {this.determinarEsCampoRequerido('cantidadAlertar') &&
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
export default InventarioForm;