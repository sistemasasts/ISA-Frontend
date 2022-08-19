import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Card } from 'primereact/card';

import SalidaMaterialService from '../../../service/SalidaMaterialService';

/* =============  DATA CATALOGOS ================ */
import { SaveExitMaterialHistory } from '../../../utils/TransactionsCalidad';

/* =============  DATA CATALOGOS ================ */
import { finaltSource, unidadesMedida } from '../../../global/catalogs';

/* ============= C O M P O N E N T S ============= */
import { ConcessionR, getDataConcessionRequest, setDataDefaultConcessionRequest } from './ConcessionRequest';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../../store/actions/modalWaitAction';
import { Calendar } from 'primereact/calendar';
import { CatalogoService } from '../../../service/CatalogoService';
import * as moment from 'moment';
import { Message } from 'primereact/message';

var that;
class ExitMaterial extends Component {
    constructor() {
        super();
        this.state = {
            destinoFinal: [],
            finalSouce: null,
            descriptionfinalSource: null,
            comments: null,
            quantity: 0,
            unit: null,
            listTask: [],
            displayDialog: false,
            task: null,
            selectedTask: null,
            selectedPnc: null,
            itemPNC: null,
            emhID:null,
            userLogin: null,
            fecha: new Date(),
            camposObligatorios: [],
            actualizar: false,
        };
        that = this;
        this.catalogoService = new CatalogoService();
        this.onDropdownChangeUnit = this.onDropdownChangeUnit.bind(this);
        this.onDropdownChangeFinaltSource = this.onDropdownChangeFinaltSource.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
        this.updatePropertyTask = this.updatePropertyTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.onTaskSelect = this.onTaskSelect.bind(this);
        this.cancelOutputMaterial = this.cancelOutputMaterial.bind(this);
        this.saveExitMaterial = this.saveExitMaterial.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
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
    /* FIN Metodos Mensajes Mostrar */

    /* Método para seleccionar la unidad Dropdown */
    onDropdownChangeUnit(event) {
        this.setState({ unit: event.value })
    }
    /* Método para seleccionar el destino del material Dropdown */
    onDropdownChangeFinaltSource(event) {
        this.setState({ finalSouce: event.value })
    }

    /*
    *  ============== INICIO FUNCION TABLE CRUD TAREAS Y CUMPLIMIENTO ==================  
    */
    saveTask() {
        let tasks = [...this.state.listTask];
        if (this.newTask)
            tasks.push(this.state.task);
        else
            tasks[this.findSelectedTaskIndex()] = this.state.task;

        this.setState({ listTask: tasks, selectedTask: null, task: null, displayDialog: false });
    }

    deleteTask() {
        let index = this.findSelectedTaskIndex();
        this.setState({
            listTask: this.state.listTask.filter((val, i) => i !== index),
            selectedTask: null,
            task: null,
            displayDialog: false
        });
    }

    findSelectedTaskIndex() {
        return this.state.listTask.indexOf(this.state.selectedTask);
    }

    updatePropertyTask(property, value) {
        let task = this.state.task;
        task[property] = value;
        this.setState({ task: task });
    }

    onTaskSelect(e) {
        this.newTask = false;
        this.setState({
            displayDialog: true,
            task: Object.assign({}, e.data)
        });
    }

    addNewTask() {
        this.newTask = true;
        this.setState({
            task: { descriptionTask: null, percentTask: null },
            displayDialog: true
        });
    }
    /* =============================== F I N ====================== */
    /* Cancela el registro de la salida del material */
    cancelOutputMaterial() {
        this.setState({ listTask: [] });
        var sm = this.props._this;
        sm.setState({ editForm: false })

    }

    /* Metodo que Guarda el registro de la salida de material */
    async saveExitMaterial() {
        try {
            debugger
            if (this.validarCamposRequeridos()) {
                var emh = { quantity: null, description: null, date: null, ncpID: null, type: null, listTasks: [], concessionRequest: null, asUser: null, }
                emh.quantity = this.state.quantity;
                emh.description = this.state.comments;
                emh.ncpID = this.props._this.state.idPNC;
                emh.idEMH= this.state.emhID;
                emh.type = this.state.finalSouce;
                emh.asUser = this.state.userLogin.idUser;
                emh.listTasks = this.state.listTask;
                emh.date = moment(this.state.fecha).format("YYYY-MM-DD");

                if (this.state.finalSouce === 'Solicitud de Concesión') {
                    var concession = getDataConcessionRequest();
                    concession.date = moment(this.state.fecha).format("YYYY-MM-DD");
                    concession.quantity = this.state.quantity;
                    emh.concessionRequest = concession;

                }
                this.props.openModal();
                if(this.state.actualizar){
                    const registroActualizado = await SalidaMaterialService.update(emh);
                    this.showMessage('Registro actualizado!', 'success');
                }else{
                    const registro = await SalidaMaterialService.create(emh);
                    this.showMessage('Salida de material registrada!', 'success');
                }
               
                
                this.props.closeModal();
                setTimeout(function () {
                    that.props._this.actualizar();
                    that.cancelOutputMaterial()
                }, 2000);
            }


        } catch (e) {
            
        }
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []

        if (this.state.fecha === null) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'fecha'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.comments === null || this.state.comments === '') {
            let obj = {}
            obj.campo = 'comentarios'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.verificarCantidada(this.state.quantity)) {
            let obj = {}
            obj.campo = 'cantidad'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.finalSouce === null || this.state.finalSouce === '') {
            let obj = {}
            obj.campo = 'destinoFinal'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }

        this.setState({ camposObligatorios: camposOblogatoriosDetectados })

        return camposOblogatoriosDetectados.length === 0 ? true : false;
    }

    verificarCantidada(valor) {
        debugger
        if (parseInt(valor) <= this.props._this.state.cantidadStock && parseInt(valor) !== 0)
            return false
        else return true;
    }

    determinarEsCampoRequerido(nombreCampo) {
        var resultado = false
        this.state.camposObligatorios.map(function (campo) {
            if (campo.campo === nombreCampo)
                resultado = true
        })

        return resultado;
    }

    componentDidMount() {
        var sesion = this.props.currentUser;
        var smSeleccionado = this.props._this.state.salidaMaterialSelected;
        if (smSeleccionado) {
            this.setState({
                fecha: smSeleccionado.date,
                quantity: smSeleccionado.quantity,
                finalSouce: smSeleccionado.type,
                comments: smSeleccionado.description,
                listTask: smSeleccionado.listTasks,
                actualizar: true,
                emhID: smSeleccionado.idEMH

            });
        }
        this.setState({ userLogin: sesion });
        this.catalogoService.getDestinoFinal().then(data => this.setState({ destinoFinal: data }));
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
        let headerGroup = <ColumnGroup>
            <Row>
                <Column header="Descripción" />
                <Column header="Cumplimiento %" style={{ backgroundColor: '#bbdefb', width: '20%' }} />
            </Row>
        </ColumnGroup>
        let footerEA = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} icon="pi pi-plus" onClick={this.addNewTask} />
        </div>;
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button className='p-button-danger' icon="pi pi-trash" label="Eliminar" onClick={this.deleteTask} />
            <Button label="Aceptar" icon="pi pi-save" onClick={this.saveTask} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                <Card>
                    <div className='p-grid form-group p-fluid' style={{ justifyContent: 'center' }}>
                        <div className='p-col-12 p-lg-8'>
                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#337ab7' }}>REGISTRO SALIDA DE MATERIAL</span>
                        </div>
                        <div className='p-col-12 p-lg-12' style={{ textAlign: 'center', padding: '0px' }}></div>
                        <div className='p-col-12 p-lg-2' style={{ justifyContent: 'left' }}>
                            <label htmlFor="float-input">Fecha</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.fecha} locale={es} showIcon="true" onChange={(e) => this.setState({ fecha: e.value })}></Calendar>
                            {this.determinarEsCampoRequerido('fecha') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-3'>
                            <label htmlFor="float-input">Cantidad</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon" style={{ background: '#337ab7', color: '#ffffff' }}>
                                    <i className="fa fa-balance-scale"></i>
                                </span>
                                <InputText placeholder='cantidad' disabled={this.state.actualizar} className={this.determinarEsCampoRequerido('cantidad') && 'p-error'} keyfilter="num" onChange={(e) => this.setState({ quantity: e.target.value })} value={this.state.quantity} />

                            </div>
                            {this.determinarEsCampoRequerido('cantidad') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Cantidad no valida o exece al stock" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-3' style={{ justifyContent: 'left' }}>
                            <label htmlFor="float-input">Destino Final</label>
                            <Dropdown options={this.state.destinoFinal} value={this.state.finalSouce} onChange={this.onDropdownChangeFinaltSource} autoWidth={false} placeholder="Selecione" disabled={this.state.actualizar} />
                            {this.determinarEsCampoRequerido('destinoFinal') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>

                        <div className='p-col-12 p-lg-8' style={{ display: this.state.finalSouce === 'Solicitud de Concesión' ? '' : 'none' }}>
                            <ConcessionR />
                        </div>

                        <div className='p-col-12 p-lg-8' style={{ display: (this.state.finalSouce === 'Desecho') || (this.state.finalSouce === 'Donación') || (this.state.finalSouce === 'Solicitud de Concesión') || (this.state.finalSouce == null) ? 'none' : '' }}>
                            <span style={{ fontWeight: 'bold' }}>VERIFICACIÓN DE CALIDAD</span>
                            <DataTable value={this.state.listTask} headerColumnGroup={headerGroup} responsive={true} footer={footerEA}
                                selectionMode="single" selection={this.state.selectedTask} onSelectionChange={(e) => { this.setState({ selectedTask: e.value }); }}
                                onRowSelect={this.onTaskSelect} scrollable={true} /* scrollHeight="250px"  */>
                                <Column field="descriptionTask" sortable={true} />
                                <Column field="percentTask" sortable={true} style={{ width: '20%', textAlign: 'center' }} />
                            </DataTable>
                            <Dialog visible={this.state.displayDialog} header="Crear/Editar" modal={true} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                                style={{ background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)' }}>
                                {this.state.task && <div className="p-grid ">
                                    <div className='p-grid'>
                                        <div className="p-col-2" style={{ padding: '10px' }}><label htmlFor="accion">Cumplimiento</label></div>
                                        <div className="p-col-10">
                                            <InputText keyfilter="money" value={this.state.task.percentTask} onChange={(e) => { this.updatePropertyTask('percentTask', e.target.value) }} />
                                        </div>
                                        <div className="p-col-2" style={{ padding: '10px' }}><label htmlFor="accion">Descripción</label></div>
                                        <div className="p-col-10">
                                            <InputTextarea rows={7} col={10} value={this.state.task.descriptionTask} onChange={(e) => { this.updatePropertyTask('descriptionTask', e.target.value) }} />
                                        </div>
                                    </div>
                                </div>}
                            </Dialog>
                        </div>
                        <div className='p-col-12 p-lg-8'>
                            <label htmlFor="float-input">Observaciones Adicionales</label>
                            <InputTextarea placeholder='Describa' className={this.determinarEsCampoRequerido('comentarios') && 'p-error'} rows='4' value={this.state.comments} onChange={(e) => this.setState({ comments: e.target.value })} />
                            {this.determinarEsCampoRequerido('comentarios') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo requerido" />
                                </div>
                            }
                        </div>
                        <div className='p-col-12 p-lg-8'>
                            <div className='p-grid'>
                                <div className='p-col-12 p-lg-8' />
                                <div className='p-col-12 p-lg-2'>
                                    <Button label='Aceptar' icon='pi pi-save' className='' onClick={() => this.saveExitMaterial()} />
                                </div>
                                <div className='p-col-12 p-lg-2'>
                                    <Button label='Cancelar' icon='pi pi-times' className='p-button-secondary' onClick={() => this.cancelOutputMaterial()} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

            </div>
        )
    }
}

export function setDataOutputMaterial(itemPNCS) {
    if (itemPNCS !== null) {

        that.setState({ itemPNC: itemPNCS, unit: itemPNCS.unitNCP });
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

export default connect(mapStateToProps, mapDispatchToProps)(ExitMaterial)