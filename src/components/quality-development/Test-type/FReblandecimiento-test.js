import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { Dialog } from 'primereact/dialog';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

/* ============  D A T A    C A T A L O G O  S =============== */
import { desicionCMB } from '../../../global/catalogs';

/* ====================  U T I L S  ======== */
import { formattedDateAndHour, formattedStringtoDate } from '../../../utils/FormatDate';

/* ====================  T R A N S A C T I O N S ======== */
import { SaveTest, GetTestByProductIDByBatchNull } from '../../../utils/TransactionsCalidad';

/* =================== FUNCIONES HEREDADAS ============= */
import { getPropertyInformation, setnewTest } from '../TestResuts';
import { connect } from 'react-redux';

var that;
class ReblandecimientoForm extends Component {
    constructor() {
        super();
        this.state = {
            testReblandecimiento: [
                { item: 1, idProperty: '', dateLog: null, timeLog: '', batchTest: '', premixer: null, m1Ini: null, m2Ini: null, averageMP: null, m1End: null, m2End: null, resultTest: null, provider: null, prommissing: '', min: null, max: null, comment: null },
                { item: 2, idProperty: '', dateLog: null, timeLog: '', batchTest: '', premixer: null, m1Ini: null, m2Ini: null, averageMP: null, m1End: null, m2End: null, resultTest: null, provider: null, prommissing: '', min: null, max: null, comment: null },
                { item: 3, idProperty: '', dateLog: null, timeLog: '', batchTest: '', premixer: null, m1Ini: null, m2Ini: null, averageMP: null, m1End: null, m2End: null, resultTest: null, provider: null, prommissing: '', min: null, max: null, comment: null },

            ],
            dataProperty: undefined,
            userLogin: undefined,
            visibleModalP: false
        }
        that = this;
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.dateEditor = this.dateEditor.bind(this);
        this.batchEditor = this.batchEditor.bind(this);
        this.premixerEditor = this.premixerEditor.bind(this);
        this.mixerEditor = this.mixerEditor.bind(this);
        this.m1Ini = this.m1Ini.bind(this);
        this.m2Ini = this.m2Ini.bind(this);
        this.m3Ini = this.m3Ini.bind(this);
        this.m1End = this.m1End.bind(this);
        this.m2End = this.m2End.bind(this);
        this.m3End = this.m3End.bind(this);
        this.averagEditor = this.averagEditor.bind(this);
        this.providerEditor = this.providerEditor.bind(this);
        this.observationEditor = this.observationEditor.bind(this);
        this.promTemplate = this.promTemplate.bind(this);
        this.addLineData = this.addLineData.bind(this);
        this.saveData = this.saveData.bind(this);
        this.dataTratamient = this.dataTratamient.bind(this);
        this.onShowModalTest = this.onShowModalTest.bind(this);
        this.onHideModalTest = this.onHideModalTest.bind(this);
        this.setFieldsNewTest = this.setFieldsNewTest.bind(this);
    }

    /* ========================   Metodos tabla editable ===========================*/
    /* Metodo paara cambiar el valor de la dataTable */
    onEditorValueChange(props, value) {
        debugger
        let updatedTestData = this.state.testReblandecimiento;
        updatedTestData[props.rowIndex][props.field] = value;
        this.setState({ testReblandecimiento: updatedTestData });
    }
    /* Metodo para renderizar el componente Calendar junto a la Hora */
    inputDateEditor(props, field) {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        return <div className='p-fluid'><Calendar appendTo={document.body} id={props.rowIndex} dateFormat="yy/mm/dd" value={this.state.testReblandecimiento[props.rowIndex][field]} locale={es} showTime={true} onChange={(e) => this.onEditorValueChange(props, e.value)} /></div>
    }
    /* Metodo para ver el valor en la celda de la tabla Calendar y Hora */
    renderDate = (value, column) => {
        var dateAux = formattedDateAndHour(value[column.field]);
        return (
            value[column.field] instanceof Date && dateAux
        );
    };

    /* Metodo que renderiza el objeto Input */
    inputTextEditor(props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }
    /* Metodo para renderizar listas despleglables */
    inputDropDownEditor(props, field) {
        return <Dropdown value={this.state.testReblandecimiento[props.rowIndex][field]} options={desicionCMB}
            onChange={(e) => this.onEditorValueChange(props, e.value)} style={{ width: '100%' }} />

    }


    /* Metodos para editar cada uno de los campos de la tabla */
    dateEditor(props) {
        return this.inputDateEditor(props, 'dateLog');
    }
    batchEditor(props) {
        return this.inputTextEditor(props, 'batchTest');
    }
    premixerEditor(props) {
        return this.inputTextEditor(props, 'premixer');
    }
    mixerEditor(props) {
        return this.inputTextEditor(props, 'mixer');
    }
    m1Ini(props) {
        return this.inputTextEditor(props, 'm1Ini');
    }
    m2Ini(props) {
        return this.inputTextEditor(props, 'm2Ini');
    }
    m3Ini(props) {
        return this.inputTextEditor(props, 'm3Ini');
    }
    m1End(props) {
        return this.inputTextEditor(props, 'm1End');
    }
    m2End(props) {
        return this.inputTextEditor(props, 'm2End');
    }
    m3End(props) {
        return this.inputTextEditor(props, 'm3End');
    }
    observationEditor(props) {
        return this.inputTextEditor(props, 'comment');
    }
    providerEditor(props) {
        return this.inputTextEditor(props, 'provider');
    }
    averagEditor(props) {
        return this.inputDropDownEditor(props, 'prommissing');
    }
    promTemplate = (value, column) => {
        debugger;
        var mp1 = 0;
        var mp2 = 0;
        var mpa = null;
        var mm1 = 0;
        var mm2 = 0;
        var prom = null;
        var count = 0;

        switch (column.field) {
            case 'averageMP':
                if (value.m1Ini !== null) {
                    mp1 = parseFloat(value.m1Ini);
                    count = count + 1;
                }
                if (value.m2Ini !== null) {
                    mp2 = parseFloat(value.m2Ini);
                    count = count + 1;
                }
                if (count !== 0)
                    mpa = ((mp1 + mp2) / count).toFixed(2);

                this.state.testReblandecimiento[column.rowIndex][column.field] = mpa;
                if (mpa !== null)
                    return <span>{mpa}</span>;
                else
                    return null;
            case 'resultTest':
                if (value.m1End !== null) {
                    mm1 = parseFloat(value.m1End);
                    count = count + 1;
                }
                if (value.m2End !== null) {
                    mm2 = parseFloat(value.m2End);
                    count = count + 1;
                }
                if (count !== 0)
                    prom = ((mm1 + mm2) / count).toFixed(2);
                this.state.testReblandecimiento[column.rowIndex][column.field] = prom;
                if (prom !== null) {
                    if ((prom <= this.state.dataProperty.propertyMax) & (prom >= this.state.dataProperty.propertyMin))
                        return <span>{prom}</span>;
                    else
                        return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px', textAlign: 'center', fontWeight: 'bold' }}>{prom}</div>
                }
                break
            default:
                break;
        }

    }


    /* Método para Mostrar mensajes de Información */
    /* Mostrar Mensajes */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        let msg = { severity: 'success', summary: 'éxito', detail: message };
        this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
    }

    /* Metodo para aumentar un registro a la Data */
    addLineData() {
        var index = this.state.testReblandecimiento.length + 1;
        var dataTMP = this.state.testReblandecimiento;
        var registerNew = { item: index, idProperty: '', dateLog: null, timeLog: '', batchTest: '', premixer: null, m1Ini: null, m2Ini: null, averageMP: null, m1End: null, m2End: null, resultTest: null, provider: null, prommissing: '', min: this.state.dataProperty.propertyMin, max: this.state.dataProperty.propertyMax, comment: null }
        dataTMP.push(registerNew);
        this.setState({ testReblandecimiento: dataTMP });
    }
    /* Metodos para ver/ocultar PopUp  */
    onShowModalTest(event) {
        this.setState({ visibleModalP: true });
    }

    onHideModalTest(event) {
        this.setState({ visibleModalP: false });
    }

    /* Metodo para guardar la Data */
    saveData() {
        debugger
        var capturedData = this.state.testReblandecimiento;
        var property = this.state.dataProperty;
        var Test = [];
        this.setState({ visibleModalP: false });
        capturedData.forEach(function (obj) {
            if ((obj.resultTest !== null) & (parseFloat(obj.resultTest) !== 0)) {
                delete obj.item;
                obj.idProperty = property.propertyId;
                obj.dateLog = formattedDateAndHour(obj.dateLog);
                obj.sapCode = property.productsapCode;
                obj.productName = property.productName;
                obj.idProduct = property.productId;
                if ((parseFloat(obj.resultTest) >= property.propertyMin) & (parseFloat(obj.resultTest) <= property.propertyMax))
                    obj.passTest = true;
                else
                    obj.passTest = false;
                obj.owner = that.props.currentUser.idUser;
                if (obj.prommissing === 'Si')
                    obj.prommissing = true;
                else
                    obj.prommissing = false;

                Test.push(obj);
            }

        })
        if (Test.length != 0) {
            SaveTest(Test, function (data, status, msg) {
                that.dataTratamient(data);
                switch (status) {
                    case 'OK':
                        that.showSuccess(msg);
                        that.setState({ testReblandecimiento: data })
                        break;
                    case 'ERROR':
                        that.showError(msg);
                        break;
                    case 'INFO':
                        that.showError(msg);
                        break;
                    default:
                        break;
                }
            })
        } else {
            this.showError('Favor ingresar la información del formulario respectiva');
        }

    }
    /* Metodo para transformar la data y poder visulizarla */
    dataTratamient(dataTest) {
        if (dataTest != null) {
            return dataTest.map(function (obj, index) {
                obj.dateLog = formattedStringtoDate(obj.dateLog);
                if (obj.prommissing == true)
                    obj.prommissing = 'Si'
                else
                    obj.prommissing = 'No'
                obj.item = index + 1;
                console.log(obj.dateLog);
            })
        }
    }



    /* Metodo para realizar nuevo ensayo */
    setFieldsNewTest() {
        setnewTest();
    }

    componentWillMount() {
        var pp = getPropertyInformation();
        if (pp.productType === 'MATERIA_PRIMA') {
            var tt = { idProduct: pp.productId, idProperty: pp.propertyId }
            GetTestByProductIDByBatchNull(tt, function (items, status, msg) {
                if (status === 'OK') {
                    that.dataTratamient(items);
                    that.setState({ testReblandecimiento: items })
                }

            })
        }
        var addMinMax = this.state.testReblandecimiento.map(function (o) {
            o.min = pp.propertyMin;
            o.max = pp.propertyMax;

        })
        this.setState({ dataProperty: getPropertyInformation() })
    }
    componentDidMount() {
        var sesion = this.props.currentUser
        this.setState({ userLogin: sesion });
    }

    render() {
        const footer = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={() => this.saveData()} />
                <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({ visibleModalP: false })} className="p-button-danger" />
            </div>
        );
        let headerGroup = <ColumnGroup>
            <Row>
                <Column header="" rowSpan={2} style={{ width: '2%' }} />
                <Column header="Fecha" rowSpan={2} />
                <Column header="Lote" rowSpan={2} style={{ width: '7%' }} />
                <Column header="N° Premezclador" rowSpan={2} style={{ width: '6%' }} />
                <Column header="MEZCLA POLIMERIZADA" colSpan={3} style={{ width: '15%', backgroundColor: '#bbdefb' }} />
                <Column header="N° Mezclador" rowSpan={2} style={{ width: '5%' }} />
                <Column header="MÁSTICO" colSpan={3} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                <Column header="Proveedor Polímero" rowSpan={2} style={{ width: '8%' }} />
                <Column header="Especificación (°C)" colSpan={2} style={{ width: '8%', backgroundColor: '#dcedc8' }} />
                <Column header="Promediar" rowSpan={2} style={{ width: '7%' }} />
                <Column header="Observación" rowSpan={2} />
            </Row>
            <Row>
                <Column header="M1" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="M2" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="Promedio" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="M1" style={{ backgroundColor: '#dcedc8' }} />
                <Column header="M2" style={{ backgroundColor: '#dcedc8' }} />
                <Column header="Promedio" style={{ backgroundColor: '#dcedc8' }} />
                <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />
            </Row>
        </ColumnGroup>;
        return (
            <div className="p-grid">
                <Growl ref={(el) => this.growl = el} />
                <div className="p-col-12">
                    <div className="card" style={{ backgroundColor: '#457fca', justifyContent: 'center', textAlign: 'center', marginBottom: '2%' }}>
                        <h3 style={{ color: '#ffff', fontWeight: 'bold'  }}>BITÁCORA DE CONTROL PUNTO DE REBLANDECIMIENTO </h3>
                    </div>
                    <Toolbar>
                        <div className="p-toolbar-group-right">
                            <Button label="Nuevo Item" icon="pi pi-plus" onClick={this.addLineData} />
                            <Button label="Nuevo Ensayo" icon="pi pi-undo" className="p-button-warning" onClick={() => this.setFieldsNewTest()} />
                            <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={() => this.onShowModalTest()} />
                        </div>
                    </Toolbar>
                    <DataTable value={this.state.testReblandecimiento} editable={true} headerColumnGroup={headerGroup} >
                        <Column field='item' />
                        <Column field="dateLog" editor={this.dateEditor} body={this.renderDate} style={{ height: '3.5em' }} />
                        <Column field="batchTest" editor={this.batchEditor} style={{ height: '3.5em' }} />
                        <Column field="premixer" editor={this.premixerEditor} style={{ height: '3.5em' }} />
                        <Column field="m1Ini" editor={this.m1Ini} style={{ height: '3.5em', backgroundColor: '#bbdefb' }} />
                        <Column field="m2Ini" editor={this.m2Ini} style={{ height: '3.5em', backgroundColor: '#bbdefb' }} />
                        <Column field="averageMP" style={{ height: '3.5em', backgroundColor: '#bbdefb' }} body={this.promTemplate} />
                        <Column field="mixer" editor={this.mixerEditor} style={{ height: '3.5em' }} />
                        <Column field="m1End" editor={this.m1End} style={{ height: '3.5em', backgroundColor: '#dcedc8' }} />
                        <Column field="m2End" editor={this.m2End} style={{ height: '3.5em', backgroundColor: '#dcedc8' }} />
                        <Column field="resultTest" style={{ height: '3.5em' }} body={this.promTemplate} />
                        <Column field="provider" editor={this.providerEditor} style={{ height: '3.5em' }} />
                        <Column field="min" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="max" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="prommissing" editor={this.averagEditor} style={{ height: '3.5em' }} />
                        <Column field="comment" editor={this.observationEditor} style={{ height: '3.5em' }} />
                    </DataTable>
                </div>
                <Dialog header="Confirmación" visible={this.state.visibleModalP} style={{ width: '30vw' }} footer={footer} modal={true} onHide={() => this.setState({ visibleModalP: false })}>
                    Desea guardar/salvar la información ingresada ?
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps)(ReblandecimientoForm)
