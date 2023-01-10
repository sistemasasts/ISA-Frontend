import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'primereact/card'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'

import { CatalogoService } from '../../../service/CatalogoService';
import { formattedDate, formattedStringtoDate } from '../../../utils/FormatDate'
import { PNCSave, GetCatalogsPNC } from '../../../utils/TransactionsCalidad'
import { Growl } from 'primereact/growl'
import { connect } from 'react-redux'
import { openModal, closeModal } from '../../../store/actions/modalWaitAction'
import { Message } from 'primereact/message'
import UnidadMedidaService from '../../../service/UnidadMedidaService';

var that;
class PncForm extends Component {
    static propTypes = {
        prop: PropTypes
    }

    constructor() {
        super();
        this.state = {
            areas: [],
            procedencia: [],
            procedenciaLinea: [],
            unidadesMedida: [],
            lineaAfectada: [],
            idNCP: null,
            productName: undefined,
            source: undefined,
            productionDate: undefined,
            detectionnDate: undefined,
            batch: undefined,
            daysAntiquities: undefined,
            orderProduction: undefined,
            hccFreeUse: undefined,
            amountProduced: undefined,
            amountNonConforming: undefined,
            existingMaterial: undefined,
            unitNCP: undefined,
            exitMaterial: 0,
            validityAverage: null,
            defect: undefined,
            fivems: [],
            fiveMDescription: undefined,
            viewForm: 'none',
            viewOtherDefect: 'none',
            viewOtherOutMethod: 'none',
            viewOtherFiveM: 'none',
            area: undefined,
            outMethod: undefined,
            otherOutMethod: undefined,
            foundProduct: undefined,
            displayOutputMaterial: 'none',
            displayTablePNC: '',
            selectedPNC: null,
            exitMaterialhistorial:[],
            itemPNC: null,
            totalProducidoKg: 0,
            totalVentas: 0,
            lineaAfectadaValor: undefined,
            pesoPNCKG: undefined,
            procedenciaLineaValor: undefined,
            editForm: false,
            camposObligatorios: []

        };
        that = this;
        this.catalogoService = new CatalogoService();
        this.onDropdownChangeOrigin = this.onDropdownChangeOrigin.bind(this);
        this.onDropdownChangeUnitNCP = this.onDropdownChangeUnitNCP.bind(this);
        this.onDropdownChangeArea = this.onDropdownChangeArea.bind(this);
        this.onFivemsChange = this.onFivemsChange.bind(this);
        this.convertDataToCatalogAreas = this.convertDataToCatalogAreas.bind(this);
        this.savePNC = this.savePNC.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.validarCamposRequeridos = this.validarCamposRequeridos.bind(this);

    }

    /* =============== I N I C I O   F U N C I O N E S ======================= */
    /* Métodos ListasDesplegables */
    onDropdownChangeOrigin(event) {
        if (event.value === 'Otro') {
            this.setState({ source: event.value, viewOtherFiveM: '' });
        } else {
            this.setState({ source: event.value, viewOtherFiveM: 'none' });
        }
    }
    onDropdownChangeUnitNCP(event) {
        this.setState({ unitNCP: event.value });
    }
    onDropdownChangeArea(event) {
        this.setState({ area: event.value });
    }

    /* Metodo para lanzar mensajes */
    showMessage(message, type) {
        switch (type) {
            case 'error':
                this.growl.show({ severity: 'error', summary: 'Error', detail: message });
                break;
            case 'success':
                this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
                break;
            case 'info':
                this.growl.show({ severity: 'info', summary: 'Información', detail: message });
                break;
            default: break;
        }
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

    /* Metodo para hacer la data de combos */
    convertDataToCatalogAreas(data) {
        debugger
        var areas = [];
        data.map(function (value) {
            let newData = { label: '', value: '' }
            newData.label = value.nameArea;
            newData.value = value.idArea;
            areas.push(newData);
        })
        this.setState({ areas: areas })
    }

    /* Metodo para guardar el PNC */
    savePNC() {
        debugger;

        if (this.validarCamposRequeridos()) {
            var pncNew = {};
            pncNew.idNCP = this.state.idNCP;
            pncNew.amountNonConforming = this.state.amountNonConforming;
            pncNew.amountProduced = this.state.amountProduced;
            pncNew.validityPercent = this.state.validityAverage;
            pncNew.batch = this.state.batch;
            pncNew.dateDetection = formattedDate(this.state.detectionnDate);
            pncNew.dateProduction = formattedDate(this.state.productionDate);
            pncNew.defect = this.state.defect;

            pncNew.totalSales = this.state.totalVentas;
            pncNew.totalProductionKg = this.state.totalProducidoKg;
            pncNew.weightKg = this.state.pesoPNCKG;
            pncNew.sourceLine = this.state.procedenciaLineaValor;
            pncNew.affectedLine = this.state.lineaAfectadaValor;
            pncNew.exitMaterialH =this.state.exitMaterialhistorial;
            pncNew.existingMaterial= this.state.existingMaterial;

            pncNew.hccFreeUse = this.state.hccFreeUse;
            pncNew.orderProduction = this.state.orderProduction;
            pncNew.product = { idProduct: this.state.foundProduct.idProduct };
            pncNew.area = { idArea: this.state.area };
            pncNew.source = this.state.source;
            //pncNew.unitNCP = this.state.unitNCP;
            pncNew.unit = {id: this.state.unitNCP};
            pncNew.asUser = this.props.currentUser.nickName;
            let stringFiveMs = '';
            this.state.fivems.map(function (o) {
                stringFiveMs = stringFiveMs + o + ',';
            })
            pncNew.fiveM = stringFiveMs;
            this.props.openModal();
            PNCSave(pncNew, function (data, status, msg) {
                
                that.props.closeModal();
                switch (status) {
                    case 'OK':
                        that.showMessage(msg, 'success');
                        setTimeout(function () {
                            that.cancelar();
                        }, 2000);

                        break;
                    case 'ERROR':
                        that.showMessage(msg, 'error');
                        break;
                    default: break;
                }
            })
        }

    }

    cancelar() {
        let a = this.props.pncf;
        a.refrescarLista();
        a.setState({ editPNCFile: false, foundProduct: undefined, productName: undefined });
    }

    transformarStringAArregloCincoM(fivem) {
        let fivems = [];
        if (fivem !== null) {
            return fivem.split(',');
        }
    }

    async componentDidMount() {
        
        if (this.props.product && this.props.product !== null) {
            this.setState({ foundProduct: this.props.product })
        } else {
            this.setState({
                foundProduct: this.props.pnc.product,
                totalProducidoKg: this.props.pnc.totalProductionKg,
                totalVentas: this.props.pnc.totalSales,
                productionDate: formattedStringtoDate(this.props.pnc.dateProduction),
                detectionnDate: formattedStringtoDate(this.props.pnc.dateDetection),
                area: this.props.pnc.area && this.props.pnc.area.idArea,
                amountProduced: this.props.pnc.amountProduced,
                amountNonConforming: this.props.pnc.amountNonConforming,
                unitNCP: this.props.pnc.unit.id,
                validityAverage: this.props.pnc.validityPercent,
                pesoPNCKG: this.props.pnc.weightKg,
                orderProduction: this.props.pnc.orderProduction,
                batch: this.props.pnc.orderProduction,
                source: this.props.pnc.source,
                hccFreeUse: this.props.pnc.hccFreeUse,
                procedenciaLineaValor: this.props.pnc.sourceLine,
                lineaAfectadaValor: this.props.pnc.affectedLine,
                defect: this.props.pnc.defect,
                fivems: this.transformarStringAArregloCincoM(this.props.pnc.fiveM),
                idNCP: this.props.pnc.idNCP,
                editForm: true,
                exitMaterialhistorial: this.props.pnc.exitMaterialH,
                existingMaterial: this.props.pnc.existingMaterial
            })

        }
        GetCatalogsPNC(function (catalogo) {
            that.convertDataToCatalogAreas(catalogo.areas);
        })
        this.catalogoService.getProcedencia().then(data => this.setState({ procedencia: data }));
        this.catalogoService.getProcedenciaLinea().then(data => this.setState({ procedenciaLinea: data }));
        //this.catalogoService.getUnidadesMedida().then(data => this.setState({ unidadesMedida: data }));
        const unidades = await UnidadMedidaService.listarActivos();
        this.setState({ unidadesMedida: unidades });
        this.catalogoService.getLineaAfectada().then(data => this.setState({ lineaAfectada: data }));

    }

    validarCamposRequeridos() {
        var camposOblogatoriosDetectados = []

        if (this.state.productionDate === undefined) {
            let obj = { campo: '', obligatorio: true }
            obj.campo = 'fechaProduccion'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.defect === undefined || this.state.defect === '') {
            let obj = {}
            obj.campo = 'defectos'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.detectionnDate === undefined) {
            let obj = {}
            obj.campo = 'fechaDeteccion'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.amountProduced === undefined) {
            let obj = {}
            obj.campo = 'cantidadProducida'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }
        if (this.state.amountNonConforming === undefined) {
            let obj = {}
            obj.campo = 'cantidadPNC'; obj.obligatorio = true
            camposOblogatoriosDetectados.push(obj);
        }

        this.setState({ camposObligatorios: camposOblogatoriosDetectados })

        return camposOblogatoriosDetectados.length === 0 ? true : false;
    }

    determinarEsCampoRequerido(nombreCampo) {
        var resultado = false
        this.state.camposObligatorios.map(function (campo) {
            if (campo.campo === nombreCampo)
                resultado = true
        })

        return resultado;
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
            <div>
                <Growl ref={(el) => this.growl = el} />
                <Card >
                    <div className='p-grid  p-fluid' style={{ justifyContent: 'center' }}>
                        {!this.state.editForm && <div className='p-col-12 p-lg-12' style={{
                            justifyContent: 'center', textAlign: 'center', paddingTop: '0px', background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)',
                            borderTopColor: '#337ab7', borderLeftColor: '#337ab7', borderRightColor: '#337ab7', borderRadius: 5, borderStyle: 'solid', borderBottomColor: '#d4e157'
                        }}>
                            <br /><span style={{ fontSize: '18px', fontWeight: 'bold' }}>FORMATO DEL REGISTRO</span><br />
                            <span style={{ fontWeight: 'inherit' }}>Referencia: MP-PNC.01</span><br />
                            <span style={{ fontWeight: 'lighter' }}>Tratamiento Del Producto No Conforme</span><br />
                            <span style={{ color: '#457fca', fontSize: '18px', marginBottom: '0px' }}>{this.state.productName}</span>


                        </div>}
                        {this.state.editForm && <div className='p-col-12 p-lg-12'><h1>Edición PNC : {this.state.idNCP} / {this.state.foundProduct.nameProduct}</h1></div>}
                        <div className='p-col-12 p-lg-12' style={{ borderColor: '#337ab7', borderRadius: '8px', borderStyle: 'solid', background: '#f5f5f5' }}>

                            <div className='p-col-12 p-lg-12' style={{ background: '#ffcdd2' }}>
                                <div className='p-grid'>
                                    <label className="p-col-12 p-lg-12" htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Datos Generales</label>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Producción Total en KG/MES</label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon"><i className="pi pi-sort" /></span>
                                            <InputText keyfilter="num" placeholder='cantidad' onChange={(e) => this.setState({ totalProducidoKg: e.target.value })} value={this.state.totalProducidoKg} />
                                        </div>
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Ventas Totales</label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon"><i className="pi pi-dollar" /></span>
                                            <InputText keyfilter="money" placeholder='monto dólares' onChange={(e) => this.setState({ totalVentas: e.target.value })} value={this.state.totalVentas} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='p-col-12 p-lg-12'>
                                <div className='p-grid'>
                                    <div className='p-col-12 p-lg-4'>
                                        <label htmlFor="float-input">Fecha De Producción</label>
                                        <Calendar className={this.determinarEsCampoRequerido('fechaProduccion') && 'p-error'} dateFormat="yy/mm/dd" value={this.state.productionDate} locale={es} showIcon="true" onChange={(e) => this.setState({ productionDate: e.value })}></Calendar>
                                        {this.determinarEsCampoRequerido('fechaProduccion') &&
                                            <div style={{ marginTop: '8px' }}>
                                                <Message severity="error" text="Campo Obligatorio" />
                                            </div>
                                        }
                                    </div>
                                    <div className='p-col-12 p-lg-4'>
                                        <label htmlFor="float-input">Fecha De Detección</label>
                                        <Calendar dateFormat="yy/mm/dd" value={this.state.detectionnDate} locale={es} showIcon="true" onChange={(e) => this.setState({ detectionnDate: e.value })}></Calendar>
                                        {this.determinarEsCampoRequerido('fechaDeteccion') &&
                                            <div style={{ marginTop: '8px' }}>
                                                <Message severity="error" text="Campo Obligatorio" />
                                            </div>
                                        }
                                    </div>
                                    <div className='p-col-12 p-lg-4'>
                                        <label htmlFor="float-input">Área Involucrada</label>
                                        <Dropdown options={this.state.areas} value={this.state.area} onChange={this.onDropdownChangeArea} autoWidth={false} placeholder="Selecione" />
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Cantidad Producida</label>
                                        <InputText className={this.determinarEsCampoRequerido('cantidadProducida') && 'p-error'} placeholder='cantidad' keyfilter="num" onChange={(e) => this.setState({ amountProduced: e.target.value })} value={this.state.amountProduced} />
                                        {this.determinarEsCampoRequerido('cantidadProducida') &&
                                            <div style={{ marginTop: '8px' }}>
                                                <Message severity="error" text="Campo Obligatorio" />
                                            </div>
                                        }
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Cantidad No Conforme</label>
                                        <InputText className={this.determinarEsCampoRequerido('cantidadPNC') && 'p-error'} placeholder='cantidad' keyfilter="num" onChange={(e) => this.setState({ amountNonConforming: e.target.value })} value={this.state.amountNonConforming} />
                                        {this.determinarEsCampoRequerido('cantidadPNC') &&
                                            <div style={{ marginTop: '8px' }}>
                                                <Message severity="error" text="Campo Obligatorio" />
                                            </div>
                                        }
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Unidad</label>
                                        <Dropdown options={this.state.unidadesMedida} value={this.state.unitNCP} onChange={this.onDropdownChangeUnitNCP} autoWidth={false} placeholder="Selecione UM" />
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">% Validez P</label>
                                        <InputText value={this.state.validityAverage} onChange={(e) => this.setState({ validityAverage: e.target.value })} />
                                    </div>

                                </div>
                            </div>


                            <div className='p-col-12 p-lg-12' >
                                <div className='p-grid'>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Peso No Conforme KG </label>
                                        <InputText placeholder='peso' onChange={(e) => this.setState({ pesoPNCKG: e.target.value })} value={this.state.pesoPNCKG} />
                                    </div>

                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Orden de Producción</label>
                                        <InputText placeholder='orden' onChange={(e) => this.setState({ orderProduction: e.target.value })} value={this.state.orderProduction} />
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Lote</label>
                                        <InputText placeholder='lote' onChange={(e) => this.setState({ batch: e.target.value })} value={this.state.batch} />
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Estado/Tipo Producto</label>
                                        <Dropdown options={this.state.procedencia} value={this.state.source} onChange={this.onDropdownChangeOrigin} autoWidth={false} placeholder="Selecione" />
                                    </div>

                                </div>

                            </div>

                            <div className='p-col-12 p-lg-12'>
                                <div className='p-grid'>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">HCC Traspaso Libre Utilización</label>
                                        <InputText placeholder='codigo' onChange={(e) => this.setState({ hccFreeUse: e.target.value })} value={this.state.hccFreeUse} />
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Procedencia Línea/Cliente</label>
                                        <Dropdown options={this.state.procedenciaLinea} value={this.state.procedenciaLineaValor} onChange={event => this.setState({ procedenciaLineaValor: event.value })} autoWidth={false} placeholder="Selecione" />
                                    </div>
                                    <div className='p-col-12 p-lg-3'>
                                        <label htmlFor="float-input">Línea Afectada</label>
                                        <Dropdown options={this.state.lineaAfectada} value={this.state.lineaAfectadaValor} onChange={event => this.setState({ lineaAfectadaValor: event.value })} autoWidth={false} placeholder="Selecione" />
                                    </div>

                                </div>
                            </div>

                            <div className='p-col-12 p-lg-8'>
                                <div className='p-grid'>
                                    <label className="p-col-12 p-lg-12" htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Observaciones 5 M's</label>
                                    <div className="p-col-12 p-lg-4">
                                        <Checkbox inputId="cb1" value="Mano de Obra" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Mano de Obra') !== -1}></Checkbox>
                                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Mano de Obra</label>
                                    </div>
                                    <div className="p-col-12 p-lg-4">
                                        <Checkbox inputId="cb1" value="Materia Prima" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Materia Prima') !== -1}></Checkbox>
                                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Materia Prima</label>
                                    </div>
                                    <div className="p-col-12 p-lg-4">
                                        <Checkbox inputId="cb1" value="Método" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Método') !== -1}></Checkbox>
                                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Método</label>
                                    </div>
                                    <div className="p-col-12 p-lg-4">
                                        <Checkbox inputId="cb1" value="Medio Ambiente" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Medio Ambiente') !== -1}></Checkbox>
                                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Medio Ambiente</label>
                                    </div>
                                    <div className="p-col-12 p-lg-4">
                                        <Checkbox inputId="cb1" value="Maquinaria" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Maquinaria') !== -1}></Checkbox>
                                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Maquinaria</label>
                                    </div>
                                    <div className="p-col-12 p-lg-4">
                                        <Checkbox inputId="cb1" value="Otro" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Otro') !== -1}></Checkbox>
                                        <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="p-checkbox-label">Otro</label>
                                    </div>
                                </div>

                            </div>

                            <div className='p-col-12 p-lg-12'>
                                <label htmlFor="float-input">Defectos</label>
                                <InputTextarea className={this.determinarEsCampoRequerido('defectos') && 'p-error'} rows={3} value={this.state.defect} onChange={(e) => this.setState({ defect: e.target.value })} />
                                {this.determinarEsCampoRequerido('defectos') &&
                                    <div style={{ marginTop: '8px' }}>
                                        <Message severity="error" text="Campo Obligatorio" />
                                    </div>
                                }
                            </div>
                            <div className='p-col-12 p-lg-12' style={{ justifyContent: 'left', textAlign: 'right' }}>
                                <Button label='Guardar' icon='pi pi-save' style={{ width: '10%' }} onClick={() => this.savePNC()} />
                                <Button label='cancelar' icon='pi pi-times' style={{ width: '10%' }} className='p-button-secondary' onClick={() => this.cancelar()} />
                            </div>
                        </div>

                    </div>
                </Card>

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

export default connect(mapStateToProps, mapDispatchToProps)(PncForm)