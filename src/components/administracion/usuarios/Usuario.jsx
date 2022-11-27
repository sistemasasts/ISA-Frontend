import React, { Component } from 'react'
import history from '../../../history';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import UsuarioService from '../../../service/UsuarioService';
import { determinarColorActivo } from '../../quality-development/SolicitudEnsayo/ClasesUtilidades';
import * as _ from "lodash";
import "../../site.css";
import { Growl } from 'primereact/growl';

class Usuario extends Component {
    constructor() {
        super();
        this.state = {
            usuarios: [],
            display: false,
            contrasena: null,
            contrasenaConfirmacion: null,
            usuarioSeleccionado: null
        };
        this.redirigirRegistroUsuario = this.redirigirRegistroUsuario.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.reestablecerContrasena = this.reestablecerContrasena.bind(this);
    }

    async componentDidMount() {
        const usuarios_data = await UsuarioService.list();
        this.setState({ usuarios: usuarios_data });
    }

    redirigirRegistroUsuario(idSolcicitud) {
        history.push(`/administracion_usuario_registro/${idSolcicitud}`);
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" className='p-button-warning' icon="fa fa-pencil" onClick={() => this.redirigirRegistroUsuario(rowData.idUser)}></Button>
            <Button type="button" className='p-button' icon="pi pi-unlock" onClick={() => this.setState({ display: true })}></Button>
        </div>;
    }

    bodyTemplateEstado(rowData) {
        const estado = rowData.employee.state ? 'SI' : 'NO';
        return <span className={determinarColorActivo(rowData.employee.state)}>{estado}</span>;
    }

    async reestablecerContrasena() {
        if (_.isEmpty(this.state.contrasena)) {
            this.growl.show({ severity: 'error', detail: 'Ingrese la información requerida.' });
            return false;
        }
        await UsuarioService.reestablecerContrasena({ idUser: this.state.usuarioSeleccionado.idUser, userPass: this.state.contrasena });
        this.growl.show({ severity: 'success', detail: 'Contraseña reestablecida.' });
        this.setState({ usuarioSeleccionado: null, contrasena: null, contrasenaConfirmacion: null, display: false });
    }

    deshabilitarGuardarReestablecer() {
        if (_.isEmpty(this.state.contrasena) && _.isEmpty(this.state.contrasenaConfirmacion))
            return true;
        return this.state.contrasena !== null && !_.isEqual(this.state.contrasena, this.state.contrasenaConfirmacion);
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => history.push("/administracion_usuario_registro/0")} />
        </div>;
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button disabled={this.deshabilitarGuardarReestablecer()} label="Guardar" icon="pi pi-check" onClick={this.reestablecerContrasena} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => this.setState({ display: false, usuarioSeleccionado: null, contrasena: null, contrasenaConfirmacion: null })} />
        </div>;
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>ADMINISTRACIÓN DE USUARIOS</strong></h3>
                <DataTable value={this.state.usuarios} paginator={true} rows={15} header={header} responsive={true} scrollable={true}
                    selectionMode="single" selection={this.state.usuarioSeleccionado} onSelectionChange={e => this.setState({ usuarioSeleccionado: e.value })}
                    onRowSelect={this.onCarSelect} >
                    <Column field="nickName" header="Usuario" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="employee.ciEmployee" header="Identificación" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="employee.completeName" header="Nombre" sortable={true} style={{ textAlign: 'center', width: '16em' }} />
                    <Column field="employee.email" header="Correo" style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="employee.kind.desc" header="Tipo" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field='employee.state' body={this.bodyTemplateEstado} header="Activo" sortable style={{ textAlign: 'center', width: '8em' }} />
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '7em' }} />
                </DataTable>
                <Dialog header="Reestablecer Contraseña" visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.setState({ display: false })} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Contraseña</label>
                            <Password value={this.state.contrasena} onChange={(e) => this.setState({ contrasena: e.target.value })} />
                        </div>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Confirmar Contraseña</label>
                            <Password value={this.state.contrasenaConfirmacion} onChange={(e) => this.setState({ contrasenaConfirmacion: e.target.value })} />
                        </div>
                        {this.state.contrasena !== null && !_.isEqual(this.state.contrasena, this.state.contrasenaConfirmacion) &&
                            <div className='p-col-12 p-lg-12'>
                                <div className="alert alert-danger" role="alert">
                                    Los valores no coinciden...
                                </div>
                            </div>
                        }

                    </div>
                </Dialog>
            </div>
        )
    }
}

export default Usuario
