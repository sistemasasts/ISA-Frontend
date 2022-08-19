import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EspecificacionService from '../../../service/EspecificacionService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

var that;
class BuscarPropiedadForm extends Component {
    static propTypes = {
        prop: PropTypes
    }

    constructor() {
        super();
        this.state = {
            propiedadSeleccionada: {},
            propiedadesNoAsignadas: [],
            display: false,

        };
        that = this;
        this.refrescarLista = this.refrescarLista.bind(this);
        this.seleccionarPropiedad = this.seleccionarPropiedad.bind(this);
    }

    async componentDidMount() {
        this.refrescarLista();
    }

    async refrescarLista() {
        const propiedades = await EspecificacionService.listarPropiedadesNoAsigandas(this.props.product && this.props.product.idProduct);
        this.setState({ propiedadesNoAsignadas: propiedades })
    }

    templateTipoPropiedad(rowData, column) {
        if (rowData.typeProperty) {
            return rowData.typeProperty === 'T' ? 'Técnica' : 'Visible';
        }
    }

    seleccionarPropiedad() {
        this.props._this.cargarInformacionPropiedadSeleccionada(this.state.propiedadSeleccionada);
        this.setState({ display: false });
    }


    render() {
        const dialogFooter = (
            <div>
                <Button icon="pi pi-check" onClick={this.seleccionarPropiedad} label="Seleccionar" />
                <Button icon="pi pi-times" onClick={() => this.setState({ display: false })} label="Cancelar" className="p-button-danger" />
            </div>
        );
        return (

            <div className="p-grid">
                <div className="p-col-12 p-lg-11">
                    <InputText  value={this.state.propiedadSeleccionada && this.state.propiedadSeleccionada.nameProperty} disabled={true} />
                </div>
                <div className="p-col-12 p-md-1">
                    <Button icon='pi pi-search' onClick={() => this.setState({ display: true })} />
                </div>

                <Dialog header="Búsqueda" visible={this.state.display} style={{ width: '50vw' }} onHide={() => this.setState({ display: false })} blockScroll footer={dialogFooter} >

                    <DataTable ref={(el) => this.dt = el} value={this.state.propiedadesNoAsignadas} selectionMode="single" paginator={true} rows={10}
                        responsive={true} selection={this.state.propiedadSeleccionada} onSelectionChange={event => this.setState({ propiedadSeleccionada: event.value })} >

                        <Column field="nameProperty" header="Propiedad" sortable={true} filter={true} style={{ width: '30%' }} />
                        <Column field="typeProperty" header="Tipo" body={this.templateTipoPropiedad} sortable={true} style={{ width: '15%' }} />

                    </DataTable>
                </Dialog>

            </div>

        )
    }
}

export default BuscarPropiedadForm;
