import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import * as _ from "lodash";
import InformeSPPService from '../../../../service/SolicitudPruebaProceso/InformeSPPService';
import ProductoService from '../../../../service/productoService';
import { Growl } from 'primereact/growl';
import { CatalogoService } from '../../../../service/CatalogoService';
import UnidadMedidaService from '../../../../service/UnidadMedidaService';

class FormMaterialUtilizado extends Component {

    constructor() {
        super();
        this.state = {
            informeId: null,
            id: null,
            nombre: null,
            unidad: null,
            cantidadSolicitada: null,
            cantidadUtilizada: null,
            catalogoProductos: [],
            unidadesCatalogo: []
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
        const mostrar = data.state.mostrarFormMaterialUtilizado;
        const itemSeleccionado = data.state.seleccionadoMaterial;
        const informe = this.props.informeId;
        if (itemSeleccionado) {
            this.setState({
                informeId: informe,
                display: mostrar,
                id: itemSeleccionado.id,
                nombre: itemSeleccionado.nombre,
                unidad: itemSeleccionado.unidad,
                cantidadSolicitada: itemSeleccionado.cantidadSolicitada,
                cantidadUtilizada: itemSeleccionado.cantidadUtilizada
            });
        } else {
            this.setState({ informeId: informe, display: mostrar });
        }
        this.cargarProductos();
        this.obtenerCatalgoUnidades();
    }

    async componentDidMount() {
        this.fetchData(this.props.origen);
    }

    async obtenerCatalgoUnidades() {
        const unidades = await UnidadMedidaService.listarActivos();
        this.setState({ unidadesCatalogo: unidades });
        //this.catalogoService.getUnidadesMedida().then(data => this.setState({ unidadesCatalogo: data }));
    }

    async cargarProductos() {
        let catalogoMateriales = await ProductoService.list();
        const productos = _.map(_.uniqBy(catalogoMateriales, 'nameProduct'), (o) => { return { label: o.nameProduct, value: o.nameProduct } });
        this.setState({ catalogoProductos: productos })
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarFormMaterialUtilizado: false, seleccionadoMaterial: null })
        this.setState({
            display: false, id: null,
            nombre: null,
            unidad: null,
            cantidadSolicitada: null,
            cantidadUtilizada: null,
            catalogoProductos: [],
            unidadesCatalogo: []
        })
    }

    async operar() {
        if (this.state.id && this.state.id > 0) {
            const detalleActualizado = await InformeSPPService.editarMaterialUtilizado(this.crearObj(), this.state.informeId);
            this.actualizarTablaMaterialesUtilizados(detalleActualizado);
            this.growl.show({ severity: 'success', detail: 'Material actualizado!' });
        } else {
            const detalleActualizado = await InformeSPPService.agregarMaterialUtilizado(this.crearObj(), this.state.informeId);
            this.actualizarTablaMaterialesUtilizados(detalleActualizado);
            this.growl.show({ severity: 'success', detail: 'Material agregado!' });
        }
        this.cerrarDialogo();
    }

    actualizarTablaMaterialesUtilizados(data) {
        this.props.origen.setState({ materialesUtilizado: data });
    }

    crearObj() {
        return {
            id: this.state.id,
            nombre: this.state.nombre,
            unidad: this.state.unidad,
            cantidadSolicitada: this.state.cantidadSolicitada,
            cantidadUtilizada: this.state.cantidadUtilizada
        }
    }

    render() {
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Guardar" icon="pi pi-check" onClick={this.operar} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={this.cerrarDialogo} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Dialog header={this.state.id > 0 ? "Editar Material Utilizado" : "Nuevo Material Utilizado"} visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Material</label>
                            <Dropdown appendTo={document.body} value={this.state.nombre} editable={true} options={this.state.catalogoProductos}
                                onChange={(e) => { this.setState({ nombre: e.value }) }} filter={true} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Unidad</label>
                            <Dropdown appendTo={document.body} value={this.state.unidad} editable={true} options={this.state.unidadesCatalogo}
                                onChange={(e) => { this.setState({ unidad: e.value }) }} filter={true} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Cantidad Solicitada</label>
                            <InputText keyfilter="num" value={this.state.cantidadSolicitada} onChange={(e) => this.setState({ cantidadSolicitada: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Cantidad Utilizada</label>
                            <InputText keyfilter="num" value={this.state.cantidadUtilizada} onChange={(e) => this.setState({ cantidadUtilizada: e.target.value })} />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }

}
export default FormMaterialUtilizado;
