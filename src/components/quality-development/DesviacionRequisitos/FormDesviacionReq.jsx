import {Growl} from "primereact/growl";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {AutoComplete} from "primereact/autocomplete";
import {Dropdown} from "primereact/components/dropdown/Dropdown";
import React from "react";
import {useHookFormDesviacionReq} from "./hooks/useHookFormDesviacionReq";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {ActionButton, ActionFooter, Header} from "./ListaDesviacionReq";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

export const FormDesviacionReq = () => {
    const {
        growl,
        nuevaDesviacionReq,
        listaProductos,
        productoSel,
        es,
        unidadesMedida,
        catalogoLineaAfectacion,
        displayForm,
        listaLote,
        lote,
        actions
    } = useHookFormDesviacionReq();

    return (
        <div className="card card-w-title">
            <Growl ref={growl} style={{ marginTop: '75px' }} />
            <h3 className={'text-titulo'}><strong>BITÁCORA DESVIACIÓN A LOS REQUISITOS</strong></h3>
            <div className="p-grid p-grid-responsive p-fluid">
                <div className='p-col-12 p-lg-12'>
                    <label htmlFor="float-input">Material</label>
                    <AutoComplete
                        field="nameProduct"
                        minLength={3}
                        placeholder="Ingrese criterio de búsqueda..."
                        suggestions={listaProductos}
                        completeMethod={(e) => actions.buscarProductos(e.query)}
                        value={productoSel}
                        onChange={(e) => actions.handleChangeNewDesviacionReq("product", e.value)}
                    />
                </div>
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Resp. Seguimiento</label>
                    <InputTextarea autoResize={true} value={nuevaDesviacionReq.seguimiento} onChange={(e) => actions.handleChangeNewDesviacionReq("seguimiento", e.target.value)} />
                </div>
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Línea Afectada</label>
                    <Dropdown value={nuevaDesviacionReq.afectacion} options={catalogoLineaAfectacion} placeholder="Seleccione una línea de afectación" onChange={(e) => actions.handleChangeNewDesviacionReq("afectacion", e.value)} autoWidth={false} />
                </div>
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Motivo de la desviación</label>
                    <InputTextarea autoResize={true} value={nuevaDesviacionReq.motivo} onChange={(e) => actions.handleChangeNewDesviacionReq("motivo", e.target.value)} />
                </div>
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Descripción de la desviación</label>
                    <InputTextarea autoResize={true} value={nuevaDesviacionReq.descripcion} onChange={(e) => actions.handleChangeNewDesviacionReq("descripcion", e.target.value)} />
                </div>
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Controles requeridos</label>
                    <InputTextarea autoResize={true} value={nuevaDesviacionReq.control} onChange={(e) => actions.handleChangeNewDesviacionReq("control", e.target.value)} />
                </div>
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Alcance y tiempo de la desviación</label>
                    <InputTextarea autoResize={true} value={nuevaDesviacionReq.alcance} onChange={(e) => actions.handleChangeNewDesviacionReq("alcance", e.target.value)} />
                </div>
                {/*{_.isEmpty(this.state.codigoUnidad) && _.isEmpty(this.state.defectoSeleccionado) &&*/}
                {/*    <div className='p-col-12 p-lg-12'>*/}
                {/*        <div className="alert alert-danger" role="alert">*/}
                {/*            Los campos son obligatorios...*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*}*/}
                {(nuevaDesviacionReq && nuevaDesviacionReq.id) && (
                    <div className='p-col-12 p-lg-12'>
                        <div>
                            <h1><strong>Lotes</strong></h1>
                            <DataTable
                                header={<Header clickDisplayForm={() => actions.clickFormLote(false)} label={"Agregar Lote"} edit={false} icon={"pi pi-plus"} />}
                                value={listaLote}
                                paginator={true}
                                rows={10}
                                autoLayout={true}
                                scrollable={true}
                                responsive={true}
                                selectionMode={"single"}
                            >
                                <Column
                                    body={(row) =>
                                        <ActionButton
                                        edit={() => actions.clickFormLote(true, row)}
                                        remove={() => actions.eliminarPorId(row)}
                                        rowData={row}
                                        />}
                                    style={{ width: '20em', textAlign: 'center' }} />
                                <Column field={"fechaLote"} header={"Fecha"}  />
                                <Column field={"lote"} header={"Lote/Orden de fabricación"} />
                                <Column field={"cantidad"} header={"Cantidad"} />
                                <Column field={"unidad.nombre"} header={"Unidad"} />
                            </DataTable>
                            <Dialog header={"Nuevo"} visible={displayForm} modal={true} style={{ width: "50vw" }} onHide={actions.closeForm} footer={<ActionFooter save={actions.saveLocalLote} cancel={actions.closeForm} />}>
                            <div className="p-grid p-fluid">
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">Lote/Orden de fabricación</label>
                                    <InputText value={lote.lote} onChange={(e) => actions.handleChangeLote("lote", e.target.value)} />
                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">Cantidad</label>
                                    <InputText type={"number"} value={lote.cantidad} onChange={(e) => actions.handleChangeLote("cantidad", e.target.value)} />
                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">Unidad</label>
                                    <Dropdown appendTo={document.body} value={lote.unidad.id} options={unidadesMedida} placeholder="Seleccione una unidad" onChange={(e) => actions.handleChangeLote("unidad", e.value)} autoWidth={false} />
                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">Fecha</label>
                                    <Calendar
                                        appendTo={document.body}
                                        showIcon={true}
                                        dateFormat="yy-mm-dd"
                                        value={lote.fecha}
                                        locale={es}
                                        onChange={(e) => actions.handleChangeLote("fecha", e.value)}
                                    />
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
                )}
                <div className='p-col-12 p-lg-12' style={{ justifyContent: 'center', textAlign: 'center' }}>
                    <Button label='Guardar' icon='pi pi-save' style={{ width: '10%' }} onClick={actions.createItem} />
                    <Button label='Cancelar' icon='pi pi-times' style={{ width: '10%' }} className='p-button-danger' onClick={actions.cancelar} />
                </div>
            </div>
        </div>
    )
}

export default FormDesviacionReq;