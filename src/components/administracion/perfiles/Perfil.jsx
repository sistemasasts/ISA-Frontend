import { Growl } from 'primereact/growl';
import history from '../../../history';
import React, { Component } from 'react'
import PerfilService from '../../../service/PerfilService';
import { determinarColorActivo } from '../../quality-development/SolicitudEnsayo/ClasesUtilidades';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PerfilForm from './PerfilForm';
import MenuForm from './MenuForm';


class Perfil extends Component {
    constructor() {
        super();
        this.state = {
            perfiles: [],
            mostrarPerfilForm: false,
            mostrarMenuForm: false,
            perfilSeleccionado: null
        };
        this.actionTemplate = this.actionTemplate.bind(this);
    }

    async componentDidMount() {
        this.actualizarLista();
    }

    async actualizarLista() {
        const perfiles_data = await PerfilService.list();
        this.setState({ perfiles: perfiles_data });
    }

    actionTemplate(rowData, column) {
        return <div>
            {/* <Button type="button" className='p-button-warning' icon="fa fa-pencil" onClick={() => this.setState({ display: true })}></Button> */}
            <Button type="button" className='p-button-success' icon="pi pi-bars" onClick={() => this.setState({ mostrarMenuForm: true })}></Button>
        </div>;
    }

    bodyTemplateEstado(rowData) {
        const estado = rowData.activo ? 'SI' : 'NO';
        return <span className={determinarColorActivo(rowData.activo)}>{estado}</span>;
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => this.setState({ mostrarPerfilForm: true })} />
        </div>;
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3><strong>ADMINISTRACIÓN DE PERFILES</strong></h3>
                <DataTable value={this.state.perfiles} paginator={true} rows={15} header={header} responsive={true} scrollable={true}
                    selectionMode="single" selection={this.state.perfilSeleccionado} onSelectionChange={e => this.setState({ perfilSeleccionado: e.value })}
                    onRowSelect={this.onCarSelect} >
                    <Column field="nombre" header="Nombre" sortable={true} filter={true} filterMatchMode="contains"  style={{ width: '10em' }} />
                    <Column field="rol" header="Rol" sortable={true} style={{ width: '10em' }} />
                    <Column field='activo' body={this.bodyTemplateEstado} header="Activo" sortable style={{ textAlign: 'center', width: '8em' }} />
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '7em' }} />
                </DataTable>
                <PerfilForm mostrar={this.state.mostrarPerfilForm} origen={this} />
                <MenuForm mostrar={this.state.mostrarMenuForm} origen={this} />
            </div>
        )
    }

}
export default Perfil