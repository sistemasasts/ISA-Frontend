import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import React, { Component } from 'react'
import history from '../../../history';
import ProductoService from '../../../service/productoService';
import UnidadMedidaService from '../../../service/UnidadMedidaService';
import ReclamoMPService from '../../../service/ReclamoMPService';
import "../../site.css";
import * as _ from "lodash";
import * as moment from 'moment';
import { determinarColorPNC } from '../SolicitudEnsayo/ClasesUtilidades';
import Adjuntos from '../SolicitudEnsayo/Adjuntos';
import { CatalogoService } from '../../../service/CatalogoService';
import { tieneRol } from '../../../service/UsuarioSesionService';
import { InputSwitch } from 'primereact/inputswitch';
import { placesRMP } from '../../../global/catalogs';
import ReclamoProblema from './ReclamoProblema';
import { InputTextarea } from 'primereact/inputtextarea';

const ESTADO = 'CREADO';
const TIPO_SOLICITUD = 'RECLAMO_MP';
const ORDEN = undefined;
class ReclamoFormLectura extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            numero: null,
            dateComplaint: null,
            otherProvider: null,
            batchProvider: null,
            palletNumber: null,
            unidad: null,
            affectedProduct: null,
            place: null,
            totalAmount: null,
            affectedAmount: null,
            porcentComplaint: null,
            applyReturn: null,
            producto: null,
            problemas: [],
            detailNCP: null,
            ordenCompra: null,

            editar: true,
            estado: null,
            observacion: null,

            unidadesCatalogo: null,
            productosSugeridos: [],
            proveedoresSugeridos: [],
        }
        this.catalogoService = new CatalogoService();

    }

    async componentDidMount() {

        const unidades = await UnidadMedidaService.listarActivos();
        this.refrescar(this.props.reclamo);
        this.setState({
            unidadesCatalogo: unidades
        });
        this.catalogoService.getBodegasERP().then(data => this.setState({ catalogoBodegas: data }));
    }

    async refrescar(reclamo) {
        if (reclamo) {
            //const reclamo = await ReclamoMPService.listarPorId(id);
            if (reclamo) {
                console.log(reclamo);
                this.setState({
                    id: reclamo.id,
                    numero: reclamo.number,
                    dateComplaint: moment(reclamo.dateComplaint, 'YYYY-MM-DD').toDate(),
                    totalAmount: reclamo.totalAmount,
                    affectedAmount: reclamo.affectedAmount,
                    unidad: reclamo.unidadMedidaId,
                    porcentComplaint: reclamo.porcentComplaint,
                    place: reclamo.place,
                    affectedProduct: reclamo.affectedProduct,
                    applyReturn: reclamo.applyReturn,
                    batchProvider: reclamo.batchProvider,
                    palletNumber: reclamo.palletNumber,
                    producto: reclamo.idProduct,
                    otherProvider: reclamo.otherProvider,
                    estado: reclamo.state,
                    origen: reclamo.origen,
                    detailNCP: reclamo.detailNCP,
                    problemas: reclamo.problemas,
                    ordenCompra: reclamo.ordenCompra,
                    editar: false
                });
            }
        }
    }


    async buscarProductos(event) {
        const resultados = await ProductoService.listarPorNombreCriterio(event.query);
        this.setState({ productosSugeridos: resultados });
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
                <h3 className='text-titulo'><strong>RECLAMO DE MATERIA PRIMA </strong>
                    {this.state.id > 0 &&
                        <span className={determinarColorPNC(this.state.estado)} style={{ fontSize: '15px' }}># {this.state.numero} ({this.state.estado})</span>
                    }
                </h3>
                <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN DE LA SOLICITUD</div>

                <div className="p-grid p-grid-responsive p-fluid">

                    <div className='p-col-12 p-col-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Nombre Producto</label>
                        <AutoComplete disabled={!this.state.editar} field="nameProduct" minLength={3} placeholder="Ingrese criterio de búsqueda..." suggestions={this.state.productosSugeridos}
                            completeMethod={(e) => this.buscarProductos(e)} value={this.state.producto} onChange={(e) => this.setState({ producto: e.value })}
                        />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Fecha</label>
                        <Calendar disabled={!this.state.editar} dateFormat="yy/mm/dd" value={this.state.dateComplaint} locale={es} onChange={(e) => this.setState({ dateComplaint: e.value })} showIcon={true} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Proveedor</label>
                        <AutoComplete disabled={!this.state.editar} field="nameProduct" minLength={3} placeholder="Ingrese criterio de búsqueda..." suggestions={this.state.proveedoresSugeridos}
                            completeMethod={(e) => this.buscarProveedores(e)} value={this.state.proveedor} onChange={(e) => this.setState({ proveedor: e.value })}
                        />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Orden Compra</label>
                        <InputText readOnly={!this.state.editar} value={this.state.ordenCompra} onChange={(e) => this.setState({ ordenCompra: e.target.value })} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Lote Proveedor</label>
                        <InputText readOnly={!this.state.editar} value={this.state.batchProvider} onChange={(e) => this.setState({ batchProvider: e.target.value })} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Lote Interno</label>
                        <InputText readOnly={!this.state.editar} value={this.state.palletNumber} onChange={(e) => this.setState({ palletNumber: e.target.value })} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Unidad</label>
                        <Dropdown disabled={!this.state.editar} options={this.state.unidadesCatalogo} value={this.state.unidad} autoWidth={false} onChange={(e) => this.setState({ unidad: e.value })} placeholder="Selecione" />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Producto Afectado</label>
                        <InputText readOnly={!this.state.editar} value={this.state.affectedProduct} onChange={(e) => this.setState({ affectedProduct: e.target.value })} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Lugar</label>
                        <Dropdown disabled={!this.state.editar} value={this.state.place} options={placesRMP} autoWidth={false} onChange={(e) => this.setState({ place: e.value })} placeholder="Seleccione" />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Cantidad Total</label>
                        <InputText readOnly={!this.state.editar} keyfilter="num" value={this.state.totalAmount} onChange={(e) => this.setState({ totalAmount: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Cantidad Afectada</label>
                        <InputText readOnly={!this.state.editar} keyfilter="num" value={this.state.affectedAmount} onChange={(e) => this.setState({ affectedAmount: e.target.value })} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">PNC Reclamo</label>
                        <InputText readOnly={!this.state.editar} keyfilter="num" value={this.state.porcentComplaint} onChange={(e) => this.setState({ porcentComplaint: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Aplica Devolución</label>
                        <InputSwitch disabled={!this.state.editar} checked={this.state.applyReturn} onChange={(e) => this.setState({ applyReturn: e.value })} />
                    </div>
                    <div className="p-col-12 p-md-12">
                        <label htmlFor="float-input">Detalle No Conformidad</label>
                        <InputTextarea readOnly={!this.state.editar} rows={5} value={this.state.detailNCP} onChange={(e) => this.setState({ detailNCP: e.target.value })} />
                    </div>
                </div>
                {
                    this.state.id > 0 &&
                    <ReclamoProblema idReclamo={this.state.id} mostrarControles={this.state.editar} problemas={this.state.problemas}></ReclamoProblema>
                }

            </div >
        )
    }

}

export default ReclamoFormLectura;