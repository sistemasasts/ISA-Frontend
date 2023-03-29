import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import { connect } from 'react-redux';
import {MultiSelect} from 'primereact/multiselect';
import history from '../../../history';
import UsuarioService from '../../../service/UsuarioService';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import "../../site.css";
import { determinarColor, determinarColorTipoAprobacion } from '../SolicitudEnsayo/ClasesUtilidades';
import * as moment from 'moment';
import { Paginator } from 'primereact/paginator';
import * as _ from "lodash";
import SolicitudPruebasProcesoService from '../../../service/SolicitudPruebaProceso/SolicitudPruebasProcesoService';

var that;
class ConsultaPrincipalPP extends Component {

    constructor() {
        super();
        this.state = {
            solicitudes: [],
            usuarios: [],
            estados: [],
            tiposAprobacion: [],
            codigo: null,
            estado: [],
            fechaInicio: null,
            fechaFin: null,
            usuarioSolicitante: null,
            usuarioAprobador: null,
            tipoAprobacion: null,
            page: 0,
            size: 10,
            first: 0,
            rows: 0,
            totalRecords: 0,
            currenPage: '',
        };
        that = this;
        this.actionTemplate = this.actionTemplate.bind(this);
        this.bodyTemplateEstado = this.bodyTemplateEstado.bind(this);
        this.bodyTemplateTipoAprobacion = this.bodyTemplateTipoAprobacion.bind(this);
        this.redirigirSolicitudEdicion = this.redirigirSolicitudEdicion.bind(this);
        this.consultar = this.consultar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    async componentDidMount() {
        const usuarios_data = await await UsuarioService.list();
        const tiposAprobacion_data = await SolicitudPruebasProcesoService.listarTiposAprobacion();
        const catalogo_estados = await SolicitudPruebasProcesoService.listarEstados();

        this.setState({
            usuarios: usuarios_data,
            tiposAprobacion: tiposAprobacion_data,
            estados: catalogo_estados
        });
    }

    redirigirSolicitudEdicion(solicitud) {
            window.open(`${window.location.origin}/#quality-development_consulta_solicitud_verspp/${solicitud.id}`)
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="fa fa-external-link-square" onClick={() => that.redirigirSolicitudEdicion(rowData)}></Button>
        </div>;
    }

    bodyTemplateEstado(rowData) {
        const estado = _.startCase(rowData.estado);
        return <span className={determinarColor(rowData.estado)}>{estado}</span>;
    }

    bodyTemplateTipoAprobacion(rowData) {
        return <span className={determinarColorTipoAprobacion(rowData.tipoAprobacionTexto)}>{rowData.tipoAprobacionTexto}</span>;
    }

    consultar() {
        this.obenerDatosConsulta(this.state.page, this.state.size);
    }

    async obenerDatosConsulta(page, size) {
        this.props.openModal();
        const solicitudesData = await SolicitudPruebasProcesoService.consultar(page, size, this.crearObj());
        this.props.closeModal();
        const currentReportAUX = `( pág. ${solicitudesData.number + 1} de ${solicitudesData.totalPages} )  Total ítems  ${solicitudesData.totalElements}`;
        this.setState({ solicitudes: solicitudesData.content, totalRecords: solicitudesData.totalElements, currenPage: currentReportAUX });
    }

    crearObj() {
        return {
            codigo: this.state.codigo,
            fechaInicio: this.state.fechaInicio && moment(this.state.fechaInicio).format("YYYY-MM-DD hh:mm:ss.SSS"),
            fechaFin: this.state.fechaFin && moment(this.state.fechaFin).format("YYYY-MM-DD hh:mm:ss.SSS"),
            tipoAprobacion: this.state.tipoAprobacion,
            nombreSolicitante: this.state.usuarioSolicitante && this.state.usuarioSolicitante.idUser,
            usuarioAprobador: this.state.usuarioAprobador && this.state.usuarioAprobador.idUser,
            estados: this.state.estado
        }
    }

    limpiar() {
        this.setState({
            tipoSolicitud: null,
            codigo: null,
            fechaInicio: null,
            fechaFin: null,
            tipoAprobacion: null,
            nombreSolicitante: null,
            usuarioAprobador: null,
            estado: [],
            solicitudes: []
        });
    }

    onPageChange(event) {
        this.obenerDatosConsulta(event.page, this.state.size);
        this.setState({
            first: event.first,
            rows: event.rows
        });
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
        const header = <div className="p-clearfix" style={{ textAlign: 'left' }}>Lista de solicitudes</div>;
        return (
            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <h1><strong>CONSULTA DE SOLICITUDES PRUEBAS EN PROCESO</strong></h1>
                <h2>Parámetros de consulta</h2>
                <div className="p-grid p-grid-responsive p-fluid">
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Código</label>
                        <InputText value={this.state.codigo} onChange={(e) => this.setState({ codigo: e.target.value })} />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Tipo Aprobación</label>
                        <Dropdown showClear options={this.state.tiposAprobacion} value={this.state.tipoAprobacion} autoWidth={false} onChange={(event => this.setState({ tipoAprobacion: event.value }))} />
                    </div>                    
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Fecha Inicio</label>
                        <Calendar dateFormat="yy/mm/dd" value={this.state.fechaInicio} locale={es} onChange={(e) => this.setState({ fechaInicio: e.value })} showIcon={true} />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Fecha Fin</label>
                        <Calendar dateFormat="yy/mm/dd" value={this.state.fechaFin} locale={es} onChange={(e) => this.setState({ fechaFin: e.value })} showIcon={true} />
                    </div>
                    <div className='p-col-12 p-lg-12'>
                        <label htmlFor="float-input">Estado Solicitud</label>
                        <MultiSelect value={this.state.estado} options={this.state.estados} onChange={(e) => this.setState({estado: e.value})} />

                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Usuario Solicitante</label>
                        <Dropdown showClear optionLabel='nickName' options={this.state.usuarios} value={this.state.usuarioSolicitante} autoWidth={false} onChange={(event => this.setState({ usuarioSolicitante: event.value }))} placeholder="Selecione" />
                    </div>
                    <div className='p-col-12 p-lg-3'>
                        <label htmlFor="float-input">Usuario Aprobador</label>
                        <Dropdown showClear optionLabel='nickName' options={this.state.usuarios} value={this.state.usuarioAprobador} autoWidth={false} onChange={(event => this.setState({ usuarioAprobador: event.value }))} placeholder="Selecione" />
                    </div>
                </div>

                <div className='p-col-12 p-lg-12 boton-opcion' >
                    <Button className="p-button-danger" label="CONSULTAR" onClick={this.consultar} />
                    <Button className='p-button-secondary' label="LIMPIAR" onClick={this.limpiar} />
                </div>

                <DataTable value={this.state.solicitudes} rows={15} responsive={true} header={header} scrollable={true}
                    selectionMode="single" onSelectionChange={e => this.setState({ selectedConfiguracion: e.value })}
                >
                    <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '4em' }} />
                    <Column field="codigo" header="Código" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="fechaCreacion2" header="Fecha Solicitud" sortable={true} style={{ textAlign: 'center', width: '10em'}} />
                    <Column field='estado' body={this.bodyTemplateEstado} header="Estado" sortable style={{ textAlign: 'center', width: '12em' }} />
                    <Column field='observacion' header="Secuencial y Motivo Prueba" sortable style={{ textAlign: 'center', width: '30em' }} />
                    <Column field="aprobadoTexto" header="Aprobado" sortable={true} style={{ textAlign: 'center', width: '10em'}}/>
                    <Column field="tipoAprobacionTexto" body={this.bodyTemplateTipoAprobacion} header="Aprobación" sortable={true} style={{ textAlign: 'center', width: '12em' }} />
                    <Column field="nombreArea" header="Área" sortable={true} style={{ textAlign: 'center', width: '15em'}}  />
                    <Column field="origenTexto" header="Tipo" sortable={true} style={{ textAlign: 'center', width: '15em'}}  />
                    <Column field="lineaAplicacion" header="Línea" sortable={true} style={{ textAlign: 'center', width: '15em'}}  />
                    <Column field="fechaEntrega" header="Fecha Entrega" sortable={true} style={{ textAlign: 'center', width: '10em' }} />
                    <Column field="requiereInformeTexto" header="Informe" sortable={true} style={{ textAlign: 'center', width: '10em'}} />
                    <Column field="fechaPrueba" header="Fecha Prueba" sortable={true} style={{ textAlign: 'center', width: '10em'}} />
                    <Column field="usuarioGestionPlanta" header="Usuario Gestión Planta" sortable={true} style={{ textAlign: 'center', width: '15em'}} />
                    <Column field="usuarioGestionCalidad" header="Usuario Gestión Calidad" sortable={true} style={{ textAlign: 'center', width: '15em'}} />
                    <Column field="usuarioGestionMantenimiento" header="Usuario Gestión MYP" sortable={true} style={{ textAlign: 'center', width: '15em'}} />
                    
                </DataTable>
                <Paginator first={this.state.first} rows={this.state.size} totalRecords={this.state.totalRecords} onPageChange={this.onPageChange}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" currentPageReportTemplate={this.state.currenPage}></Paginator>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        openModal: () => dispatch(openModal()),
        closeModal: () => dispatch(closeModal()) // will be wrapped into a dispatch call
    }

};


const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaPrincipalPP);