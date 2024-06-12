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
import PncHistorial from '../Pnc/PncHistorial';
import ProveedorService from '../../../service/ProveedorService';
import ReclamoPlanesAccion from './ReclamoPlanesAccion';
import ReclamoAccionEjecutada from './ReclamoAccionEjecutada';
import ReclamoEnviarCorreo from './ReclamoEnviarCorreo';

const ESTADO = 'CREADO';
const TIPO_SOLICITUD = 'RECLAMO_MP';
const ORDEN = 'INGRESO';
class ReclamoForm extends Component {

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
            planesAccion: [],
            accionesEjecutadas: [],
            detailNCP: null,
            ordenCompra: null,

            editar: true,
            estado: null,
            observacion: null,

            unidadesCatalogo: null,
            productosSugeridos: [],
            proveedoresSugeridos: [],
            abrirEmail: false,
        }
        this.catalogoService = new CatalogoService();
        this.guardar = this.guardar.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.actualizar = this.actualizar.bind(this);
        this.anular = this.anular.bind(this);
        this.enviar = this.enviar.bind(this);
        this.cerrar = this.cerrar.bind(this);
        this.onSelectProducto = this.onSelectProducto.bind(this);
        this.enviarPlanesAccion = this.enviarPlanesAccion.bind(this);

    }

    async componentDidMount() {

        const unidades = await UnidadMedidaService.listarActivos();
        this.refrescar(this.props.match.params.idReclamo);
        this.setState({
            unidadesCatalogo: unidades
        });
        this.catalogoService.getBodegasERP().then(data => this.setState({ catalogoBodegas: data }));
    }

    async refrescar(id) {
        if (id) {
            const reclamo = await ReclamoMPService.listarPorId(id);
            if (reclamo) {
                console.log(reclamo);
                var proveedoresCatalogo = await this.buscarProveedor(reclamo.idProduct);
                var proveedorSeleccionado = null;
                if (reclamo.idProvider) {
                    proveedorSeleccionado = { idProvider: reclamo.idProvider, nameProvider: reclamo.nombreProveedor, descProvider: null, sapProviderCode: null, typeProvider: 'Apto' }
                }

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
                    producto: reclamo.nombreProducto,
                    otherProvider: reclamo.otherProvider,
                    estado: reclamo.state,
                    origen: reclamo.origen,
                    detailNCP: reclamo.detailNCP,
                    problemas: reclamo.problemas,
                    planesAccion: reclamo.listActionsPlanProvider,
                    accionesEjecutadas: reclamo.listExecutedActons,
                    proveedoresSugeridos: proveedoresCatalogo,
                    proveedor: proveedorSeleccionado,
                    ordenCompra: reclamo.ordenCompra,
                    editar: _.includes(['CREADA', 'REGRESADO'], reclamo.state),
                });
            }
        }
    }

    async onSelectProducto(event) {
        console.log(event)
        if (event) {
            const proveedores = await this.buscarProveedor(event.idProduct);
            console.log(proveedores)
            this.setState({ proveedoresSugeridos: proveedores });
        }
    }

    async buscarProductos(event) {
        const resultados = await ProductoService.listarPorNombreCriterio(event.query);
        this.setState({ productosSugeridos: resultados });
    }

    async buscarProveedor(productoId) {
        return await ProveedorService.listarPorProducto(productoId);
    }

    async guardar() {
        if (!this.formularioValido()) {
            this.growl.show({ severity: 'error', detail: 'Complete los campos requeridos.' });
            return false;
        }
        const solicitudCreada = await ReclamoMPService.registrar(this.crearObjSolicitud());
        this.growl.show({ severity: 'success', detail: 'Producto no conforme regsitrado!' });
        setTimeout(function () {
            history.push(`/quality-development_complaint_edit/${solicitudCreada.id}`);
        }, 1000);
    }

    cancelar() {
        history.goBack();
    }

    async actualizar() {
        if (!this.formularioValido()) {
            this.growl.show({ severity: 'error', detail: 'Complete los campos requeridos.' });
            return false;
        }
        const solicitudActualizada = await ReclamoMPService.actualizar(this.crearObjSolicitud());
        this.refrescar(solicitudActualizada.id);
        this.growl.show({ severity: 'success', detail: 'Registro Actualizado!' });
    }

    async anular() {
        if (_.isEmpty(this.state.observacion)) {
            this.growl.show({ severity: 'error', detail: 'La observación es obligaoria.' });
            return false;
        }
        const obj = {};
        obj.id = this.state.id;
        obj.observacion = this.state.observacion;
        await ReclamoMPService.anular(obj);
        this.growl.show({ severity: 'success', detail: 'Registro Anulado!' });
        setTimeout(function () {
            history.push(`/quality-development_complaint`);
        }, 1000);
    }

    async cerrar() {
        const obj = {};
        obj.id = this.state.id;
        obj.observacion = this.state.observacion;
        await ReclamoMPService.cerrar(obj);
        this.growl.show({ severity: 'success', detail: 'Reclamo cerrado!' });
        setTimeout(function () {
            history.push(`/quality-development_complaint`);
        }, 1000);
    }

    async enviar() {
        const obj = {};
        obj.id = this.state.id;
        obj.observacion = this.state.observacion;
        await ReclamoMPService.enviar(obj);
        this.growl.show({ severity: 'success', detail: 'Reclamo enviado!' });
        setTimeout(function () {
            history.push(`/quality-development_complaint`);
        }, 1000);
    }

    async enviarPlanesAccion() {
        const obj = {};
        obj.id = this.state.id;
        obj.observacion = this.state.observacion;
        await ReclamoMPService.enviarPlanesAccion(obj);
        this.refrescar(this.props.match.params.idReclamo);
        window.location.reload();
        this.growl.show({ severity: 'success', detail: 'Planes de acción enviados!' });
    }

    


    crearObjSolicitud() {
        var proveedorId = null;
        if (this.state.proveedor)
            proveedorId = this.state.proveedor.idProvider;
        return {
            id: this.state.id,
            dateComplaint: moment(this.state.dateComplaint, 'YYYY-MM-DD').toDate(),
            totalAmount: this.state.totalAmount,
            affectedAmount: this.state.affectedAmount,
            unidadMedidaId: this.state.unidad,
            porcentComplaint: this.state.porcentComplaint,
            place: this.state.place,
            affectedProduct: this.state.affectedProduct,
            applyReturn: this.state.applyReturn,
            batchProvider: this.state.batchProvider,
            palletNumber: this.state.palletNumber,
            idProduct: this.state.producto.idProduct,
            idProvider: proveedorId,
            otherProvider: this.state.otherProvider,
            detailNCP: this.state.detailNCP,
            ordenCompra: this.state.ordenCompra
        }
    }

    formularioValido() {
        var valido = true;
        if (!this.state.affectedAmount
            || !this.state.totalAmount
            || _.isEmpty(this.state.producto)

        )
            valido = false;
        return valido;
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
                            completeMethod={(e) => this.buscarProductos(e)} value={this.state.producto} onChange={(e) => this.setState({ producto: e.value })} onSelect={(e) => this.onSelectProducto(e.value)}
                        />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Fecha</label>
                        <Calendar disabled={!this.state.editar} dateFormat="yy/mm/dd" value={this.state.dateComplaint} locale={es} onChange={(e) => this.setState({ dateComplaint: e.value })} showIcon={true} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label style={{ fontWeight: 'bold' }} htmlFor="float-input">Proveedor</label>
                        {/*  <AutoComplete disabled={!this.state.editar} field="nameProduct" minLength={3} placeholder="Ingrese criterio de búsqueda..." suggestions={this.state.proveedoresSugeridos}
                            dropdown={true} value={this.state.proveedor} onChange={(e) => this.setState({ proveedor: e.value })}
                        /> */}
                        <Dropdown optionLabel="nameProvider" disabled={!this.state.editar} options={this.state.proveedoresSugeridos} value={this.state.proveedor}
                            autoWidth={false} onChange={(e) => this.setState({ proveedor: e.value })} placeholder="Selecione" showClear={true} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">Orden Compra</label>
                        <InputText readOnly={!this.state.editar} value={this.state.ordenCompra} onChange={(e) => this.setState({ordenCompra: e.target.value })} />
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
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Unidad</label>
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
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Cantidad Total</label>
                        <InputText readOnly={!this.state.editar} keyfilter="num" value={this.state.totalAmount} onChange={(e) => this.setState({ totalAmount: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-4'>
                        <span style={{ color: '#CB3234' }}>*</span><label htmlFor="float-input">Cantidad Afectada</label>
                        <InputText readOnly={!this.state.editar} keyfilter="num" value={this.state.affectedAmount} onChange={(e) => this.setState({ affectedAmount: e.target.value })} />
                    </div>

                    <div className='p-col-12 p-lg-4'>
                        <label htmlFor="float-input">PNC Reclamo</label>
                        <InputText readOnly keyfilter="num" value={this.state.porcentComplaint} onChange={(e) => this.setState({ porcentComplaint: e.target.value })} />
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
                {
                    this.state.id > 0 &&
                    <ReclamoAccionEjecutada idReclamo={this.state.id} mostrarControles={this.state.editar} problemas={this.state.accionesEjecutadas}></ReclamoAccionEjecutada>
                }
                {
                    this.state.id > 0 && this.state.estado === 'APROBADO' &&
                    <ReclamoPlanesAccion idReclamo={this.state.id} mostrarControles={true} problemas={this.state.planesAccion} proceso={'VALIDAR'} observacion={this.state.observacion}></ReclamoPlanesAccion>
                }
                <div className='p-col-12 p-lg-12 boton-opcion' >
                    {this.state.id === 0 &&
                        < div >
                            <Button style={{ marginRight: '15px' }} className="p-button" label="GUARDAR" onClick={this.guardar} />
                            <Button className="p-button-danger" label="CANCELAR" onClick={this.cancelar} />
                        </div>
                    }
                </div>
                {
                    this.state.id > 0 &&
                    <div>
                        <div className='p-grid p-grid-responsive p-fluid'>
                            <div className='p-col-12 p-lg-12 caja' >INFORMACIÓN ADICIONAL</div>
                            <div className='p-col-12 p-lg-12'>
                                <Adjuntos solicitud={this.state.id} orden={ORDEN} controles={this.state.editar} tipo={TIPO_SOLICITUD} estado={ESTADO} />
                                <PncHistorial solicitud={this.state.id} tipo={TIPO_SOLICITUD} />

                                <div className='p-col-12 p-lg-12'>
                                    <label htmlFor="float-input">OBSERVACIÓN</label>
                                    <InputTextarea value={this.state.observacion} onChange={(e) => this.setState({ observacion: e.target.value })} rows={3} />
                                </div>

                            </div>
                        </div>


                        <div className='p-col-12 p-lg-12 boton-opcion' >
                            {_.includes(['CREADA', 'REGRESADO'], this.state.estado) && !(tieneRol('JPL') || tieneRol('PL')) &&
                                <Button className="p-button" label="ACTUALIZAR" onClick={this.actualizar} />
                            }
                            {_.includes(['CREADA', 'REGRESADO'], this.state.estado) &&
                                <Button className="p-button" label="ENVIAR" onClick={this.enviar} />
                            }
                            {_.includes(['CREADA', 'REGRESADO'], this.state.estado) &&
                                <Button className="p-button-danger" label="ANULAR" onClick={this.anular} />
                            }
                            {_.includes(['APROBADO', 'CERRADO'], this.state.estado) &&
                                <Button className="p-button" label="NOTIFICAR" onClick={() => this.setState({ abrirEmail: true })} />
                            }
                            {_.includes(['APROBADO'], this.state.estado) &&
                                <Button className="p-button" label="ENVIAR PLANES DE ACCIÓN" onClick={this.enviarPlanesAccion} />
                            }
                            {_.includes(['APROBADO'], this.state.estado) &&
                                <Button className="p-button-danger" label="CERRAR" onClick={this.cerrar} />
                            }
                            <Button className="p-button-secondary" label="ATRÁS" onClick={this.cancelar} />
                        </div>
                    </div>
                }
                <ReclamoEnviarCorreo mostrar={this.state.abrirEmail} origen={this}/>
            </div >
        )
    }

}

export default ReclamoForm;