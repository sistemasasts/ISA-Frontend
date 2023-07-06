import React from "react";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {Growl} from "primereact/growl";
import {DataTable} from "primereact/datatable";
import {useHookDesviacionReq} from "./hooks/useHookDesviacionReq";
import {Column} from "primereact/column";
import {Paginator} from "primereact/paginator";
import {Accordion, AccordionTab} from "primereact/accordion";
import {InputText} from "primereact/inputtext";
import {AutoComplete} from "primereact/autocomplete";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/components/dropdown/Dropdown";

export const Header = ({ clickDisplayForm, icon, label }) => {
    return (
        <div>
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-left">
                    <Button label={label} icon={icon} onClick={clickDisplayForm} />
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

export const ActionButton = ({ edit, view, remove, rowData }) => {
    return (
        <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={edit} />
            {remove && <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => remove(rowData)}></Button>}
            {view && <Button type="button" icon="pi pi-file-pdf" className="p-button-success" onClick={() => view(rowData)}/>}
        </div>
    )
}

export const ListaDesviacionReq = () => {
    const {
        growl,
        listaDesviacionReq,
        criterios,
        listaProductos,
        productoSel,
        es,
        catalogoLineaAfectacion,
        activeIndexTab,
        pagination,
        actions
    } = useHookDesviacionReq();

    return (
        <div className='p-grid'>
            <div className="p-col-12 p-lg-12">
                <Growl ref={growl} style={{ marginTop: '75px' }} />
                <div className="card card-w-title">
                    <h1>Bitácora Desviación a los Requisitos</h1>
                    <Accordion activeIndex={activeIndexTab} onTabChange={(e) => actions.setActiveIndexTab(e.index)}>
                        <AccordionTab header={"Consulta avanzada"}>
                            <h2>Parámetros de consulta</h2>
                            <div className="p-grid p-grid-responsive p-fluid">
                                <div className='p-col-12 p-lg-3'>
                                    <label htmlFor="float-input">Número de Desviación de Requisito</label>
                                    <InputText value={criterios.consulta.secuencial} onChange={(e) => actions.onChangeCriterios("secuencial", e.target.value)} />
                                </div>
                                <div className='p-col-3'>
                                    <label htmlFor="float-input">Producto</label>
                                    <AutoComplete
                                        field="nameProduct"
                                        minLength={3}
                                        suggestions={listaProductos}
                                        completeMethod={(e) => actions.buscarProductos(e.query)}
                                        value={productoSel}
                                        onChange={(e) => actions.onChangeCriterios("productoId", e.value)}
                                    />
                                </div>
                                <div className='p-col-12 p-lg-3'>
                                    <label htmlFor="float-input">Fecha Inicio</label>
                                    <Calendar dateFormat="yy/mm/dd" inputId='fini' value={criterios.consulta.fechaInicio} locale={es} onChange={(e) => actions.onChangeCriterios("fechaInicio", e.value)} showIcon={true} />
                                </div>
                                <div className='p-col-12 p-lg-3'>
                                    <label htmlFor="float-input">Fecha Fin</label>
                                    <Calendar dateFormat="yy/mm/dd" inputId='ffin' value={criterios.consulta.fechaFin} locale={es} onChange={(e) => actions.onChangeCriterios("fechaFin", e.value)} showIcon={true} />
                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">Línea Afectada</label>
                                    <Dropdown value={criterios.consulta.afectacion} options={catalogoLineaAfectacion} placeholder="Seleccione una línea de afectación" onChange={(e) => actions.onChangeCriterios("afectacion", e.value)} autoWidth={false} />
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-12 boton-opcion' >
                                <Button className="p-button-danger" label="CONSULTAR" onClick={actions.obtenerListaDesviacionReq} />
                                <Button className='p-button-secondary' label="LIMPIAR" onClick={actions.limpiarCriterios} />
                            </div>
                        </AccordionTab>
                    </Accordion>
                    <DataTable
                        header={<Header label={"Nuevo"} icon={"pi pi-plus"} clickDisplayForm={actions.clickNuevaDesviacionReq}  />}
                        value={listaDesviacionReq}
                        autoLayout={true}
                        scrollable={true}
                        responsive={true}
                        selectionMode={"single"}
                        onSelectionChange={(e) => actions.onSelectionChange(e.value)}
                    >
                        <Column body={(row) => <ActionButton edit={() => actions.onEdit(row)} rowData={row} view={actions.generarReporte} />} style={{ width: '7em', textAlign: 'center' }} />
                        <Column field={"secuencial"} header={"PNC.04"} style={{ width: '7em', textAlign: 'center' }} />
                        <Column field={"productTypeText"} header={"Origen"} style={{ width: '15em', textAlign: 'center' }} />
                        <Column field={"fechaCreacionTrans"} header={"Fecha"} style={{ width: '10em', textAlign: 'center' }} />
                        <Column field={"product.nameProduct"} header={"Material"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"seguimiento"} header={"Resp. seguimiento"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"afectacionText"} header={"Línea afectada"} style={{ width: '15em', textAlign: 'center' }} />
                        <Column field={"motivo"} header={"Motivo de la desviación"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"descripcion"} header={"Descripción de la desviación"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"control"} header={"Controles requeridos"} style={{ width: '20em', textAlign: 'center' }} />
                        <Column field={"alcance"} header={"Alcance y tiempo de la desviación"} style={{ width: '20em', textAlign: 'center' }} />
                    </DataTable>
                    <Paginator
                        first={pagination.first}
                        rows={pagination.rows}
                        totalRecords={pagination.totalRecords}
                        onPageChange={actions.onPageChange}
                        currentPageReportTemplate={pagination.currenPage}
                        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    ></Paginator>
                </div>
            </div>
        </div>
    )
}

export default ListaDesviacionReq;