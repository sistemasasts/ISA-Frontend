import React, { Component } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { Growl } from 'primereact/growl';
import { tooltip } from 'primereact/tooltip';
import { TreeTable } from 'primereact/treetable';


/* ====================  T R A N S A C T I O N S ======================== */
import { GetNotifications, DownloadFileFromServer, ValidateDeliverMaterial, RespondProcessFlow, GenerateReportDDP04, TxAvailableMP } from '../../utils/TransactionsCalidad';

/* ===================== U T I L S   ======================== */
import { getDatenow, formattedDate, getDateWithNameMonth, getHourFromDate } from '../../utils/FormatDate';

/* ======  DATA CATALOGOS ======== */
import { approbateType, approbateDesicion } from '../../global/catalogs';

/* =============  SUB-COMPONENTS  ======== */
import { PW, show_msgPW, hide_msgPW } from '../../global/SubComponents/PleaseWait'; //Sub-Componente "Espere Por favor..."
import RTest, { show_form } from './Request-type/RequestTest';
import RProcessTest, { show_formRPP } from './Request-type/Request-Process-Test';
import OrderMP, { show_formOrderMP } from './Request-type/Order-MP';
import { Email, setParamsSendEmail } from '../Email/EmailGeneric';
import { connect } from 'react-redux';

var that;
class WFlow extends Component {

    constructor() {
        super();
        this.state = {
            userLogin: null,
            tray: [],
            trayOriginal: [],
            processToUpdate: null,
            expandedRows: null,
            viewModalValidateDeliverMaterial: false,
            commentResponse: null,
            displayRespond: 'none',
            displayTable: '',
            fileB64: null,
            fileNameInform: null,
            fileExtension: null,
            fileB64Aditional: null,
            fileNameAditional: null,
            fileExtensionAditional: null,
            approve: null,
            approvView: 'none',
            approvViewType: 'none',
            approveType: null,
            approveState: true,
            viewNewRequestButton: 'none',
            viewModalImg: false,
            srcImageVM: null,
            viewStateDDP05: 'none',
            viewModalSubProcess: false,
            contentDialog: null,
            viewModalSMP: false,
            addFileState: false,
            aproveAndShare: false,
        };
        that = this;
        this.showMessage = this.showMessage.bind(this);
        this.download = this.download.bind(this);
        this.dataTratamientTray = this.dataTratamientTray.bind(this);
        this.onNotificationSelect = this.onNotificationSelect.bind(this);
        this.deliverTypeTemplate = this.deliverTypeTemplate.bind(this);
        this.FilesTemplate = this.FilesTemplate.bind(this);
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.downloadFiles = this.downloadFiles.bind(this);
        this.validationTestRequest = this.validationTestRequest.bind(this);
        this.findProcessUpdeted = this.findProcessUpdeted.bind(this);
        this.onBasicUploadAutoResponse = this.onBasicUploadAutoResponse.bind(this);
        this.onBasicUploadAutoResponseAditionalInform = this.onBasicUploadAutoResponseAditionalInform.bind(this);
        this.viewButtonValidate = this.viewButtonValidate.bind(this);
        this.sendRespond = this.sendRespond.bind(this);
        this.onApprobeChange = this.onApprobeChange.bind(this);
        this.onApprobeTypeChange = this.onApprobeTypeChange.bind(this);
        this.validateFormRespond = this.validateFormRespond.bind(this);
        this.stateProcessTemplate = this.stateProcessTemplate.bind(this);
        this.refreshDataWorkflow = this.refreshDataWorkflow.bind(this);
        this.startProcessTestRForm = this.startProcessTestRForm.bind(this);
        this.showImageProcessTestRequest = this.showImageProcessTestRequest.bind(this);
        this.generateReportDDP04 = this.generateReportDDP04.bind(this);
        this.fillContentInformation = this.fillContentInformation.bind(this);
        this.templateContentInformation = this.templateContentInformation.bind(this);
        this.requestOrderMP = this.requestOrderMP.bind(this);
        this.availableSMPForDDP04 = this.availableSMPForDDP04.bind(this);
        this.determinateFilesProcessInTest = this.determinateFilesProcessInTest.bind(this);
        this.determinateFilesForRequestTest = this.determinateFilesForRequestTest.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.getAllFilesDDP04 = this.getAllFilesDDP04.bind(this);
        this.dateTimeTemplate = this.dateTimeTemplate.bind(this);
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

    /*Metodo para DropDown Aprobación    */
    onApprobeChange(e) {
        if (e.value === 'Aprobado')
            this.setState({ approve: e.value, approveState: false });
        else {
            this.setState({ approve: e.value, approveState: true });
        }
    }

    /*Metodo para DropDown Aprobación    */
    onApprobeTypeChange(e) {
        this.setState({ approveType: e.value });
    }


    download() {
        // fake server request, getting the file url as response
        /* setTimeout(() => {
            const response = {
                file: require('X:/HCC/MP/HCC Aceite Plastificante 4500014808.pdf'),
            };
            // server sent the url to the file!
            // now, let's download:
            //window.location.href = response.file;
            // you could also do:
            window.open(response.file);
        }, 100); */
    }

    /* Método para tratamiento de la Data */
    dataTratamientTray(data) {
        var trayTmp = [];
        if (data != null || data.length !== 0) {
            data.map(function (o) {
                var itemTray = { files: [] };
                itemTray.timeNoti = o.noti.date;
                itemTray.userLast = o.user;
                itemTray.files = o.actionProcess.listFileDocument;
                itemTray.idProcess = o.process.idProcess;
                itemTray.APDate = o.actionProcess.dateAP;
                itemTray.timeRespond = o.actionProcess.timeRespond;
                itemTray.detail = o.actionProcess.detail;
                itemTray.testRequest = o.process.testRequest
                itemTray.processTestRequest = o.process.processTestRequest
                itemTray.subProcess = o.process.subProcess;
                itemTray.amount = o.actionProcess.amountOrder;
                itemTray.materialType = o.actionProcess.materialType;
                itemTray.materialUnit = o.actionProcess.materialUnit;
                itemTray.priorityLevel = o.process.testRequest !== null ? o.process.testRequest.priorityLevel : "-";
                var area = that.state.userLogin.employee.area.nameArea;
                if (area === 'COMPRAS' || area === 'COMERCIAL') {
                    switch (o.actionProcess.state) {
                        case 'Enviado':
                            itemTray.state = 'Enviado';
                            itemTray.comment = o.actionProcess.comment;
                            break;
                        case 'MP Solicitada':
                            itemTray.state = 'Pendiente';
                            itemTray.comment = o.actionProcess.comment;
                            break;
                        default:
                            if (o.process.state === 'Abierto') {
                                itemTray.state = 'En Proceso';
                                itemTray.comment = o.actionProcess.comment;
                            } else {
                                itemTray.state = o.process.state;
                                itemTray.comment = o.actionProcess.comment;
                            }
                            break;
                    }

                } else if (area === 'PRODUCCIÓN') {
                    switch (o.actionProcess.state) {
                        case 'Aprobado-Envio-DDP04':
                            itemTray.state = 'Pendiente';
                            itemTray.comment = o.actionProcess.comment;
                            break;
                        case 'Por Aprobar y Comunicar':
                            var lastActionProcess = o.process.listActionsProcess[o.process.listActionsProcess.length - 2];
                            itemTray.state = "Finalizado";
                            itemTray.comment = lastActionProcess.comment;
                            itemTray.files = lastActionProcess.listFileDocument;
                            itemTray.userLast = that.state.userLogin.employee.completeName;
                            break;
                        default:
                            itemTray.state = o.actionProcess.state;
                            itemTray.comment = o.actionProcess.comment;
                            break;
                    }
                } else {
                    switch (o.actionProcess.state) {
                        case 'Enviado':
                            itemTray.state = 'Pendiente';
                            itemTray.comment = o.actionProcess.comment;
                            break;
                        case 'En Proceso':
                            itemTray.state = 'Por Responder';
                            itemTray.comment = o.actionProcess.comment;
                            break;
                        case 'Por Aprobar':
                            itemTray.state = 'Por Aprobar';
                            itemTray.comment = o.actionProcess.comment;
                            break;
                        case 'Enviado DDP04':
                            if (that.state.userLogin.idUser === 'svillacis')
                                itemTray.state = 'Pendiente';
                            else
                                itemTray.state = o.actionProcess.state;
                            itemTray.comment = o.actionProcess.comment;
                            break;
                        case 'Por Aprobar DDP04':
                            if (that.state.userLogin.idUser === 'svillacis')
                                itemTray.state = 'Pendiente';
                            else
                                itemTray.state = o.actionProcess.state;
                            itemTray.comment = o.actionProcess.comment;
                            break;

                        case 'MP Disponible':
                            itemTray.state = 'Listo DDP04';
                            itemTray.comment = o.actionProcess.comment;
                            break;
                        default:
                            itemTray.state = o.actionProcess.state;
                            itemTray.comment = o.actionProcess.comment;
                            break;
                    }
                }

                trayTmp.push(itemTray);
            })
        }
        this.setState({ tray: trayTmp, trayOriginal: data, viewModalValidateDeliverMaterial: false, viewModalSMP: false });
    }

    /* Método para determinar el proceso q se actuaizo */
    findProcessUpdeted(trayItem) {
        var flag = true;
        var ind = '';
        if (this.state.trayOriginal.length !== 0) {
            this.state.trayOriginal.map(function (t, indice) {
                if (trayItem.process.idProcess == t.process.idProcess) {
                    ind = indice;
                    t = trayItem;
                    flag = false;
                }

            })
        }

        if (!flag) {
            this.state.trayOriginal.splice(ind, 1);
            var name = this.state.userLogin.employee.name.split(' ');
            var lastName = this.state.userLogin.employee.lastName.split(' ');
            trayItem.user = name[0] + " " + lastName[0];
            this.state.trayOriginal.push(trayItem);
        }


        return this.state.trayOriginal;
    }

    /* Seleccionar item de la tabla */
    onNotificationSelect(e) {
        this.setState({
            notification: Object.assign({}, e.data)
        });
    }

    /* Método para Customizar la columan DeliverType de la tabla */
    deliverTypeTemplate(rowData, column) {
        if (rowData.testRequest !== null) {
            switch (rowData.testRequest.deliverType) {
                //Color Rojo #d9534f
                case 'Inmediato':
                    return (
                        <div style={{ background: '' }}>
                            <spam style={{ color: '#d9534f', fontWeight: 'bold' }}>{rowData.testRequest.deliverType.toUpperCase()}</spam>
                        </div>
                    )
                //Color Naranja #f0ad4e
                case 'Medio':
                    return (
                        <spam style={{ color: '#f0ad4e', fontWeight: 'bold' }}>{rowData.testRequest.deliverType.toUpperCase()}</spam>
                    );
                //Color amarillo #c0ca33    
                case 'Bajo':
                    return (
                        <spam style={{ color: '#c0ca33', fontWeight: 'bold' }}>{rowData.testRequest.deliverType.toUpperCase()}</spam>
                    );
                default: break;
            }
        } else {
            return (
                <spam >NA</spam>
            );
        }

    }

    /* Método para Customizar la columan DeliverType de la tabla */
    stateProcessTemplate(rowData, column) {
        debugger;
        switch (rowData.state.toUpperCase()) {
            //Color azul #1976d2
            case 'ENVIADO':
                return (
                    <div style={{ background: '' }}>
                        <spam style={{ color: '#1976d2', fontWeight: 'bold' }}>{rowData.state.toUpperCase()}</spam>
                    </div>
                )
            //Color Verde #388e3c
            case 'APROBADO':
                return (
                    <spam style={{ color: '#388e3c', fontWeight: 'bold' }}>{rowData.state.toUpperCase()}</spam>
                );
            //Color Rojo #d9534f    
            case 'NO APROBADO':
                return (
                    <spam style={{ color: '#d9534f', fontWeight: 'bold' }}>{rowData.state.toUpperCase()}</spam>
                );
            //Color Naranja #f0ad4e    
            case 'PENDIENTE':
                return (
                    <spam style={{ color: '#f0ad4e', fontWeight: 'bold' }}>{rowData.state.toUpperCase()}</spam>
                );
            //Color Azul #1565c0    
            case 'POR RESPONDER':
                return (
                    <spam style={{ color: '#1565c0', fontWeight: 'bold' }}>{rowData.state.toUpperCase()}</spam>
                );
            //Color Azul #ff7043    
            case 'POR APROBAR':
                return (
                    <spam style={{ color: '#ff7043', fontWeight: 'bold' }}>{rowData.state.toUpperCase()}</spam>
                );
            //Color Verde #388e3c   
            case 'LISTO DDP04':
                return (
                    <spam style={{ color: '#388e3c', fontWeight: 'bold' }}>{rowData.state.toUpperCase()}</spam>
                );
            default:
                return (
                    <spam >{rowData.state.toUpperCase()}</spam>
                );
        }
    }
    /* Metodo para visualizar el tiempo de vigencia para respoder */
    validityTemplate(rowData, column) {
        debugger
        let hoy = new Date();
        console.log(formattedDate(hoy));
        //rowData.timeRespond = 2;
        if (rowData.timeRespond !== null) {
            var now = new Date();

            var limitDate = new Date(rowData.APDate);
            var i = 0;
            while (i < rowData.timeRespond) {
                limitDate.setTime(limitDate.getTime() + 24 * 60 * 60 * 1000);
                if (limitDate.getDay() !== 6 && limitDate.getDay() != 0)
                    i++;
            }
            var diasdif = limitDate.getTime() - new Date().getTime();
            var contdias = Math.round(diasdif / (1000 * 60 * 60 * 24));

            var j = 0;
            var diasC = 0;
            while (j < contdias) {
                now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
                if (now.getDay() !== 6 && now.getDay() !== 0)
                    diasC++;
                j++;
            }

            console.log("Le quedan " + diasC + ' Dia(s)')
            switch (rowData.state) {
                case 'Pendiente':
                    if (diasC === 0) {
                        //Naranja f0ad4e
                        return (<spam style={{ color: '#f0ad4e', fontWeight: 'bold' }}>HOY DÍA</spam>);
                    } else if (diasC < 0) {
                        //Rojo d9534f
                        return (<spam style={{ color: '#d9534f', fontWeight: 'bold' }}>{diasC} DÍA (s)</spam>);
                    } else {
                        //Verde 388e3c
                        return (<spam style={{ color: '#388e3c', fontWeight: 'bold' }}>{diasC} DÍA (s)</spam>);
                    }
                case 'Por Aprobar':
                    if (diasC === 0) {
                        //Naranja f0ad4e
                        return (<spam style={{ color: '#f0ad4e', fontWeight: 'bold' }}>HOY DÍA</spam>);
                    } else if (diasC < 0) {
                        //Rojo d9534f
                        return (<spam style={{ color: '#d9534f', fontWeight: 'bold' }}>{diasC} DÍA (s)</spam>);
                    } else {
                        //Verde 388e3c
                        return (<spam style={{ color: '#388e3c', fontWeight: 'bold' }}>{diasC} DÍA (s)</spam>);
                    }
                case 'Por Responder':
                    if (diasC === 0) {
                        //Naranja f0ad4e
                        return (<spam style={{ color: '#f0ad4e', fontWeight: 'bold' }}>HOY DÍA</spam>);
                    } else if (diasC < 0) {
                        //Rojo d9534f
                        return (<spam style={{ color: '#d9534f', fontWeight: 'bold' }}>{diasC} DÍA (s)</spam>);
                    } else {
                        //Verde 388e3c
                        return (<spam style={{ color: '#388e3c', fontWeight: 'bold' }}>{diasC} DÍA (s)</spam>);
                    }
                default: break;
            }
            /* switch (that.state.userLogin.idUser) {
                case 'svillacis':
                    
                case 'svillacis':


                default: return null;
            } */
        }
    }

    /* Método para Customizar la columan Prioridad de la tabla */
    priorityTemplate(rowData, column) {
        switch (rowData.priorityLevel) {
            case 'ALTO':
                return (
                    <div style={{ background: '' }}>
                        <spam style={{ color: '#d9534f', fontWeight: 'bold' }}>{rowData.priorityLevel.toUpperCase()}</spam>
                    </div>
                )
            case 'MEDIO':
                return (
                    <div style={{ background: '' }}>
                        <spam style={{ color: '#f0ad4e', fontWeight: 'bold' }}>{rowData.priorityLevel.toUpperCase()}</spam>
                    </div>
                )
            case 'BAJO':
                return (
                    <div style={{ background: '' }}>
                        <spam style={{ color: '#388e3c', fontWeight: 'bold' }}>{rowData.priorityLevel.toUpperCase()}</spam>
                    </div>
                )
            default:
                return (
                    <spam >{rowData.priorityLevel}</spam>
                );
        }
    }

    /* Método para Customizar la columan Files Show de la tabla */
    FilesTemplate(rowData, column) {
        debugger
        if (this.state.userLogin.employee.area.nameArea === 'COMPRAS') {
            if (rowData.state === 'En Proceso') {
                var proc = null;
                this.state.trayOriginal.map(function (o) {
                    if (rowData.testRequest.idRequestTest === o.process.testRequest.idRequestTest) {
                        proc = o.process;
                    }
                })
                if (proc.listActionsProcess[1].listFileDocument.length !== 0) {
                    var nameButton = proc.listActionsProcess[1].listFileDocument.length + ' Archivo(s) ';
                    return (
                        <div>
                            <Button className='p-button-secondary' icon='fa fa-file-pdf-o' label={nameButton} tooltip="Descargar" onClick={() => this.downloadFiles(proc.listActionsProcess[1].listFileDocument)} />
                        </div>
                    );

                }

            } else {

                if (rowData.files.length !== 0) {
                    var nameButton = rowData.files.length + ' Archivo(s) ';
                    return (
                        <div>
                            <Button className='p-button-secondary' icon='fa fa-file-pdf-o' label={nameButton} tooltip="Descargar" onClick={() => this.downloadFiles(rowData.files)} />
                        </div>
                    );
                }
            }
        } else {
            if (rowData.files.length !== 0) {
                var nameButton = rowData.files.length + ' Archivo(s) ';
                return (
                    <div>
                        <Button className='p-button-secondary' icon='fa fa-file-pdf-o' label={nameButton} tooltip="Descargar" onClick={() => this.downloadFiles(rowData.files)} />
                    </div>
                );
            }
        }
    }

    /* Método para customizar la columna Date Notificacion de la tabla */
    dateTimeTemplate(rowData, column) {
        debugger;
        var dateNotification = new Date(rowData.timeNoti);
        var dateNow = new Date();
        let dayInMillis = 24 * 3600000;

        let days1 = Math.floor(dateNotification.getTime() / dayInMillis);
        let days2 = Math.floor(dateNow.getTime() / dayInMillis);

        if (days1 == days2) {
            return (
                <spam style={{ color: '' }}>Hoy {getHourFromDate(dateNotification)}</spam>
            );
        } else {
            return (<spam>{getDateWithNameMonth(dateNotification)}</spam>);
        }

    }

    /* Método para descargar archivos del servidor */
    downloadFiles(listFiles) {
        debugger
        DownloadFileFromServer(listFiles, function (data, status, msg) {
            data.map(function (o) {
                var link = document.createElement("a");
                link.download = o.name;
                link.href = o.base64File;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
        })
    }

    /* Método para visualizar la imagen */
    showImageProcessTestRequest(imageFile) {

        DownloadFileFromServer(imageFile, function (data, status, msg) {
            debugger
            var base64 = data[0].base64File;
            that.setState({ srcImageVM: base64, viewModalImg: true });
        })
    }

    /* Método para validar la entrega de muestras y realizar la prueba de ensayo */
    validationTestRequest() {
        debugger
        var processTmp = this.state.processToUpdate;
        var trayToUpdate = null;
        this.state.trayOriginal.map(function (t) {
            if (processTmp.idProcess === t.process.idProcess)
                trayToUpdate = t;
        })
        trayToUpdate.userReplay = this.state.userLogin.idUser;
        trayToUpdate.stateReply = 'Validar Entrega Material';
        ValidateDeliverMaterial(trayToUpdate, function (data, status, msg) {
            switch (status) {
                case 'OK':
                    debugger
                    var pF = that.findProcessUpdeted(data);
                    that.dataTratamientTray(pF);
                    that.showMessage(msg, 'success');
                    break;
                case 'ERROR':
                    that.showMessage(msg, 'error');
                    break;
                default:
                    that.showMessage(msg, 'info');
                    break;
            }
        });
    }

    /* Método para notificar la disponibiliadad de MP para DDP04 */
    availableSMPForDDP04() {
        debugger
        var processTmp = this.state.processToUpdate;
        var trayToUpdate = null;
        this.state.trayOriginal.map(function (t) {
            if (processTmp.idProcess === t.process.idProcess)
                trayToUpdate = t;
        })
        trayToUpdate.userReplay = this.state.userLogin.idUser;
        show_msgPW();
        TxAvailableMP(trayToUpdate, function (data, status, msg) {
            hide_msgPW();
            switch (status) {
                case 'OK':
                    debugger
                    var pF = that.findProcessUpdeted(data);
                    that.dataTratamientTray(pF);
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

    /* Método para generar el reporte DDP04 */
    generateReportDDP04(dataParam) {
        debugger
        if (dataParam !== null) {
            GenerateReportDDP04(dataParam, function (data, status, msg) {
                switch (status) {
                    case 'OK':
                        debugger
                        that.showMessage(msg, 'success');
                        var link = document.createElement("a");
                        link.download = data.name;
                        link.href = data.base64File;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
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

    /* Método para lanzar el formulario de Solicitud de Pruebas en Proceso */
    startProcessTestRForm(process) {
        debugger
        var pp = null;
        this.state.trayOriginal.map(function (t) {
            if (t.process.idProcess === process.idProcess)
                pp = t.process;
        })

        show_formRPP(pp);
    }

    /* Método valida el boton a mostrar al proceso en seguimiento */
    viewButtonValidate(stateView, typeButton, typeRequest) {
        debugger
        var user = this.state.userLogin.idUser;
        var area = this.state.userLogin.employee.area;
        if ((area.nameArea).toUpperCase() === 'COMPRAS' || (area.nameArea).toUpperCase() === 'PRODUCCIÓN' || (area.nameArea).toUpperCase() === 'COMERCIAL') {
            switch (typeButton) {
                case 'VSMP':
                    if (stateView === 'Pendiente') {
                        return '';
                    }
                    else {
                        return 'none';
                    }
                case 'Respond':
                    if (user === 'jnorona') {
                        if ((stateView === 'Pendiente')) {
                            that.state.viewStateDDP05 = '';
                            return '';
                        }
                        else {
                            return 'none';
                        }
                    } else {
                        return 'none';
                    }

                default:
                    return 'none';
            }
        } else {
            switch (user) {
                case 'svillacis':
                    if (typeButton === 'Respond') {
                        if (typeRequest === 'ProcessInTest') {
                            if (stateView === 'Pendiente') {
                                that.state.approvView = '';
                                return '';
                            } else if (stateView === 'Por Aprobar y Comunicar') {
                                that.state.aproveAndShare = true;
                                that.state.approvView = '';
                                that.state.approvViewType = '';
                                return '';
                            }
                        } else {
                            if (stateView === 'Por Aprobar') {
                                that.state.approvView = '';
                                that.state.approvViewType = '';
                                return '';
                            } else {
                                return 'none';
                            }
                        }
                    } else if (typeButton === 'Notificar') {
                        if (stateView === 'Aprobado y Comunicado')
                            return '';
                        else
                            return 'none';

                    } else {
                        return 'none';
                    }
                default:
                    switch (typeButton) {
                        case 'Validate':
                            if (stateView == 'Pendiente')
                                return '';
                            else
                                return 'none';
                        case 'Respond':
                            if ((stateView == 'Por Responder') || (stateView == 'No Aprobado'))
                                return '';
                            else
                                return 'none';
                        case 'SPP':
                            if (stateView == 'Listo DDP04')
                                return '';
                            else
                                return 'none';
                        case 'SMP':
                            if (stateView == 'Aprobado')
                                return '';
                            else
                                return 'none';
                        case 'AddFile':
                            if (stateView == 'Informe-DDP05-Enviado')
                                return ''
                            else
                                return 'none';
                        case 'VSMP':
                            if (stateView == 'MP Solicitada')
                                return '';
                            else
                                return 'none';
                        default:
                            return 'none';

                    }

            }
        }
    }

    /* Método ContentDialog para ilustrar la información del SubProceso
        Solicitud de ensayos MP
    */
    fillContentInformation(subProcess) {
        if (subProcess !== null) {
            this.setState({ contentDialog: this.templateContentInformation(subProcess), viewModalSubProcess: true });
        }
    }

    templateContentInformation(data) {
        var informe = data.listActionsProcess[data.listActionsProcess.length - 1].listFileDocument;
        return (
            <div className="p-grid" style={{ background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)' }}>
                <div className="p-col-12 p-lg-12">
                    <spam style={{ fontWeight: 'bold' }}>SOLICITUD DE ENSAYO</spam>
                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="p-col-12 p-lg-3">Fecha: </div>
                    <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.deliverDate}</div>

                    <div className="p-col-12 p-lg-3">Proveedor: </div>
                    <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.providerName}</div>

                    <div className="p-col-12 p-lg-3">Objetivo: </div>
                    <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.objective}</div>

                    <div className="p-col-12 p-lg-3">Linea de Aplicación: </div>
                    <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.aplicationLine}</div>

                </div>
                <div className="p-col-12 p-lg-6">
                    <div className="p-col-12 p-lg-3">Material: </div>
                    <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.materialDetail}</div>

                    <div className="p-col-12 p-lg-3">Cantidad: </div>
                    <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.quantity}<spam style={{ marginLeft: '3px' }}>{data.unit}</spam></div>

                    <div className="p-col-12 p-lg-3">Uso: </div>
                    <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.use}</div>

                    <div className="p-col-12 p-lg-3">Informe Final: </div>
                    <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>
                        <Button className='warning-btn' icon='fa fa-file-pdf-o' label='Descargar' onClick={() => this.downloadFiles(informe)} />
                    </div>
                </div>
            </div>
        )
    }

    /* Método rowExpansionTemplate view para usuarios en las pruebas en proceso */
    rowExpansionTemplate(data) {
        debugger
        if (data.testRequest !== null) {
            return (
                <div className="p-grid p-grid-responsive p-fluid" style={{ padding: '1em 1em 1em 1em', background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)' }}>
                    <div className="p-col-12 p-lg-12">
                        <spam style={{ fontWeight: 'bold' }}>DETALLE SOLICITUD DE ENSAYO</spam>
                    </div>
                    <div className="p-col-12 p-lg-6">
                        <div className='p-grid'>
                            <div className="p-col-12 p-lg-3">Fecha: </div>
                            <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.deliverDate}</div>

                            <div className="p-col-12 p-lg-3">Proveedor: </div>
                            <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.providerName}</div>

                            <div className="p-col-12 p-lg-3">Objetivo: </div>
                            <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.objective}</div>

                            <div className="p-col-12 p-lg-3">Linea de Aplicación: </div>
                            <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.aplicationLine}</div>

                        </div>

                    </div>
                    <div className="p-col-12 p-lg-6">
                        <div className='p-grid'>
                            <div className="p-col-12 p-lg-3">Material: </div>
                            <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.materialDetail}</div>

                            <div className="p-col-12 p-lg-3">Cantidad: </div>
                            <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.quantity}<spam style={{ marginLeft: '3px' }}>{data.testRequest.unit}</spam></div>

                            <div className="p-col-12 p-lg-3">Uso: </div>
                            <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.testRequest.use}</div>
                        </div>

                    </div>
                    <div className="p-col-12 p-lg-12" style={{ alignContent: 'right' }}>
                        <div className="p-col-12 p-lg-2" style={{ display: this.viewButtonValidate(data.state, "Validate") }}>
                            <Button label='Validar' icon='pi pi-check' className='p-button-success' onClick={() => this.setState({ viewModalValidateDeliverMaterial: true, processToUpdate: data })} />
                        </div>
                        <div className="p-col-12 p-lg-2" style={{ display: this.viewButtonValidate(data.state, "Respond") }}>
                            <Button label='Responder' icon='fa fa-share-square-o' className='p-button-success' onClick={() => this.setState({ displayRespond: '', displayTable: 'none', processToUpdate: data })} />
                        </div>
                        <div className="p-col-12 p-lg-2" style={{ display: this.viewButtonValidate(data.state, "SPP") }}>
                            <Button label='Solicitud Pruebas en Proceso' icon='fa fa-hand-o-right' className='success-btn' onClick={() => this.startProcessTestRForm(data)} />
                        </div>
                        <div className="p-col-12 p-lg-2" style={{ display: this.viewButtonValidate(data.state, "SMP") }}>
                            <Button label='Solicitar MP' icon='fa fa-plus-circle' className='success-btn' onClick={() => this.requestOrderMP(data)} />
                        </div>
                        <div className="p-col-12 p-lg-2" style={{ display: this.viewButtonValidate(data.state, "VSMP") }}>
                            <Button label='Ver Solicitud' icon='fa fa-expand' className='success-btn' onClick={() => this.setState({ viewModalSMP: true, processToUpdate: data })} />
                        </div>

                    </div>
                </div>
            );
        } else if (data.processTestRequest !== null) {
            debugger
            var extension = data.processTestRequest.urlImg.slice((data.processTestRequest.urlImg.lastIndexOf(".") - 1 >>> 0) + 2);
            var files = [{ url: data.processTestRequest.urlImg, extension: extension }];
            var typeRespond = false;
            if (data.state === 'Por Aprobar y Comunicar')
                typeRespond = true;

            return (
                <div className="p-grid " style={{ padding: '1em 1em 1em 1em', background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)' }}>
                    <div className="p-col-12 p-lg-12">
                        <div className="p-col-12 p-lg-6">
                            <spam style={{ fontWeight: 'bold', marginRight: '10px', }}>DETALLE SOLICITUD DE PRUEBAS EN PROCESO DDP-04</spam>
                            <Button className='info-btn' style={{ display: this.viewButtonValidate('edit', 'editDDP04', 'DDP04') }} ><i className="fa fa-pencil" /></Button>
                            <Button className='success-btn' onClick={() => this.generateReportDDP04(data.processTestRequest)}><i className="fa fa-file-pdf-o" /></Button>
                            <Button style={{ display: data.subProcess == null ? 'none' : '' }} className='secondary-btn' label='Sub-Proceso' icon='fa fa-search' onClick={() => this.fillContentInformation(data.subProcess)} />
                        </div>

                    </div>
                    <div className="p-col-12 p-lg-6">
                        <div className="p-col-12 p-lg-3">Fecha: </div>
                        <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.processTestRequest.deliverDate}</div>

                        <div className="p-col-12 p-lg-3">Objetivo: </div>
                        <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.processTestRequest.objective}</div>

                        <div className="p-col-12 p-lg-3">Descripción del Material: </div>
                        <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.processTestRequest.materialLine}</div>

                        <div className="p-col-12 p-lg-3">Producto que se desea obtener: </div>
                        <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.processTestRequest.productGetting}</div>

                    </div>
                    <div className="p-col-12 p-lg-6">
                        <div className="p-col-12 p-lg-3">Variables a considerar: </div>
                        <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.processTestRequest.processVariables}</div>

                        <div className="p-col-12 p-lg-3">Verificaciones Adicionales: </div>
                        <div className="p-col-12 p-lg-9" style={{ fontWeight: 'bold' }}>{data.processTestRequest.additionVerification}</div>

                        <div className="p-col-12 p-lg-3">Detalle Gráfico: </div>
                        <div className="p-col-12 p-lg-9" ><Button icon='fa fa-picture-o' label='Ver' className='warning-btn' onClick={() => this.showImageProcessTestRequest(files)} /></div>
                    </div>
                    <div className="p-col-12 p-lg-12" style={{ alignContent: 'right' }}>

                        <div className="p-col-12 p-lg-2" style={{ display: this.viewButtonValidate(data.state, "Respond", "ProcessInTest") }}>
                            <Button label='Responder' icon='fa fa-share-square-o' className='p-button-success' onClick={() => this.setState({ displayRespond: '', displayTable: 'none', processToUpdate: data, aproveAndShare: typeRespond })} />
                        </div>
                        <div className="p-col-12 p-lg-2" style={{ display: this.viewButtonValidate(data.state, "SPP") }}>
                            <Button label='Solicitud Pruebas en Proceso' icon='fa fa-hand-o-right' className='success-btn' onClick={() => this.startProcessTestRForm(data)} />
                        </div>
                        <div className="p-col-12 p-lg-2" style={{ display: this.viewButtonValidate(data.state, "AddFile", "ProcessInTest") }}>
                            <Button label='Subir Informe' icon='fa fa-upload' className='p-button-success' onClick={() => this.setState({ displayRespond: '', displayTable: 'none', processToUpdate: data, addFileState: true })} />
                        </div>
                    </div>

                </div>

            );
        } else {
            var files = this.determinateFilesProcessInTest(data);
            var filesRequestTest = this.determinateFilesForRequestTest(data);
            return (
                <div className="p-grid " style={{ padding: '1em 1em 1em 1em', background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)' }}>
                    <div className="p-col-12 p-lg-12">
                        <spam style={{ fontWeight: 'bold', marginRight: '10px', color: '#337ab7' }}>DETALLE DEL PROCESO</spam>
                        <Button className='success-btn' onClick={() => this.sendEmail(data)} style={{ display: this.viewButtonValidate(data.state, "Notificar") }} >
                            <i className="fa fa-envelope" />
                        </Button>
                    </div>
                    <div className="p-col-12 p-lg-12" style={{ padding: '0px' }}>
                        <div className='p-g form-group ' style={{ justifyContent: 'center' }}>
                            <div className="p-col-12 p-lg-3">
                                <spam style={{ fontWeight: 'bold', marginRight: '10px', }}>PRUEBA EN PROCESO</spam>
                                <Button label='Documentos' icon='fa fa-download' className='info-btn' onClick={() => this.getAllFilesDDP04(files, data.subProcess.processTestRequest)} />

                            </div>
                            <div className="p-col-12 p-lg-4" style={{ display: filesRequestTest.length == 0 ? 'none' : '' }}>
                                <spam style={{ fontWeight: 'bold', marginRight: '10px', }}>SOLICITUD DE ENSAYO</spam>
                                <Button style={{ display: data.subProcess.subProcess == null ? 'none' : '' }} className='warning-btn' onClick={() => this.fillContentInformation(data.subProcess.subProcess)}>
                                    <i className="fa fa-expand" />
                                </Button>
                                <Button label='Documentos' icon='fa fa-download' className='info-btn' onClick={() => this.downloadFiles(filesRequestTest)} />
                            </div>

                        </div>

                    </div>
                </div>
            );
        }

    }

    /* Metodo para descargar todos los documentos de la Prueba en proceso */
    getAllFilesDDP04(files, processTestRequest) {
        try {
            this.generateReportDDP04(processTestRequest);
            this.downloadFiles(files);
        } catch (e) {
            console.log(e);
        }
    }

    /* Enviar a Email para comunicar */
    sendEmail(data) {
        debugger
        try {
            if (data.process !== null) {
                var file = '';
                file = data.files[0].url;
                setParamsSendEmail(file);
            }
        } catch (e) {
            console.log(e);
        }
    }

    /* Determina los informes para la descarga en la interfaz del detalle del proceso Pruebas en Proceso*/
    determinateFilesProcessInTest(data) {
        try {
            var files = [];
            if (data.subProcess !== null) {
                data.subProcess.listActionsProcess.map(function (x) {
                    if (x.state === 'Por Aprobar y Comunicar') {
                        files = x.listFileDocument;
                    }
                })
            }
            return files;

        } catch (e) {
            console.log(e);
        }
    }

    /* Determina los informes para la descarga en la interfaz del detalle del proceso Solicitud de ensayo */
    determinateFilesForRequestTest(data) {
        try {
            var files = [];
            if (data.subProcess.subProcess !== null) {
                data.subProcess.subProcess.listActionsProcess.map(function (x) {
                    if (x.state === 'Aprobado') {
                        files = x.listFileDocument;
                    }
                })
            }
            return files;
        } catch (e) {
            console.log(e);
        }
    }

    /* Subir Archivo Informe/ DDP05  */
    onBasicUploadAutoResponse(event) {
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
                that.setState({ fileB64: pTmp, fileNameInform: file.name, fileExtension: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            that.showMessage('Error, tamaño de la imagen excedido !', 'error');
            that.setState({ fileB64: null, fileNameInform: null, fileExtension: null });
        }
    }

    /* Subir Archivo Informe Adicional si lo hubiere  */
    onBasicUploadAutoResponseAditionalInform(event) {
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
                that.setState({ fileB64Aditional: pTmp, fileNameAditional: file.name, fileExtensionAditional: ext[1] });
            }
            reader.readAsDataURL(file);
        } else {
            that.showMessage('Error, tamaño de la imagen excedido !', 'error');
            that.setState({ fileB64Aditional: null, fileNameAditional: null, fileExtensionAditional: null });
        }
    }

    /* Método para Replicar / Responder el paso anterior del proceso WorkFlow */
    sendRespond() {
        debugger;
        var processTmp = this.state.processToUpdate;
        var objToUpdate = null;
        this.state.trayOriginal.map(function (n) {
            if (processTmp.idProcess === n.process.idProcess)
                objToUpdate = n;
        })

        var actionProcess = { comment: null, listFileDocument: [], userImptek: null }
        actionProcess.comment = this.state.commentResponse;
        actionProcess.userImptek = this.state.userLogin.idUser;
        var filesN = { name: null, extension: null, base64File: null, type: null };
        filesN.name = this.state.fileNameInform;
        filesN.extension = this.state.fileExtension;
        filesN.base64File = this.state.fileB64;
        if (this.state.fileB64 !== null) {
            if (this.state.viewStateDDP05 === '')
                filesN.type = "DDP-05"
            actionProcess.listFileDocument.push(filesN);
        }

        if (this.state.fileB64Aditional !== null) {
            var filesNA = { name: null, extension: null, base64File: null, type: null };
            filesNA.name = this.state.fileNameAditional;
            filesNA.extension = this.state.fileExtensionAditional;
            filesNA.base64File = this.state.fileB64Aditional;
            filesNA.type = "Informe Adicional";
            actionProcess.listFileDocument.push(filesNA);
        }


        // Replay Approve
        switch (this.state.approve) {
            case 'Aprobado':
                if (processTmp.processTestRequest !== null) {
                    if (this.state.aproveAndShare) {
                        objToUpdate.stateReply = "APROBADO Y COMUNICADO";
                        objToUpdate.process.state = this.state.approveType;
                    } else {
                        objToUpdate.stateReply = "APROBADO INICIAR DDP-04";
                    }

                } else {
                    objToUpdate.stateReply = "APROBADO";
                    objToUpdate.process.state = this.state.approveType;
                }
                break;
            case 'No Aprobado':
                objToUpdate.stateReply = "NO APROBADO";
                break;
            case null:
                if (processTmp.processTestRequest !== null) {
                    switch (this.state.userLogin.employee.area.nameArea) {
                        case 'PRODUCCIÓN':
                            objToUpdate.stateReply = "INFORME-DDP05-ENVIADO";
                            break;
                        case 'CALIDAD':
                            if (this.state.addFileState) {
                                objToUpdate.stateReply = "POR APROBAR Y COMUNICAR";
                            } else {
                                objToUpdate.stateReply = "POR APROBAR DDP04";
                            }
                            break;
                        default: break;
                    }

                }
                else {
                    objToUpdate.stateReply = "POR APROBAR";
                }

                break;
            default: break;
        }

        objToUpdate.actionProcessReply = actionProcess;
        objToUpdate.userReplay = this.state.userLogin.idUser;
        objToUpdate.userFullNameReplay = this.state.userLogin.employee.completeName;

        if (this.validateFormRespond()) {
            show_msgPW();
            RespondProcessFlow(objToUpdate, function (data, status, msg) {
                hide_msgPW();
                console.log(data);
                switch (status) {
                    case 'OK':
                        debugger;
                        var pF = that.findProcessUpdeted(data);
                        that.dataTratamientTray(pF);
                        that.setState({ displayRespond: 'none', displayTable: '', commentResponse: null, fileB64: null, fileExtension: null, fileNameInform: null, approve: null, approbateType: null, approveState: null });
                        that.showMessage(msg, 'success');
                        hide_msgPW();
                        break;
                    case 'ERROR':

                        that.showMessage(msg, 'error');
                        break;
                    default:
                        hide_msgPW();
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        } else {
            this.showMessage('Ingresar todos los campos necesarios', 'error');
        }
    }

    //Metodo para validar formulario respond
    validateFormRespond() {
        debugger
        if (this.state.userLogin.idUser === 'svillacis') {
            if (this.state.approve == null) {
                return false;
            } else if (this.state.approve === 'Aprobado') {
                if (this.state.processToUpdate.processTestRequest !== null) {
                    return true;
                } else {
                    if (this.state.approveType == null) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }


            } else if (this.state.approve === 'No Aprobado') {
                return true;
            }
        } else {
            if (this.state.fileB64 == null)
                return false;
            else
                return true;
        }
    }

    /* Método para solicitar MP adicional para Pruebas en Proceso */
    requestOrderMP(data) {
        if (data !== null) {
            var process = null;
            this.state.trayOriginal.map(function (x) {
                if (data.idProcess === x.process.idProcess)
                    process = x;
            })
            show_formOrderMP(process);
        }
    }

    /* Método para Refrescar información en la tabla */
    refreshDataWorkflow() {
        var user = {};
        user.user = this.state.userLogin.idUser;
        GetNotifications(user, function (data, status, msg) {
            debugger;
            console.log(data);
            switch (status) {
                case 'OK':
                    that.dataTratamientTray(data);
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

    componentWillMount() {
        debugger
        var user = {};
        var sesion = this.props.currentUser
        user.user = sesion.idUser;
        this.state.userLogin = sesion;
        if (sesion.idUser === 'vpillajo' || sesion.idUser === 'svillacis') {
            this.state.viewNewRequestButton = '';
        } else {
            var date = new Date();
            date = formattedDate(date);
            var day = date.split('-');
            //if (parseInt(day[2]) <= 15) Solo se habilita el boton los 15 primeros dias de cada mes.
            if (parseInt(day[2]) >= 0)
                this.state.viewNewRequestButton = '';
            else
                this.state.viewNewRequestButton = 'none';
        }


        GetNotifications(user, function (data, status, msg) {
            debugger;
            console.log(data);
            switch (status) {
                case 'OK':
                    that.dataTratamientTray(data);
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

    componentDidMount() {
        var sesion = this.props.currentUser
        this.setState({ userLogin: sesion });
    }

    render() {
        const footer = (
            <div>
                <Button label="Yes" icon="pi pi-check" onClick={this.onHide} />
                <Button label="No" icon="pi pi-times" onClick={this.onHide} className="p-button-secondary" />
            </div>
        );

        var header = <div className="p-clearfix" style={{ 'lineHeight': '1.87em', background: '#337ab7', color: '#ffffff', textAlign: 'center' }}>Notificaciones</div>;
        let headerGroup = <ColumnGroup>
            <Row>
                <Column header="NOTIFICACIONES" colSpan={7} style={{ background: '#337ab7', color: '#ffffff', textAlign: 'left' }} />

            </Row>
        </ColumnGroup>;
        const footerValidateDeliverMaterial = (
            <div>
                <Button label="Si" icon="pi pi-check" className="p-button-primary" onClick={this.validationTestRequest} />
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ viewModalValidateDeliverMaterial: false })} className="p-button-danger" />
            </div>
        );
        const footerViewModalSMP = (
            <div>
                <Button label="Si" icon="pi pi-check" className="p-button-primary" onClick={this.availableSMPForDDP04} />
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ viewModalSMP: false, processToUpdate: null })} className="p-button-danger" />
            </div>
        );
        return (
            <div className="p-grid">

                <div className="p-col-12 p-lg-12 " style={{ justifyContent: 'center', alignContent: 'center', paddingBottom: '0px' }}>
                    <div className="card shadow-box p-shadow-3" style={{ backgroundColor: '#d4e157', justifyContent: 'center' }}>
                        <spam style={{ paddingTop: '2px', fontWeight: 'bold', color: '#337ab7', fontSize: '18px' }}>SOLICITUD DE ENSAYOS</spam>
                    </div>
                </div>

                <div className="p-col-12 p-lg-12" >
                    <div className="card ">

                        <Toolbar>
                            <div className="p-toolbar-group-right">
                                <Button className="secondary-btn" icon='pi pi-refresh' onClick={this.refreshDataWorkflow}></Button>
                                <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
                                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
                            </div>
                            <div className="p-toolbar-group-left">
                                <Button icon="pi pi-plus" label="Solicitud de Ensayos" style={{ display: this.state.viewNewRequestButton }} onClick={this.addComplaint} onClick={() => show_form()} />
                                <Button icon="pi pi-plus" label="Solicitud DDP04" style={{ display: this.state.userLogin.employee.area.nameArea === 'CALIDAD' ? '' : 'none' }} onClick={() => show_formRPP()} />
                            </div>
                        </Toolbar>
                        <Toolbar style={{ background: '#337ab7', color: '#ffffff' }}>
                            <div className="p-toolbar-group-left">
                                <i className="fa fa-bell" style={{ margin: '4px 4px 0 0' }}></i>
                                <spam>NOTIFICACIONES</spam>
                            </div>
                        </Toolbar>

                        {/*  <DataTable value={this.state.tray} globalFilter={this.state.globalFilter} style={{ display: this.state.displayTable }}
                                expandedRows={this.state.expandedRows} onRowToggle={(e) => this.setState({ expandedRows: e.data })}
                                rowExpansionTemplate={this.rowExpansionTemplate} dataKey="timeNoti"
                        onRowSelect={this.onComplaintSelect} scrollable frozenWidth="200px" scrollHeight="550px">
                                <Column expander={true} style={{ width: '2%' }} />
                                <Column field="timeNoti" header='Fecha' style={{ width: '7%' }} sortable={true} body={this.dateTimeTemplate} />
                                <Column field="userLast" header='Remitente' style={{ width: '10%', textAlign: 'center' }} />
                                <Column field="comment" header='Comentarios' style={{ width: '43%' }} />
                                <Column field={this.state.tray.testRequest == null ? "" : "testRequest.deliverType"} header='Tipo Entrega' body={this.deliverTypeTemplate} style={{ width: '10%', justifyContent: 'center', textAlign: 'center' }} />
                                <Column field="state" style={{ width: '10%', textAlign: 'center' }} header='Estado' body={this.stateProcessTemplate} sortable={true} />
                                <Column field="timeRespond" style={{ width: '8%', textAlign: 'center' }} header='Vigencia' body={this.validityTemplate} />
                                <Column header='Archivos' style={{ width: '10%', textAlign: 'center' }} body={this.FilesTemplate} />
                            </DataTable> */}

                        <DataTable ref={(el) => this.dt = el} value={this.state.tray} paginator={true} rows={10} style={{ display: this.state.displayTable }}
                            responsive={true} expandedRows={this.state.expandedRows} onRowToggle={(e) => this.setState({ expandedRows: e.data })}
                            rowExpansionTemplate={this.rowExpansionTemplate} dataKey="timeNoti">
                            <Column expander={true} style={{ width: '2%' }} />
                            <Column field="timeNoti" header="Fecha" sortable={true} filter={true} style={{ width: '8%' }} body={this.dateTimeTemplate} />
                            <Column field="userLast" header="Remitente" sortable={true} filter={true} style={{ width: '10%', textAlign: 'center' }} />
                            <Column field="comment" header="Comentarios" sortable={true} />
                            <Column field="state" style={{ width: '10%', textAlign: 'center' }} header='Estado' body={this.stateProcessTemplate} sortable={true} />
                            <Column field="timeRespond" style={{ width: '8%', textAlign: 'center' }} header='Vigencia' body={this.validityTemplate} />

                            <Column field="priorityLevel" style={{ width: '10%', textAlign: 'center' }} header='Prioridad' body={this.priorityTemplate} sortable={true} />

                            <Column header='Archivos' style={{ width: '10%', textAlign: 'center' }} body={this.FilesTemplate} />
                            {/* <Column  body={this.actionTemplate} style={{textAlign:'center', width: '8em'}}/> */}
                        </DataTable>


                    </div>


                </div>
                <div className="p-col-12 p-lg-12" style={{ marginTop: '5px', display: this.state.displayRespond }}>

                    <div className='card'>
                        <div className="p-grid p-fluid">
                            <div className='p-col-12 p-lg-12' style={{ background: '#e3f2fd' }}>
                                <label htmlFor="float-input" style={{ fontWeight: 'bolder' }}>ENVIAR RESPUESTA</label>
                            </div>

                            <div className='p-col-12 p-lg-3' style={{ display: this.state.approvView }}>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Aprobación</label>
                                <Dropdown options={approbateDesicion} value={this.state.approve} autoWidth={false} onChange={this.onApprobeChange} placeholder="Selecione" />
                            </div>
                            <div className='p-col-12 p-lg-3' style={{ display: this.state.approvViewType }}>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Tipo de Aprobación Solicitud</label>
                                <Dropdown options={approbateType} value={this.state.approveType} autoWidth={false} onChange={this.onApprobeTypeChange} placeholder="Selecione" disabled={this.state.approveState} />
                            </div>

                            <div className='p-col-12 p-lg-12'>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Comentarios</label>
                                <InputTextarea value={this.state.commentResponse} onChange={(e) => this.setState({ commentResponse: e.target.value })} rows={5} placeholder='Descripción' />
                            </div>

                            <div className='p-col-12 p-lg-3'>
                                <span style={{ color: '#CB3234', display: this.state.viewStateDDP05 }}>*</span><label style={{ display: this.state.viewStateDDP05 }} htmlFor="float-input">Archivo DDP-05</label>
                                <input type='file' onChange={this.onBasicUploadAutoResponse} />
                            </div>

                            <div className='p-col-12 p-lg-2' style={{ display: this.state.viewStateDDP05 }}>
                                <label htmlFor="float-input">Informe Adicional</label>
                                <input type='file' onChange={this.onBasicUploadAutoResponseAditionalInform} />
                            </div>

                            <div className='p-col-12 p-lg-12'>
                                <div className='p-grid'>
                                    <div className='p-col-12 p-lg-10'></div>
                                    <div className='p-col-12 p-lg-1'>
                                        <Button className='p-button-danger' label='Cancelar' icon='fa fa-chevron-circle-left' onClick={() => this.setState({ displayRespond: 'none', displayTable: '', addFileState: false, commentResponse: null, approveType: null, approve: null, aproveAndShare: false })} />
                                    </div>
                                    <div className='p-col-12 p-lg-1'>
                                        <Button className='p-button-success' label='Enviar' icon='fa fa-paper-plane-o' onClick={this.sendRespond} />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>


                </div>
                <Dialog visible={this.state.viewModalValidateDeliverMaterial} style={{ width: '30vw' }} footer={footerValidateDeliverMaterial} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ viewModalStateEdit: false })}>
                    <Card style={{ borderColor: '#2196f3', background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)' }}>
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className="p-col-12" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', textAlign: 'center' }}>VALIDA LA RECEPCIÓN DE MUESTRAS DE MATERIA PRIMA PARA LOS RESPECTIVOS ENSAYOS ?</span>
                            </div>
                            <div className="p-col-12" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', textAlign: 'center', marginRight: '5px' }}>A LA FECHA:</span>{getDatenow()}
                            </div>
                        </div>
                    </Card>
                </Dialog>
                <Dialog visible={this.state.viewModalSMP} style={{ width: '30vw' }} footer={footerViewModalSMP} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ viewModalSMP: false })}>
                    <Card style={{ borderColor: '#2196f3', background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)' }}>
                        <div>

                            <div className="p-col-12" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                <div className='p-grid'>
                                    <div className="p-col-5" style={{ padding: '4px 10px', fontWeight: 'bold' }}><label htmlFor="year">CANTIDAD SOLICITADA:</label></div>
                                    <div className="p-col-7" style={{ padding: '0px 10px' }}>
                                        <spam>{this.state.processToUpdate == null ? '' : this.state.processToUpdate.amount} {this.state.processToUpdate == null ? '' : this.state.processToUpdate.materialUnit}</spam>
                                    </div>

                                    <div className="p-col-5" style={{ padding: '4px 10px', fontWeight: 'bold' }}><label htmlFor="year">TIPO MATERIAL:</label></div>
                                    <div className="p-col-7" style={{ padding: '0px 10px' }}>
                                        <spam>{this.state.processToUpdate == null ? '' : this.state.processToUpdate.materialType}</spam>
                                    </div>
                                </div>

                            </div>
                            <div className="p-col-12" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', textAlign: 'center', color: '#d9534f' }}>CONFIRMAR LA DISPONIBILIDAD DE MATERIA PRIMA SOLICITADA PARA PRUEBA EN PROCESO ?</span>
                            </div>
                            <div className="p-col-12" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', textAlign: 'center', marginRight: '5px' }}>A LA FECHA:</span>{getDatenow()}
                            </div>
                        </div>
                    </Card>
                </Dialog>
                <Dialog visible={this.state.viewModalImg} style={{ width: '30vw', justifyContent: 'center', textAlign: 'center' }} onHide={() => this.setState({ viewModalImg: false })} closeOnEscape >
                    <img src={this.state.srcImageVM} alt="Galleria 1" style={{ width: '500px', borderRadius: '7px' }} />
                </Dialog>
                <Dialog visible={this.state.viewModalSubProcess} header="Detalle" style={{ width: '40vw' }} modal={true} onHide={() => this.setState({ viewModalSubProcess: false })} closeOnEscape>
                    {this.state.contentDialog}
                </Dialog>
                {/* <Button icon="fa-plus" label="Descargar" onClick={this.download} /> */}
                {/* <a href={require('X:/HCC/MP/HCC Aceite Plastificante 4500014808.pdf')} download>Click to download</a> */}
                <RTest style={{ height: '80%' }} />
                <RProcessTest />
                <OrderMP />
                <Growl ref={(el) => this.growl = el} />
                <PW />
                <Email />


            </div>
        )
    }
}



export function setData(tray) {
    var name = that.state.userLogin.employee.name.split(' ');
    var lastName = that.state.userLogin.employee.lastName.split(' ');
    tray.user = name[0] + " " + lastName[0];
    var to = that.state.trayOriginal;
    to.push(tray);
    that.dataTratamientTray(to)
}

export function refreshInformation() {
    that.refreshDataWorkflow();
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps)(WFlow)