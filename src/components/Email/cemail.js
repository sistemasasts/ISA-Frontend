import React, { Component } from 'react';
import { Growl } from 'primereact/growl';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Chips } from 'primereact/chips';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Messages } from 'primereact/messages';

/* ====================  T R A N S A C T I O N S ======== */
import { SendEmail } from '../../utils/TransactionsCalidad';

var that;
export class Email extends Component {

    constructor() {
        super();
        this.state = {
            waitModalView: false,
            visibleModalEmail: false,
            pathFile: null,
            sendTo: ['anunez@imptek.com'],
            sendSubject: '',
            sendMessage: '',
            messageEmail: ''
        };
        that = this;
        this.closeModalEmail = this.closeModalEmail.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.changeChipsAdd = this.changeChipsAdd.bind(this);
        this.changeChipsRemove = this.changeChipsRemove.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.showMessageBig = this.showMessageBig.bind(this);
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

    /* Metodo para mostrar mensajes en el mismo dialog */
    showMessageBig(message, type) {
        switch (type) {
            case 'error':
                this.messages.show({ severity: 'error', summary: 'Error', detail: message });
                break;
            case 'success':
                this.messages.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
                break;
            case 'info':
                this.messages.show({ severity: 'info', summary: 'Información', detail: message });
                break;
            default: break;
        }
    }

    changeChipsAdd(e) {
        debugger
        var aux = this.state.sendTo;
        aux.push(e);
        this.setState({ sendTo: aux });
    }

    changeChipsRemove(e) {
        debugger
        var array = this.state.sendTo
        var filtered = array.filter(function (value, index, arr) {

            return value !== e;

        });
        this.setState({ sendTo: filtered });
    }
    closeModalEmail() {
        that.setState({
            visibleModalEmail: false, sendTo: []
        });
    }

    sendEmail() {
        debugger
        if (this.state.pathFile !== null) {
            if (this.state.sendTo.length !== 0) {
                this.setState({ waitModalView: true })
                var obj = { contacts: this.state.sendTo.toString(), subject: this.state.sendSubject, filePath: this.state.pathFile, message: this.state.sendMessage }
                SendEmail(obj, function (data, status, msg) {
                    that.setState({ waitModalView: false })
                    switch (status) {
                        case 'OK':
                            that.showMessage(msg, 'success');
                            that.setState({
                                visibleModalEmail: false, sendTo: [],
                                sendSubject: '',
                                sendMessage: '',
                            });
                            break;
                        case 'ERROR':
                            that.showMessage(msg, 'error');
                            break;
                        default: break;
                    }
                })
            } else {
                this.showMessageBig('Error ingrese correo electrónico', 'error');
            }

        }

    }

    render() {
        const footer = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={() => this.sendEmail()} />
                <Button label="Cancelar" icon="pi pi-times" onClick={() => this.closeModalEmail()} className="p-button-danger" />
            </div>
        );
        return (
            <div className="p-g-12">
                <Growl ref={(el) => this.growl = el} />
                <Dialog visible={this.state.waitModalView} style={{ width: '20vw' }} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ waitModalView: false })}>
                    <div className="p-grid p-grid-responsive p-fluid">
                        <div className="p-grid-row" style={{ marginRight: '10px' }}>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration="4s" />
                        </div>
                        <div className="p-grid-row" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: '10px', marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Espere por favor... !</span>
                        </div>
                    </div>
                </Dialog>
                <Dialog header="Envío Correo Electrónico" visible={this.state.visibleModalEmail} style={{ width: '40vw' }} footer={footer} modal={true} onHide={() => this.setState({ visibleModalEmail: false })}>
                    <Messages ref={(el) => this.messages = el} />
                    <div className="p-grid p-grid-responsive p-fluid">
                       
                            <div className="p-col-2" style={{ padding: '4px 10px' }}><label htmlFor="year">Para</label></div>
                            <div className="p-col-10" style={{ padding: '4px 10px' }}>
                                <Chips value={this.state.sendTo} onChange={(e) => this.setState({sendTo: e.value})} ></Chips>
                            </div>
                        
                            <div className="p-col-2" style={{ padding: '4px 10px' }}><label htmlFor="year">Asunto</label></div>
                            <div className="p-col-10" style={{ padding: '4px 10px' }}>
                                <InputText onChange={(e) => this.setState({ sendSubject: e.target.value })} value={this.state.sendSubject} />
                            </div>
                        
                            <div className="p-col-2" style={{ padding: '4px 10px' }}><label htmlFor="year">Mensaje</label></div>
                            <div className="p-col-10" style={{ padding: '4px 10px' }}>
                                <InputTextarea rows={5} value={this.state.sendMessage} onChange={(e) => this.setState({ sendMessage: e.target.value })} />
                            </div>
                        
                        <div className="p-col-12">
                            <div>{this.state.messageEmail}</div>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export function setParamsSendEmail(file, subject, msgEmail) {
    //that.changeChipsAdd('diegoalpala91@gmail.com');
    that.setState({ pathFile: file, visibleModalEmail: true, sendSubject: subject, sendMessage: msgEmail });
}