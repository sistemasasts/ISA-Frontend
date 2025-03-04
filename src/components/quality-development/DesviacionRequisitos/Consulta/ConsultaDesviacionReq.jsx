import React from "react";
import { Button } from "primereact/button";
import { Growl } from "primereact/growl";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/components/dropdown/Dropdown";
import {MultiSelect} from 'primereact/multiselect';
import { useHookConsultaDesviacionReq } from "./useHookConsultaDesviacionReq";



export const ActionButton = ({ edit, view, remove, rowData }) => {
    return (
        <div>
            {view && <Button type="button" icon="pi pi-file-pdf" className="p-button-success" onClick={() => view(rowData)} />}
        </div>
    )
}

export const ConsultaDesviacionReq = () => {
    const {
        growl,
        listaDesviacionReq,
        criterios,
        listaProductos,
        productoSel,
        es,
        catalogoLineaAfectacion,
        catalogoLineaNegocio,
        catalogoEstado,
        activeIndexTab,
        pagination,
        actions
    } = useHookConsultaDesviacionReq();

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
                                        minLength={1}
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
                                <div className='p-col-12 p-lg-6'>
                                    <label htmlFor="float-input">Línea Afectada</label>
                                    <Dropdown value={criterios.consulta.afectacion} options={catalogoLineaAfectacion} placeholder="Seleccione una línea de afectación" onChange={(e) => actions.onChangeCriterios("afectacion", e.value)} autoWidth={false} />
                                </div>
                                <div className='p-col-12 p-lg-6'>
                                    <label htmlFor="float-input">Línea Negocio</label>
                                    <Dropdown value={criterios.consulta.lineaNegocio} options={catalogoLineaNegocio} placeholder="Seleccione línea de negocio" onChange={(e) => actions.onChangeCriterios("lineaNegocio", e.value)} autoWidth={false} />
                                </div>
                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">Estado</label>
                                    {/* <Dropdown value={criterios.consulta.estados} options={catalogoEstado} placeholder="Seleccione línea de negocio" onChange={(e) => actions.onChangeCriterios("estados", e.value)} autoWidth={false} /> */}
                                    <MultiSelect value={criterios.consulta.estados} options={catalogoEstado} onChange={(e) => actions.onChangeCriterios("estados", e.value)} />
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-12 boton-opcion' >
                                <Button className="p-button-danger" label="CONSULTAR" onClick={actions.obtenerListaDesviacionReq} />
                                <Button className='p-button-secondary' label="LIMPIAR" onClick={actions.limpiarCriterios} />
                            </div>
                        </AccordionTab>
                    </Accordion>
                    <DataTable
                        value={listaDesviacionReq}
                        autoLayout={true}
                        scrollable={true}
                        responsive={true}
                        selectionMode={"single"}
                        onSelectionChange={(e) => actions.onSelectionChange(e.value)}
                    >
                        <Column body={(row) => <ActionButton rowData={row} view={actions.generarReporte} />} style={{ width: '7em', textAlign: 'center' }} />
                        <Column field={"secuencial"} header={"PNC"} style={{ width: '7em', textAlign: 'center' }} />
                        <Column field={"estado"} header={"Estado"} style={{ width: '15em', textAlign: 'center' }} />
                        <Column field={"productTypeText"} header={"Origen"} style={{ width: '15em', textAlign: 'center' }} />
                        <Column field={"fechaCreacionTrans"} header={"Fecha"} style={{ width: '10em', textAlign: 'center' }} />
                        <Column field={"product.nameProduct"} header={"Material"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"afectacionText"} header={"Línea afectada"} style={{ width: '15em', textAlign: 'center' }} />
                        <Column field={"causa"} header={"Causa de la desviación"} style={{ width: '30em', textAlign: 'center' }} />
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

export default ConsultaDesviacionReq;