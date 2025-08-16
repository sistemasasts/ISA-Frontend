import React, { Component } from 'react'
import history from '../../../history';
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import UsuarioService from '../../../service/UsuarioService';
import * as _ from "lodash";
import "../../site.css";
import PerfilService from '../../../service/PerfilService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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
            stateE: null,
            perfiles: null,
            perfil: null,

            catalogoArea: [],
            catalogoTipo: [],
            catalogoPerfiles: [],
            catalogoEstados: [],
            actualizar: false,

        };
        this.guardar = this.guardar.bind(this);
        this.regresar = this.regresar.bind(this);
        this.asignarPerfil = this.asignarPerfil.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.eliminarPerfil = this.eliminarPerfil.bind(this);
    }

    componentDidMount() {
        const idParam = this.props.match.params.idUsuario;
        this.cargarCatalogos();
        this.refrescar(idParam);
    }

    async cargarCatalogos() {
        const areas = await UsuarioService.listarAreas();
        const perfiles_catalogo = await PerfilService.listarActivos();
        const estado_catalogo = await UsuarioService.listarEstado();
        this.setState({ catalogoArea: areas, catalogoPerfiles: perfiles_catalogo, catalogoEstados: estado_catalogo });
    }

    async refrescar(idUsuario) {
        if (idUsuario !== '0') {
            const usuario = await UsuarioService.listarPorId(idUsuario);
            if (usuario) {
                const perfiles_data = await UsuarioService.listarPerfiles(usuario.id);
                this.setState({
                    idUser: usuario.id,
                    nombreUsuario: usuario.nombreUsuario,
                    ciEmployee: usuario.numeroIdentificacion,
                    name: usuario.nombre,
                    job: usuario.trabajo,
                    email: usuario.email,
                    area: usuario.area,
                    stateE: {'label': usuario.estado, 'value': usuario.estado, 'adicional': null },
                    actualizar: true,
                    perfiles: perfiles_data
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

    async asignarPerfil() {
        if(!this.state.perfil){
            this.growl.show({ severity: 'error', detail: 'Debe seleccionar un perfil.' });
            return ;
        }
        await UsuarioService.createUsuarioPerfil(this.crearObjUsuairoPerfil());
        this.growl.show({ severity: 'success', detail: 'Perfil asignado.' });
        const perfiles_data = await UsuarioService.listarPerfiles(this.state.idUser);
        this.setState({ perfiles: perfiles_data });
    }

    crearObjUsuairoPerfil(){
        return {
            usuarioId: this.state.idUser,
            perfilId: this.state.perfil.id
        }
    }

    async eliminarPerfil(perfilId) {
        await UsuarioService.deleteUsuarioPerfil(this.state.idUser, perfilId);
        this.growl.show({ severity: 'success', detail: 'Perfil eliminado.' });
        const perfiles_data = await UsuarioService.listarPerfiles(this.state.idUser);
        this.setState({ perfiles: perfiles_data });
    }


    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" className='p-button-danger' icon="pi pi-trash" onClick={() => this.eliminarPerfil(rowData.id)}></Button>
        </div>;
    }

    regresar() {
        history.push(`/administracion_usuario`);
    }

    crearObj() {
        return {
            id: this.state.idUser,
            nombreUsuario: this.state.idUser,
            nombre: this.state.name,
            numeroIdentificacion: this.state.ciEmployee,
            email: this.state.email,
            trabajo: this.state.job,
            estado: this.state.stateE?.value,
            area: this.state.area,
        }
    }

    validarFormulario() {
        if (_.isEmpty(this.state.ciEmployee) || _.isEmpty(this.state.name) || _.isEmpty(this.state.email))
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
                        <InputText value={this.state.nombreUsuario} onChange={(e) => this.setState({ nombreUsuario: e.target.value })} />
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
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Área</label>
                        <Dropdown options={this.state.catalogoArea} optionLabel='nameArea' value={this.state.area} autoWidth={false} onChange={(e) => this.setState({ area: e.value })} placeholder="Seleccione " />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Estado</label>
                        <Dropdown options={this.state.catalogoEstados} optionLabel='label' optionValue='value' value={this.state.stateE} autoWidth={false} onChange={(e) => this.setState({ stateE: e.value })} placeholder="Seleccione " />
                    </div>
                    
                </div>
                <div className='p-col-12 p-lg-12 boton-opcion' >
                    <Button label="GUARDAR" onClick={this.guardar} />
                    <Button className='p-button-danger' label="REGRESAR" onClick={this.regresar} />
                </div>
                <h3><strong>PERFILES</strong></h3>
                <div className='p-grid p-grid-responsive'>
                    <div className='p-col-12 p-lg-12'>
                        <div className="formgroup-inline">
                            <div className="field">
                                <label htmlFor="firstname5" className="p-sr-only" style={{marginRight:'5px'}}>Perfil</label>
                                <Dropdown style={{marginRight:'8px', width:'400px'}} options={this.state.catalogoPerfiles} optionLabel='nombre' autoWidth={true} value={this.state.perfil} onChange={(e) => this.setState({ perfil: e.value })} placeholder="Seleccione " />
                                <Button type="button" label="Asignar Perfil" onClick={this.asignarPerfil}/>
                            </div>
                        </div>
                        <br />
                        <DataTable value={this.state.perfiles} paginator={true} rows={15} responsive={true} scrollable={true}
                            selectionMode="single" selection={this.state.perfilSeleccionado} onSelectionChange={e => this.setState({ perfilSeleccionado: e.value })}
                            >
                            <Column field="perfil.nombre" header="Perfil" sortable={true}  style={{ width: '10em' }} />
                            <Column header="Acciones" body={this.actionTemplate} style={{ textAlign: 'center', width: '7em' }} />
                        </DataTable>
                    </div>
                    
                </div>
                

            </div>
        )
    }
}

export default UsuarioFormulario;
