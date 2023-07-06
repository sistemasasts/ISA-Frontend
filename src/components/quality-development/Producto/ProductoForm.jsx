import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import ProductoService from '../../../service/productoService';
import { CatalogoService } from '../../../service/CatalogoService';
import history from '../../../history';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../../store/actions/modalWaitAction';
import { Growl } from 'primereact/growl';
import { Editor } from 'primereact/editor';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toolbar } from 'primereact/toolbar';
import * as _ from "lodash";
import CriterioAprobacio from './CriterioAprobacion';
import Paletizacion from './Paletizacion';
import { FileUpload } from 'primereact/fileupload';

var that;
class ProductoForm extends Component {

    constructor() {
        super();
        this.state = {
            prdocutoSeleccionado: null,
            editForm: false,
            tipoProductoCatalogo: [],
            origenProductoCatalogo: [],
            id: null,
            nombre: null,
            itcdq: null,
            codigoSap: null,
            grupoSap: null,
            codigoBarras: null,
            designacion: null,
            normaReferencia: null,
            nombreGenerico: null,
            grupoProducto: null,
            recomendacionSeguridadIndustrial: null,
            inspeccionMuestreoEnsayo: null,
            tipo: null,
            origen: null,
            descripcion: null,
            registro: null,
            usoEspecifico: null,
            unidad: null,
            presentacion: null,
            manipulacionAlmacenamiento: null,
            indicacionesGenerales: null,
            detalleCriterios: [],
            dialogVisible: false,
            camposObligatorios: [],
            grupoProductoLista: [],
            tipoArmadura: null,
            revision: null,
            dialogVisibleRevision: false,

        };
        that = this;
        this.catalogoService = new CatalogoService();
        this.refrescarProducto = this.refrescarProducto.bind(this);
        this.actualizar = this.actualizar.bind(this);
        this.generarReporte = this.generarReporte.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.actualizarRevision = this.actualizarRevision.bind(this);
        this.visualizarCamposPorGrupoProducto = this.visualizarCamposPorGrupoProducto.bind(this);
        this.myUploader = this.myUploader.bind(this);
        this.leerImagen = this.leerImagen.bind(this);
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
        this.catalogoService.getTipoGrupoProducto().then(data => this.setState({ grupoProductoLista: data }));
        this.refrescarProducto();
    }

    async refrescarProducto() {
        const listaTipoCatalogo = await ProductoService.listarTipoProducto();
        const listaOrigenCatalogo = await ProductoService.listarOrigenProducto();

        console.log(this.props.producto)
        if (this.props.producto !== null) {
            const producto = await ProductoService.listarPorId(this.props.producto);
            console.log(producto);
            if (producto !== undefined && producto !== null) {
                this.setState({
                    prdocutoSeleccionado: producto,
                    id: producto.idProduct,
                    nombre: producto.nameProduct,
                    itcdq: producto.itcdq,
                    codigoSap: producto.sapCode,
                    tipo: producto.typeProduct,
                    descripcion: producto.descProduct,
                    usoEspecifico: producto.specificUse,
                    presentacion: producto.presentation,
                    origen: producto.origin,
                    grupoSap: producto.sapGroup,
                    nombreGenerico: producto.genericName,
                    manipulacionAlmacenamiento: producto.manipulationStorage,
                    indicacionesGenerales: producto.generalIndication,
                    detalleCriterios: producto.detailCriteria,
                    codigoBarras: producto.barcode,
                    designacion: producto.designation,
                    normaReferencia: producto.referenceNorm,
                    recomendacionSeguridadIndustrial: producto.industrialSafetyRecommendation,
                    inspeccionMuestreoEnsayo: producto.inspectionSamplingTesting,
                    tipoProductoCatalogo: listaTipoCatalogo,
                    origenProductoCatalogo: listaOrigenCatalogo,
                    grupoProducto: producto.typeProductTxt,
                    tipoArmadura: producto.armorType,
                    revision: producto.review,

                })
            }
        } else {
            this.setState({ tipoProductoCatalogo: listaTipoCatalogo, origenProductoCatalogo: listaOrigenCatalogo, id: this.props.producto });
        }
    }

    cancelar() {
        history.push(`/quality-development_product`);
    }

    async actualizar() {
        this.setState({ dialogVisible: false });
        if (this.validarCamposRequeridos()) {
            this.props.openModal();
            if (this.props.producto !== null) {
                const productoActualizado = await ProductoService.update(this.crearProducto());
                this.showMessage('Producto actualizado!', 'success');
            } else {
                const productoCreado = await ProductoService.create(this.crearProducto());
                this.showMessage('Producto Creado!', 'success');
                setTimeout(function () {
                    history.push(`/quality-development_product_instructivo/${productoCreado.idProduct}`);
                }, 2000);
            }
            this.props.closeModal();
        } else {
            this.showMessage('Favor ingrese los campos requeridos', 'error');
        }
    }

    async actualizarRevision() {
        this.setState({ dialogVisibleRevision: false });
        this.props.openModal();
        const revisionNueva = await ProductoService.generarRevision(this.state.id);
        this.setState({ revision: revisionNueva });
        this.props.closeModal();
    }

    crearProducto() {
        return {
            idProduct: this.props.producto,
            nameProduct: this.state.nombre,
            itcdq: this.state.itcdq,
            genericName: this.state.nombreGenerico,
            descProduct: this.state.descripcion,
            barcode: this.state.codigoBarras,
            designation: this.state.designacion,
            family: null,
            itcdq: this.state.itcdq,
            lineProduction: null,
            manipulationStorage: this.state.manipulacionAlmacenamiento,
            generalIndication: this.state.indicacionesGenerales,
            presentation: this.state.presentacion,
            origin: this.state.origen,
            referenceNorm: this.state.normaReferencia,
            sapGroup: this.state.grupoSap,
            specificUse: this.state.usoEspecifico,
            sapCode: this.state.codigoSap,
            typeProduct: this.state.tipo,
            industrialSafetyRecommendation: this.state.recomendacionSeguridadIndustrial,
            typeProductTxt: this.state.grupoProducto,
            armorType: this.state.tipoArmadura,
            inspectionSamplingTesting: this.state.inspeccionMuestreoEnsayo
        }
    }

    async leerImagen(idDocumento) {
        const respuesta = await ProductoService.obtenerImagenPatron(idDocumento);
        if (respuesta) {
            console.log(respuesta);
            document.getElementById("ItemPreview").src = `data:${respuesta.tipo};base64,` + respuesta.base64;
        }
    }

    async generarReporte() {
        this.props.openModal();
        var data = await ProductoService.generarReporte(this.props.producto);
        this.props.closeModal();
        const ap = window.URL.createObjectURL(data)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = ap;
        a.download = `Instructivo_Trabajo_${this.state.nombre}.pdf`;
        a.click();
        //this.showMessage('Reporte generado', 'success');
    }

    crearObjValidacion(nombreCampo) {
        let obj = { campo: '', obligatorio: true }
        obj.campo = nombreCampo;
        return obj;
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []

        if (_.isEmpty(this.state.nombre)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('nombre'));
        }
        if (_.isEmpty(this.state.codigoSap)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('codigoSap'));
        }
        if (_.isEmpty(this.state.grupoSap)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('grupoSap'));
        }
        /* if (_.isEmpty(this.state.nombreGenerico)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('nombreGenerico'));
        } */
        if (_.isEmpty(this.state.itcdq)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('itcdq'));
        }
        if (_.isEmpty(this.state.tipo)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('tipo'));
        }
        /* if (_.isEmpty(this.state.origen)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('origen'));
        } */
        if (_.isEmpty(this.state.descripcion)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('descripcion'));
        }
        /* if (_.isEmpty(this.state.usoEspecifico)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('usoEspecifico'));
        } */
        if (_.isEmpty(this.state.presentacion)) {
            camposOblogatoriosDetectados.push(this.crearObjValidacion('presentacion'));
        }

        this.setState({ camposObligatorios: camposOblogatoriosDetectados })

        return camposOblogatoriosDetectados.length === 0 ? true : false;
    }

    determinarEsCampoRequerido(nombreCampo) {
        const campo = _.find(this.state.camposObligatorios, (o) => o.campo === nombreCampo);
        return _.isEmpty(campo) ? false : true;
    }

    visualizarCamposPorGrupoProducto(nombreCampo) {
        switch (this.state.grupoProducto) {
            case "Láminas Impermeabilizantes":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'ManipulacionYAlmacenamiento')
                    || (nombreCampo === 'InspeccionMuestreoYEnsayo'))
                    return 'none';
                break;

            case "Cortes de Bandas":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'ManipulacionYAlmacenamiento')
                    || (nombreCampo === 'InspeccionMuestreoYEnsayo'))
                    return 'none';
                break;

            case "Revestimientos Líquidos":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'TipoArmadura') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'Designacion')
                    || (nombreCampo === 'ManipulacionYAlmacenamiento') || (nombreCampo === 'InspeccionMuestreoYEnsayo'))
                    return 'none';
                break;

            case "Desinfectantes":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'TipoArmadura') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'Designacion')
                    || (nombreCampo === 'ManipulacionYAlmacenamiento') || (nombreCampo === 'InspeccionMuestreoYEnsayo'))
                    return 'none';
                break;

            case "Emulsiones Asfálticas":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'TipoArmadura') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'CaracteristicasPaletizado'))
                    return 'none';
                break;

            case "Asfalto Modificado":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'TipoArmadura') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'CaracteristicasPaletizado'))
                    return 'none';
                break;

            case "Mezcla en Frío":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'TipoArmadura') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'CaracteristicasPaletizado'))
                    return 'none';
                break;

            case "Metales":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'TipoArmadura') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'CaracteristicasPaletizado'))
                    return 'none';
                break;

            case "Malla de Refuerzo":
                if ((nombreCampo === 'NombreComercial') || (nombreCampo === 'Origen') || (nombreCampo === 'TipoArmadura') || (nombreCampo === 'UsoEspecifico') || (nombreCampo === 'CaracteristicasPaletizado'))
                    return 'none';
                break;

            case "Aditivos":
            case "Cargas Minerales":
            case "Armaduras":
            case "Cintas, Stickers, Etiquetas":
            case "Derivados del Petróleo":
            case "Flejes Metálicos":
            case "Pallets":
            case "Polietilenos":
            case "Polímeros":
            case "Resinas":
            case "Tubos":
            case "Empaques":
            case "Reactivos Laboratorio":
                if ((nombreCampo === 'TipoArmadura') || (nombreCampo === 'CodigoBarras') || (nombreCampo === 'Designacion') || (nombreCampo === 'NormaReferencia') || (nombreCampo === 'CaracteristicasPaletizado')
                    || (nombreCampo === 'InspeccionMuestreoYEnsayo'))
                    return 'none';
                break;

            default:
                break;
        }
    }

    async myUploader(event) {
        await ProductoService.subirImagenPatron(this.state.id, this.crearSolicitudDocumento(event.files[0]));
        this.leerImagen(this.state.id);
        this.fileUploadRef.clear();
    }

    crearSolicitudDocumento(archivo) {
        let formadata = new FormData();
        formadata.append('file', archivo);
        return formadata;
    }

    onChangeTab(index) {
        if (index === 6) {
            this.leerImagen(this.state.id);
        }
        this.setState({ activeIndex: index });
    }

    render() {
        const header = (
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

        const dialogFooter = (
            <div>
                <Button label="SI" icon="pi pi-check" onClick={() => this.actualizar()} />
                <Button label="NO" className='p-button-secondary' icon="pi pi-times" onClick={() => this.setState({ dialogVisible: false })} />
            </div>
        );

        const dialogFooterRevision = (
            <div>
                <Button label="SI" icon="pi pi-check" onClick={() => this.actualizarRevision()} />
                <Button label="NO" className='p-button-secondary' icon="pi pi-times" onClick={() => this.setState({ dialogVisibleRevision: false })} />
            </div>
        );

        const divErrorStyle = {
            color: '#b94a48',
            fontStyle: "italic"
        };

        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                <div className="card card-w-title">
                    <Toolbar>
                        <div className="p-toolbar-group-left">
                            <h2 style={{ marginBottom: '0px', marginTop: '2px', }}>Información Principal <strong>Rev.{this.state.revision}</strong></h2>
                        </div>
                        {this.props.producto && <div className="p-toolbar-group-right" >
                            <Button label="Descargar Instructivo Trabajo" icon="pi pi-download" onClick={() => this.generarReporte()} />
                            <Button label="Revisión" className="p-button-success" icon="pi pi-star" onClick={() => this.setState({ dialogVisibleRevision: true })} />
                        </div>}
                    </Toolbar>
                    <div className='p-fluid p-grid' style={{ marginTop: '5px' }}>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Código SAP</label>
                            <InputText className={this.determinarEsCampoRequerido('codigoSap') && 'p-error'} placeholder="Código" value={this.state.codigoSap} onChange={(e) => this.setState({ codigoSap: e.target.value })} />
                            {this.determinarEsCampoRequerido('codigoSap') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>
                        <div className='p-col-12 p-lg-8'>
                            <label htmlFor="float-input">Nombre SAP</label>
                            <InputText className={this.determinarEsCampoRequerido('nombre') && 'p-error'} placeholder="Nombre" value={this.state.nombre} onChange={(e) => this.setState({ nombre: e.target.value })} />
                            {this.determinarEsCampoRequerido('nombre') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Grupo de Artículos</label>
                            <InputText className={this.determinarEsCampoRequerido('grupoSap') && 'p-error'} placeholder="Grupo" value={this.state.grupoSap} onChange={(e) => this.setState({ grupoSap: e.target.value })} />
                            {this.determinarEsCampoRequerido('grupoSap') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>

                        <div className='p-col-12 p-lg-8' style={{ display: this.visualizarCamposPorGrupoProducto('NombreComercial') }}>
                            <label htmlFor="float-input">Nombre Comercial</label>
                            <InputText className={this.determinarEsCampoRequerido('nombreGenerico') && 'p-error'} placeholder="Genérico" value={this.state.nombreGenerico} onChange={(e) => this.setState({ nombreGenerico: e.target.value })} />
                            {this.determinarEsCampoRequerido('nombreGenerico') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">ITCDQ</label>
                            <InputText className={this.determinarEsCampoRequerido('itcdq') && 'p-error'} placeholder="ITCDQ" value={this.state.itcdq} onChange={(e) => this.setState({ itcdq: e.target.value })} />
                            {this.determinarEsCampoRequerido('itcdq') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Tipo</label>
                            <Dropdown className={this.determinarEsCampoRequerido('tipo') && 'p-error'} options={this.state.tipoProductoCatalogo} value={this.state.tipo}
                                onChange={event => that.setState({ tipo: event.value })} autoWidth={false} placeholder="Selecione" />
                            {this.determinarEsCampoRequerido('tipo') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>
                        <div className='p-col-12 p-lg-4' style={{ display: this.visualizarCamposPorGrupoProducto('Origen') }}>
                            <label htmlFor="float-input">Origen</label>
                            <Dropdown className={this.determinarEsCampoRequerido('origen') && 'p-error'} options={this.state.origenProductoCatalogo} value={this.state.origen}
                                onChange={event => that.setState({ origen: event.value })} autoWidth={false} placeholder="Selecione" />
                            {this.determinarEsCampoRequerido('origen') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>

                        <div className='p-col-12 p-lg-4' style={{ display: this.visualizarCamposPorGrupoProducto('CodigoBarras') }}>
                            <label htmlFor="float-input">Código Barras</label>
                            <InputText placeholder="Código de barras" value={this.state.codigoBarras} onChange={(e) => this.setState({ codigoBarras: e.target.value })} />
                        </div>

                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Norma de Referencia</label>
                            <InputText placeholder="Norma" value={this.state.normaReferencia} onChange={(e) => this.setState({ normaReferencia: e.target.value })} />
                        </div>

                        <div className='p-col-12 p-lg-4' style={{ display: this.visualizarCamposPorGrupoProducto('Designacion') }}>
                            <label htmlFor="float-input">Designación</label>
                            <InputText placeholder="Norma" value={this.state.designacion} onChange={(e) => this.setState({ designacion: e.target.value })} />
                        </div>

                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Grupo Producto</label>
                            <Dropdown options={this.state.grupoProductoLista} value={this.state.grupoProducto}
                                onChange={event => that.setState({ grupoProducto: event.value })} autoWidth={false} placeholder="Selecione" />
                        </div>

                        <div className='p-col-12 p-lg-4' style={{ display: this.visualizarCamposPorGrupoProducto('TipoArmadura') }}>
                            <label htmlFor="float-input">Tipo Armadura</label>
                            <InputText placeholder="Tipo Armadura" value={this.state.tipoArmadura} onChange={(e) => this.setState({ tipoArmadura: e.target.value })} />
                        </div>


                        <div className='p-col-12 p-lg-6' style={{ display: this.visualizarCamposPorGrupoProducto('UsoEspecifico') }}>
                            <label htmlFor="float-input">Uso Específico</label>
                            <InputTextarea className={this.determinarEsCampoRequerido('usoEspecifico') && 'p-error'} rows={3} value={this.state.usoEspecifico} onChange={(e) => this.setState({ usoEspecifico: e.target.value })} />
                            {this.determinarEsCampoRequerido('usoEspecifico') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">Presentación</label>
                            <InputTextarea className={this.determinarEsCampoRequerido('presentacion') && 'p-error'} rows={3} placeholder="Presentación" value={this.state.presentacion} onChange={(e) => this.setState({ presentacion: e.target.value })} />
                            {this.determinarEsCampoRequerido('presentacion') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Descripción</label>
                            <InputTextarea className={this.determinarEsCampoRequerido('descripcion') && 'p-error'} rows={3} value={this.state.descripcion} onChange={(e) => this.setState({ descripcion: e.target.value })} />
                            {this.determinarEsCampoRequerido('descripcion') && <div style={divErrorStyle}>Campo Obligatorio</div>}
                        </div>
                        {this.state.id && <div className='p-col-12 p-lg-12'>
                            <TabView style={{ marginTop: '10px' }} activeIndex={this.state.activeIndex} onTabChange={(e) => this.onChangeTab(e.index)}>
                                <TabPanel header="Criterios Aceptación" leftIcon="pi pi-check" >
                                    <CriterioAprobacio producto={this.state.prdocutoSeleccionado} _this={this} />
                                </TabPanel>
                                <TabPanel header="Recomendaciones de Seguridad Industrial" leftIcon="pi pi-exclamation-triangle" >
                                    <Editor headerTemplate={header} style={{ height: '320px' }} value={this.state.recomendacionSeguridadIndustrial} onTextChange={(e) => this.setState({ recomendacionSeguridadIndustrial: e.htmlValue })} />
                                </TabPanel>
                                <TabPanel header="Manipulación y Almacenamiento" leftIcon="pi pi-exclamation-triangle" headerStyle={{ display: this.visualizarCamposPorGrupoProducto('ManipulacionYAlmacenamiento') }} >
                                    <Editor headerTemplate={header} style={{ height: '320px' }} value={this.state.manipulacionAlmacenamiento} onTextChange={(e) => this.setState({ manipulacionAlmacenamiento: e.htmlValue })} />
                                </TabPanel>
                                <TabPanel header="Caraterísticas de Paletización" leftIcon="pi pi-check" headerStyle={{ display: this.visualizarCamposPorGrupoProducto('CaracteristicasPaletizado') }} >
                                    <Paletizacion producto={this.state.prdocutoSeleccionado} _this={this} />
                                </TabPanel>
                                <TabPanel header="Indicaciones Generales" leftIcon="pi pi-exclamation-circle" >
                                    <Editor headerTemplate={header} style={{ height: '320px' }} value={this.state.indicacionesGenerales} onTextChange={(e) => this.setState({ indicacionesGenerales: e.htmlValue })} />
                                </TabPanel>
                                <TabPanel header="Inspección, Muestreo y Ensayo" leftIcon="pi pi-exclamation-circle" headerStyle={{ display: this.visualizarCamposPorGrupoProducto('InspeccionMuestreoYEnsayo') }}>
                                    <Editor headerTemplate={header} style={{ height: '320px' }} value={this.state.inspeccionMuestreoEnsayo} onTextChange={(e) => this.setState({ inspeccionMuestreoEnsayo: e.htmlValue })} />
                                </TabPanel>
                                <TabPanel header="Patron HCC" leftIcon="pi pi-image">
                                    <div className='p-col-12 p-lg-4'></div>
                                    <div className='p-col-12 p-lg-4'>
                                        <img style={{ width: 'auto', maxHeight: '100%', maxWidth: '100%', display: 'block', margin: 'auto' }} id="ItemPreview" src="" />

                                        <FileUpload ref={(el) => this.fileUploadRef = el} mode="basic" name="demo" customUpload={true} uploadHandler={this.myUploader} accept="image/*" chooseLabel='Seleccione Imagen' uploadLabel='Subir Imagen' />

                                    </div>
                                    <div className='p-col-12 p-lg-4'></div>

                                </TabPanel>


                            </TabView>
                        </div>
                        }
                        <div className='p-col-12 p-lg-12' style={{ justifyContent: 'left', textAlign: 'right' }}>
                            <Button label='Guardar' icon='pi pi-save' style={{ width: '10%' }} onClick={() => this.setState({ dialogVisible: true })} />
                            <Button label='cancelar' icon='pi pi-times' style={{ width: '10%' }} className='p-button-secondary' onClick={() => this.cancelar()} />
                        </div>
                    </div>
                    <Dialog header="Confirmación" visible={this.state.dialogVisible} style={{ width: '25vw' }} footer={dialogFooter} onHide={() => this.setState({ dialogVisible: false })}>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <span>¿Está seguro de {this.state.id ? 'ACTUALIZAR la información del' : 'CREAR el'} producto <strong>{this.state.nombre}</strong>?</span>
                            </div>
                        </div>
                    </Dialog>
                    <Dialog header="Confirmación" visible={this.state.dialogVisibleRevision} style={{ width: '25vw' }} footer={dialogFooterRevision} onHide={() => this.setState({ dialogVisibleRevision: false })}>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <span>¿Está seguro de actualizar el número de Revisión del producto <strong>{this.state.nombre}</strong>?</span>
                            </div>
                        </div>
                    </Dialog>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductoForm)