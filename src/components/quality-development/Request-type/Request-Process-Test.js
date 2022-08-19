import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { Growl } from 'primereact/growl';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Dropdown } from 'primereact/dropdown';

/* ====================  T R A N S A C T I O N S ======== */
import { GetAllProviders, SaveProcessStart } from '../../../utils/TransactionsCalidad';

import { setData } from '../WorkFlow';

/* ============  D A T A    C A T A L O G O  S =============== */
import { formattedDate } from '../../../utils/FormatDate';
import { LineDDP04 } from '../../../global/catalogs';

/* ============  S U B  C O M P O N E N T S    =============== */
import { PW, show_msgPW, hide_msgPW } from '../../../global/SubComponents/PleaseWait'; //Sub-Componente "Espere Por favor..."
import { connect } from 'react-redux';


var that;
var providerNames = []; // Variable para formar el Array de nombres de los proveedores.
class RProcessTest extends Component {

    constructor() {
        super();
        this.state = {
            listProviders: [],
            viewModal: false,
            dateRequest: null,
            checked: false,
            objectives: [],
            otroMotivos: null,
            descriptionMaterialLP: [],
            productToGetting: null,
            processVariables: null,
            additionVerification: null,
            inform: null,
            informName: null,
            informFile: null,
            informType: null,
            informExtension: null,
            imageName: null,
            imageFile: null,
            imageExtension: null,
            otherName: null,
            otherFile: null,
            otherExtension: null,
            userLogin: null,
            preProcess: null,
            otroMaterialLinea: null,
            comment: null,
            heightDialog: null,
            heightScroll: null,
            ddp04Single: 'none',
            lineaDDP04: null,
        };
        that = this;
        this.showMessage = this.showMessage.bind(this);
        this.onObjectiveChange = this.onObjectiveChange.bind(this);
        this.onDescriptionMaterialLPChange = this.onDescriptionMaterialLPChange.bind(this);
        this.saveTestRequest = this.saveTestRequest.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.onBasicUploadAuto = this.onBasicUploadAuto.bind(this);
        this.findProvider = this.findProvider.bind(this);
        this.onLineChange = this.onLineChange.bind(this);
        this.onBasicUploadOtherFile = this.onBasicUploadOtherFile.bind(this);
    }

    /* =============== I N I C I O   F U N C I O N E S ======================= */
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
    /* Métodos  Auto Completado Buscar Clinte */
    handleDropdownClickProviderFind() {
        this.setState({ filteredProviders: [] });
        //mimic remote call
        setTimeout(() => {
            this.setState({ filteredProviders: this.clients });
        }, 100)
    }
    filterProviders(event) {
        debugger
        let results = providerNames.filter((brand) => {
            return brand.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({ filteredProviders: results });
    }
    onClientValueChange(e) {
        debugger;
        this.setState({ providerName: e.value, filteredProviders: null });
    }

    /* FIn Métodos  Auto Completado */

    /* Metodo para los checkBoxs */
    onObjectiveChange(e) {
        let selectedObjectives = [...this.state.objectives];
        if (e.checked)
            selectedObjectives.push(e.value);
        else
            selectedObjectives.splice(selectedObjectives.indexOf(e.value), 1);
        this.setState({ objectives: selectedObjectives });
    }

    onDescriptionMaterialLPChange(e) {
        let selectedDescriptionMaterial = [...this.state.descriptionMaterialLP];
        if (e.checked)
            selectedDescriptionMaterial.push(e.value);
        else
            selectedDescriptionMaterial.splice(selectedDescriptionMaterial.indexOf(e.value), 1);
        this.setState({ descriptionMaterialLP: selectedDescriptionMaterial });
    }


    /* Metodo para set/save Solicitud de Ensayo */
    saveTestRequest() {
        debugger
        if (this.validateForm()) {
            this.showMessage('Favor llenar los campos obligatorios (*)', 'error');
        } else {
            var tRTmp = {
                deliverDate: null, objective: null, materialLine: null, productGetting: null, processVariables: null, additionVerification: null, informExist: null,
                imgBase64: null, nameImg: null, extImg: null, asUser: null, nameUser: null, comment: null, lineBelong: null
            };

            let stringObjetives = '';
            this.state.objectives.map(function (o) {
                stringObjetives = stringObjetives + o + ',';
            })
            if (this.state.otroMotivos !== '' && this.state.otroMotivos !== null)
                stringObjetives = stringObjetives + this.state.otroMotivos;

            let stringMaterialLine = '';
            this.state.descriptionMaterialLP.map(function (o) {
                stringMaterialLine = stringMaterialLine + o + ',';
            })
            if (this.state.otroMaterialLinea !== '' && this.state.otroMaterialLinea !== null)
                stringMaterialLine = stringMaterialLine + this.state.otroMaterialLinea;
            tRTmp.deliverDate = formattedDate(this.state.dateRequest);
            tRTmp.asUser = this.state.userLogin.idUser;
            tRTmp.nameUser = this.state.userLogin.employee.completeName;
            tRTmp.objective = stringObjetives;
            tRTmp.materialLine = stringMaterialLine;
            tRTmp.productGetting = this.state.productToGetting;
            tRTmp.processVariables = this.state.processVariables;
            tRTmp.additionVerification = this.state.additionVerification;
            tRTmp.informExist = this.state.inform;
            tRTmp.imgBase64 = this.state.imageFile;
            tRTmp.nameImg = this.state.imageName;
            tRTmp.extImg = this.state.imageExtension;
            tRTmp.comment = this.state.comment;
            tRTmp.lineBelong = this.state.lineaDDP04;

            var ap = { userImptek: null, detail: null, state: null, listFileDocument: [] };
            ap.userImptek = this.state.userLogin.idUser;
            ap.state = 'Enviado DDP04';
            ap.timeRespond = 2;

            var fileDocument = { name: null, extension: null, type: null, base64File: null };
            fileDocument.name = this.state.informName;
            fileDocument.extension = this.state.informExtension;
            fileDocument.type = this.state.informType;
            fileDocument.base64File = this.state.informFile;
            ap.listFileDocument.push(fileDocument);

            /* Add Other File  */
            if (this.state.otherFile !== null) {
                var fileDocumentO = { name: null, extension: null, type: null, base64File: null };
                fileDocumentO.name = this.state.otherName;
                fileDocumentO.extension = this.state.otherExtension;
                fileDocumentO.base64File = this.state.otherFile;
                ap.listFileDocument.push(fileDocumentO);
            }


            var processFlow = { state: '', processTestRequest: {}, listActionsProcess: [] };
            processFlow.state = 'Abierto';
            processFlow.processTestRequest = tRTmp;
            if (this.state.preProcess !== null) {
                processFlow.subProcess = this.state.preProcess;
            }

            processFlow.listActionsProcess.push(ap);
            show_msgPW();
            SaveProcessStart(processFlow, function (data, status, msg) {
                debugger;
                hide_msgPW();
                console.log(data);
                switch (status) {
                    case 'OK':
                        setData(data);
                        that.setState({ viewModal: false });
                        that.showMessage(msg, 'success');
                        break;
                    case 'ERROR':
                        that.showMessage(msg, 'error');
                        break;
                    default:
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        }
    }

    /* Metodo para validar formulario */
    validateForm() {
        var results = this.state;
        var onValidate = false;
        if (this.state.dateRequest == null || this.state.dateRequest === '') {
            onValidate = true;
        }

        if (this.state.objectives.length === 0) {
            onValidate = true;
        }

        if (this.state.descriptionMaterialLP.length === 0) {
            onValidate = true;
        }

        if (this.state.productToGetting == null || this.state.productToGetting === '') {
            onValidate = true;
        }

        if (this.state.processVariables == null || this.state.processVariables === '') {
            onValidate = true;
        }

        if (this.state.informFile == null || this.state.informFile === '') {
            onValidate = true;
        }
        if (this.state.imageFile == null || this.state.imageFile === '') {
            onValidate = true;
        }

        return onValidate;
    }

    findProvider() {
        var idProviderFound = null;
        this.state.listProviders.map(function (p) {
            if (p.nameProvider === that.state.providerName)
                idProviderFound = p.idProvider;
        })
        return idProviderFound;
    }

    /* Subir Archivo Informe   */
    onBasicUploadAuto(event) {
        debugger;
        var pTmp = null;
        var file = event.target.files[0];
        var ext = (file.type).split('/');
        var sizeImage = (file.size) / 1024;
        if (sizeImage > 1) {
            var reader = new FileReader();
            reader.onloadend = function () {
                //console.log('RESULT', reader.result)
                pTmp = reader.result;
                that.setState({ informFile: pTmp, inform: true, informName: file.name, informType: 'INFORME', informExtension: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            this.showMessage('Error, tamaño del archivo excedido !', 'error');
            that.setState({ informFile: null, inform: false, informName: null, informType: null, informExtension: null });
        }
    }

    /* Subir Imagen adjunta al Informe   */
    onBasicUploadAutoImageAdjunto(event) {
        debugger;
        var pTmp = null;
        var file = event.target.files[0];
        var ext = (file.type).split('/');
        var sizeImage = (file.size) / 1024;
        if (sizeImage < 900) {
            var reader = new FileReader();
            reader.onloadend = function () {
                //console.log('RESULT', reader.result)
                pTmp = reader.result;
                that.setState({ imageFile: pTmp, imageName: file.name, imageExtension: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            that.showMessage('Error, tamaño del archivo excedido !', 'error');
            that.setState({ imageFile: null, imageName: null, imageExtension: null });
        }
    }

    /* Subir Otro File adjunto   */
    onBasicUploadOtherFile(event) {
        debugger;
        var pTmp = null;
        var file = event.target.files[0];
        var ext = (file.type).split('/');
        var sizeImage = (file.size) / 1024;
        if (sizeImage > 10) {
            var reader = new FileReader();
            reader.onloadend = function () {
                //console.log('RESULT', reader.result)
                pTmp = reader.result;
                that.setState({ otherFile: pTmp, otherName: file.name, otherExtension: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            that.showMessage('Error, tamaño del archivo excedido !', 'error');
            that.setState({ otherFile: null, otherName: null, otherExtension: null });
        }
    }

    /*Metodo para DropDown unidades de medida    */
    onLineChange(e) {
        this.setState({ lineaDDP04: e.value });
    }

    componentWillMount() {
        providerNames = [];
        var altura = window.screen.height;
        var ancho = window.screen.width;
        this.state.heightDialog = altura - (altura * 0.2);
        this.state.heightScroll = altura - (altura * 0.37);
        GetAllProviders(function (data, status, msg) {
            switch (status) {
                case 'OK':
                    data.map(function (value, index) {
                        providerNames.push(value.nameProvider);
                    })
                    that.setState({ listProviders: data })
                    break;
                default: break;
            }
        })
    }

    componentDidMount() {
        var sesion = this.props.currentUser
        this.setState({ userLogin: sesion });
    }

    render() {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        const footerRequest = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={this.saveTestRequest} />
                <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={() => this.setState({
                    viewModal: false, checked: false,
                    objectives: [],
                    otroMotivos: null,
                    descriptionMaterialLP: [],
                    productToGetting: null,
                    processVariables: null,
                    additionVerification: null,
                    inform: null,
                    informName: null,
                    informFile: null,
                    informType: null,
                    informExtension: null,
                    imageName: null,
                    imageFile: null,
                    imageExtension: null,
                    otherName: null,
                    otherFile: null,
                    otherExtension: null,
                    preProcess: null,
                    otroMaterialLinea: null,
                    comment: null,
                    ddp04Single: 'none',
                    lineaDDP04: null,
                })} />
            </div>
        );
        let imgUrl = 'assets/layout/images/laboratory.jpg'
        return (
            <div className="p-grid">
                <Growl ref={(el) => this.growl = el} />
                <Dialog visible={this.state.viewModal} header="Solicitud de Pruebas de Proceso DDP-04" maximizable footer={footerRequest} modal={true} closeOnEscape={true} onHide={() => this.setState({ viewModal: false })}>

                    <Card style={{
                        borderColor: '#00a9e2', backgroundImage: 'url(' + imgUrl + ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                    }}>
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-lg-6'>
                                <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight:'bold' }} htmlFor="float-input">Fecha de Entrega</label>
                                <Calendar dateFormat="yy/mm/dd" value={this.state.dateRequest} locale={es} onChange={(e) => this.setState({ dateRequest: e.value })} showIcon={true} />
                            </div>
                            <div className='p-col-12 p-lg-6' style={{ display: this.state.ddp04Single }}>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Línea</label>
                                <Dropdown options={LineDDP04} value={this.state.lineaDDP04} autoWidth={false} onChange={this.onLineChange} placeholder="Selecione" />
                            </div>
                            <div className="p-col-12 p-lg-12" >
                                <div className='p-grid'>
                                    <label className="p-col-12 p-lg-12" style={{ fontWeight:'bold' }} htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Motivo del Ensayo</label>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb1" value="Desarrollo Proveedores" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Desarrollo Proveedores') !== -1}></Checkbox>
                                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Proveedores</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb2" value="Desarrollo Materias Primas" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Desarrollo Materias Primas') !== -1}></Checkbox>
                                        <label htmlFor="cb2" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Materias Primas</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb3" value="Desarrollo Productos" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Desarrollo Productos') !== -1}></Checkbox>
                                        <label htmlFor="cb3" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Desarrollo Productos</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb4" value="Reingeniería" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Reingeniería') !== -1}></Checkbox>
                                        <label htmlFor="cb4" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reingeniería</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb5" value="Reclamos Clientes" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Reclamos Clientes') !== -1}></Checkbox>
                                        <label htmlFor="cb5" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reclamos Clientes</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb6" value="Reducción Costos" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Reducción Costos') !== -1}></Checkbox>
                                        <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Reducción Costos</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb6" value="Mejora de Producto" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Mejora de Producto') !== -1}></Checkbox>
                                        <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejora de Producto</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb6" value="Mejora del Proceso" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Mejora del Proceso') !== -1}></Checkbox>
                                        <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejora del Proceso</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb6" value="Verificación de Equipos" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Verificación de Equipos') !== -1}></Checkbox>
                                        <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Verificación de Equipos</label>
                                    </div>
                                    <div className="p-col-12 p-lg-12">
                                        <label htmlFor="float-input">Otro (Describa)</label>
                                        <InputTextarea value={this.state.otroMotivos} onChange={(e) => this.setState({ otroMotivos: e.target.value })} rows={2} placeholder='Descripción' />
                                    </div>
                                </div>

                            </div>
                            <div className="p-col-12 p-lg-12" >
                                <div className='p-grid'>
                                    <label className="p-col-12 p-lg-12" style={{ fontWeight:'bold' }} htmlFor="float-input"> <span style={{ color: '#CB3234' }}>*</span>Descripción del Material y Línea de Proceso de Prueba (Marque según corresponda)</label>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb11" value="Materia Prima" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Materia Prima') !== -1}></Checkbox>
                                        <label htmlFor="cb11" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Materia Prima</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb12" value="Láminas Impermeabilizantes" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Láminas Impermeabilizantes') !== -1}></Checkbox>
                                        <label htmlFor="cb12" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Láminas Impermeabilizantes</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb13" value="Prod. en Proceso" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Prod. en Proceso') !== -1}></Checkbox>
                                        <label htmlFor="cb13" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. en Proceso</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb14" value="Prod. Terminado" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Prod. Terminado') !== -1}></Checkbox>
                                        <label htmlFor="cb14" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Terminado</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb15" value="Suministros" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Suministros') !== -1}></Checkbox>
                                        <label htmlFor="cb15" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Suministros</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb16" value="Accesorios" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Accesorios') !== -1}></Checkbox>
                                        <label htmlFor="cb16" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Accesorios</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb17" value="Prod. Viales" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Prod. Viales') !== -1}></Checkbox>
                                        <label htmlFor="cb17" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Viales</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb17" value="Rev. Líquidos" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Rev. Líquidos') !== -1}></Checkbox>
                                        <label htmlFor="cb17" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Rev. Líquidos</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb18" value="Pinturas" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Pinturas') !== -1}></Checkbox>
                                        <label htmlFor="cb18" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Pinturas</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb19" value="Prod. Metálicos" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Prod. Metálicos') !== -1}></Checkbox>
                                        <label htmlFor="cb19" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Prod. Metálicos</label>
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <Checkbox inputId="cb20" value="Paneles PUR" onChange={this.onDescriptionMaterialLPChange} checked={this.state.descriptionMaterialLP.indexOf('Paneles PUR') !== -1}></Checkbox>
                                        <label htmlFor="cb20" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Paneles PUR</label>
                                    </div>
                                    <div className="p-col-12 p-lg-12">
                                        <label htmlFor="float-input">Otro (Describa)</label>
                                        <InputTextarea value={this.state.otroMaterialLinea} onChange={(e) => this.setState({ otroMaterialLinea: e.target.value })} rows={2} placeholder='Descripción' />
                                    </div>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight:'bold' }} htmlFor="float-input">Descripción del Producto que se quiere obtener</label>
                                <InputTextarea value={this.state.productToGetting} onChange={(e) => this.setState({ productToGetting: e.target.value })} rows={4} placeholder='Descripción' />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight:'bold' }} htmlFor="float-input">Información sobre Variables de Proceso que deben ser controladas</label>
                                <InputTextarea value={this.state.processVariables} onChange={(e) => this.setState({ processVariables: e.target.value })} rows={4} placeholder='Descripción' />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label style={{ fontWeight:'bold' }} htmlFor="float-input">Se requieren verificaciones adicionales u otras en especial</label>
                                <InputTextarea value={this.state.additionVerification} onChange={(e) => this.setState({ additionVerification: e.target.value })} rows={4} placeholder='Descripción' />
                            </div>

                            <div className='p-col-12 p-lg-12'>
                                <label style={{ fontWeight:'bold' }} htmlFor="float-input">Observaciones</label>
                                <InputTextarea value={this.state.comment} onChange={(e) => this.setState({ comment: e.target.value })} rows={2} placeholder='Descripción' />
                            </div>

                            {/*  <label className="p-col-12 p-lg-12" htmlFor="float-input"> <span style={{ color: '#CB3234' }}>*</span>Se requiere adjuntar informe</label> */}
                            <div className="p-col-12 p-lg-12" >
                                <div className="p-grid" >
                                    <div className="p-col-12 p-lg-4" >
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight:'bold' }} htmlFor="float-input">Se requiere adjuntar informe</label>
                                        <div className="p-col-12 p-lg-12">
                                            <input type='file' onChange={this.onBasicUploadAuto} />
                                        </div>
                                    </div>
                                    <div className="p-col-12 p-lg-4" >
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight:'bold' }} htmlFor="float-input">Detalle gráfico</label>
                                        <div className="p-col-12 p-lg-12">
                                            <input type='file' onChange={this.onBasicUploadAutoImageAdjunto} />
                                        </div>
                                    </div>
                                    <div className="p-col-12 p-lg-4" style={{ display: this.state.ddp04Single }}>
                                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight:'bold' }} htmlFor="float-input">Otro</label>
                                        <div className="p-col-12 p-lg-12">
                                            <input type='file' onChange={this.onBasicUploadOtherFile} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                </Dialog>
                <PW />
            </div>
        )
    }
}

export function show_formRPP(data) {
    if (data === undefined || data == null)
        that.setState({ viewModal: true, ddp04Single: '' });
    else
        that.setState({ viewModal: true, preProcess: data });

}

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}


export default connect(mapStateToProps)(RProcessTest)
