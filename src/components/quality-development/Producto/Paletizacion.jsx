import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Editor } from 'primereact/editor';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../../store/actions/modalWaitAction';
import ProductoService from '../../../service/productoService';
import InformationAditionalService from '../../../service/InformationAditionalService';
import InformationAditionalFileService from '../../../service/InformationAditionalFileService';
import { FileUpload } from 'primereact/fileupload';
import * as _ from "lodash";
import { DataView } from 'primereact/dataview';
import { Panel } from 'primereact/panel';
import { InputTextarea } from 'primereact/inputtextarea';
import { Messages } from 'primereact/messages';

var that;
class Paletizacion extends Component {

    constructor() {
        super();
        this.state = {
            idProduct: null,
            productoSeleccionado: null,
            listaCriterios: [],
            criterio: null,
            criterioSeleccionado: null,
            displayDialog: false,
            displayDialogImagenes: false,
            descripcionImagen: null,
            imagenSubir: null,
            listaImagenes: [],
            dialogConfirmacion: false,
            mensajeEliminacion: null,
            fileSeleccionado: null,
            tipoEliminacion: null

        };
        that = this;
        this.onSave = this.onSave.bind(this);
        //this.onDelete = this.onDelete.bind(this);
        this.onCarSelect = this.onCarSelect.bind(this);
        this.addNew = this.addNew.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.myUploader = this.myUploader.bind(this);
        this.guardarImagen = this.guardarImagen.bind(this);
        this.crearAprobacionCriterio = this.crearAprobacionCriterio.bind(this);
        this.abrirDialogoImagenes = this.abrirDialogoImagenes.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.limpiarUpload = this.limpiarUpload.bind(this);
    }

    componentDidMount() {
        this.fetchData(this.props.producto);
    }

    componentDidUpdate(prevProps) {
        if (this.props.producto !== prevProps.producto) {
            console.log(this.props.producto);
            this.fetchData(this.props.producto);
        }
    }

    fetchData(data) {
        this.setState({ productoSeleccionado: data, listaCriterios: data ? data.detailPaletizado : [] });
    }

    async onSave() {
        debugger
        let criterios = [...this.state.listaCriterios];
        if (this.newCaracteristica) {
            this.props.openModal();
            const crieriosActualizado = await ProductoService.registrarApprobationCriteria(this.state.productoSeleccionado.idProduct, this.state.criterio);
            criterios = crieriosActualizado;
            this.props.closeModal();
        }
        else {
            this.props.openModal();
            const crierioActualizado = await InformationAditionalService.actualizar(this.state.criterio);
            criterios[this.findSelectedCarIndex()] = crierioActualizado;
            this.props.closeModal();
        }
        this.refrescarData();
        this.setState({ listaCriterios: criterios, criterioSeleccionado: null, criterio: null, displayDialog: false });
    }



    onCarSelect(e) {
        this.newCaracteristica = false;
        this.setState({
            displayDialog: true,
            criterio: Object.assign({}, e)
        });
    }

    findSelectedCarIndex() {
        return this.state.listaCriterios.indexOf(this.state.criterioSeleccionado);
    }

    updateProperty(property, value) {
        let car = this.state.criterio;
        car[property] = value;
        this.setState({ criterio: car });
    }

    addNew() {
        this.newCaracteristica = true;
        this.setState({
            criterio: { description: '', type:'CARATERISTICAS_PALETIZADO' },
            displayDialog: true
        });
    }

    actionTemplateCriteria(rowData, column) {
        var regex = /(<([^>]+)>)/ig
        const description = _.replace(rowData.description, regex, "");
        return <div>{description}</div>;
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => that.onCarSelect(rowData)} />
            <Button type="button" icon="pi pi-images" className="p-button-success" onClick={() => that.abrirDialogoImagenes(rowData.id)} />
            <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => that.abrirDialogoConfirmacion(rowData, "CRITERIO")} />
        </div>
    }

    abrirDialogoConfirmacion(objeto, tipoConfirmacion) {
        if (tipoConfirmacion === 'CRITERIO') {
            this.setState({ criterioSeleccionado: objeto, dialogConfirmacion: true, mensajeEliminacion: 'Criterio de aceptación', tipoEliminacion: 'CRITERIO' });
        } else {
            this.setState({ fileSeleccionado: objeto, dialogConfirmacion: true, mensajeEliminacion: 'la imagen', tipoEliminacion: 'FILE' });
        }
    }

    async abrirDialogoImagenes(id) {
        console.log(id)
        const imgs = await InformationAditionalService.leerImagenes(id);
        this.setState({ displayDialogImagenes: true, listaImagenes: imgs })
    }

    itemTemplate(file) {
        if (!file) {
            return;
        }
        return (
            <div style={{ padding: '.5em' }} className="p-col-12 p-md-3">
                <Panel header={this.headerImg(file)} style={{ textAlign: 'center' }}>
                    <img style={{ width: '60%', borderRadius: '7px' }} src={file.base64} />
                    <div className="car-detail">{file.description}</div>
                </Panel>
            </div>
        )
    }

    headerImg(file) {
        return (
            <Button label='Eliminar' className="p-button-danger" icon="pi pi-trash" onClick={() => this.abrirDialogoConfirmacion(file, "FILE")}></Button>
        )
    }

    limpiarUpload() {
        this.setState({ descripcionImagen: '', imagenSubir: '' })
    }

    myUploader(event) {
        this.setState({ imagenSubir: event.files[0] })
    }

    async refrescarListaImagenes(criterioId) {
        const imgs = await InformationAditionalService.leerImagenes(criterioId);
        this.setState({ listaImagenes: imgs })
    }

    async guardarImagen() {
        if (_.isEmpty(this.state.descripcionImagen) || _.isEmpty(this.state.imagenSubir)) {
            this.messages.show({ severity: 'error', summary: 'Error', detail: 'Favor seleccione una imagen y agrege una descrición.' });
            return false;
        }
        this.props.openModal();
        const criterio = await InformationAditionalService.agregarImagen(this.crearAprobacionCriterio());
        this.props.closeModal();
        this.limpiarUpload();
        this.refrescarListaImagenes(criterio.id);
        this.messages.show({ severity: 'success',detail: 'Imagen agregada satisfactoriamente' });
    }

    crearAprobacionCriterio() {
        let infoAditional = {};
        let formadata = new FormData();
        infoAditional.criteriaId = this.state.criterioSeleccionado.id;
        infoAditional.description = this.state.descripcionImagen;
        infoAditional.nameFile = this.state.imagenSubir.name;
        formadata.append('file', this.state.imagenSubir);
        formadata.append('info', JSON.stringify(infoAditional));
        return formadata;
    }

    async eliminar() {
        if (this.state.tipoEliminacion === 'CRITERIO') {
            const a = await InformationAditionalService.eliminar(this.state.criterioSeleccionado.id);
        } else {
            const a = await InformationAditionalFileService.eliminar(this.state.fileSeleccionado.id);
            this.refrescarListaImagenes(this.state.criterioSeleccionado.id);
        }
        this.setState({ dialogConfirmacion: false });
        this.refrescarData();
    }

    refrescarData() {
        this.props._this.refrescarProducto();
    }

    render() {
        const headerEditor = (
            <div>
                <span className="ql-formats">
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                </span>
            </div>
        );

        let footer = <div className="p-clearfix">
            <Button style={{ float: 'left' }} icon="pi pi-plus" onClick={this.addNew} />
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Aceptar" icon="pi pi-check" onClick={this.onSave} />
            <Button label="Cancelar" icon="pi pi-times" className='p-button-secondary' onClick={() => this.setState({ displayDialog: false })} />
        </div>;
        const dialogFooterConfirmacion = (
            <div>
                <Button label="SI" icon="pi pi-check" onClick={() => this.eliminar()} />
                <Button label="NO" className='p-button-secondary' icon="pi pi-times" onClick={() => this.setState({ dialogConfirmacion: false })} />
            </div>
        );
        return (
            <div>
                <DataTable value={this.state.listaCriterios} footer={footer}
                    selectionMode="single" selection={this.state.criterioSeleccionado} onSelectionChange={e => this.setState({ criterioSeleccionado: e.value })}
                >
                    <Column body={this.actionTemplateCriteria} header="Descripción de Criterios" />
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>
                <Dialog visible={this.state.displayDialog} style={{ width: '500px', }} header="Característica de Paletización" modal={true} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                    blockScroll={false}>
                    {
                        this.state.criterio &&

                        <div className="p-grid p-fluid">
                            <div className="p-col-12" style={{ padding: '.5em' }}>
                                <Editor headerTemplate={headerEditor} style={{ height: '220px' }} value={this.state.criterio.description}
                                    onTextChange={(e) => { this.updateProperty('description', e.htmlValue) }} />
                            </div>
                        </div>
                    }
                </Dialog>
                <Dialog visible={this.state.displayDialogImagenes} style={{ width: '900px', }} header="Criterio Imágenes" modal={true} onHide={() => this.setState({ displayDialogImagenes: false })}
                    blockScroll={true}>

                    <div className="p-grid">
                        <div className='p-col-12 p-lg-4'>
                            <FileUpload name="demo[]" customUpload={true} chooseLabel="Seleccione" auto={true} uploadHandler={this.myUploader} accept="image/*" />
                        </div>
                        <div className='p-col-12 p-lg-6'>
                            <InputTextarea placeholder="Descripción de la imagen a subir" rows={4} value={this.state.descripcionImagen} onChange={(e) => this.setState({ descripcionImagen: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-2'>
                            <Button label="Agregar" icon="pi pi-plus" onClick={() => this.guardarImagen()} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <Messages ref={(el) => this.messages = el}></Messages>
                        </div>
                        <div className="p-col-12 p-lg-12" style={{ padding: '.5em' }}>
                            {this.state.criterioSeleccionado &&
                                <DataView value={this.state.listaImagenes} layout="grid" header="Lista de Imágenes"
                                    itemTemplate={this.itemTemplate} />
                            }
                        </div>
                    </div>
                </Dialog>
                <Dialog header="Confirmación" visible={this.state.dialogConfirmacion} style={{ width: '25vw' }} footer={dialogFooterConfirmacion}
                    onHide={() => this.setState({ dialogConfirmacion: false })}>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <span>¿Está seguro de eliminar <strong>{this.state.mensajeEliminacion}</strong>?</span>
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Paletizacion);