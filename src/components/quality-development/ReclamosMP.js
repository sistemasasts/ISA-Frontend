import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Growl } from 'primereact/growl';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { CarService } from '../../service/CarService';
import { TabView, TabPanel } from 'primereact/tabview';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { AutoComplete } from 'primereact/autocomplete';

/* ============  L I B R A R I E S   S U B  C O M P O N E N T S   ===================== */
import { Email, setParamsSendEmail } from '../Email/cemail';
import { PW, show_msgPW, hide_msgPW } from '../../global/SubComponents/PleaseWait'; //Sub-Componente "Espere Por favor..."

/* ============  D A T A    C A T A L O G O  S =============== */
import { placesRMP, unidadesMedida } from '../../global/catalogs';

/* ====================  T R A N S A C T I O N S ======== */
import { GetAllComplaintsRMP, SaveComplaintRMP, GenerateReportComplaint, GetAllProducts } from '../../utils/TransactionsCalidad';

/* ====================  U T I L S  ======== */
import { formattedDate, formattedDateAndHour } from '../../utils/FormatDate';
import { openModal, closeModal } from '../../store/actions/modalWaitAction';
import { connect } from 'react-redux';
import ReclamoMPService from '../../service/ReclamoMPService';

var that;
var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
//var directorio=require("D:/ISA/FilesRepository/img");
class Complaint extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
            dataTable: null,
            globalFilter: null,
            visibleMRMPEditar: false,
            selectedComplaint: {},
            visibleMRMPDetails: false,
            selectedComplaint2: {},
            nameProductC: null,//variables para editar inicio
            dateC: null,
            batchProviderC: null,
            palletC: null,
            unitC: null,
            affectedProductC: null,
            placeC: null,
            totalAmountC: null,
            affectAmountC: null,
            percentC: null,
            observationC: null,
            providerC: null,
            providerOtro: null,
            listProvidersC: [],
            detailNCPC: null,
            listProblemsC: [],
            listExecutedActionsC: [],
            listPAPC: [],
            returnApplyC: null, //Fin de las variables
            selectedEA: null,
            newCar: false,
            imageC: null,
            imageCName: null,
            imageCExten: null,
            viewModalImg: false,
            srcImageVM: '',
            datePAPC: null,
            imgTmp: null,
            optionDisplayC: 'none',
            idProductC: null,
            viewModalStateEdit: false,
        };
        that = this;
        this.carservice = new CarService();
        this.showMessage = this.showMessage.bind(this);
        this.templateViews = this.templateViews.bind(this);
        this.editComplaint = this.editComplaint.bind(this);
        this.onComplaintSelect = this.onComplaintSelect.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.onPlaceChange = this.onPlaceChange.bind(this);
        this.onUnitChange = this.onUnitChange.bind(this);
        this.onProviderChange = this.onProviderChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.addNewEA = this.addNewEA.bind(this);
        this.onEASelect = this.onEASelect.bind(this);
        this.updatePropertyEA = this.updatePropertyEA.bind(this);
        this.findSelectedEActionIndex = this.findSelectedEActionIndex.bind(this);
        this.saveEAction = this.saveEAction.bind(this);
        this.addNewP = this.addNewP.bind(this);
        this.onProblemSelect = this.onProblemSelect.bind(this);
        this.saveProblem = this.saveProblem.bind(this);
        this.updatePropertyP = this.updatePropertyP.bind(this);
        this.findSelectedProblemIndex = this.findSelectedProblemIndex.bind(this);
        this.onBasicUploadAuto = this.onBasicUploadAuto.bind(this);
        this.templateImage = this.templateImage.bind(this);
        this.addNewPAP = this.addNewPAP.bind(this);
        this.findSelectedPAPIndex = this.findSelectedPAPIndex.bind(this);
        this.updatePropertyPAP = this.updatePropertyPAP.bind(this);
        this.onPAPSelect = this.onPAPSelect.bind(this);
        this.savePAP = this.savePAP.bind(this);
        this.saveUpdateComplaint = this.saveUpdateComplaint.bind(this);
        this.dataTratamientList = this.dataTratamientList.bind(this);
        this.templateImageDetails = this.templateImageDetails.bind(this);
        this.viewModalImage = this.viewModalImage.bind(this);
        this.generateReport = this.generateReport.bind(this);
        this.calcPercentReclamo = this.calcPercentReclamo.bind(this);
        this.deleteEA = this.deleteEA.bind(this);
        this.deleteProblem = this.deleteProblem.bind(this);
        this.deletePAP = this.deletePAP.bind(this);
        this.addComplaint = this.addComplaint.bind(this);
        this.templateState = this.templateState.bind(this);
        this.closeComplaintAfirmativo = this.closeComplaintAfirmativo.bind(this);
        this.validateTypeUser = this.validateTypeUser.bind(this);

    }

    /* Métodos  Auto Completado Buscar Producto */
    handleDropdownClick() {
        this.setState({ filteredBrands: [] });
        //mimic remote call
        setTimeout(() => {
            this.setState({ filteredBrands: this.brands });
        }, 100)
    }
    filterProducts(event) {
        let results = nameProducts.filter((brand) => {
            return brand.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({ filteredProducts: results });
    }
    onProductValueChange(e) {
        debugger;
        if (e.value.length !== 1) {
            this.state.products.map(function (obj, index) {
                if (obj.nameProduct === e.value) {
                    if (obj.typeProduct === 'PRODUCTO_TERMINADO') {
                        that.setState({ enabledFrecuencia: false });
                    }
                    if (obj.typeProduct === 'MATERIA_PRIMA') {
                        that.setState({ enabledFrecuencia: true });
                    }
                }
            })
        }
        var providers = [];
        var idProductTmp = null;
        if (e.value.length >= 5) {
            this.state.products.map(function (o) {
                if (o.nameProduct == e.value) {
                    idProductTmp = o.idProduct;
                    if (o.providers !== undefined) {
                        o.providers.map(function (p) {
                            let pTmp = { label: '', value: '' }
                            pTmp.label = p.nameProvider;
                            pTmp.value = p.idProvider;
                            providers.push(pTmp);
                        })
                    }
                }
            })
        }

        this.setState({ productName: e.value, nameProductC: e.value, filteredProducts: null, listProvidersC: providers, idProductC: idProductTmp });
    }
    /* FIn Métodos  Auto Completado */

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
    /* Metodos para listas despleglables */
    /* Unidad */
    onUnitChange(e) {
        this.setState({ unitC: e.value });
    }
    /* Lugar */
    onPlaceChange(e) {
        this.setState({ placeC: e.value });
    }
    /* Proveedor */
    onProviderChange(e) {
        this.setState({ providerC: e.value });
    }
    /* Metodo para RadioButton */
    /* Aplica Devolucion */
    onRadioChange(event) {
        this.setState({ returnApplyC: event.value })
    }

    /* Metodo template Tabla Reclamos MP, */
    templateViews(rowData, column) {
        if (rowData.pictureStringB64 !== null || rowData.pictureStringB64 !== '') {
            return (<div>
                <Button type="button" label="Ver" icon='fa fa-tasks' style={{ width: '' }} className="p-button-success" onClick={() => this.showDetails(rowData, 'details')}></Button>
            </div>);
        }

    }

    /* Metod para visulizar la imagen en un acolumna */
    templateImage(rowData, column) {
        return (
            <img style={{ width: '30%', borderRadius: '7px' }} src={rowData.pictureStringB64} />
        );
    }
    /* Metod para visulizar la imagen en un acolumna */
    templateImageDetails(rowData, column) {
        return (
            <img style={{ width: '30%', borderRadius: '7px' }} src={rowData.pictureStringB64} onClick={() => this.viewModalImage(rowData.pictureStringB64)} />
        );
    }
    /* Método para visualizar el boton e la columna estado */
    templateState(rowData, column) {

        switch (rowData.state) {
            case 'Abierto':
                return (
                    <Button type="button" label="Abierto" className="p-button-warning" onClick={() => this.closeComplaint(rowData)}></Button>
                )
            case 'Cerrado':
                return (
                    <Button type="button" label="Cerrado" disabled="disabled" className="p-button-danger" />
                );
            default: return;
        }

    }
    viewModalImage(image) {
        console.log('Activa Dialog')
        this.setState({ viewModalImg: true, srcImageVM: image });
    }

    /* Seleccionar item de la tabla */
    onComplaintSelect(e) {
        this.setState({
            complaint: Object.assign({}, e.data)
        });
    }
    /* Metodo para visualizar los detalles */
    showDetails(data, action) {
        console.log(data);
        if (data.listProblems.length !== 0) {
            data.listProblems.map(function (obj, index) {
                obj.item = index + 1;
            })
        }
        if (data.listActionsPlanProvider.length !== 0) {
            data.listActionsPlanProvider.map(function (obj, index) {
                obj.item = index + 1;
            })
        }
        if (data.listExecutedActons.length !== 0) {
            data.listExecutedActons.map(function (obj, index) {
                obj.item = index + 1;
            })
        }
        switch (action) {
            case 'edit':
                this.setState({ selectedComplaint: data });
                break;
            case 'details':
                this.setState({ visibleMRMPDetails: true, selectedComplaint2: data });
                break;
            default: break;
        }
    }

    /* Template itemList */
    propertyTemplate(prop) {
        return (
            <div className="p-grid p-fluid car-item" style={{ justifyContent: 'center' }}>
                <div className="p-col-12 p-md-12" style={{ borderBottomStyle: 'solid', borderBottomColor: '#eceff1' }}>
                    {prop.description}
                </div>
            </div>
        );
    }

    /* Metodo formato Proveedor */
    dataProvider(data) {
        var listProviders = [];
        if (data.length !== 0) {
            data.map(function (o) {
                let x = { label: '', value: '' };
                x.label = o.nameProvider;
                x.value = o.idProvider;
                listProviders.push(x);
            })
        }
        return listProviders;
    }

    /* Método para añadir Reclamo */
    addComplaint() {
        this.setState({ visibleMRMPEditar: true, optionDisplayC: '', selectedComplaint: {}, selectedComplaint2: {}, listProblemsC:[], listPAPC:[], listExecutedActionsC:[]});
    }

    /* Metodo para editar el Complaint(Reclamo)  */
    editComplaint() {
        debugger;
        if (Object.keys(this.state.selectedComplaint).length !== 0) {
            if (this.state.selectedComplaint.state !== 'Cerrado') {
                var x = null;
                x = this.state.selectedComplaint;
                var d = Date.parse(x.dateComplaint);
                d = new Date(d);
                var ap = '';
                if (x.applyReturn)
                    ap = 'SI'
                else
                    ap = 'NO'
                var listProviders = this.dataProvider(x.product.providers);
                this.showDetails(x, 'edit');
                console.log(this.state.selectedComplaint);
                this.setState({
                    visibleMRMPEditar: true, nameProductC: x.product.nameProduct, batchProviderC: x.batchProvider, palletC: x.palletNumber,
                    dateC: d, unitC: x.unitP, affectedProductC: x.affectedProduct, placeC: x.place, listProvidersC: listProviders,
                    totalAmountC: x.totalAmount, affectAmountC: x.affectedAmount, percentC: x.porcentComplaint, returnApplyC: ap, providerC: x.idProvider, providerOtro: x.otherProvider,
                    detailNCPC: x.detailNCP, listProblemsC: x.listProblems, listPAPC: x.listActionsPlanProvider, listExecutedActionsC: x.listExecutedActons, idProductC: x.idProduct
                });
            } else {
                this.showMessage('El elemento seleccionado no se puede editar debido a su Estado:Cerrado', 'info')
            }

        } else {
            this.showMessage('Seleccione un elmento', 'info');
        }
    }

    /* Metodos para añadir Tareas en Executed Actions, Problems, Plan Providers*/
    /* Inicio ==================*/
    saveEAction() {
        if (this.state.newCar) {
            this.state.listExecutedActionsC.push(this.state.EAction);
            //this.showMessage('Tarea Registrada', '');
        }
        else {
            this.state.listExecutedActionsC[this.findSelectedEActionIndex()] = this.state.EAction;
            //this.showSuccess('Tarea Actualizada');
        }

        this.setState({ selectedEA: null, EAction: null, displayDialog: false });
    }
    saveProblem() {
        if (this.state.newCar) {
            this.state.problem.pictureStringB64 = this.state.imageC;
            this.state.problem.nameFileP = this.state.imageCName;
            this.state.problem.extensionFileP = this.state.imageCExten;
            this.state.listProblemsC.push(this.state.problem);
        }
        else {
            this.state.listProblemsC[this.findSelectedProblemIndex()] = this.state.problem;
            this.state.problem.pictureStringB64 = this.state.imageC;
            this.state.problem.nameFileP = this.state.imageCName;
            this.state.problem.extensionFileP = this.state.imageCExten;
        }
        this.setState({ selectedProblem: null, problem: null, imageC: null, imageCName: null, imageCExten: null, displayDialogP: false });
    }
    savePAP() {
        debugger
        if (this.state.newCar) {
            let dateTmp = formattedDate(this.state.PAP.dateLimit);
            this.state.PAP.dateLimit = dateTmp;
            this.state.listPAPC.push(this.state.PAP);
        }
        else {
            this.state.listPAPC[this.findSelectedPAPIndex()] = this.state.PAP;
            if (typeof this.state.PAP.dateLimit !== 'string') {
                let dateTmp = formattedDate(this.state.PAP.dateLimit);
                this.state.PAP.dateLimit = dateTmp;
            }
        }
        this.setState({ selectedPAP: null, PAP: null, displayDialogPAP: false, datePAPC: null, });
    }
    findSelectedEActionIndex() {
        return this.state.listExecutedActionsC.indexOf(this.state.selectedEA);
    }
    findSelectedProblemIndex() {
        return this.state.listProblemsC.indexOf(this.state.selectedProblem);
    }
    findSelectedPAPIndex() {
        return this.state.listPAPC.indexOf(this.state.selectedPAP);
    }
    updatePropertyEA(property, value) {
        let eActionTmp = this.state.EAction;
        eActionTmp[property] = value;
        this.setState({ EAction: eActionTmp });
    }
    updatePropertyP(property, value) {
        let problemTmp = this.state.problem;
        problemTmp[property] = value;
        this.setState({ problem: problemTmp });
    }
    updatePropertyPAP(property, value) {
        debugger
        let pAPTmp = this.state.PAP;
        pAPTmp[property] = value;
        this.setState({ PAP: pAPTmp });
    }
    addNewEA() {
        this.state.newCar = true;
        var id = this.state.listExecutedActionsC.length;
        this.setState({
            EAction: { item: id + 1, idExecutedAction: null, description: '' },
            displayDialog: true
        });
    }
    addNewP() {
        this.state.newCar = true;
        var id = this.state.listProblemsC.length;
        this.setState({
            problem: { item: id + 1, description: '' },
            displayDialogP: true
        });
    }
    addNewPAP() {
        this.state.newCar = true;
        var id = this.state.listPAPC.length;
        this.setState({
            PAP: { item: id + 1, description: '', dateLimit: null, responsable: null },
            displayDialogPAP: true
        });
    }
    onEASelect(e) {
        this.state.newCar = false;
        this.setState({
            displayDialog: true,
            EAction: Object.assign({}, e.data)
        });
    }
    onProblemSelect(e) {
        this.state.newCar = false;
        this.setState({
            displayDialogP: true,
            imageC: e.data.pictureStringB64,
            problem: Object.assign({}, e.data)
        });
    }
    onPAPSelect(e) {
        debugger
        this.state.newCar = false;
        var date1 = null;
        if ((e.data.dateLimit !== null) && (e.data.dateLimit !== undefined)) {
            date1 = new Date(e.data.dateLimit);
            date1 = new Date(date1.getTime() + 1000 * 60 * 60 * 24);
        }

        this.setState({
            displayDialogPAP: true,
            datePAPC: date1,
            PAP: Object.assign({}, e.data)
        });
    }
    deleteEA() {
        var e = this.state.listExecutedActionsC.indexOf(this.state.selectedEA);
        this.state.listExecutedActionsC.splice(e, 1);
        this.setState({ displayDialog: false })
    }
    deleteProblem() {
        var e = this.state.listProblemsC.indexOf(this.state.selectedProblem);
        this.state.listProblemsC.splice(e, 1);
        this.setState({ displayDialogP: false })
    }
    deletePAP() {
        var e = this.state.listPAPC.indexOf(this.state.selectedPAP);
        this.state.listPAPC.splice(e, 1);
        this.setState({ displayDialogPAP: false })
    }
    /* Fin ==================== */

    /* Método para calcular porcentaje */
    calcPercentReclamo(value, idText) {
        debugger
        var percentTmp = 0;
        var tATmp = 0;
        var aATmp = 0;
        if ((this.state.affectAmountC !== null) & (this.state.affectAmountC !== "")) {
            aATmp = parseFloat(this.state.affectAmountC);
        }
        if ((this.state.totalAmountC !== null) & (this.state.totalAmountC !== ""))
            tATmp = parseFloat(this.state.totalAmountC);

        switch (idText) {
            case 'totalAmount':
                let tM = parseFloat(value);
                if (aATmp !== 0 & tM !== undefined) {
                    percentTmp = ((aATmp / tM) * 100).toFixed(2);
                }
                that.setState({ totalAmountC: value, percentC: percentTmp });
                break;
            case 'affectedAmount':
                let aM = parseFloat(value);
                if (tATmp !== 0 & aM !== undefined) {
                    percentTmp = ((aM / tATmp) * 100).toFixed(2);
                }
                that.setState({ affectAmountC: value, percentC: percentTmp });
                break;
            default: break;
        }

    }

    /* Subir Imagen */
    onBasicUploadAuto(event) {
        debugger;
        var pTmp = null;
        var file = event.target.files[0];
        var ext = (file.type).split('/');
        var sizeImage = (file.size) / 1024;
        if (sizeImage < 650) {
            var reader = new FileReader();
            reader.onloadend = function () {
                //console.log('RESULT', reader.result)
                pTmp = reader.result;
                that.setState({ imageC: pTmp, imageCName: file.name, imageCExten: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            this.showMessage('Error, tamaño de la imagen excedido !', 'error');
            that.setState({ imageC: null, imageCName: null, imageCExten: null });
        }

    }

    /* Tratamient */
    dataTratamientList(data, type) {
        var dataTmp = [];
        switch (type) {
            case 'vista':
                break;
            case 'save':
                if (data.length !== 0) {
                    data.map(function (x) {
                        console.log(x);
                        delete x.item;
                        Object.keys(x).map(function (o) {
                            if (o == '_$visited') {
                                console.log('Ingresa a eliminar visited')
                                delete x['_$visited'];
                            }
                        })
                        dataTmp.push(x);
                    })
                }
                return dataTmp;
            default: break;
        }
    }

    /* Método para Guardar el Reclamo de materia Prima */
    saveUpdateComplaint() {
        debugger
        if (this.state.idProductC != null) {
            var complaint = this.state.selectedComplaint;
            if (this.state.optionDisplayC === '') {
                complaint.idProduct = this.state.idProductC;
            }
            complaint.asUser = this.state.userLogin.idUser;
            complaint.state = 'Abierto';
            complaint.dateComplaint = formattedDateAndHour(this.state.dateC);
            complaint.idProvider = this.state.providerC;
            complaint.otherProvider = this.state.providerOtro;
            complaint.batchProvider = this.state.batchProviderC;
            complaint.palletNumber = this.state.palletC;
            complaint.unitP = this.state.unitC;
            complaint.affectedProduct = this.state.affectedProductC;
            complaint.place = this.state.placeC;
            complaint.totalAmount = this.state.totalAmountC;
            complaint.affectedAmount = this.state.affectAmountC;
            complaint.porcentComplaint = this.state.percentC;
            if (this.state.returnApplyC === 'SI')
                complaint.applyReturn = true;
            else
                complaint.applyReturn = false;
            complaint.detailNCP = this.state.detailNCPC;
            complaint.listActionsPlanProvider = this.dataTratamientList(this.state.listPAPC, 'save');
            complaint.listProblems = this.dataTratamientList(this.state.listProblemsC, 'save');
            complaint.listExecutedActons = this.dataTratamientList(this.state.listExecutedActionsC, 'save');
            show_msgPW();
            SaveComplaintRMP(complaint, function (data, status, msg) {
                hide_msgPW();
                switch (status) {
                    case 'OK':
                        that.showMessage(msg, 'success');
                        that.dataTratamientList(data, 'vista');
                        if (that.state.optionDisplayC === '') {
                            let lc = that.state.dataTable;
                            lc.push(data);
                            that.setState({
                                selectedComplaint: data, visibleMRMPEditar: false, batchProviderC: '', palletC: '',
                                dateC: null, unitC: null, affectedProductC: '', placeC: null, totalAmountC: '', affectAmountC: '', percentC: '',
                                providerC: null,
                                detailNCPC: '', optionDisplayC: 'none', idProductC: '', dataTable: lc, productName: '', nameProductC: '', applyReturn: null
                            });
                        } else {
                            that.setState({
                                selectedComplaint: data, visibleMRMPEditar: false, batchProviderC: '', palletC: '',
                                dateC: null, unitC: null, affectedProductC: '', placeC: null, totalAmountC: '', affectAmountC: '', percentC: '',
                                providerC: null,
                                detailNCPC: '', nameProductC: ''
                            });
                        }

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
        else {
            this.showMessage('Debe escoger el producto a registrar ', 'error');
        }

    }

    /* Metodo para generar Reporte de Reclamo de Materia Prima */
    generateReport() {
        if (Object.keys(this.state.selectedComplaint).length !== 0) {
            var data = { idComplaint: this.state.selectedComplaint.idComplaint };
            show_msgPW();
            GenerateReportComplaint(data, function (data, status, msg) {
                switch (status) {
                    case 'OK':
                        hide_msgPW();
                        that.showMessage(msg, 'success');
                        //let contacts = 'anunez@imptek.com';
                        let subject = 'Reclamo MP ' + that.state.selectedComplaint.product.nameProduct;
                        let msgEmail = 'Estimados. \nAdjunto el documento RMP' + that.state.selectedComplaint.idComplaint + ' ' + that.state.selectedComplaint.product.nameProduct;
                        setParamsSendEmail(data.filePath, subject, msgEmail);
                        break;
                    case 'ERROR':
                        hide_msgPW();
                        that.showMessage(msg, 'error');
                        break;
                    default:
                        hide_msgPW();
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        } else {
            this.showMessage('Para generar el reporte debe seleccionar un problema', 'error')
        }
    }

    /* Método para cerrar el caso de Reclamo de MP */
    closeComplaint(data) {
        if (this.validateTypeUser() !== 'none')
            this.setState({ viewModalStateEdit: true, selectedComplaint: data });
    }
    async closeComplaintAfirmativo() {
        var com = this.state.selectedComplaint;
        this.props.openModal();
        const reclamo = await ReclamoMPService.cerrar(com.idComplaint);
        this.props.closeModal();
        that.showMessage('Reclamo cerrado', 'success');
        that.setState({viewModalStateEdit: false });
        this.actualizarTabla();
    }

    actualizarTabla() {
        GetAllComplaintsRMP(function (data, status, msg) {
            switch (status) {
                case 'OK':
                    that.setState({ dataTable: data });
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

    /* Método para restringir el usuario de Consulta con el de Edición Compras/ Calidad */
    validateTypeUser() {
        var sesion = this.props.currentUser
        if (sesion != null) {
            switch (sesion.employee.area.nameArea.toUpperCase()) {
                case 'COMPRAS':
                    return 'none';
                case 'CALIDAD':
                    return '';
                case 'TECNOLOGÍA DE LA INFORMACIÓN':
                    return '';
                default:
                    return 'none';
            }
        } else {
            console.log('No valida type User')
        }


    }



    componentDidMount() {

        nameProducts = [];
        GetAllComplaintsRMP(function (data, status, msg) {
            debugger;
            console.log(data);
            switch (status) {
                case 'OK':
                    that.setState({ dataTable: data });
                    break;
                case 'ERROR':
                    that.showMessage(msg, 'error');
                    break;
                default:
                    that.showMessage(msg, 'info');
                    break;
            }
        })
        var productsMP = [];
        GetAllProducts(function (items) {
            items.map(function (value, index) {
                nameProducts.push(value.nameProduct);
                productsMP.push(value);
                if (value.typeProduct == 'MP') {

                }

            })
            console.log(productsMP);
            that.setState({ products: productsMP })
        });
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
        const footerDetail = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={() => this.setState({ visibleMRMPDetails: false, listExecutedActionsC: [], listPAPC: [], listProblemsC: [], nameProductC: '' })} />
            </div>
        );
        const footerEdit = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={this.saveUpdateComplaint} />
                <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={() => this.setState({
                    visibleMRMPEditar: false, detailNCPC: '', providerC: '', batchProviderC: '',
                    totalAmountC: '', affectAmountC: '', percentC: '', affectedProductC: '', nameProduct: '', nameProductC: '', optionDisplayC: 'none', datePAPC: null, PAP: null, problem: null, EAction: null
                })} />
            </div>
        );

        let headerGroup = <ColumnGroup>
            <Row>
                <Column header="Item" style={{ width: '7%', backgroundColor: '#bbdefb' }} />
                <Column header="Descripción Acción" style={{ backgroundColor: '#bbdefb' }} />
            </Row>
        </ColumnGroup>
        let headerGroupPAP = <ColumnGroup>
            <Row>
                <Column header="Item" style={{ width: '7%', backgroundColor: '#bbdefb' }} />
                <Column header="Fecha Limite" style={{ width: '15%', backgroundColor: '#bbdefb' }} />
                <Column header="Descripción Acción" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="Responsable" style={{ width: '20%', backgroundColor: '#bbdefb' }} />

            </Row>
        </ColumnGroup>
        let headerGroupProblem = <ColumnGroup>
            <Row>
                <Column header="Item" style={{ width: '7%', backgroundColor: '#bbdefb' }} />
                <Column header="Descripción Problema" style={{ width: '65%', backgroundColor: '#bbdefb' }} />
                <Column header="Imagen" style={{ backgroundColor: '#bbdefb' }} />
            </Row>
        </ColumnGroup>
        let footerEA = <div className="p-helper-clearfix" style={{ width: '10%' }} >
            <Button style={{ float: 'left' }} icon="pi pi-plus" onClick={this.addNewEA} />
        </div>;
        let footerP = <div className="p-helper-clearfix" style={{ width: '10%' }} >
            <Button style={{ float: 'left' }} icon="pi pi-plus" onClick={this.addNewP} />
        </div>;
        let footerPAP = <div className="p-helper-clearfix" style={{ width: '10%' }} >
            <Button style={{ float: 'left' }} icon="pi pi-plus" onClick={this.addNewPAP} />
        </div>;
        let dialogFooter = <div className="p-dialog-buttonpane p-helper-clearfix">
            <Button className='p-button-danger' icon="pi pi-trash" label="Eliminar" onClick={this.deleteEA} />
            <Button className='p-button-success' label="Guardar" icon="pi pi-save" onClick={this.saveEAction} />
        </div>;
        let dialogFooterP = <div className="p-dialog-buttonpane p-helper-clearfix">
            <Button className='p-button-danger' icon="fa fa-trash" label="Eliminar" onClick={this.deleteProblem} />
            <Button className='p-button-success' label="Guardar" icon="pi pi-save" onClick={this.saveProblem} />
        </div>;
        let dialogFooterPAP = <div className="p-dialog-buttonpane p-helper-clearfix">
            <Button className='p-button-danger' icon="pi pi-trash" label="Eliminar" onClick={this.deletePAP} />
            <Button className='p-button-success' label="Guardar" icon="pi pi-save" onClick={this.savePAP} />
        </div>;
        const footerCloseComplaint = (
            <div>
                <Button label="Si" icon="pi pi-check" className="p-button-primary" onClick={this.closeComplaintAfirmativo} />
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ viewModalStateEdit: false })} className="p-button-danger" />
            </div>
        );
        return (
            <div className="p-grid">
                <Growl ref={(el) => this.growl = el} />
                <Email />
                <PW />

                <div className="p-col-12 p-lg-12 " style={{ paddingBottom: '0px' }}>
                    <div className='card card-w-title shadow-box p-shadow-3' style={{ backgroundColor: '#d4e157', borderColor: '#d4e157' }}>
                        <h1 >PROBLEMAS DE MATERIA PRIMA</h1>
                    </div>

                </div>

                <div className="p-col-12 p-lg-12">

                    <div className="card card-w-title">
                        <Toolbar>
                            <div className="p-toolbar-group-right">
                                <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
                                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
                            </div>
                            <div className="p-toolbar-group-left">
                                <Button icon="pi pi-plus" label="Añadir" onClick={this.addComplaint} style={{ display: this.validateTypeUser() }} />
                                <Button icon="pi pi-pencil" label="Editar" className="p-button-warning" onClick={() => this.editComplaint()} style={{ display: this.validateTypeUser() }} />
                                <Button icon="fa fa-file-pdf-o" label='Reporte' className="p-button-success" onClick={() => this.generateReport()} style={{ display: this.validateTypeUser() }} />
                            </div>
                        </Toolbar>

                        <DataTable ref={(el) => this.dt = el} value={this.state.dataTable} selectionMode="single" paginator={true} rows={12} scrollable={true} scrollHeight="700px"
                            responsive={true} selection={this.state.selectedComplaint} onSelectionChange={event => this.setState({ selectedComplaint: event.value })}>
                            <Column field="number" header="PNC.08" sortable={true} filter={true} filterPlaceholder="Número" style={{ width: '7%' }} />
                            <Column field="dateComplaint" header="Fecha" sortable={true} filter={true} filterPlaceholder="Contiene" />
                            <Column field="product.nameProduct" header="Materia Prima" sortable={true} filter={true} filterPlaceholder="Contiene" />
                            <Column field="detailNCP" header="Detalle NC" sortable={true} filter={true} filterPlaceholder="Contiene" style={{ width: '29%' }} />
                            <Column field="provider.nameProvider" header="Proveedor" sortable={true} filter={true} filterPlaceholder="Contiene" />
                            <Column field="totalAmount" header="Cantidad Total" sortable={true} filter={true} style={{ textAlign: 'center' }} />
                            <Column field="affectedAmount" header="Cantidad Afectada" sortable={true} filter={true} style={{ textAlign: 'center' }} />
                            <Column field="porcentComplaint" header="% PNC" sortable={true} filter={true} style={{ textAlign: 'center' }} />
                            <Column header="Detalles" body={this.templateViews} style={{ textAlign: 'center', width: '7em' }} />
                            <Column field="state" header="Estado" sortable={true} filter={true} body={this.templateState} style={{ width: '7%', textAlign: 'center' }} />
                            <Column field="kpiTime" header="I. Tiempo (Días)" sortable={true} style={{ width: '7%', textAlign: 'center' }} />
                        </DataTable>

                    </div>
                </div>
                <Dialog visible={this.state.viewModalStateEdit} style={{ width: '30vw' }} footer={footerCloseComplaint} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ viewModalStateEdit: false })}>
                    <Card style={{ borderColor: '#2196f3' }}>
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className="p-col-12" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', textAlign: 'center' }}>DESEA CERRAR EL CASO DE RECLAMO MATERIA PRIMA..?</span>
                            </div>
                            <div className="p-col-12" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Producto:</span>{Object.keys(this.state.selectedComplaint).length === 0 ? '' : this.state.selectedComplaint.product.nameProduct}
                            </div>
                        </div>
                    </Card>

                </Dialog>
                <Dialog header="Detalles" visible={this.state.visibleMRMPDetails} style={{ width: '60%', backgroundColor: '#eceff1' }} blockScroll footer={footerDetail} modal={true} onHide={() => this.setState({ visibleMRMPDetails: false })}>

                    <div className='p-grid p-fluid'>
                        <div className="p-col-12 p-md-12">
                            <div className="card card-w-title">
                                <div className='p-grid p-fluid' style={{ backgroundColor: '#dcedc8' }}>
                                    <div className="p-col-12 p-lg-2">
                                        <strong style={{ marginRight: '2%' }}>Fecha:</strong>{Object.keys(this.state.selectedComplaint2).length === 0 ? '' : this.state.selectedComplaint2.dateComplaint}
                                    </div>
                                    <div className="p-col-12 p-lg-4">
                                        <strong style={{ marginRight: '2%' }}>Materia Prima:</strong>{Object.keys(this.state.selectedComplaint2).length === 0 ? '' : this.state.selectedComplaint2.product.nameProduct}
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <strong style={{ marginRight: '2%' }}>Producto Afectado:</strong>{Object.keys(this.state.selectedComplaint2).length === 0 ? '' : this.state.selectedComplaint2.affectedProduct}
                                    </div>
                                    <div className="p-col-12 p-lg-3">
                                        <strong style={{ marginRight: '2%' }}>Proveedor:</strong>{Object.keys(this.state.selectedComplaint2).length === 0 ? '' : this.state.selectedComplaint2.provider?this.state.selectedComplaint2.provider.nameProvider: this.state.selectedComplaint2.otherProvider}
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="p-col-12 p-md-12">
                            <div className="card card-w-title">
                                <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                                    <TabPanel header="Acciones Ejecutadas" rightIcon="fa fa-calendar" >
                                        <DataTable value={this.state.selectedComplaint2.listExecutedActons} headerColumnGroup={headerGroup} responsive={true}>
                                            <Column field="item" style={{ width: '7%', textAlign: 'center' }} />
                                            <Column field="description" />
                                        </DataTable>

                                    </TabPanel>
                                    <TabPanel header="Problemas" rightIcon="fa fa-exclamation-triangle">
                                        <DataTable value={this.state.selectedComplaint2.listProblems} headerColumnGroup={headerGroupProblem} responsive={true}>
                                            <Column field="item" style={{ width: '7%', textAlign: 'center' }} />
                                            <Column field="description" />
                                            <Column field="picture" body={this.templateImageDetails} />
                                        </DataTable>
                                    </TabPanel>
                                    <TabPanel header="Plan Acción Proveedor" rightIcon="fa fa-calendar">
                                        <DataTable value={this.state.selectedComplaint2.listActionsPlanProvider} headerColumnGroup={headerGroupPAP} responsive={true}>
                                            <Column field="item" style={{ width: '7%', textAlign: 'center' }} />
                                            <Column field="dateLimit" style={{ width: '15%', textAlign: 'center' }} />
                                            <Column field="description" />
                                            <Column field="responsable" style={{ width: '20%', textAlign: 'center' }} />
                                        </DataTable>
                                    </TabPanel>
                                </TabView>

                            </div>

                        </div>
                    </div>

                </Dialog>
                <Dialog visible={this.state.viewModalImg} style={{ width: '30vw', justifyContent: 'center', textAlign: 'center' }} onHide={() => this.setState({ viewModalImg: false })} closeOnEscape >
                    <img src={this.state.srcImageVM} alt="Galleria 1" style={{ width: '500px', borderRadius: '7px' }} />
                </Dialog>
                <Dialog header="Crear/Editar" visible={this.state.visibleMRMPEditar} style={{ width: '60vw', backgroundColor: '#eceff1' }} footer={footerEdit} modal={true} maximizable blockScroll onHide={() => this.setState({ visibleMRMPEditar: false, optionDisplayC: 'none' })}>
                    <Card style={{ backgroundColor: '#dcedc8', display: this.state.optionDisplayC }} >
                        <div className='p-grid form-group p-fluid'>
                            <div className='p-col-10' >
                                <label htmlFor="float-input">Buscar Producto</label>
                                <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                    suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.productName}
                                    onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                                />
                            </div>
                        </div>
                    </Card>

                    <Accordion>
                        <AccordionTab header="Información" >
                            <Card style={{ backgroundColor: '#e3f2fd' }}>
                                <div className='p-grid p-fluid'>
                                    <div className="p-grid ">
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Producto</label>
                                            {/* <InputText value={this.state.selectedComplaint && this.state.selectedComplaint.product && this.state.selectedComplaint.product.nameProduct} disabled={true} /> */}
                                            <InputText value={this.state.optionDisplayC === '' ? this.state.nameProductC : this.state.selectedComplaint && this.state.selectedComplaint.product && this.state.selectedComplaint.product.nameProduct} disabled={true} />
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Fecha</label>
                                            <Calendar dateFormat="yy/mm/dd" value={this.state.dateC} locale={es} showTime={true} onChange={(e) => this.setState({ dateC: e.value })} showIcon={true} />
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Proveedor</label>
                                            <Dropdown value={this.state.providerC} options={this.state.listProvidersC} autoWidth={false} onChange={this.onProviderChange} placeholder="Seleccione" />
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Otro Proveedor</label>
                                            <InputText value={this.state.providerOtro} onChange={(e) => this.setState({ providerOtro: e.target.value })} placeholder="Otro" />
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Lote Proveedor</label>
                                            <div className="p-inputgroup">
                                                <InputText placeholder='Lote' value={this.state.batchProviderC} onChange={(e) => this.setState({ batchProviderC: e.target.value })} />
                                                <span className="p-inputgroup-addon">
                                                    <i className="fa fa-car"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Lote Interno #Pallet</label>
                                            <InputText placeholder='Pallet número' value={this.state.palletC} onChange={(e) => this.setState({ palletC: e.target.value })} />
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Unidad</label>
                                            <Dropdown value={this.state.unitC} options={unidadesMedida} autoWidth={false} onChange={this.onUnitChange} placeholder="Seleccione" />
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Producto Afectado</label>
                                            <div className="p-inputgroup">
                                                <InputText placeholder='Nombre' value={this.state.affectedProductC} onChange={(e) => this.setState({ affectedProductC: e.target.value })} />
                                                <span className="p-inputgroup-addon">
                                                    <i className="fa fa-product-hunt"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Lugar</label>
                                            <Dropdown value={this.state.placeC} options={placesRMP} autoWidth={false} onChange={this.onPlaceChange} placeholder="Seleccione" />
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Cantidad Total</label>
                                            <div className="p-inputgroup">
                                                <InputText placeholder='Número de unidades' keyfilter="num" value={this.state.totalAmountC} onChange={(e) => this.calcPercentReclamo(e.target.value, 'totalAmount')} />
                                                <span className="p-inputgroup-addon">
                                                    <i className="fa fa-sort-amount-asc"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">Cantidad Afectada</label>
                                            <div className="p-inputgroup">
                                                <InputText placeholder='Número de unidades' keyfilter="num" value={this.state.affectAmountC} onChange={(e) => this.calcPercentReclamo(e.target.value, 'affectedAmount')} />
                                                <span className="p-inputgroup-addon">
                                                    <i className="fa fa-sort-amount-asc"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <label htmlFor="float-input">PNC Reclamo</label>
                                            <div className="p-inputgroup">
                                                <InputText placeholder='' keyfilter="num" value={this.state.percentC} onChange={(e) => this.setState({ percentC: e.target.value })} />
                                                <span className="p-inputgroup-addon">
                                                    <i className="fa fa-percent"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-col-12 p-md-3">
                                            <div className="p-col-12 p-md-12">
                                                <label htmlFor="float-input">Aplica Devolución</label>
                                            </div>
                                            <div className="p-col-12 p-md-2">
                                                <RadioButton value="SI" inputId="rb1" onChange={this.onRadioChange} checked={this.state.returnApplyC === "SI"} />
                                                <label htmlFor="rb1" style={{ marginLeft: '5px' }}>Si</label>
                                            </div>
                                            <div className="p-col-12 p-md-2">
                                                <RadioButton value="NO" inputId="rb2" onChange={this.onRadioChange} checked={this.state.returnApplyC === "NO"} />
                                                <label htmlFor="rb2" style={{ marginLeft: '5px' }}>No</label>
                                            </div>
                                        </div>
                                        <div className="p-col-12 p-md-9">
                                            <label htmlFor="float-input">Detalle No Conformidad</label>
                                            <InputTextarea rows={3} value={this.state.detailNCPC} onChange={(e) => this.setState({ detailNCPC: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </AccordionTab>

                        <AccordionTab header='Acciones, Problemas, Acciones Proveedor'>
                            <Card style={{ backgroundColor: '#f1f8e9' }}>
                                <div className='p-grid p-fluid'>
                                    <div className="p-col-12 p-md-12">
                                        <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                                            <TabPanel header="Acciones Ejecutadas" rightIcon="fa fa-calendar">

                                                <DataTable ref={(el) => this.dt = el} value={this.state.listExecutedActionsC} headerColumnGroup={headerGroup} responsive={true} footer={footerEA}
                                                    selectionMode="single" selection={this.state.selectedEA} onSelectionChange={(e) => { this.setState({ selectedEA: e.data }); }}
                                                    onRowSelect={this.onEASelect} scrollable={true} scrollHeight="250px" >
                                                    <Column field="item" style={{ width: '7%', textAlign: 'center' }} sortable={true} />
                                                    <Column field="description" sortable={true} />
                                                </DataTable>

                                                <Dialog visible={this.state.displayDialog} header="Crear/Editar Acción" modal={false} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                                                    style={{ backgroundColor: '#dcedc8' }}>
                                                    {this.state.EAction && <div className="p-grid">
                                                        <div className="p-grid">
                                                            <div className="p-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="accion">Acción</label></div>
                                                            <div className="p-grid-col-9" style={{ padding: '4px 10px' }}>
                                                                <InputTextarea rows={4} cols={90} value={this.state.EAction.description} onChange={(e) => { this.updatePropertyEA('description', e.target.value) }} />
                                                            </div>
                                                        </div>
                                                    </div>}
                                                </Dialog>

                                            </TabPanel>
                                            <TabPanel header="Problemas" rightIcon="fa fa-exclamation-triangle">

                                                <DataTable ref={(el) => this.dt = el} value={this.state.listProblemsC} headerColumnGroup={headerGroupProblem} responsive={true} footer={footerP}
                                                    selectionMode="single" selection={this.state.selectedProblem} onSelectionChange={(e) => { this.setState({ selectedProblem: e.data }); }}
                                                    scrollable={true} scrollHeight="250px" >
                                                    <Column field="item" style={{ width: '7%', textAlign: 'center' }} />
                                                    <Column field="description" />
                                                    <Column field="picture" body={this.templateImage} />
                                                </DataTable>
                                                <Dialog visible={this.state.displayDialogP} header="Crear/Editar Problema" width='100px' modal={false} footer={dialogFooterP} onHide={() => this.setState({ displayDialogP: false })}
                                                    style={{ backgroundColor: '#dcedc8' }}>
                                                    {this.state.problem && <div className="p-grid ">
                                                        <div className="p-grid ">
                                                            <div className="p-col-12 p-md-2" style={{ padding: '4px 10px' }}><label htmlFor="accion">Descripción</label></div>
                                                            <div className="p-col-12 p-md-9" style={{ padding: '4px 10px' }}>
                                                                <InputTextarea rows={4} cols={90} value={this.state.problem.description} onChange={(e) => { this.updatePropertyP('description', e.target.value) }} />
                                                            </div>
                                                            <div className="p-col-12 p-md-2" style={{ padding: '4px 10px' }}><label htmlFor="accion">Seleccione Imagen</label></div>
                                                            <div className="p-col-12 p-md-9" style={{ padding: '4px 10px' }}>
                                                                <input type='file' onChange={this.onBasicUploadAuto} />
                                                            </div>
                                                        </div>

                                                    </div>}
                                                </Dialog>

                                            </TabPanel>
                                            <TabPanel header="Plan Acción Proveedor" rightIcon="fa fa-calendar">
                                                <DataTable ref={(el) => this.dt = el} value={this.state.listPAPC} headerColumnGroup={headerGroupPAP} responsive={true} footer={footerPAP}
                                                    selectionMode="single" selection={this.state.selectedPAP} onSelectionChange={(e) => { this.setState({ selectedPAP: e.data }); }}
                                                    scrollable={true} scrollHeight="200px" >
                                                    <Column field="item" style={{ width: '7%', textAlign: 'center' }} />
                                                    <Column field="dateLimit" style={{ width: '15%', textAlign: 'center' }} />
                                                    <Column field="description" />
                                                    <Column field="responsable" style={{ width: '20%', textAlign: 'center' }} />
                                                </DataTable>
                                                <Dialog visible={this.state.displayDialogPAP} header="Crear/Editar Acción" modal={true} footer={dialogFooterPAP} onHide={() => this.setState({ displayDialogPAP: false })}
                                                    style={{ backgroundColor: '#dcedc8', width: '50vw' }}>
                                                    {this.state.PAP && <div className="p-grid p-fluid">
                                                        <div className="p-grid">
                                                            <div className="p-col-2" style={{ padding: '4px 10px' }}><label htmlFor="accion">Fecha límite</label></div>
                                                            <div className="p-col-9" style={{ padding: '4px 10px' }}>
                                                                <Calendar dateFormat="yy/mm/dd" value={this.state.datePAPC} locale={es} onChange={(e) => { this.updatePropertyPAP('dateLimit', e.value) }} showIcon={true} />
                                                            </div>
                                                            <div className="p-col-2" style={{ padding: '4px 10px' }}><label htmlFor="accion">Responsable</label></div>
                                                            <div className="p-col-9" style={{ padding: '4px 10px' }}>
                                                                <InputText placeholder='' value={this.state.PAP.responsable} onChange={(e) => { this.updatePropertyPAP('responsable', e.target.value) }} />
                                                            </div>
                                                            <div className="p-col-2" style={{ padding: '4px 10px' }}><label htmlFor="accion">Acción</label></div>
                                                            <div className="p-col-9" style={{ padding: '4px 10px' }}>
                                                                <InputTextarea rows={4} cols={90} value={this.state.PAP.description} onChange={(e) => { this.updatePropertyPAP('description', e.target.value) }} />
                                                            </div>
                                                        </div>

                                                    </div>}
                                                </Dialog>
                                            </TabPanel>



                                        </TabView>
                                    </div>
                                </div>
                            </Card>

                        </AccordionTab>

                    </Accordion>

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

export default connect(mapStateToProps, mapDispatchToProps)(Complaint)