import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Growl } from 'primereact/growl';
import { Card } from 'primereact/card';


/* ====================  T R A N S A C T I O N S ======== */
import { TxOrderMP } from '../../../utils/TransactionsCalidad';

import { refreshInformation } from '../WorkFlow';

/* ==================  D A T A    C A T A L O G O  S =============== */
import { unidadesMedida } from '../../../global/catalogs';
import {  } from '../../../utils/FormatDate';

/* ============  S U B  C O M P O N E N T S    =============== */
import { PW, show_msgPW, hide_msgPW } from '../../../global/SubComponents/PleaseWait'; //Sub-Componente "Espere Por favor..."
import { connect } from 'react-redux';

var that;
class OrderMP extends Component {

    constructor() {
        super();
        this.state = {
            amount: null,
            unit: null,
            materialType: null,
            viewModal: false,
            process: null,
            userLogin: null,
        };
        that = this;
        this.showMessage = this.showMessage.bind(this);
        this.onUnitMetricsChange = this.onUnitMetricsChange.bind(this);
        this.onOrderMP = this.onOrderMP.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    /* ============================== I N I C I O   F U N C I O N E S ======================= */
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
    /*Metodo para DropDown unidades de medida    */
    onUnitMetricsChange(e) {
        this.setState({ unit: e.value });
    }

    onOrderMP() {
        debugger
        if (!this.validateForm()) {
            if (this.state.process !== null) {
                var actionPToUpdate = this.state.process;
                actionPToUpdate.userReplay = this.props.currentUser.idUser;
                actionPToUpdate.actionProcessReply = { amountOrder: this.state.amount, materialType: this.state.materialType, materialUnit: this.state.unit };

                show_msgPW();
                TxOrderMP(actionPToUpdate, function (data, status, msg) {
                    debugger;
                    hide_msgPW();
                    console.log(data);
                    switch (status) {
                        case 'OK':
                            refreshInformation();
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
        } else {
            this.showMessage('Ingrese los campos necesarios', 'error');
        }
    }

    validateForm() {
        var onValidate = false;
        if (this.state.amount == null) {
            onValidate = true;
        }

        if (this.state.unit == null) {
            onValidate = true;
        }
        return onValidate;
    }

    /* componentDidMount() {
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion });
    } */

    render() {
        const footerRequest = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={this.onOrderMP} />
                <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={() => this.setState({ viewModal: false })} />
            </div>
        );
        let imgUrl = 'assets/layout/images/laboratory.jpg'
        return (
            <div className="p-g">
                <Growl ref={(el) => this.growl = el} />
                <Dialog visible={this.state.viewModal} header="Solicitar MP" style={{ width: '40vw' }} footer={footerRequest} modal={true} closeOnEscape={true} onHide={() => this.setState({ viewModal: false })}>

                    <Card style={{
                        borderColor: '#00a9e2', backgroundImage: 'url(' + imgUrl + ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                    }}>
                        <div className="p-grid p-grid-responsive p-fluid">
                            <div className='p-col-12 p-md-6'>
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="fa fa-cc"></i>
                                    </span>
                                    <InputText placeholder="Cantidad" value={this.state.amount} onChange={(e) => this.setState({ amount: e.target.value })} />
                                </div>
                            </div>
                            <div className='p-col-12 p-md-6'>
                                
                                    <Dropdown options={unidadesMedida} value={this.state.unit} onChange={this.onUnitMetricsChange} placeholder="Selecione" />
                                
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Tipo Material</label>
                                <InputTextarea value={this.state.materialType} onChange={(e) => this.setState({ materialType: e.target.value })} rows={4} placeholder='Descripción' />
                            </div>
                        </div>
                    </Card>
                </Dialog>
                <PW />
            </div>
        )
    }
}
//Method for show form
export function show_formOrderMP(data) {
    that.setState({ viewModal: true, process: data });
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps)(OrderMP)