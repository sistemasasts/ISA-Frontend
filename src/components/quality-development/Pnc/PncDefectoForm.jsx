import React, { Component } from 'react'
import * as _ from "lodash";
import * as moment from 'moment';
import UnidadMedidaService from '../../../service/UnidadMedidaService';
import DefetoService from '../../../service/Pnc/DefectoService';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import PncService from '../../../service/Pnc/PncService';

class PncDefectoForm extends Component {

    constructor() {
        super();
        this.state = {
            idPnc: 0,
            id: 0,
            defecto: null,
            cantidad: null,
            unidad: null,
            ubicacion: null,
            validez: null,
            imagenSubir: null,

            display: false,
            unidadesCatalogo: [],
            defectosCatalogo: []
        }

        this.cerrarDialogo = this.cerrarDialogo.bind(this);
        this.operar = this.operar.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.myUploaderImagen = this.myUploaderImagen.bind(this);

    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.origen);
        }
    }

    async fetchData(data) {
        const mostrar = data.state.mostrarForm;
        const itemSeleccionado = data.state.defectoSeleccionado;
        console.log(data);

        console.log(itemSeleccionado);
        const unidades = await UnidadMedidaService.listarActivos();
        const defectosCatalogo = await DefetoService.listarActivos();
        if (itemSeleccionado) {
            this.setState({
                idPnc: data.state.idPnc,
                display: mostrar,
                id: itemSeleccionado.id,
                cantidad: itemSeleccionado.cantidad,
                unidad: itemSeleccionado.unidad ? itemSeleccionado.unidad.id : null,
                ubicacion: itemSeleccionado.ubicacion,
                defecto: itemSeleccionado.defecto,
                validez: itemSeleccionado.validez,

                unidadesCatalogo: unidades,
                defectosCatalogo: defectosCatalogo
            });
        } else {
            this.setState({ idPnc: data.state.idPnc, display: mostrar, unidadesCatalogo: unidades, defectosCatalogo: defectosCatalogo });
        }
    }

    async componentDidMount() {
        this.fetchData(this.props.origen);
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarForm: false, defectoSeleccionado: null })
        this.setState({
            display: false,
            id: null,
            idPnc: null,
            cantidad: null,
            unidad: null,
            ubicacion: null,
            defecto: null,
            validez: null,
            imagenSubir: null,
            camposObligatorios: []
        })
    }

    async operar() {
        if (this.validarCamposRequeridos()) {
            if (this.state.id && this.state.id > 0) {
                const actualizado = await PncService.actualizarDefecto(this.crearObj());
                this.actualizarTablaDefectos(actualizado);
                this.growl.show({ severity: 'success', detail: 'Defecto actualizado!' });
            } else {
                const actualizado = await PncService.agregarDefecto(this.crearObj());
                this.actualizarTablaDefectos(actualizado);
                this.growl.show({ severity: 'success', detail: 'Defecto agregado!' });
            }
            this.cerrarDialogo();
        }
    }

    actualizarTablaDefectos(defectosActualizados) {
        console.log(defectosActualizados);
        this.props.origen.setState({ defectos: defectosActualizados });
    }


    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []
        if (this.state.cantidad === null) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'cantidad'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.unidad === null) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'unidad'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (_.isEmpty(this.state.ubicacion)) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'ubicacion'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
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
        /* this.state.camposObligatorios.map(function (campo) {
            if (campo.campo === nombreCampo)
                resultado = true
        }) */
        return resultado;
    }

    myUploaderImagen(event) {
        this.setState({ imagenSubir: event.files[0] })
    }

    crearObj() {
        let infoAditional = {};
        let formadata = new FormData();
        if (this.state.id > 0)
            infoAditional.id = this.state.id;
        infoAditional.cantidad = this.state.cantidad;
        infoAditional.defecto = this.state.defecto;
        infoAditional.unidad = this.state.unidad ? { id: this.state.unidad } : null;
        infoAditional.validez = this.state.validez;
        infoAditional.ubicacion = this.state.ubicacion;
        infoAditional.productoNoConformeId = this.state.idPnc;
        if (this.state.imagenSubir)
            formadata.append('file', this.state.imagenSubir);
        else
            formadata.append('file', new File([], ''));
        formadata.append('info', JSON.stringify(infoAditional));
        return formadata;
    }

    render() {
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Guardar" icon="pi pi-check" onClick={this.operar} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={this.cerrarDialogo} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Dialog header={this.state.id > 0 ? "Editar Defecto" : "Nuevo Defecto"} visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Cantidad</label>
                            <InputText keyfilter="num" value={this.state.cantidad} onChange={(e) => this.setState({ cantidad: e.target.value })} />
                            {this.determinarEsCampoRequerido('cantidad') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>

                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Unidad</label>
                            <Dropdown appendTo={document.body} options={this.state.unidadesCatalogo} value={this.state.unidad} autoWidth={false} onChange={(e) => this.setState({ unidad: e.value })}
                                placeholder="Selecione" />
                            {this.determinarEsCampoRequerido('unidad') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>

                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Ubicación</label>
                            <InputText value={this.state.ubicacion} onChange={(e) => this.setState({ ubicacion: e.target.value })} />
                            {this.determinarEsCampoRequerido('ubicacion') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>

                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Defecto</label>
                            <Dropdown appendTo={document.body} options={this.state.defectosCatalogo} optionLabel="nombre" value={this.state.defecto} autoWidth={false}
                                onChange={(e) => this.setState({ defecto: e.value })}
                                placeholder="Selecione" />
                            {this.determinarEsCampoRequerido('defecto') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>

                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Validez</label>
                            <InputText keyfilter="num" value={this.state.validez} onChange={(e) => this.setState({ validez: e.target.value })} />
                            {this.determinarEsCampoRequerido('validez') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>

                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Agregar/Actualizar Imagen</label>
                            <FileUpload ref={(el) => this.fileUploadRefIM = el} name="demo" customUpload={true} auto={true}
                                uploadHandler={this.myUploaderImagen} accept="image/*" chooseLabel='Seleccione Imagen' uploadLabel='Subir Imagen' />

                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }

}

export default PncDefectoForm;