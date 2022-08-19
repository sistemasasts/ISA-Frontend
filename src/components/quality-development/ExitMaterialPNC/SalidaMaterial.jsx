import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import SalidaMaterialService from '../../../service/SalidaMaterialService';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import history from '../../../history';
import ExitMaterial from './OutputMaterial.js'
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';

var that;
class SalidaMaterial extends Component {

    constructor() {
        super();
        this.state = {
            salidaMaterial: [],
            idPNC: null,
            nombreProducto: null,
            cantidadPnc: 0,
            cantidadStock: 0,
            tipoProducto: null,
            unidad: null,
            editForm: false,
            salidaMaterialSelected: null
        };
        that = this;
        this.showMessage=this.showMessage.bind(this);
    }

     /* Metodo para lanzar mensajes */
     showMessage(message, type) {
        switch (type) {
            case 'error':
                this.growl.show({ severity: 'error', summary: 'Error', detail: message });
                break;
            case 'success':
                this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
                break;
            case 'info':
                this.growl.show({ severity: 'info', summary: 'Información', detail: message });
                break;
            default: break;
        }
    }

    async componentDidMount() {
        this.actualizar();

    }

    async actualizar() {
        const historial = await SalidaMaterialService.list(parseInt(this.props.match.params.idpnc));
        this.setState({
            salidaMaterial: historial.salidaMaterialHistorial,
            idPNC: historial.idPNC,
            nombreProducto: historial.nombreProducto,
            cantidadPnc: historial.cantidadInicial,
            cantidadStock: historial.cantidadStock,
            tipoProducto: historial.tipoProducto,
            unidad: historial.unidad,
        })

    }

    async eliminar() {
        await SalidaMaterialService.delete(this.state.salidaMaterialSelected.idEMH);
        this.setState({ dialogVisible: false });
        this.actualizar();
        this.showMessage('Registro eliminado con éxito !', 'success')
    }


    /* Template para accion en Tabla  */
    actionTemplate(rowData, column) {

        return <div>
            <Button type="button" icon='pi pi-pencil' className="p-button-warning" onClick={() => that.setState({ editForm: true, salidaMaterialSelected: rowData })} ></Button>
            <Button type="button" icon='pi pi-trash' className="p-button-danger" onClick={() => that.setState({ dialogVisible: true })} ></Button>
        </div>;

    }



    render() {
        let actionHeader = <Button type="button" icon="pi pi-cog" />;
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-right">
                    <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
                </div>

                <div className="p-toolbar-group-left">
                    <Button label='Registrar' icon='pi pi-plus' onClick={() => this.setState({ editForm: true })} disabled={this.state.cantidadStock===0}/>
                </div>
            </Toolbar>
        </div>

        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={() => this.eliminar()} />
                <Button className='p-button-secondary' icon="pi pi-times" onClick={() => this.setState({ dialogVisible: false })} />
            </div>

        );

        return (
            <div className='p-grid dashboard'>
                <div className="p-col-12 p-lg-12">
                    <div className="card card-w-title" >
                    <Growl ref={(el) => this.growl = el} />
                        <div className='p-grid'>
                            <div className="p-col-12 p-md-6 p-lg-1 ">
                                <Button icon='pi pi-step-backward' tooltip="Regresar a PNC" onClick={() => history.push("/quality-development_pnc")} />

                            </div>
                            <div className="p-col-12 p-md-6 p-lg-3">
                                <div className="p-grid overview-box overview-box-1">
                                    <div className="overview-box-title">
                                        <i className="fa fa-file-text"></i>
                                    </div>
                                    <div className="overview-box-count">Código PNC: {this.state.idPNC}</div>
                                    <div className="overview-box-stats">Producto no conforme</div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-6 p-lg-3">
                                <div className="p-grid overview-box overview-box-1">
                                    <div className="overview-box-title">
                                        <i className="fa fa-product-hunt"></i>
                                        <span>PRODUCTO</span>
                                    </div>
                                    <div className="overview-box-count">{this.state.nombreProducto}</div>
                                    <div className="overview-box-stats">{this.state.tipoProducto}</div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-6 p-lg-3">
                                <div className="p-grid overview-box overview-box-5" style={{ background: '#f44336' }}>
                                    <div className="overview-box-title">
                                        <i className="fa fa-sort-amount-asc"></i>
                                        <span>CANTIDAD STOCK</span>
                                    </div>
                                    <div className="overview-box-count">{this.state.cantidadStock} {this.state.unidad}</div>
                                    <div className="overview-box-stats"> Cantidad no conforme total {this.state.cantidadPnc} {this.state.unidad}</div>
                                </div>
                            </div>
                        </div>
                        <Dialog header="Confirmación" visible={this.state.dialogVisible} width='300px' footer={dialogFooter} onHide={() => this.setState({ dialogVisible: false })}>
                            <div className="p-grid">
                                <div className="p-col-12">
                                    <span>Esta seguro de eliminar la salida de material seleccionada  ?                    </span>
                                </div>
                            </div>
                        </Dialog>


                        {!this.state.editForm &&
                            <DataTable ref={(el) => this.dt = el} value={this.state.salidaMaterial} header={header} selectionMode="single" paginator={true} rows={20}
                                responsive={true} selection={this.state.salidaMaterialSelected} onSelectionChange={event => this.setState({ salidaMaterialSelected: event.value })}>
                                <Column field="date" header="Fecha" filter sortable style={{ textAlign: 'center', width: '10%' }} />
                                <Column field="quantity" header="Cantidad" sortable filter style={{ textAlign: 'center', width: '10%' }} />
                                <Column field="type" header="Tipo Salida" sortable filter style={{ width: '10%' }} />
                                <Column field="description" header="Descripción" style={{ width: '50%' }} />
                                <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                            </DataTable>}

                        {this.state.editForm &&
                            <ExitMaterial _this={this} />
                        }

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

export default connect(mapStateToProps)(SalidaMaterial)
