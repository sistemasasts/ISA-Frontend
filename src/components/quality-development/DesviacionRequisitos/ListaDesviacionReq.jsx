import React from "react";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {Growl} from "primereact/growl";
import {DataTable} from "primereact/datatable";
import {useHookDesviacionReq} from "./hooks/useHookDesviacionReq";
import {Column} from "primereact/column";

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

export const ActionButton = ({ edit, view, remove, rowData }) => {
    return (
        <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={edit} />
            {remove && <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => remove(rowData)}></Button>}
            {view && <Button type="button" icon="pi pi-file-pdf" className="p-button-success" onClick={view}/>}
        </div>
    )
}

export const ListaDesviacionReq = () => {
    const {
        growl,
        listaDesviacionReq,
        actions
    } = useHookDesviacionReq();

    return (
        <div className='p-grid'>
            <div className="p-col-12 p-lg-12">
                <Growl ref={growl} style={{ marginTop: '75px' }} />
                <div className="card card-w-title">
                    <h1>Bitácora Desviación a los Requisitos</h1>
                    <DataTable
                        header={<Header clickDisplayForm={actions.clickNuevaDesviacionReq}  />}
                        value={listaDesviacionReq}
                        paginator={true}
                        rows={20}
                        autoLayout={true}
                        scrollable={true}
                        responsive={true}
                        selectionMode={"single"}
                        // onSelectionChange={(e) => actions.onSelectionChange(e.value)}
                    >
                        <Column body={(row) => <ActionButton edit={() => actions.onEdit(row)} rowData={row} />} style={{ width: '7em', textAlign: 'center' }} />
                        <Column field={"id"} header={"PNC.04"} style={{ width: '7em', textAlign: 'center' }} />
                        <Column field={"product.origin"} header={"Origen"} style={{ width: '15em', textAlign: 'center' }} />
                        <Column field={"fechaCreacion"} header={"Fecha"} style={{ width: '20em', textAlign: 'center' }} />
                        <Column field={"product.nameProduct"} header={"Material"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"seguimiento"} header={"Resp. seguimiento"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"afectacion"} header={"Línea afectada"} style={{ width: '15em', textAlign: 'center' }} />
                        <Column field={"motivo"} header={"Motivo de la desviación"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"descripcion"} header={"Descripción de la desviación"} style={{ width: '30em', textAlign: 'center' }} />
                        <Column field={"control"} header={"Controles requeridos"} style={{ width: '20em', textAlign: 'center' }} />
                        <Column field={"alcance"} header={"Alcance y tiempo de la desviación"} style={{ width: '20em', textAlign: 'center' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    )
}

export default ListaDesviacionReq;