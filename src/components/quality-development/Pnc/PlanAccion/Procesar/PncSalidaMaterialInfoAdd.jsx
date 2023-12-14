import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import * as _ from "lodash";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import UnidadMedidaService from '../../../../../service/UnidadMedidaService';
import PncSalidaMaterialService from '../../../../../service/Pnc/PncSalidaMaterialService';
import { connect } from 'react-redux';

class PncSalidaMaterialInfoAdd extends Component {

    constructor() {
        super();
        this.state = {
            idSalida: 0,
            salida: null,
            informacionAdicional: [],
            mostrarControles: true,
            unidadesMedida: [],
            puedeEditar: false,
        }
        this.clonedCars = {};

        this.editorForRowEditing = this.editorForRowEditing.bind(this);
        this.onRowEditorValidator = this.onRowEditorValidator.bind(this);
        this.onRowEditInit = this.onRowEditInit.bind(this);
        this.onRowEditSave = this.onRowEditSave.bind(this);
        this.onRowEditCancel = this.onRowEditCancel.bind(this);

    }

    async componentDidMount() {
        const salida = this.props.salidaMaterial;
        var editar = false;
        if (salida.informacionAdicional.length > 0) {
            editar = salida.informacionAdicional[0].usuario === this.props.currentUser.nickName;
        }
        const unidades = await UnidadMedidaService.listarActivos();
        this.setState({
            idSalida: salida.id, 
            informacionAdicional: salida.informacionAdicional, 
            unidadesMedida: unidades, 
            salida: salida,
            puedeEditar: editar
        });
    }

    onEditorValueChange(props, value, field) {
        let updatedCars = [...props.value];
        updatedCars[props.rowIndex][field] = value;
        this.setState({ informacionAdicional: updatedCars });
    }

    onRowEditInit(event) {
        this.clonedCars[event.data.id] = { ...event.data };
    }

    async onRowEditSave(event) {
        if (this.onRowEditorValidator(event.data)) {
            delete this.clonedCars[event.data.id];
            event.data.unidadMedida = null;
            let obj = await PncSalidaMaterialService.actualizarInfoAdd(event.data);
            let cars = [...this.state.informacionAdicional];
            const index = cars.findIndex(x => x.id === obj.id);
            cars[index] = obj;
            this.setState({ informacionAdicional: cars });
            this.growl.show({ severity: 'success', summary: 'Success', detail: 'Registro actualizado' });
        }
        else {
            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Campos incorrectos' });
        }
    }

    onRowEditCancel(event) {
        let cars = [...this.state.informacionAdicional];
        cars[event.index] = this.clonedCars[event.data.id];
        delete this.clonedCars[event.data.id];
        this.setState({
            informacionAdicional: cars
        })
    }

    editorForRowEditing(props, field) {
        switch (field) {
            case 'cantidad':
                return <InputText keyfilter="num" value={props.rowData[field]} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.target.value)} />;
            case 'unidadMedidaId':
                return <Dropdown value={props.rowData[field]} options={this.state.unidadesMedida}
                    onChange={(e) => this.onEditorValueChange(props, e.value, field)} style={{ width: '100%' }} placeholder="Seleccione..." />
            default:
                return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChangeForRowEditing(props, e.target.value)} />;
        }

    }

    onRowEditorValidator(rowData) {
        //let value = rowData['loteOriginal'];
        return true;
    }

    /* Row Editing */
    onEditorValueChangeForRowEditing(props, value) {
        let updatedCars = [...props.value];
        updatedCars[props.rowIndex][props.field] = value;
        this.setState({ informacionAdicional: updatedCars });
    }


    render() {
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                {this.state.salida && this.state.salida.grupoAdicional === 1 &&
                    <DataTable value={this.state.informacionAdicional} editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}>
                        <Column field="tipoInfoAddTexto" header="Detalle" />
                        <Column field="cantidad" header="Cantidad" editor={(props) => this.editorForRowEditing(props, 'cantidad')} style={{ textAlign: 'center' }} />
                        <Column field="unidadMedidaTexto" header="Unidad Medida" editor={(props) => this.editorForRowEditing(props, 'unidadMedidaId')} style={{ textAlign: 'center' }} />
                        <Column field="lote" header="Lote" editor={(props) => this.editorForRowEditing(props, 'lote')} style={{ textAlign: 'center' }} />
                        {this.state.puedeEditar &&
                            <Column rowEditor={true} style={{ 'width': '90px', 'textAlign': 'center' }}></Column>
                        }
                    </DataTable>
                }
                {this.state.salida && this.state.salida.grupoAdicional === 2 &&
                    <DataTable value={this.state.informacionAdicional} editMode="row" rowEditorValidator={this.onRowEditorValidator} onRowEditInit={this.onRowEditInit} onRowEditSave={this.onRowEditSave} onRowEditCancel={this.onRowEditCancel}>
                        <Column field="loteOriginal" header="Lote Original" editor={(props) => this.editorForRowEditing(props, 'loteOriginal')} style={{ textAlign: 'center' }} />
                        <Column field="loteFin" header="Lote Fin" editor={(props) => this.editorForRowEditing(props, 'loteFin')} style={{ textAlign: 'center' }} />
                        <Column field="cantidad" header="Cantidad" editor={(props) => this.editorForRowEditing(props, 'cantidad')} style={{ textAlign: 'center' }} />
                        <Column field="unidadMedidaTexto" header="Unidad Medida" editor={(props) => this.editorForRowEditing(props, 'unidadMedidaId')} style={{ textAlign: 'center' }} />
                        <Column rowEditor={true} style={{ 'width': '70px', 'textAlign': 'center' }}></Column>
                    </DataTable>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps)(PncSalidaMaterialInfoAdd);