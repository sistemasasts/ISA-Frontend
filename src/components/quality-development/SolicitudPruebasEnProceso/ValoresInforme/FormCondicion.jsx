import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import InformeSPPService from '../../../../service/SolicitudPruebaProceso/InformeSPPService';
import { Growl } from 'primereact/growl';
import { CatalogoService } from '../../../../service/CatalogoService';
import { InputText } from 'primereact/inputtext';

class FormCondicion extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            informeId: null,
            condicionOperacionId: null,
            nombre: null,
            valor: null,
            unidad: null,
            maquinaria: null,
            display: false,
            nombreVentana: '',
            tipo: null,
            unidadesCatalogo: [],
            condicionesCatalogo: [],
            maquinariaCatalogo: []
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
        const mostrar = data.state.mostrarFormCondicion;
        const itemSeleccionado = data.state.seleccionadoCondicion;
        const informe = this.props.informeId;
        const condicionOperacion = this.props.condicionOperacionId;
        const tipo = this.props.tipo;
        if (itemSeleccionado) {
            this.setState({
                informeId: informe,
                condicionOperacionId: condicionOperacion,
                display: mostrar,
                id: itemSeleccionado.id,
                nombre: itemSeleccionado.nombre,
                unidad: itemSeleccionado.unidad,
                valor: itemSeleccionado.valor,
                maquinaria: itemSeleccionado.maquinaria,
                tipo: tipo
            });
        } else {
            this.setState({ informeId: informe, condicionOperacionId: condicionOperacion, display: mostrar, tipo: tipo });
        }
        this.obtenerCatalgoUnidades();
    }

    componentDidMount() {
        this.fetchData(this.props.origen);
    }

    obtenerCatalgoUnidades() {
        this.catalogoService.getUnidadesMedida().then(data => this.setState({ unidadesCatalogo: data }));
        this.catalogoService.getProcesoCondicion().then(data => this.setState({ condicionesCatalogo: data }));
        this.catalogoService.getProcesoCondicionMaquinaria().then(data => this.setState({ maquinariaCatalogo: data }));
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarFormCondicion: false, seleccionadoCondicion: null })
        this.setState({
            display: false, id: null,
            informeId: null,
            condicionOperacionId: null,
            nombre: null,
            valor: null,
            unidad: null,
            maquinaria: null,
            nombreVentana: '',
            tipo: null,
            unidadesCatalogo: [],
            condicionesCatalogo: []
        })
    }

    async operar() {
        if (this.state.id && this.state.id > 0) {
            const detalleActualizado = await InformeSPPService.editarCondicion(this.crearObj(), this.state.informeId);
            this.actualizarTablaCondiciones(detalleActualizado);
            this.growl.show({ severity: 'success', detail: 'Condición actualizado!' });
        } else {
            const detalleActualizado = await InformeSPPService.agregarCondicion(this.crearObj(), this.state.informeId);
            this.actualizarTablaCondiciones(detalleActualizado);
            this.growl.show({ severity: 'success', detail: 'Condición agregado!' });
        }
        this.cerrarDialogo();
    }

    actualizarTablaCondiciones(data) {
        this.props.origen.setState({ condicionesOperacion: data });
    }

    crearObj() {
        return {
            id: this.state.id,
            nombre: this.state.nombre,
            valor: this.state.valor,
            unidad: this.state.unidad,
            maquinaria: this.state.maquinaria,
            condicionOperacionId: this.state.condicionOperacionId,
            tipo: this.state.tipo
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
                <Dialog header={this.state.id > 0 ? "Editar Condición" : "Nueva Condición"} visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.setState({ display: false })} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        {this.state.tipo === 'MANTENIMIENTO' &&
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Maquinaria</label>
                                <Dropdown appendTo={document.body} value={this.state.maquinaria} editable={true} options={this.state.maquinariaCatalogo}
                                    onChange={(e) => { this.setState({ maquinaria: e.value }) }} />
                            </div>
                        }
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Condición</label>
                            <Dropdown appendTo={document.body} value={this.state.nombre} editable={true} options={this.state.condicionesCatalogo}
                                onChange={(e) => { this.setState({ nombre: e.value }) }} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Unidad</label>
                            <Dropdown appendTo={document.body} value={this.state.unidad} editable={true} options={this.state.unidadesCatalogo}
                                onChange={(e) => { this.setState({ unidad: e.value }) }} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Valor</label>
                            <InputText keyfilter="num" value={this.state.valor} onChange={(e) => this.setState({ valor: e.target.value })} />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }

}
export default FormCondicion;
