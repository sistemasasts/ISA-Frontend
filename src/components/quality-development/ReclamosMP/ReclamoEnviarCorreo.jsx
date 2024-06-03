import React, { Component } from 'react'
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import ReclamoMPService from '../../../service/ReclamoMPService';
/* import "../../site.css"; */
import * as _ from "lodash";
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import * as moment from 'moment';
import { Messages } from 'primereact/messages';
import { Chips } from 'primereact/components/chips/Chips';
import { InputText } from 'primereact/inputtext';

class ReclamoEnviarCorreo extends Component {

    constructor() {
        super();
        this.state = {
            idReclamo: 0,
            responsable: null,
            display: null,
            asunto: null,
            mensaje: null,
            destinos: [],
            camposObligatorios: []
        }

        this.operar = this.operar.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.origen);
        }
    }

    async fetchData(data) {
        this.setState({
            display: data.state.abrirEmail,
            idReclamo: data.state.id
        });

    }

    async componentDidMount() {
        this.fetchData(this.props.origen);

    }

    cerrarDialogo() {
        this.props.origen.setState({ abrirEmail: false })
        this.setState({
            display: false, id: null, destinos: [], asunto: null, mensaje: null
        })
    }

    async operar() {
        if (this.validarCamposRequeridos()) {
            console.log('se envia', this.crearObj())
            await ReclamoMPService.notificarReclamo(this.crearObj());
            this.growl.show({ severity: 'success', detail: 'Mensaje Enviado!' });
            this.cerrarDialogo();
        }
    }

    crearObj() {
        return {
            id: this.state.idReclamo,
            mensaje: this.state.mensaje,
            destinatarios: this.state.destinos,
            asunto: this.state.asunto
        }
    }


    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = [];
        if (this.state.destinos.length <= 0) {
            let obj = { campo: 'descripcion', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
            this.growl.show({ severity: 'error', detail: 'Ingrese los contactos!' });
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
        return resultado;
    }



    render() {
        let footer = <div className="p-dialog-buttonpane p-helper-clearfix">
            <Button className='p-button-success' label="Enviar" onClick={this.operar} />
            <Button className='p-button-danger' label="Cancelar" onClick={this.cerrarDialogo} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />

                <Dialog header="Envío Correo Electrónico" visible={this.state.display} style={{ width: '40vw' }} footer={footer} modal={true} onHide={() => this.setState({ display: false })}>
                    <Messages ref={(el) => this.messages = el} />
                    <div className="p-grid p-grid-responsive p-fluid">

                        <div className="p-col-12 p-lg-2" style={{ padding: '4px 10px' }}><label htmlFor="year">Para</label></div>
                        <div className="p-col-12 p-lg-10" style={{ padding: '4px 10px' }}>
                            {/* <Chips value={this.state.sendTo} onAdd={(e) => this.changeChipsAdd(e.value)} onRemove={(e) => this.changeChipsRemove(e.value)}></Chips> */}
                            <Chips value={this.state.destinos} onChange={(e) => this.setState({ destinos: e.value })}></Chips>
                        </div>
                        {/* <div className="p-col-12 p-lg-2" style={{ padding: '4px 10px' }}><label htmlFor="year">Asunto</label></div>
                        <div className="p-col-12 p-lg-10" style={{ padding: '4px 10px' }}>
                            <InputText onChange={(e) => this.setState({ asunto: e.target.value })} value={this.state.asunto} />
                        </div> */}

                        <div className="p-col-12 p-lg-2" style={{ padding: '4px 10px' }}><label htmlFor="year">Mensaje</label></div>
                        <div className="p-col-12 p-lg-10" style={{ padding: '4px 10px' }}>
                            <InputTextarea rows={5} value={this.state.mensaje} onChange={(e) => this.setState({ mensaje: e.target.value })} />
                        </div>
                    </div>
                </Dialog>
            </div>

        )
    }
}

export default ReclamoEnviarCorreo;