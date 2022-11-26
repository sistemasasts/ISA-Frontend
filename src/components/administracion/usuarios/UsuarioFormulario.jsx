import React, { Component } from 'react'
import history from '../../../history';
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import UsuarioService from '../../../service/UsuarioService';
import RoleService from '../../../service/RoleService';
import * as _ from "lodash";
import "../../site.css";

class UsuarioFormulario extends Component {
    constructor() {
        super();
        this.state = {
            idUser: null,
            ciEmployee: null,
            name: null,
            lastName: null,
            job: null,
            email: null,
            area: null,
            kind: null,
            stateE: true,
            role: null,

            catalogoArea: [],
            catalogoTipo: [],
            catalogoRoles: [],
            actualizar: false,

        };
        this.guardar = this.guardar.bind(this);
        this.regresar = this.regresar.bind(this);
    }

    componentDidMount() {
        const idParam = this.props.match.params.idUsuario;
        console.log(idParam);
        this.cargarCatalogos();
        this.refrescar(idParam);
    }

    async cargarCatalogos() {
        const areas = await UsuarioService.listarAreas();
        const tipos = await UsuarioService.listarTipos();
        const roles = await RoleService.listar();
        this.setState({ catalogoArea: areas, catalogoTipo: tipos, catalogoRoles: roles });
    }

    async refrescar(idUsuario) {
        debugger
        if (idUsuario !== '0') {
            const usuario = await UsuarioService.listarPorId(idUsuario);
            if (usuario) {
                console.log(usuario);
                this.setState({
                    idUser: usuario.idUser,
                    ciEmployee: usuario.employee.ciEmployee,
                    name: usuario.employee.name,
                    lastName: usuario.employee.lastName,
                    job: usuario.employee.job,
                    email: usuario.employee.email,
                    area: usuario.employee.area,
                    kind: usuario.employee.kind,
                    stateE: usuario.employee.state,
                    role: usuario.role,
                    actualizar: true,
                });
            }
        }
    }

    async guardar() {
        if (!this.validarFormulario()) {
            this.growl.show({ severity: 'error', detail: 'Complete los campos requeridos.' });
            return false;
        }

        if (this.state.actualizar) {
            const usuario = await UsuarioService.update(this.crearObj());
            this.growl.show({ severity: 'success', detail: 'Usuario actualizado.' });
        } else {
            const usuario = await UsuarioService.create(this.crearObj());
            history.push(`/administracion_usuario_registro/${usuario.idUser}`);
            this.growl.show({ severity: 'success', detail: 'Usuario registrado.' });
            this.setState({ actualizar: true });
        }
    }

    regresar() {
        history.push(`/administracion_usuario`);
    }

    crearObj() {
        return {
            idUser: this.state.idUser,
            nickName: this.state.idUser,
            role: this.state.role,
            employee: {
                ciEmployee: this.state.ciEmployee,
                name: this.state.name,
                lastName: this.state.lastName,
                state: this.state.stateE,
                area: this.state.area,
                kind: this.state.kind,
                email: this.state.email,
                job: this.state.job,
            }
        }
    }

    validarFormulario() {
        if (_.isEmpty(this.state.idUser) || _.isEmpty(this.state.ciEmployee) || _.isEmpty(this.state.name) || _.isEmpty(this.state.lastName) || _.isEmpty(this.state.email)
        || _.isEmpty(this.state.role))
            return false;
        return true;
    }

    render() {
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>USUARIO REGISTRO</strong></h3>
                <div className='p-grid p-grid-responsive p-fluid'>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Usuario</label>
                        <InputText value={this.state.idUser} onChange={(e) => this.setState({ idUser: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Cargo</label>
                        <InputText value={this.state.job} onChange={(e) => this.setState({ job: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Correo Electrónico</label>
                        <InputText value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Identificación</label>
                        <InputText value={this.state.ciEmployee} onChange={(e) => this.setState({ ciEmployee: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Nombres</label>
                        <InputText value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Apellidos</label>
                        <InputText value={this.state.lastName} onChange={(e) => this.setState({ lastName: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Área</label>
                        <Dropdown options={this.state.catalogoArea} optionLabel='nameArea' value={this.state.area} autoWidth={false} onChange={(e) => this.setState({ area: e.value })} placeholder="Seleccione " />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Tipo</label>
                        <Dropdown options={this.state.catalogoTipo} optionLabel='desc' value={this.state.kind} autoWidth={false} onChange={(e) => this.setState({ kind: e.value })} placeholder="Seleccione " />
                    </div>
                    <div className="p-col-12 p-lg-4">
                        <label htmlFor="cb2" className="p-checkbox-label">Activo</label><br />
                        <Checkbox inputId="cb2" onChange={(e) => this.setState({ stateE: e.checked })} checked={this.state.stateE}></Checkbox>
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Rol</label>
                        <Dropdown options={this.state.catalogoRoles} optionLabel='rolDescription' value={this.state.role} autoWidth={false} onChange={(e) => this.setState({ role: e.value })} placeholder="Seleccione " />
                    </div>
                </div>
                <div className='p-col-12 p-lg-12 boton-opcion' >
                    <Button label="GUARDAR" onClick={this.guardar} />
                    <Button className='p-button-danger' label="REGRESAR" onClick={this.regresar} />
                </div>
            </div>
        )
    }
}

export default UsuarioFormulario;
