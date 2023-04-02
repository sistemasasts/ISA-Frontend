import React, { Component } from 'react'
import { Galleria } from 'primereact/galleria';
import * as _ from "lodash";
import { Growl } from 'primereact/growl';
import UnidadMedidaService from '../../../service/UnidadMedidaService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import PncDefectoForm from './PncDefectoForm';
import PncService from '../../../service/Pnc/PncService';

class PncDefecto extends Component {

    constructor() {
        super();
        this.state = {
            idPnc: 0,
            defectos: [],
            mostrarForm: false,
            defectoSeleccionado: null,
            unidadesCatalogo: [],
            imagen: null,
            mostrarControles: true,
        }
        this.actionTemplate = this.actionTemplate.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.previewTemplate = this.previewTemplate.bind(this);

        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 5
            },
            {
                breakpoint: '768px',
                numVisible: 3
            },
            {
                breakpoint: '560px',
                numVisible: 1
            }
        ];
    }

    async componentDidMount() {
        const unidades = await UnidadMedidaService.listarActivos();

        const pnc = this.props.idPnc;
        const defectos = this.props.defectos;
        console.log(this.props);
        this.setState({
            unidadesCatalogo: unidades, idPnc: pnc, defectos: defectos, mostrarControles: this.props.mostrarControles
        });
    }

    async mostrarImagen(defecto) {
        const respuesta = await PncService.listarImagenDefecto(defecto.idImagen);
        this.setState({ imagen: [`data:${respuesta.tipo};base64,` + respuesta.base64] })
        this.galleria2.show();
    }

    async eliminarDefecto(defecto) {
        const respuesta = await PncService.eliminarDefecto(this.state.idPnc, defecto.id);
        this.growl.show({ severity: 'success', detail: 'Defecto Eliminado!' });
        this.setState({ defectos: respuesta });
    }

    itemTemplate(item) {
        return (
            <div className="p-grid p-nogutter p-justify-center">
                <img src={`${item}`} alt={item.alt} style={{ display: 'block' }} />
            </div>
        );
    }
    previewTemplate(item) {
        return <img src={`${item}`} alt={item.alt} style={{ width: '100%', display: 'block' }} />
    }

    actionTemplate(rowData, column) {
        return <div>
            {this.state.mostrarControles &&
                <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.setState({ defectoSeleccionado: rowData, mostrarForm: true })}></Button>}
            {rowData.idImagen > 0 &&
                <Button type="button" icon="pi pi-image" onClick={() => this.mostrarImagen(rowData)}></Button>
            }
            {this.state.mostrarControles &&
                <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => this.eliminarDefecto(rowData)}></Button>}
        </div>
    }

    render() {
        let header = <div className="p-clearfix" style={{ width: '100%' }}>
            {this.state.mostrarControles &&
                <Button style={{ float: 'left' }} label="Nuevo" icon="pi pi-plus" onClick={() => this.setState({ mostrarForm: true })} />
            }
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <div className='p-col-12 p-lg-12 caja' >DETALLE DEFECTOS</div>

                <DataTable value={this.state.defectos} header={header}>
                    <Column body={this.actionTemplate} style={{ width: '13%', textAlign: 'center' }} />
                    <Column field="cantidad" header="Cantidad" style={{ width: '10%', textAlign: 'center' }} sortable />
                    <Column field="unidad.nombre" header="Unidad" style={{ width: '10%', textAlign: 'center' }} sortable />
                    <Column field="ubicacion" header="Ubicación" style={{ width: '25%', textAlign: 'center' }} sortable />
                    <Column field="defecto.nombre" header="Defecto" style={{ width: '35%', textAlign: 'center' }} sortable />
                    <Column field="validez" header="Validez" style={{ width: '10%', textAlign: 'center' }} sortable />

                </DataTable>
                <PncDefectoForm mostrar={this.state.mostrarForm} idPnc={this.state.idPnc} origen={this} />
                <Galleria ref={(el) => this.galleria2 = el} value={this.state.imagen} responsiveOptions={this.responsiveOptions} numVisible={7}
                    previewItemTemplate={this.previewTemplate} thumbnailItemTemplate={this.itemTemplate} baseZIndex={1024}
                    circular={true} fullScreen={true} showPreviewNavButtons={false} showThumbnails={false} style={{ maxWidth: '850px' }} />
            </div>
        )
    }


}

export default PncDefecto;
