import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import InformeSPPService from '../../../../service/SolicitudPruebaProceso/InformeSPPService';
import { Growl } from 'primereact/growl';
import { CatalogoService } from '../../../../service/CatalogoService';

class FormCondicionOperacion extends Component {

    constructor() {
        super();
        this.state = {
            id: null,
            proceso: null,
            observacion: null,
            display: false,
            nombreVentana: '',
            tipo: null,
            procesoCatalogo: []
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
        const mostrar = data.state.mostrarFormCondicionOperacion;
        const itemSeleccionado = data.state.seleccionadoCondicionOperacion;
        const informe = this.props.informeId;
        const tipo = this.props.tipo;
        if (itemSeleccionado) {
            this.setState({
                informeId: informe,
                display: mostrar,
                id: itemSeleccionado.id,
                proceso: itemSeleccionado.proceso,
                observacion: itemSeleccionado.observacion,
                tipo: tipo
            });
        } else {
            this.setState({ informeId: informe, display: mostrar, tipo: tipo });
        }
        this.obtenerCatalgoProceso();
    }

    componentDidMount() {
        this.fetchData(this.props.origen);
    }

    obtenerCatalgoProceso() {
        this.catalogoService.getProcesoCondicionOperacion().then(data => this.setState({ procesoCatalogo: data }));
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarFormCondicionOperacion: false, seleccionadoCondicionOperacion: null })
        this.setState({
            display: false, id: null, proceso: null,
            observacion: null,
            nombreVentana: '',
            tipo: null,
            procesoCatalogo: [],
        })
    }

    async operar() {
        if (this.state.id && this.state.id > 0) {
            const detalleActualizado = await InformeSPPService.editarCondicionOperacion(this.crearObj(), this.state.informeId);
            this.actualizarTablaCondicionesOperacion(detalleActualizado);
            this.growl.show({ severity: 'success', detail: 'Condición operación actualizado!' });
        } else {
            const detalleActualizado = await InformeSPPService.agregarCondicionOperacion(this.crearObj(), this.state.informeId);
            this.actualizarTablaCondicionesOperacion(detalleActualizado);
            this.growl.show({ severity: 'success', detail: 'Condición operación agregado!' });
        }
        this.cerrarDialogo();
    }

    actualizarTablaCondicionesOperacion(data) {
        this.props.origen.setState({ condicionesOperacion: data });
    }

    crearObj() {
        return {
            id: this.state.id,
            proceso: this.state.proceso,
            observacion: this.state.observacion,
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
                <Dialog header={this.state.id > 0 ? "Editar Condición Operación" : "Nuevo Condición Operación"} visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.setState({ display: false })} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Proceso</label>
                            <Dropdown appendTo={document.body} value={this.state.proceso} editable={true} options={this.state.procesoCatalogo}
                                onChange={(e) => { this.setState({ proceso: e.value }) }} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Observación</label>
                            <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }

}
export default FormCondicionOperacion;
