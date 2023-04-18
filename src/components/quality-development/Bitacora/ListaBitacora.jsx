import React from "react";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {Growl} from "primereact/growl";
import {DataTable} from "primereact/datatable";
import {useHookBitacora} from "./hooks/useHookBitacora";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import * as _ from "lodash";
import {Dialog} from "primereact/dialog";
import {AutoComplete} from "primereact/autocomplete";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/components/dropdown/Dropdown";

export const Header = ({ clickDisplayForm }) => {
    return (
        <div>
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-left">
                    <Button label="Nuevo" icon="pi pi-plus" onClick={clickDisplayForm} />
                </div>
            </Toolbar>
        </div>
    );
}

export const ActionFooter = ({ save, cancel }) => {
    return (
        <div>
            <Button icon="pi pi-check" onClick={save} label={"Guardar"} />
            <Button icon="pi pi-times" onClick={cancel} label={"Cancelar"} className="p-button-secondary"/>
        </div>
    )
}

export const CellTextEdit = (props, field, action, catalogo, actions, productoSel, es, type) => {
    switch (field) {
        case "fechaLote":
            return <input type={"date"}  value={props.rowData[field]} onChange={(e) => action(props, e.target.value)}/>
            // return <Calendar
            //     dateFormat="yy-mm-dd"
            //     value={props.rowData[field]}
            //     locale={es}
            //     onChange={(e) => action(props, e.value)}
            // />
        case "material":
            return <AutoComplete
                field="nameProduct"
                // disabled={this.state.id > 0}
                minLength={3}
                placeholder="Ingrese criterio de búsqueda..."
                suggestions={catalogo}
                completeMethod={(e) => actions.buscarProductos(e.query)}
                value={productoSel}
                onChange={(e) => action(props, e.value)}
            />
        case "unidad":
        case "afectacion":
            return <Dropdown value={props.rowData[field]} options={catalogo} placeholder="Seleccione una unidad" onChange={(e) => action(props, e.value)} autoWidth={false} />
        default:
            return <InputText type={_.defaultTo(type, "text")} value={props.rowData[field]} onChange={(e) => action(props, e.target.value)}/>

    }
}
export const ListaBitacora = () => {
    const {
        growl,
        listaBitacora,
        displayForm,
        nuevaBitacora,
        listaProductos,
        productoSel,
        es,
        unidadesMedida,
        catalogoLineaAfectacion,
        actions
    } = useHookBitacora();

    return (
        <div className='p-grid'>
            <div className="p-col-12 p-lg-12">
                <Growl ref={growl} style={{ marginTop: '75px' }} />
                <div className="card card-w-title">
                    <h1>Bitácora</h1>
                    <DataTable
                        header={<Header clickDisplayForm={actions.clickNuevaBitacora}  />}
                        rowEditorValidator={actions.onRowEditorValidator}
                        onRowEditInit={actions.onRowEditInit}
                        onRowEditSave={actions.onRowEditSave}
                        onRowEditCancel={actions.onRowEditCancel}
                        value={listaBitacora}
                        editMode="row"
                        paginator={true}
                        rows={20}
                        autoLayout={true}
                    >
                        <Column field={"id"} header={"PNC.04"} sortable={true} filter={true} />
                        <Column field={"origen"} header={"Origen"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "origen", actions.onEditorValueChangeForRowEditing)} />
                        <Column field={"fechaLote"} header={"Fecha"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "fechaLote", actions.onEditorValueChangeForRowEditing, undefined, undefined, undefined, es)} />
                        <Column field={"material"} header={"Material"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "material", actions.onEditorValueChangeForRowEditing, listaProductos, actions, productoSel)} />
                        <Column field={"lote"} header={"Lote/Orden de fabricación"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "lote", actions.onEditorValueChangeForRowEditing)} />
                        <Column field={"cantidad"} header={"Cantidad"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "cantidad", actions.onEditorValueChangeForRowEditing, undefined, undefined, undefined, undefined, "number")} />
                        <Column field={"unidad"} header={"Unidad"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "unidad", actions.onEditorValueChangeForRowEditing, unidadesMedida)} />
                        <Column field={"seguimiento"} header={"Resp. seguimiento"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "seguimiento", actions.onEditorValueChangeForRowEditing)} />
                        <Column field={"afectacion"} header={"Línea afectada"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "afectacion", actions.onEditorValueChangeForRowEditing, catalogoLineaAfectacion)} />
                        <Column field={"motivo"} header={"Motivo de la desviación"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "motivo", actions.onEditorValueChangeForRowEditing)} />
                        <Column field={"descripcion"} header={"Descripción de la desviación"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "descripcion", actions.onEditorValueChangeForRowEditing)} />
                        <Column field={"control"} header={"Controles requeridos"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "control", actions.onEditorValueChangeForRowEditing)} />
                        <Column field={"alcance"} header={"Alcance y tiempo de la desviación"} sortable={true} filter={true} editor={(props) => CellTextEdit(props, "alcance", actions.onEditorValueChangeForRowEditing)} />
                        <Column rowEditor={true} style={{width: '100px', textAlign: 'center'}} />
                    </DataTable>
                    <Dialog header={"Nuevo"} visible={displayForm} modal={true} style={{ width: "50vw" }} onHide={actions.closeForm} footer={<ActionFooter save={actions.createItem} cancel={actions.closeForm} />}>
                        <div className="p-grid p-fluid">
                            <div className='p-col-6 p-lg-6'>
                                <label htmlFor="float-input">Origen</label>
                                <InputText value={nuevaBitacora.origen} onChange={(e) => actions.handleChangeNewBitacora("origen", e.target.value)} />
                            </div>
                            <div className='p-col-6 p-lg-6'>
                                <label htmlFor="float-input">Fecha</label>
                                <Calendar
                                    showIcon={true}
                                    dateFormat="yy-mm-dd"
                                    value={nuevaBitacora.fechaLote}
                                    locale={es}
                                    onChange={(e) => actions.handleChangeNewBitacora("fechaLote", e.value)}
                                />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Material</label>
                                <AutoComplete
                                    field="nameProduct"
                                    // disabled={this.state.id > 0}
                                    minLength={3}
                                    placeholder="Ingrese criterio de búsqueda..."
                                    suggestions={listaProductos}
                                    completeMethod={(e) => actions.buscarProductos(e.query)}
                                    value={productoSel}
                                    onChange={(e) => actions.handleChangeNewBitacora("material", e.value)}
                                />
                            </div>
                            <div className='p-col-4 p-lg-4'>
                                <label htmlFor="float-input">Lote</label>
                                <InputText value={nuevaBitacora.lote} onChange={(e) => actions.handleChangeNewBitacora("lote", e.target.value)} />
                            </div>
                            <div className='p-col-4 p-lg-4'>
                                <label htmlFor="float-input">Cantidad</label>
                                <InputText type={"number"} value={nuevaBitacora.cantidad} onChange={(e) => actions.handleChangeNewBitacora("cantidad", e.target.value)} />
                            </div>
                            <div className='p-col-4 p-lg-4'>
                                <label htmlFor="float-input">Unidad</label>
                                <Dropdown value={nuevaBitacora.unidad} options={unidadesMedida} placeholder="Seleccione una unidad" onChange={(e) => actions.handleChangeNewBitacora("unidad", e.value)} autoWidth={false} />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Resp. Seguimiento</label>
                                <InputText value={nuevaBitacora.seguimiento} onChange={(e) => actions.handleChangeNewBitacora("seguimiento", e.target.value)} />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Línea Afectada</label>
                                <Dropdown value={nuevaBitacora.afectacion} options={catalogoLineaAfectacion} placeholder="Seleccione una línea de afectación" onChange={(e) => actions.handleChangeNewBitacora("afectacion", e.value)} autoWidth={false} />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Motivo de la desviación</label>
                                <InputText value={nuevaBitacora.motivo} onChange={(e) => actions.handleChangeNewBitacora("motivo", e.target.value)} />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Descripción de la desviación</label>
                                <InputText value={nuevaBitacora.descripcion} onChange={(e) => actions.handleChangeNewBitacora("descripcion", e.target.value)} />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Controles requeridos</label>
                                <InputText value={nuevaBitacora.control} onChange={(e) => actions.handleChangeNewBitacora("control", e.target.value)} />
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Alcance y tiempo de la desviación</label>
                                <InputText value={nuevaBitacora.alcance} onChange={(e) => actions.handleChangeNewBitacora("alcance", e.target.value)} />
                            </div>
                            {/*{_.isEmpty(this.state.codigoUnidad) && _.isEmpty(this.state.defectoSeleccionado) &&*/}
                            {/*    <div className='p-col-12 p-lg-12'>*/}
                            {/*        <div className="alert alert-danger" role="alert">*/}
                            {/*            Los campos son obligatorios...*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*}*/}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default ListaBitacora;