import { Growl } from 'primereact/growl';
import React, { Component } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import * as _ from "lodash";
import MenuService from '../../../service/MenuService';
import { Checkbox } from 'primereact/checkbox';


class MenuForm extends Component {
    constructor() {
        super();
        this.state = {
            idPerfil: 0,
            titulo: null,
            menus:[],
            display: false,
            menuSeleccionados: []
            
        };
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
        this.operar = this.operar.bind(this);
        this.onMenuChange = this.onMenuChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.origen);
        }
    }

    async componentDidMount() {
        const menu_data = await MenuService.list();
        this.setState({ menus: menu_data});
        this.fetchData(this.props.origen);
    }


    async fetchData(data) {
        const mostrar = data.state.mostrarMenuForm;
        const perfilNombre = data.state.perfilSeleccionado?.nombre;
        const tituloTmp = `Confguración del perfil: ${perfilNombre}`;
        let menu_condif_data = [];
        if(data.state.perfilSeleccionado){
            menu_condif_data = await MenuService.listarPorPerfil(data.state.perfilSeleccionado.id);
        }
        
        this.setState({ display: mostrar, titulo: tituloTmp, menuSeleccionados: menu_condif_data, idPerfil: data.state.perfilSeleccionado?.id });
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarMenuForm: false, perfilSeleccionado: null })
        this.setState({
            idPerfil: 0,
            titulo: null,
            display: false,
            menuSeleccionados: []
        })
    }

    async operar() {
        await MenuService.asignar(this.state.idPerfil, this.state.menuSeleccionados);
        this.growl.show({ severity: 'success', detail: 'Registro exitoso!' });
        this.cerrarDialogo();
    }

    onMenuChange(e) {
        let selectedMenu = [...this.state.menuSeleccionados];
        if(e.checked)
            selectedMenu.push(e.value);
        else
            selectedMenu.splice(selectedMenu.indexOf(e.value), 1);
        this.setState({menuSeleccionados: selectedMenu});
    }
    

    render() {
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Guardar" icon="pi pi-check" onClick={this.operar} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={this.cerrarDialogo} />
        </div>;
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Dialog header={this.state.titulo} visible={this.state.display} style={{ width: '50vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                    <div className="p-grid p-fluid">
                        <span style={{fontSize:'16px'}}>Seleccione las opciones de menú que desea asignar al perfil actual.</span>
                            { this.state.menus.filter(x => x.padreId === null).filter(x => x.etiqueta !== 'Inicio').map(menu => (
                                <div className="p-col-12 p-lg-12">
                                    <h3><strong>{menu.etiqueta}</strong></h3>
                                        { menu.menus && menu.menus.map(submenu => (
                                            <div className="p-col-12">
                                                <Checkbox inputId={submenu.id} value={submenu} onChange={this.onMenuChange}  checked={this.state.menuSeleccionados.find(x => x.id === submenu.id)}></Checkbox>
                                                <label htmlFor="cb1" className="p-checkbox-label">{submenu.etiqueta}</label>
                                            </div>   
                                        ))}
                                </div>
                            ))}
                            
                        
                    </div>
                </Dialog>
            </div>
        )
    }

}
export default MenuForm