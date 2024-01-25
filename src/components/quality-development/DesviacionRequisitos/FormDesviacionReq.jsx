import { Growl } from "primereact/growl";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/components/dropdown/Dropdown";
import React from "react";
import { useHookFormDesviacionReq } from "./hooks/useHookFormDesviacionReq";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ActionButton, ActionFooter, Header } from "./ListaDesviacionReq";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputSwitch } from 'primereact/inputswitch';
import * as _ from "lodash";

export const ActionButtonDefecto = ({ edit, view, remove, rowData }) => {
    return (
        <div>
            {remove && <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => remove(rowData)}></Button>}
            {view && <Button type="button" icon="pi pi-file-pdf" className="p-button-success" onClick={() => view(rowData)}/>}
        </div>
    )
}

export const FormDesviacionReq = () => {
    const {
        growl,
        nuevaDesviacionReq,
        listaProductos,
        productoSel,
        productoAfectadoSel,
        productoReplanificadoSel,
        es,
        unidadesMedida,
        defectosCatalogo,
        catalogoLineaAfectacion,
        catalogoCausas,
        displayForm,
        displayFormDefecto,
        listaLote,
        lote,
        listaDefecto,
        defecto,
        materialSel,
        recurso,
        listaRecurso,
        totalRecurso,
        displayFormRecurso,
        actions
    } = useHookFormDesviacionReq();

    let footerRecurso = <div style={{ textAlign: 'right' }}> <span style={{ paddingRight: '20%' }}>TOTAL:</span> {totalRecurso}</div>
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
                    <label htmlFor="float-input">Línea Afectada</label>
                    <Dropdown value={nuevaDesviacionReq.afectacion} options={catalogoLineaAfectacion} placeholder="Seleccione una línea de afectación" onChange={(e) => actions.handleChangeNewDesviacionReq("afectacion", e.value)} autoWidth={false} />
                </div>
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Causa</label>
                    <Dropdown value={nuevaDesviacionReq.causa} editable={true} options={catalogoCausas} onChange={(e) => actions.handleChangeNewDesviacionReq("causa", e.value)} autoWidth={false} />
                </div>
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Resp. Seguimiento</label>
                    <InputTextarea autoResize={true} value={nuevaDesviacionReq.seguimiento} onChange={(e) => actions.handleChangeNewDesviacionReq("seguimiento", e.target.value)} />
                </div>
                {/* <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Motivo de la desviación</label>
                    <InputTextarea autoResize={true} value={nuevaDesviacionReq.motivo} onChange={(e) => actions.handleChangeNewDesviacionReq("motivo", e.target.value)} />
                </div> */}
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
                {(nuevaDesviacionReq && nuevaDesviacionReq.id) && (
                    <div className='p-col-12 p-lg-12'>
                        <div>
                            <h1><strong>Defectos</strong></h1>
                            <DataTable
                                header={<Header clickDisplayForm={() => actions.clickFormDefecto(false)} label={"Agregar Defecto"} edit={false} icon={"pi pi-plus"} />}
                                value={listaDefecto}
                                autoLayout={true}
                                scrollable={true}
                                responsive={true}
                                selectionMode={"single"}
                            >
                                <Column
                                    body={(row) =>
                                        <ActionButtonDefecto
                                            /* edit={() => actions.clickFormLote(true, row)} */
                                            remove={() => actions.eliminarDefectoPorId(row)}
                                            rowData={row}
                                        />}
                                    style={{ width: '10em', textAlign: 'center' }} />
                                <Column field={"defecto.nombre"} header={"Descripción Defecto"} style={{textAlign: 'left' }}/>
                            </DataTable>
                            <Dialog header={"Nuevo"} visible={displayFormDefecto} modal={true} style={{ width: "50vw" }} onHide={actions.closeFormDefecto} footer={<ActionFooter save={actions.saveDefecto} cancel={actions.closeFormDefecto} />}>
                                <div className="p-grid p-fluid">
                                    <div className='p-col-12 p-lg-12'>
                                        <label htmlFor="float-input">Defecto</label>
                                        <Dropdown appendTo={document.body} value={defecto.defecto} options={defectosCatalogo} optionLabel="nombre" placeholder="Seleccione..." onChange={(e) => actions.handleChangeDefecto("defecto", e.value)} autoWidth={false} />
                                    </div>                                    
                                </div>
                            </Dialog>
                        </div>
                    </div>
                )}



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
                                <Column field={"fechaLote"} header={"Fecha"} />
                                <Column field={"lote"} header={"Lote/Orden de fabricación"} />
                                <Column field={"cantidad"} header={"Cantidad"} />
                                <Column field={"unidad.nombre"} header={"Unidad"} />
                                <Column field={"costo"} header={"Costo"} style={{textAlign: "right"}} />
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
                                    <div className='p-col-12 p-lg-12'>
                                        <label htmlFor="float-input">Costo</label>
                                        <InputText type={"number"} value={lote.costo} onChange={(e) => actions.handleChangeLote("costo", e.target.value)} />
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
                <div className='p-col-12 p-lg-6'>
                    <label htmlFor="float-input">Replanificación</label> <br />
                    <InputSwitch checked={nuevaDesviacionReq.replanificacion} onChange={(e) => actions.handleChangeNewDesviacionReq("replanificacion", e.target.value)} />
                </div>
                <div className='p-col-12 p-lg-6'></div>
                {(nuevaDesviacionReq && nuevaDesviacionReq.id && nuevaDesviacionReq.replanificacion) && (
                    <div className='p-col-12 p-lg-12  p-grid'>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Producto Afectado</label>
                            <AutoComplete
                                field="nameProduct"
                                minLength={3}
                                placeholder="Ingrese criterio de búsqueda..."
                                suggestions={listaProductos}
                                completeMethod={(e) => actions.buscarProductos(e.query)}
                                value={productoAfectadoSel}
                                onChange={(e) => actions.handleChangeNewDesviacionReq("productoAfectado", e.value)}
                            />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Cantidad Afectada</label>
                            <div className="p-inputgroup">
                                <InputText keyfilter={"num"} type={"number"} value={nuevaDesviacionReq.cantidadAfectada} onChange={(e) => actions.handleChangeNewDesviacionReq("cantidadAfectada", e.target.value)} />
                                <Dropdown style={{ minWidth: '3%', maxWidth: '40%' }} appendTo={document.body} value={_.get(nuevaDesviacionReq, "unidadAfectada.id")} options={unidadesMedida} placeholder="Seleccione una unidad" onChange={(e) => actions.handleChangeNewDesviacionReq("unidadAfectada", e.value)} autoWidth={false} />
                            </div>
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Desperdicio Generado</label>
                            <div className="p-inputgroup">
                                <InputText type={"number"} value={nuevaDesviacionReq.desperdicioGenerado} onChange={(e) => actions.handleChangeNewDesviacionReq("desperdicioGenerado", e.target.value)} />
                                <Dropdown style={{ minWidth: '3%', maxWidth: '40%' }} appendTo={document.body} value={_.get(nuevaDesviacionReq,"unidadDesperdicio.id")} options={unidadesMedida} placeholder="Seleccione una unidad" onChange={(e) => actions.handleChangeNewDesviacionReq("unidadDesperdicio", e.value)} autoWidth={false} />
                            </div>
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Producto Replanificado</label>
                            <AutoComplete
                                field="nameProduct"
                                minLength={3}
                                placeholder="Ingrese criterio de búsqueda..."
                                suggestions={listaProductos}
                                completeMethod={(e) => actions.buscarProductos(e.query)}
                                value={productoReplanificadoSel}
                                onChange={(e) => actions.handleChangeNewDesviacionReq("productoReplanificado", e.value)}
                            />
                        </div>
                        <div className='p-col-12 p-lg-4'>
                            <label htmlFor="float-input">Cantidad Recuperada</label>
                            <div className="p-inputgroup">
                                <InputText type={"number"} value={nuevaDesviacionReq.cantidadRecuperada} onChange={(e) => actions.handleChangeNewDesviacionReq("cantidadRecuperada", e.target.value)} />
                                <Dropdown style={{ minWidth: '3%', maxWidth: '40%' }} appendTo={document.body} value={_.get(nuevaDesviacionReq, "unidadRecuperada.id")} options={unidadesMedida} placeholder="Seleccione una unidad" onChange={(e) => actions.handleChangeNewDesviacionReq("unidadRecuperada", e.value)} autoWidth={false} />
                            </div>
                        </div>
                    </div>
                )}
                {(nuevaDesviacionReq && nuevaDesviacionReq.id && nuevaDesviacionReq.replanificacion) && (
                    <div className='p-col-12 p-lg-12'>
                        <div>
                            <h1><strong>Materia Prima y/o Mano  de obra de empleados</strong></h1>
                            <DataTable
                                header={<Header clickDisplayForm={() => actions.clickFormRecurso(false)} label={"Agregar Recurso"} edit={false} icon={"pi pi-plus"} />}
                                footer={footerRecurso}
                                value={listaRecurso}

                                autoLayout={true}
                                scrollable={true}
                                responsive={true}
                                selectionMode={"single"}
                            >
                                <Column
                                    body={(row) =>
                                        <ActionButton
                                            edit={() => actions.clickFormRecurso(true, row)}
                                            remove={() => actions.eliminarRecursoPorId(row)}
                                            rowData={row}
                                        />}
                                    style={{ width: '20em', textAlign: 'center' }} />
                                <Column field={"descripcion"} header={"Material"} />
                                <Column field={"cantidad"} header={"Cantidad"} style={{ textAlign: 'right' }}/>
                                <Column field={"unidad.nombre"} header={"Unidad"} style={{ textAlign: 'right' }}/>
                                <Column field={"costo"} header={"Costo"} style={{ textAlign: 'right' }} />
                                <Column field={"costoTotal"} header={"Costo total"} style={{ textAlign: 'right' }} />
                            </DataTable>
                            <Dialog header={"Nuevo"} visible={displayFormRecurso} modal={true} style={{ width: "50vw" }} onHide={actions.closeFormRecurso} footer={<ActionFooter save={actions.saveRecurso} cancel={actions.closeFormRecurso} />}>
                                <div className="p-grid p-fluid">
                                    <div className='p-col-12 p-lg-12'>
                                        <label htmlFor="float-input">Materia Prima / Mano de obra </label>
                                        <AutoComplete
                                            field="nameProduct"
                                            minLength={3}
                                            placeholder="Ingrese criterio de búsqueda..."
                                            suggestions={listaProductos}
                                            completeMethod={(e) => actions.buscarProductos(e.query)}
                                            value={materialSel}
                                            onChange={(e) => actions.handleChangeRecurso("material", e.value)}
                                        />
                                    </div>
                                    <div className='p-col-12 p-lg-12'>
                                        <label htmlFor="float-input">Cantidad</label>
                                        <InputText type={"number"} value={recurso.cantidad} onChange={(e) => actions.handleChangeRecurso("cantidad", e.target.value)} />
                                    </div>
                                    <div className='p-col-12 p-lg-12'>
                                        <label htmlFor="float-input">Unidad</label>
                                        <Dropdown appendTo={document.body} value={_.get(recurso, "unidad.id")} options={unidadesMedida} placeholder="Seleccione una unidad" onChange={(e) => actions.handleChangeRecurso("unidad", e.value)} autoWidth={false} />
                                    </div>
                                    <div className='p-col-12 p-lg-12'>
                                        <label htmlFor="float-input">Costo</label>
                                        <InputText type={"number"} value={recurso.costo} onChange={(e) => actions.handleChangeRecurso("costo", e.target.value)} />
                                    </div>
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