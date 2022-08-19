import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Growl } from 'primereact/growl';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';

/* ====================  T R A N S A C T I O N S ======== */
import { GetAllProviders, SaveProcessStart } from '../../../utils/TransactionsCalidad';

import { setData } from '../WorkFlow';

/* ============  D A T A    C A T A L O G O  S =============== */
import { aplicationLine, unidadesMedida } from '../../../global/catalogs';
import { formattedDate } from '../../../utils/FormatDate';

/* ============  S U B  C O M P O N E N T S    =============== */
import { PW, show_msgPW, hide_msgPW } from '../../../global/SubComponents/PleaseWait'; //Sub-Componente "Espere Por favor..."
import { connect } from 'react-redux';

var that;
var providerNames = []; // Variable para formar el Array de nombres de los proveedores.
class RTest extends Component {

    constructor() {
        super();
        this.state = {
            listProviders: [],
            listPriorityLevel: [{ label: 'Alto', value: 'ALTO' }, { label: 'Medio', value: 'MEDIO' }, { label: 'Bajo', value: 'BAJO' }],
            viewModal: false,
            dateRequest: null,
            priority: null,
            checked: false,
            objectives: [],
            deliveredTime: null,
            deliverProduct: null,
            aplicationL: null,
            unit: null,
            dataSheet: null,
            dataSheetName: null,
            dataSheetFile: null,
            dataSheetType: null,
            dataSheetExtension: null,
            msds: false,
            msdsFile: null,
            msdsName: null,
            msdsType: null,
            msdsExtension: null,
            use: null,
            amount: null,
            providerName: null,
            userLogin: null,
            heightDialog: null,
            heightScroll: null,
            casoEspecialFile: null,
            casoEspecialName: null,
            casoEspecialExtension: null,
        };
        that = this;
        this.showMessage = this.showMessage.bind(this);
        this.onObjectiveChange = this.onObjectiveChange.bind(this);
        this.onAplicationLineChange = this.onAplicationLineChange.bind(this);
        this.onUnitMetricsChange = this.onUnitMetricsChange.bind(this);
        this.saveTestRequest = this.saveTestRequest.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.onBasicUploadAuto = this.onBasicUploadAuto.bind(this);
        this.onBasicUploadAutoMSDS = this.onBasicUploadAutoMSDS.bind(this);
        this.findProvider = this.findProvider.bind(this);
        this.onBasicUploadAutoCasoEspecial = this.onBasicUploadAutoCasoEspecial.bind(this);
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

    /*Metodo para DropDown Linea de aplicacion    */
    onAplicationLineChange(e) {
        this.setState({ aplicationL: e.value });
    }

    /*Metodo para DropDown unidades de medida    */
    onUnitMetricsChange(e) {
        this.setState({ unit: e.value });
    }
    /* Metodo para set/save Solicitud de Ensayo */
    saveTestRequest() {
        debugger
        if (this.validateForm()) {
            this.showMessage('Favor llenar los campos obligatorios (*)', 'error');
        } else {
            var tRTmp = {
                providerName: null, idProvider: null, deliverDate: null, deliverType: null, objective: null, materialDetail: null, aplicationLine: null, use: null, quantity: null,
                unit: null, dataSheet: null, msds: null,
            };
            tRTmp.providerName = this.state.providerName;
            tRTmp.idProvider = this.findProvider();
            tRTmp.deliverDate = formattedDate(this.state.dateRequest);
            tRTmp.priorityLevel = this.state.priority;
            let stringObjetives = '';
            this.state.objectives.map(function (o) {
                stringObjetives = stringObjetives + o + ',';
            })
            tRTmp.objective = stringObjetives;
            tRTmp.materialDetail = this.state.deliverProduct;
            tRTmp.aplicationLine = this.state.aplicationL;
            tRTmp.deliverType = this.state.deliveredTime;
            tRTmp.use = this.state.use;
            tRTmp.quantity = this.state.amount;
            tRTmp.unit = this.state.unit;
            tRTmp.dataSheet = this.state.dataSheet;
            tRTmp.msds = this.state.msds;
            tRTmp.asUser = this.state.userLogin.idUser;
            tRTmp.nameUser = this.state.userLogin.employee.completeName;
            tRTmp.specialCaseJustification = this.state.deliveredTime === 'Casos Especiales' ? true : false;

            var ap = { userImptek: null, detail: null, state: null, listFileDocument: [] };
            ap.userImptek = this.state.userLogin.idUser;
            ap.state = 'Enviado';

            var fileDocument = { name: null, extension: null, type: null, base64File: null };
            fileDocument.name = this.state.dataSheetName;
            fileDocument.extension = this.state.dataSheetExtension;
            fileDocument.type = this.state.dataSheetType;
            fileDocument.base64File = this.state.dataSheetFile;
            ap.listFileDocument.push(fileDocument);
            if (this.state.msds) {
                var fileDocumentMSDS = { name: null, extension: null, type: null, base64File: null };
                fileDocumentMSDS.name = this.state.msdsName;
                fileDocumentMSDS.extension = this.state.msdsExtension;
                fileDocumentMSDS.type = this.state.msdsType;
                fileDocumentMSDS.base64File = this.state.msdsFile;
                ap.listFileDocument.push(fileDocumentMSDS);
            }
            if (this.state.deliveredTime === 'Casos Especiales') {
                var fileDocumentCasoEspcial = { name: null, extension: null, type: null, base64File: null };
                fileDocumentCasoEspcial.name = this.state.casoEspecialName;
                fileDocumentCasoEspcial.extension = this.state.casoEspecialExtension;
                fileDocumentCasoEspcial.base64File = this.state.casoEspecialFile;
                ap.listFileDocument.push(fileDocumentCasoEspcial);
            }


            var processFlow = { state: '', testRequest: {}, listActionsProcess: [] };
            processFlow.state = 'Abierto';
            processFlow.testRequest = tRTmp;
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
        debugger
        var results = this.state;
        var onValidate = false;
        if (this.state.dateRequest == null || this.state.dateRequest === '') {
            onValidate = true;
        }

        if (this.state.priority == null || this.state.priority === '') {
            onValidate = true;
        }

        if (this.state.providerName == null || this.state.providerName === '') {
            onValidate = true;
        }

        if (this.state.objectives.length === 0) {
            onValidate = true;
        }

        if (this.state.objectives.length === 0) {
            onValidate = true;
        }

        if (this.state.deliveredTime == null || this.state.deliveredTime === '') {
            onValidate = true;
        }
        if (this.state.deliverProduct == null || this.state.deliverProduct === '') {
            onValidate = true;
        }

        if (this.state.aplicationL == null || this.state.aplicationL === '') {
            onValidate = true;
        }
        if (this.state.unit == null || this.state.unit === '') {
            onValidate = true;
        }

        if (this.state.amount == null || this.state.amount === '') {
            onValidate = true;
        }

        if (this.state.dataSheetFile == null || this.state.dataSheetFile === '') {
            onValidate = true;
        }

        if (this.state.deliveredTime === 'Casos Especiales') {
            if (this.state.casoEspecialFile == null)
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

    /* Subir Archivo Datasheet  */
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
                that.setState({ dataSheetFile: pTmp, dataSheet: true, dataSheetName: file.name, dataSheetType: 'DATASHEET', dataSheetExtension: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            that.showMessage('Error, tamaño del archivo excedido !', 'error');
            that.setState({ dataSheetFile: null, dataSheet: false, dataSheetName: null, dataSheetType: null, dataSheetExtension: null });
        }

    }
    /* Subir Archivo MSDS  */
    onBasicUploadAutoMSDS(event) {
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
                that.setState({ msdsFile: pTmp, msds: true, msdsName: file.name, msdsType: 'MSDS', msdsExtension: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            that.showMessage('Error, tamaño del archivo excedido !', 'error');
            that.setState({ msdsFile: null, msds: false, msdsName: null, msdsType: null, msdsExtension: null });
        }

    }

    /* Subir Archivo Caso Especial  */
    onBasicUploadAutoCasoEspecial(event) {
        var pTmp = null;
        var file = event.target.files[0];
        var ext = (file.type).split('/');
        var sizeImage = (file.size) / 1024;
        if (sizeImage > 1) {
            var reader = new FileReader();
            reader.onloadend = function () {
                pTmp = reader.result;
                that.setState({ casoEspecialFile: pTmp, casoEspecialName: file.name, casoEspecialExtension: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            that.showMessage('Error, tamaño del archivo excedido !', 'error');
            that.setState({ casoEspecialFile: null, casoEspecialName: null, casoEspecialExtension: null });
        }
    }

    componentWillMount() {

        providerNames = [];
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
                <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={() => this.setState({ viewModal: false })} />
            </div>
        );
        let imgUrl = 'assets/layout/images/laboratory.jpg'
        return (
            <div className="p-grid">
                <Growl ref={(el) => this.growl = el} />
                <Dialog visible={this.state.viewModal} header="Solicitud de Ensayo" style={{ width: '65vw' }} footer={footerRequest} modal={true} maximizable closeOnEscape={true} onHide={() => this.setState({ viewModal: false })}>
                    <ScrollPanel style={{ width: '100%', height: this.state.heightScroll }} className="custom">
                        <Card style={{
                            borderColor: '#00a9e2', backgroundImage: 'url(' + imgUrl + ')',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                            <div className="p-grid p-grid-responsive p-fluid">
                                <div className='p-col-12 p-lg-3'>
                                    <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Fecha de Entrega</label>
                                    <Calendar dateFormat="yy/mm/dd" value={this.state.dateRequest} locale={es} onChange={(e) => this.setState({ dateRequest: e.value })} showIcon={true} />
                                </div>
                                <div className='p-col-12 p-lg-3'>
                                    <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Nivel Prioridad</label>
                                    <Dropdown options={this.state.listPriorityLevel} value={this.state.priority} autoWidth={false} onChange={(event => that.setState({ priority: event.value }))} placeholder="Selecione" />
                                </div>
                                <div className='p-col-12 p-lg-6'>
                                    <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Proveedor</label>
                                    <AutoComplete minLength={1} placeholder="Nombre" id="acAdvanced"
                                        suggestions={this.state.filteredProviders} completeMethod={this.filterProviders.bind(this)} value={this.state.providerName}
                                        onChange={this.onClientValueChange.bind(this)} onDropdownClick={this.handleDropdownClickProviderFind.bind(this)}
                                    />
                                </div>

                                <div className="p-col-12 p-lg-12" >
                                    <div className="p-grid" >
                                        <label className="p-col-12 p-lg-12" htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Objetivo</label>
                                        <div className="p-col-12 p-lg-4">
                                            <Checkbox inputId="cb1" value="Ahorro de Costos" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Ahorro de Costos') !== -1}></Checkbox>
                                            <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Ahorro de Costos</label>
                                        </div>
                                        <div className="p-col-12 p-lg-4">
                                            <Checkbox inputId="cb2" value="Disponibilidad de Material" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Disponibilidad de Material') !== -1}></Checkbox>
                                            <label htmlFor="cb2" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Disponibilidad de Material</label>
                                        </div>
                                        <div className="p-col-12 p-lg-4">
                                            <Checkbox inputId="cb3" value="Solicitud Interna" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Solicitud Interna') !== -1}></Checkbox>
                                            <label htmlFor="cb3" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Solicitud Interna</label>
                                        </div>
                                        <div className="p-col-12 p-lg-4">
                                            <Checkbox inputId="cb4" value="Mejoramiento del Proceso" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Mejoramiento del Proceso') !== -1}></Checkbox>
                                            <label htmlFor="cb4" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mejoramiento del Proceso</label>
                                        </div>
                                        <div className="p-col-12 p-lg-4">
                                            <Checkbox inputId="cb5" value="Cambio de Normativa Vigente" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Cambio de Normativa Vigente') !== -1}></Checkbox>
                                            <label htmlFor="cb5" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Cambio de Normativa Vigente</label>
                                        </div>
                                        <div className="p-col-12 p-lg-4">
                                            <Checkbox inputId="cb6" value="Restricción de Materia Prima" onChange={this.onObjectiveChange} checked={this.state.objectives.indexOf('Restricción de Materia Prima') !== -1}></Checkbox>
                                            <label htmlFor="cb6" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Restricción de Materia Prima</label>
                                        </div>
                                    </div>

                                </div>

                                <div className="p-col-12 p-lg-12" >
                                    <div className='p-grid'>

                                        <label className="p-col-12 p-lg-12" htmlFor="float-input"> <span style={{ color: '#CB3234' }}>*</span>Tiempo de Entrega</label>
                                        <div className="p-col-12 p-lg-6">
                                            <RadioButton inputId="rb1" name="deliverTime" value="Inmediato" onChange={(e) => this.setState({ deliveredTime: e.value })} checked={this.state.deliveredTime === 'Inmediato'} />
                                            <label htmlFor="rb1" className="p-radiobutton-label">Inmediato (Tiempo de desarrollo 5 días)</label>
                                        </div>
                                        <div className="p-col-12 p-lg-6">
                                            <RadioButton inputId="rb2" name="deliverTime" value="Medio" onChange={(e) => this.setState({ deliveredTime: e.value })} checked={this.state.deliveredTime === 'Medio'} />
                                            <label htmlFor="rb2" className="p-radiobutton-label">Medio (Tiempo de desarrollo 15 días)</label>
                                        </div>
                                        <div className="p-col-12 p-lg-6">
                                            <RadioButton inputId="rb3" name="deliverTime" value="Bajo" onChange={(e) => this.setState({ deliveredTime: e.value })} checked={this.state.deliveredTime === 'Bajo'} />
                                            <label htmlFor="rb3" className="p-radiobutton-label">Bajo (Tiempo de desarrollo 2 meses)</label>
                                        </div>
                                        <div className="p-col-12 p-lg-6">
                                            <RadioButton inputId="rb4" name="deliverTime" value="Casos Especiales" onChange={(e) => this.setState({ deliveredTime: e.value })} checked={this.state.deliveredTime === 'Casos Especiales'} />
                                            <label htmlFor="rb4" className="p-radiobutton-label">Casos Especiales</label>
                                        </div>
                                        <div className="p-col-12 p-lg-6"></div>
                                        <div className="p-col-12 p-lg-6">
                                            <input type='file' onChange={this.onBasicUploadAutoCasoEspecial} size={5} disabled={this.state.deliveredTime == 'Casos Especiales' ? false : true} />
                                        </div>
                                    </div>

                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Material Entregado (Descripción)</label>
                                    <InputTextarea value={this.state.deliverProduct} onChange={(e) => this.setState({ deliverProduct: e.target.value })} rows={2} placeholder='Descripción' />
                                </div>
                                <div className='p-col-12 p-lg-6'>
                                    <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Cantidad</label>
                                    <InputText value={this.state.amount} onChange={(e) => this.setState({ amount: e.target.value })} />
                                </div>
                                <div className='p-col-12 p-lg-6'>
                                    <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Unidad</label>
                                    <Dropdown options={unidadesMedida} value={this.state.unit} autoWidth={false} onChange={this.onUnitMetricsChange} placeholder="Selecione" />
                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Línea de Aplicación</label>
                                    <Dropdown options={aplicationLine} value={this.state.aplicationL} autoWidth={false} onChange={this.onAplicationLineChange} placeholder="Seleccione " />
                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">Uso (Descripción)</label>
                                    <InputTextarea value={this.state.use} onChange={(e) => this.setState({ use: e.target.value })} rows={2} placeholder='Descripción' />
                                </div>
                                <div className="p-col-12 p-lg-6" >
                                    <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Ficha Técnica</label>
                                    <div className="p-col-12 p-lg-12">
                                        <input type='file' onChange={this.onBasicUploadAuto} size={5} />
                                    </div>
                                </div>
                                <div className="p-col-12 p-lg-6" >
                                    <label htmlFor="float-input">Ficha MSDS</label>
                                    <div className="p-col-12 p-lg-12">
                                        <input type='file' onChange={this.onBasicUploadAutoMSDS} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </ScrollPanel>
                </Dialog>
                <PW />
            </div>
        )
    }
}

export function show_form() {
    that.setState({ viewModal: true });
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps)(RTest)