import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import React, { Component } from 'react'
import history from '../../../history';
import PncService from '../../../service/Pnc/PncService';
import ProductoService from '../../../service/productoService';
import SolicitudPruebasProcesoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';
import UnidadMedidaService from '../../../service/UnidadMedidaService';
import "../../site.css";
import * as _ from "lodash";
import * as moment from 'moment';
import PncDefecto from './PncDefecto';
import PncSalidaMaterial from './SalidaMaterial/PncSalidaMaterial';

class FormLectura extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            numero: null,
            fechaProduccion: null,
            fechaDeteccion: null,
            area: null,
            cantidadProducida: null,
            cantidadNoConforme: null,
            unidad: null,
            validez: null,
            pesoNoConforme: null,
            ordenProduccion: null,
            lote: null,
            hcc: null,
            procedencia: null,
            lineaAfectada: null,
            observacionCincoMs: null,
            defectos: null,
            producto: null,
            fivems: [],

            catalogoArea: null,
            unidadesCatalogo: null,
            catalogoProcedenciaLinea: null,
            catalogoLineaAfecta: null,
            productosSugeridos: [],
        }
        this.onFivemsChange = this.onFivemsChange.bind(this);


    }

    async componentDidMount() {
        const catalogAreas = await SolicitudPruebasProcesoService.listarAreas();
        const unidades = await UnidadMedidaService.listarActivos();        
        const procedenciaLinea = await PncService.obtenerProcedenciaLinea();
        const lineaAfecta = await PncService.obtenerLineaAfecta();
        this.refrescar(this.props.pnc);
        this.setState({
            catalogoArea: catalogAreas, unidadesCatalogo: unidades, catalogoProcedenciaLinea: procedenciaLinea,
            catalogoLineaAfecta: lineaAfecta
        });
    }

    async refrescar(pnc) {
        if (pnc) {
            let cincoMsValor = _.split(pnc.observacionCincoMs, ',');
            console.log(pnc)
            this.setState({
                id: pnc.id,
                numero: pnc.numero,
                fechaProduccion: moment(pnc.fechaProduccion, 'YYYY-MM-DD').toDate(),
                fechaDeteccion: moment(pnc.fechaDeteccion, 'YYYY-MM-DD').toDate(),
                area: pnc.area,
                cantidadProducida: pnc.cantidadProducida,
                cantidadNoConforme: pnc.cantidadNoConforme,
                unidad: pnc.unidad && pnc.unidad.id,
                validez: pnc.porcentajeValidez,
                pesoNoConforme: pnc.pesoNoConforme,
                ordenProduccion: pnc.ordenProduccion,
                lote: pnc.lote,
                hcc: pnc.hcc,
                procedencia: pnc.procedenciaLinea,
                lineaAfectada: pnc.lineaAfecta,
                observacionCincoMs: pnc.observacionCincoMs,
                fivems: cincoMsValor,
                producto: pnc.producto,
                defectos: pnc.defectos
            });
        }
        /* if (idPnc) {
            const pnc = await PncService.listarPorId(idPnc);
            
        } */
    }

    /* Metodo inputCheck */
    onFivemsChange(e) {
        let selectedFivems = [...this.state.fivems];
        if (e.checked)
            selectedFivems.push(e.value);
        else
            selectedFivems.splice(selectedFivems.indexOf(e.value), 1);
        this.setState({ fivems: selectedFivems });
    }


    render() {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h3 className='text-titulo'><strong>PRODUCTO NO CONFORME</strong></h3>
                <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN DE LA SOLICITUD</div>

                <div className="p-grid p-grid-responsive p-fluid">
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Fecha de Producción</label>
                        <Calendar disabled dateFormat="yy/mm/dd" value={this.state.fechaProduccion} locale={es} onChange={(e) => this.setState({ fechaProduccion: e.value })} showIcon={true} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Fecha de Detección</label>
                        <Calendar disabled dateFormat="yy/mm/dd" value={this.state.fechaDeteccion} locale={es} onChange={(e) => this.setState({ fechaDeteccion: e.value })} showIcon={true} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Área</label>
                        <Dropdown disabled optionLabel='nameArea' options={this.state.catalogoArea} value={this.state.area} autoWidth={false} onChange={(e) => this.setState({ area: e.value })} placeholder="Selecione" />
                    </div>

                    <div className='p-col-4'>
                        <label htmlFor="float-input">Nombre Producto</label>
                        <AutoComplete disabled field="nameProduct" minLength={3} placeholder="Ingrese criterio de búsqueda..." suggestions={this.state.productosSugeridos}
                            completeMethod={(e) => this.buscarProductos(e)} value={this.state.producto} onChange={(e) => this.setState({ producto: e.value })}
                        />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Cantidad Producida</label>
                        <InputText readOnly keyfilter="num" value={this.state.cantidadProducida} onChange={(e) => this.setState({ cantidadProducida: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Cantidad No Conforme</label>
                        <InputText readOnly keyfilter="num" value={this.state.cantidadNoConforme} onChange={(e) => this.setState({ cantidadNoConforme: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Unidad</label>
                        <Dropdown disabled options={this.state.unidadesCatalogo} value={this.state.unidad} autoWidth={false} onChange={(e) => this.setState({ unidad: e.value })} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Validez Producto(%)</label>
                        <InputText readOnly keyfilter="num" value={this.state.validez} onChange={(e) => this.setState({ validez: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Peso No Conforme KG</label>
                        <InputText readOnly keyfilter="num" value={this.state.pesoNoConforme} onChange={(e) => this.setState({ pesoNoConforme: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Orden de Producción</label>
                        <InputText readOnly value={this.state.ordenProduccion} onChange={(e) => this.setState({ ordenProduccion: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Lote</label>
                        <InputText readOnly value={this.state.lote} onChange={(e) => this.setState({ lote: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">HCC Traspaso Libre Utilización</label>
                        <InputText readOnly value={this.state.hcc} onChange={(e) => this.setState({ hcc: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Procedencia Línea/Cliente</label>
                        <Dropdown disabled options={this.state.catalogoProcedenciaLinea} value={this.state.procedencia} autoWidth={false} onChange={(e) => this.setState({ procedencia: e.value })} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Línea Afectada</label>
                        <Dropdown disabled options={this.state.catalogoLineaAfecta} value={this.state.lineaAfectada} autoWidth={false} onChange={(e) => this.setState({ lineaAfectada: e.value })} placeholder="Selecione" />
                    </div>

                    <label className="p-col-12 p-lg-12" htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span><strong>Observaciones 5 M's</strong></label>
                    <div className='p-col-12 p-lg-12' style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                        <div className='p-grid'>

                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb1" value="Mano de Obra" checked={this.state.fivems.indexOf('Mano de Obra') !== -1}
                                    tooltip="Mano de Obra .............." tooltipOptions={{ position: 'top' }}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mano de Obra</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb1" value="Materia Prima" checked={this.state.fivems.indexOf('Materia Prima') !== -1}
                                    tooltip="Materia Prima .............." tooltipOptions={{ position: 'top' }}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Materia Prima</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb1" value="Método" checked={this.state.fivems.indexOf('Método') !== -1}
                                    tooltip="Método .............." tooltipOptions={{ position: 'top' }}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Método</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb1" value="Medio Ambiente" checked={this.state.fivems.indexOf('Medio Ambiente') !== -1}
                                    tooltip="Medio Ambiente .............." tooltipOptions={{ position: 'top' }}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Medio Ambiente</label>
                            </div>
                            <div className="p-col-12 p-lg-4">
                                <Checkbox inputId="cb1" value="Maquinaria" checked={this.state.fivems.indexOf('Maquinaria') !== -1}
                                    tooltip="Maquinaria .............." tooltipOptions={{ position: 'top' }}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Maquinaria</label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

}

export default FormLectura;