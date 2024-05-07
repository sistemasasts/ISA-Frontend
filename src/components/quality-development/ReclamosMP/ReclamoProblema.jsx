import React, { Component } from 'react'
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import ReclamoMPService from '../../../service/ReclamoMPService';
import DefetoService from '../../../service/Pnc/DefectoService';
import "../../site.css";
import * as _ from "lodash";
import { tieneRol } from '../../../service/UsuarioSesionService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';

class ReclamoProblema extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            idReclamo: 0,
            problemas: [],
            mostrarControles: true,
            description: null,
            viewModalImg: false,
            srcImageVM: null,
            defecto: null,
            defectosCatalogo: []
        }
        this.actionTemplate = this.actionTemplate.bind(this);
        this.imageTemplate = this.imageTemplate.bind(this);
        this.limpiarUpload = this.limpiarUpload.bind(this);
        this.myUploader = this.myUploader.bind(this);
        this.registrar = this.registrar.bind(this);
        this.eliminarProblema = this.eliminarProblema.bind(this);
    }

    async componentDidMount() {
        const pnc = this.props.idReclamo;
        const problemas = this.props.problemas;
        const defectosCatalogo = await DefetoService.listarActivos();
        this.setState({
            idReclamo: pnc, problemas: problemas, mostrarControles: this.props.mostrarControles, defectosCatalogo: defectosCatalogo
        });
    }

    imageTemplate(rowData, column) {
        return <div>
            <img style={{ width: '30%', borderRadius: '7px' }} src={rowData.base64} onClick={() => this.setState({ viewModalImg: true, srcImageVM: rowData.base64 })} />
        </div>
    }

    actionTemplate(rowData, column) {
        return <div>
            {this.state.mostrarControles &&
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.setState({ id: rowData.id, description: rowData.description, display: true, 
                    defecto: {id: rowData.defectoId, nombre: rowData.description, activo: true}})}></Button>}
            {this.state.mostrarControles &&
                <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => this.eliminarProblema(rowData.id)}></Button>}
        </div>
    }

    limpiarUpload() {
        this.fileUploadRef.clear();
        this.setState({ descripcionImagen: '', imagenSubir: '', display: false })
    }

    myUploader(event) {
        this.setState({ imagenSubir: event.files[0] })
    }

    async registrar() {
        if (this.validarCamposRequeridos()) {
            let infoAditional = {};
            let formadata = new FormData();
            infoAditional.id = this.state.id;
            infoAditional.reclamoId = this.state.idReclamo;
            infoAditional.defectoId = this.state.defecto.id;
            infoAditional.description = this.state.defecto.nombre;
            if (this.state.imagenSubir)
                formadata.append('file', this.state.imagenSubir);
            else
                formadata.append('file', new File([], ''));
            formadata.append('info', JSON.stringify(infoAditional));
            await ReclamoMPService.agregarProblema(formadata);
            this.growl.show({ severity: 'success', detail: 'Registro agregado!' });
            this.refrescarLista();
        }
    }

    async refrescarLista() {
        const problemas = await ReclamoMPService.listarProblemas(this.state.idReclamo);
        this.setState({ problemas: problemas, display: false });
    }

    async eliminarProblema(problemaId) {
        const problemas = await ReclamoMPService.eliminarProblema(this.state.idReclamo, problemaId);
        this.growl.show({ severity: 'success', detail: 'Registro eliminado!' });
        this.setState({ problemas: problemas });
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []
        if (_.isEmpty(this.state.defecto)) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'defecto'; obj.obligatorio = true
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
            <Button className='p-button-success' label="Guardar" icon="pi pi-save" onClick={this.registrar} />
            <Button className='p-button-danger' icon="fa fa-trash" label="Cancelar" onClick={() => this.setState({ display: false, description: null, imagenSubir: null })} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className='p-col-12 p-lg-12 caja' >DETALLE PROBLEMAS</div>

                <DataTable value={this.state.problemas} header={header}>
                    {this.state.mostrarControles &&<Column body={this.actionTemplate} style={{ width: '10%', textAlign: 'center' }} />}
                    <Column body={this.imageTemplate} header="Gráfico" style={{ width: '23%', textAlign: 'center' }} />
                    <Column field="description" header="Descripción" />
                </DataTable>


                <Dialog visible={this.state.display} header="Crear/Editar Problema" style={{ width: '40vw' }} footer={dialogFooterP} onHide={() => this.setState({ display: false, description: null, imagenSubir: null, id: 0 })}
                >
                    <div className="p-grid p-grid-responsive p-fluid">
                        
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Defecto</label>
                            <Dropdown appendTo={document.body} options={this.state.defectosCatalogo} optionLabel="nombre" value={this.state.defecto} autoWidth={false}
                                onChange={(e) => this.setState({ defecto: e.value })}
                                placeholder="Seleccione ..." />
                            {this.determinarEsCampoRequerido('defecto') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className="p-col-12 p-lg-12">
                            <label htmlFor="accion">Seleccione Imagen</label>
                            <FileUpload ref={(el) => this.fileUploadRef = el} name="demo[]" customUpload={true} chooseLabel="Seleccione" auto={true} uploadHandler={this.myUploader} accept="image/*" />
                        </div>

                    </div>
                </Dialog>

                <Dialog visible={this.state.viewModalImg} style={{ width: '40vw', justifyContent: 'center', textAlign: 'center' }} onHide={() => this.setState({ viewModalImg: false })} closeOnEscape >
                    <img src={this.state.srcImageVM} alt="Galleria 1" style={{ width: '500px', borderRadius: '7px' }} />
                </Dialog>
            </div>

        )
    }
}

export default ReclamoProblema;