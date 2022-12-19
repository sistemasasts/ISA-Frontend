import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';
import React, { Component } from 'react';
import UsuarioService from '../../service/UsuarioService';
import * as _ from 'lodash';
import { Growl } from 'primereact/growl';

export class SeleccionUsuario extends Component {
    constructor() {
        super();
        this.state = {
            mostrarDialogo: false,
            usuarios: [],
            responsable: null
        };
        this.asignarSolicitud = this.asignarSolicitud.bind(this);
    }

    async componentDidMount() {
        const catalogo_usuarios = await UsuarioService.listarActivos();
        this.setState({ usuarios: this.transformarDatos(catalogo_usuarios) });
    }

    transformarDatos(data) {
        const usuairosCasteo = [];
        _.forEach(data, (x) => {
            usuairosCasteo.push({ 'label': `${x.idUser} - ${x.employee.completeName}`, 'value': x.idUser });
        });
        return usuairosCasteo;
    }

    asignarSolicitud() {
        if (this.state.responsable) {
            let a = this.props.origen;
            a.asignarResponsable(this.state.responsable);
            this.setState({ responsable: null, mostrarDialogo: false });
        } else {
            this.messages.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccione un responsable' });
        }
    }

    abrirDialogo() {
        debugger
        let a = this.props.origen;
        const solicitudes = a.state.seleccionSolicitud;
        if (_.size(solicitudes) > 0) {
            this.setState({ mostrarDialogo: true });
        } else {
            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Seleccione al menos una solicitud' });
        }
    }

    render() {
        const footer = (
            <div>
                <Button label="Aceptar" icon="fa fa-check" onClick={() => this.asignarSolicitud()} />
                <Button label="Cancelar" icon="fa fa-close" onClick={() => this.setState({ mostrarDialogo: false, responsable: null })} className="p-button-danger" />
            </div>
        );
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Button label="Asignar Responsable" onClick={() => this.abrirDialogo()} />
                <Dialog header="Asignar Usuario Responsable" visible={this.state.mostrarDialogo} style={{ width: '40vw' }} footer={footer} modal={true} onHide={() => this.setState({ mostrarDialogo: false })}>
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">RESPONSABLE</label>
                            <Dropdown appendTo={document.body} value={this.state.responsable} options={this.state.usuarios} onChange={(e) => this.setState({ responsable: e.value })} placeholder="Seleccione..." />
                            <Messages ref={(el) => this.messages = el} />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}
