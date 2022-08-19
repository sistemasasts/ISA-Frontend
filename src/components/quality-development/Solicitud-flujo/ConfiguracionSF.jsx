import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';
import { openModal, closeModal } from '../../../store/actions/modalWaitAction';
import ConfigSolicitudSEServices from '../../../service/ConfigSolicitudSEServices';
import UsuarioService from '../../../service/UsuarioService';

var that;
class ConfiguracionSF extends Component {

    constructor() {
        super();
        this.state = {
            tiposSolicitud: [],
            tipoSolicitdu: null,
            ordenFlujo: [],
            configuraciones: [],
            usuarios: [],
            selectedConfiguracion: null,
            configuracion: null,
            displayDialog: false,

        };
        that = this;
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onCarSelect = this.onCarSelect.bind(this);
        this.addNew = this.addNew.bind(this);
    }

    async componentDidMount() {
        const catalog = await ConfigSolicitudSEServices.listarTodos();
        const catalogo_tipoSolicitud = await ConfigSolicitudSEServices.listarTipoSolicitud();
        const catalogo_ordenFlujo = await ConfigSolicitudSEServices.listarOrdenFlujo();
        const catalogo_usuarios = await UsuarioService.list();
        this.setState({ configuraciones: catalog, tiposSolicitud: catalogo_tipoSolicitud, ordenFlujo: catalogo_ordenFlujo, usuarios: catalogo_usuarios });
    }

    async refrescarLista() {
        const listConfigurations = await ConfigSolicitudSEServices.listarTodos();
        this.setState({ configuraciones: listConfigurations })
    }

    onSave() {
        let configuraciones = [...this.state.configuraciones];
        /* if (this.newCar)
            configuraciones.push(this.state.configuracion);
        else
            configuraciones[this.findSelectedCarIndex()] = this.state.configuracion; */
        this.guardar();

        this.setState({ configuraciones: configuraciones, selectedConfiguracion: null, configuracion: null, displayDialog: false });
    }

    async guardar() {
        if (this.state.configuracion !== null) {
            debugger;
            await ConfigSolicitudSEServices.create(this.state.configuracion);
            let msg = { severity: 'success', summary: 'Configuración', detail: 'Creada con éxito' };
            this.growl.show(msg);
            this.refrescarLista();

        } else {
            this.messages.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar el grupo y una propiedad.' });
        }
    }

    onDelete() {
        let index = this.findSelectedCarIndex();
        this.eliminar();
        this.setState({
            //configuraciones: this.state.configuraciones.filter((val, i) => i !== index),
            selectedConfiguracion: null,
            configuracion: null,
            displayDialog: false
        });
    }

    async eliminar() {
        const a = await ConfigSolicitudSEServices.delete(this.state.configuracion.id);
        console.log(a);
        let msg = { severity: 'success', summary: 'Configuración', detail: 'Eliminada' };
        this.growl.show(msg);
        this.refrescarLista();
    }

    findSelectedCarIndex() {
        return this.state.configuraciones.indexOf(this.state.selectedConfiguracion);
    }

    updateProperty(property, value) {
        let car = this.state.configuracion;
        car[property] = value;
        this.setState({ car: car });
    }

    onCarSelect(e) {
        this.newCar = false;
        this.setState({
            displayDialog: true,
            configuracion: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newCar = true;
        this.setState({
            configuracion: { id: 0, usuario: {}, tipoSolicitud: '', orden: '' },
            displayDialog: true
        });
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Agregar" icon="pi pi-plus" onClick={this.addNew} />
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Eliminar" icon="pi pi-times" className="p-button-danger" onClick={this.onDelete} />
            <Button label="Guardar" icon="pi pi-check" onClick={this.onSave} />
        </div>;
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>Configuración de Roles a Usuarios en Flujo Solicitud de Ensayos</strong></h3>
                <DataTable value={this.state.configuraciones} paginator={true} rows={15} header={header}
                    selectionMode="single" selection={this.state.selectedConfiguracion} onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                    onRowSelect={this.onCarSelect}>
                    <Column field="usuario.employee.completeName" header="Usuario" sortable={true} />
                    <Column field="orden" header="Rol-Acción" sortable={true} />
                    <Column field="tipoSolicitud" header=" Tipo Solicitud" sortable={true} />
                </DataTable>

                <Dialog visible={this.state.displayDialog} style={{ width: '500px' }} header="Configuración" modal={true} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                    blockScroll={false}>
                    {
                        this.state.configuracion &&

                        <div className="p-grid p-fluid">
                            <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="vin">Usuario</label></div>
                            <div className="p-col-8" style={{ padding: '.5em' }}>
                                <Dropdown value={this.state.configuracion.usuario} optionLabel='nickName' options={this.state.usuarios} onChange={(e) => { this.updateProperty('usuario', e.value) }} placeholder="Seleccione" />
                            </div>

                            <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="brand">Rol-Acción</label></div>
                            <div className="p-col-8" style={{ padding: '.5em' }}>
                                <Dropdown value={this.state.configuracion.orden} options={this.state.ordenFlujo} onChange={(e) => { this.updateProperty('orden', e.value) }} placeholder="Seleccione" />
                            </div>

                            <div className="p-col-4" style={{ padding: '.75em' }}><label htmlFor="year">Tipo Solicitud</label></div>
                            <div className="p-col-8" style={{ padding: '.5em' }}>
                                <Dropdown value={this.state.configuracion.tipoSolicitud} options={this.state.tiposSolicitud} onChange={(e) => { this.updateProperty('tipoSolicitud', e.value) }} placeholder="Seleccione" />
                            </div>
                        </div>
                    }
                </Dialog>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        openModal: () => dispatch(openModal()),
        closeModal: () => dispatch(closeModal()) // will be wrapped into a dispatch call
    }

};


const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfiguracionSF);