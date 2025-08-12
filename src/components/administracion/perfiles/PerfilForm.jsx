import { Growl } from 'primereact/growl';
import React, { Component } from 'react'
import PerfilService from '../../../service/PerfilService';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import * as _ from "lodash";
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';


class PerfilForm extends Component {
    constructor() {
        super();
        this.state = {
            roles:[],
            display: false,
            perfilSeleccionado: null,
            nombre: null,
            rol: null,
        };
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
        this.operar = this.operar.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.origen);
        }
    }

    async componentDidMount() {
        const roles_data = await PerfilService.listarRoles();
        this.setState({ roles: roles_data });
        this.fetchData(this.props.origen);
    }


    fetchData(data) {
        const mostrar = data.state.mostrarPerfilForm;
        this.setState({ display: mostrar });
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarPerfilForm: false })
        this.setState({
            id: null,
            nombre: null,
            rol: null
        })
    }

    async operar() {
        if (this.validarCamposRequeridos()) {
            await PerfilService.create(this.crearObj());
            this.actualizarTabla();
            this.growl.show({ severity: 'success', detail: 'Perfil registrado!' });

            this.cerrarDialogo();
        }
    }

    crearObj() {
            return {
                nombre: this.state.nombre,
                rol: this.state.rol.value,
            }
        }

    actualizarTabla() {
        this.props.origen.actualizarLista();
    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []
        if (this.state.nombre === null) {
            let obj = { campo: 'nombre', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.rol === null) {
            let obj = { campo: 'rol', obligatorio: true }
            camposOblogatoriosDetectados.push(obj);
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
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Guardar" icon="pi pi-check" onClick={this.operar} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={this.cerrarDialogo} />
        </div>;
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Dialog header={this.state.id > 0 ? "Editar" : "Nuevo"} visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Nombre</label>
                            <InputText value={this.state.nombre} onChange={(e) => this.setState({ nombre: e.target.value })} />
                            {this.determinarEsCampoRequerido('nombre') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>

                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Rol</label>
                            <Dropdown appendTo={document.body} options={this.state.roles} value={this.state.rol} autoWidth={false} onChange={(e) => this.setState({ rol: e.value })}
                                placeholder="Selecione" optionLabel='label' optionValue='value' />
                            {this.determinarEsCampoRequerido('rol') &&
                                <div style={{ marginTop: '8px' }}>
                                    <Message severity="error" text="Campo Obligatorio" />
                                </div>
                            }
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }

}
export default PerfilForm