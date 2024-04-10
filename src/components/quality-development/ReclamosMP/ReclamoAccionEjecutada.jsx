import React, { Component } from 'react'
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import ReclamoMPService from '../../../service/ReclamoMPService';
import "../../site.css";
import * as _ from "lodash";
import { tieneRol } from '../../../service/UsuarioSesionService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import UsuarioService from '../../../service/UsuarioService'
import * as moment from 'moment';

class ReclamoAccionEjecutada extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            idReclamo: 0,
            accionesEjecutadas: [],
            mostrarControles: true,
            description: null,
            viewModalImg: false,
            srcImageVM: null,

            descripcion: null,
            fechaInicio: null,
            fechaFin: null,
            responsable: null,

            usuarios: [],
            camposObligatorios: []
        }
        this.actionTemplate = this.actionTemplate.bind(this);

        this.limpiarUpload = this.limpiarUpload.bind(this);
        this.myUploader = this.myUploader.bind(this);
        this.operar = this.operar.bind(this);
        this.eliminarProblema = this.eliminarProblema.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.prepararDatosEditar = this.prepararDatosEditar.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    async componentDidMount() {
        const pnc = this.props.idReclamo;
        const problemas = this.props.problemas;
        this.setState({
            idReclamo: pnc, accionesEjecutadas: problemas, mostrarControles: this.props.mostrarControles
        });
    }

    actionTemplate(rowData, column) {
        return <div>
            {this.state.mostrarControles &&
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.prepararDatosEditar(rowData)}></Button>}
            {this.state.mostrarControles &&
                <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => this.eliminarProblema(rowData.id)}></Button>}
        </div>
    }

    prepararDatosEditar(plan) {
        this.setState({
            id: plan.id,
            descripcion: plan.description,
            display: true
        })
    }

    cancelar() {
        this.setState({
            id: 0,
            descripcion: null,
            display: false
        })
    }

    limpiarUpload() {
        this.fileUploadRef.clear();
        this.setState({ descripcionImagen: '', imagenSubir: '', display: false })
    }

    myUploader(event) {
        this.setState({ imagenSubir: event.files[0] })
    }

    async operar() {
        if (this.validarCamposRequeridos()) {
            var data;
            if (this.state.id && this.state.id > 0) {
                data = await ReclamoMPService.actualizarAccionEjecutada(this.crearObj());
                this.growl.show({ severity: 'success', detail: 'Plan de acción actualizado!' });
            } else {
                data = await ReclamoMPService.crearAccionEjecutada(this.crearObj());
                this.growl.show({ severity: 'success', detail: 'Plan de acción agregado!' });
            }

            this.setState({ accionesEjecutadas: data, display: false, descripcion: null });
        }
    }

    crearObj() {
        console.log(this.state)
        return {
            id: this.state.id,
            idReclamo: this.state.idReclamo,
            description: this.state.descripcion
        }
    }


    async eliminarProblema(problemaId) {
        const problemas = await ReclamoMPService.eliminarAccionEjecutada(this.state.idReclamo, problemaId);
        this.growl.show({ severity: 'success', detail: 'Registro eliminado!' });
        this.setState({ accionesEjecutadas: problemas });
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []
        if (_.isEmpty(this.state.descripcion)) {
            let obj = { campo: 'descripcion', obligatorio: true }
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

        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            {this.state.mostrarControles &&
                <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => this.setState({ display: true })} />
            }
        </div>;
        let dialogFooterP = <div className="p-dialog-buttonpane p-helper-clearfix">
            <Button className='p-button-success' label="Guardar" icon="pi pi-save" onClick={this.operar} />
            <Button className='p-button-danger' icon="fa fa-trash" label="Cancelar" onClick={this.cancelar} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className='p-col-12 p-lg-12 caja' >ACCIONES EJECUTADAS</div>

                <DataTable value={this.state.accionesEjecutadas} header={header}>
                    {this.state.mostrarControles && <Column body={this.actionTemplate} style={{ width: '10%', textAlign: 'center' }} />}
                    <Column field="description" header="Descripción" />
                </DataTable>


                <Dialog visible={this.state.display} header="Crear/Editar Acción Ejecutada" style={{ width: '30vw' }} footer={dialogFooterP} onHide={this.cancelar}
                >
                    <div className="p-grid p-grid-responsive p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Descripción</label>
                            <InputTextarea className={this.determinarEsCampoRequerido('descripcion') && 'p-error'} value={this.state.descripcion} onChange={(e) => this.setState({ descripcion: e.target.value })} rows={3} />
                            {this.determinarEsCampoRequerido('descripcion') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                    </div>
                </Dialog>
            </div>

        )
    }
}

export default ReclamoAccionEjecutada;