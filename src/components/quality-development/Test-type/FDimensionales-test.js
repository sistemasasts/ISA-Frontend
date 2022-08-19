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
import { formattedDateAndHour } from '../../../utils/FormatDate';

/* ====================  T R A N S A C T I O N S ======== */
import { SaveTest } from '../../../utils/TransactionsCalidad';

/* =================== FUNCIONES HEREDADAS ============= */
import { getPropertyInformation, setnewTest } from '../TestResuts';
import { connect } from 'react-redux';

var that;
class DimensionalesForm extends Component {
    constructor() {
        super();
        this.state = {
            testData: [
                { item: 1, idProperty: '', dateLog: null, timeLog: '', batchTest: '', m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null, prommissing: '', min: null, max: null },
            ],
            testDimensionalesData: [{
                item: 1, idProperty: '', dateLog: null, batchTest: '', minA: null, maxA: null, resultA: null, minL: null, maxL: null, resultL: null, minE: null, maxE: null, resultE: null, minPR: null, maxPR: null, resultPR: null, prommissing: '', comment: ''
            },
            {
                item: 2, idProperty: '', dateLog: null, batchTest: '', minA: null, maxA: null, resultA: null, minL: null, maxL: null, resultL: null, minE: null, maxE: null, resultE: null, minPR: null, maxPR: null, resultPR: null, prommissing: '', comment: ''
            },
            ],
            dataProperty: undefined,
            userLogin: undefined,
            visibleModalP: false,
            eLongitudMin: null,
            eLongitudMax: null,
            eAnchoMin: null,
            eAnchoMax: null,
            eEspesorMin: null,
            eEspesorMax: null,
            ePesoRolloMin: null,
            ePesoRolloMax: null,

        }
        that = this;
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.dateEditor = this.dateEditor.bind(this);
        this.batchEditor = this.batchEditor.bind(this);
        this.resultA = this.resultA.bind(this);
        this.resultL = this.resultL.bind(this);
        this.resultE = this.resultE.bind(this);
        this.resultPR = this.resultPR.bind(this);
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
        let updatedTestData = this.state.testDimensionalesData;
        updatedTestData[props.rowIndex][props.field] = value;
        this.setState({ testDimensionalesData: updatedTestData });
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
        return <Calendar id={props.rowIndex} dateFormat="yy/mm/dd" value={this.state.testDimensionalesData[props.rowIndex][field]} locale={es} showTime={true} onChange={(e) => this.onEditorValueChange(props, e.value)} />
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
        return <Dropdown value={this.state.testDimensionalesData[props.rowIndex][field]} options={desicionCMB}
            onChange={(e) => this.onEditorValueChange(props, e.value)} style={{ width: '100%' }} />

    }


    /* Metodos para editar cada uno de los campos de la tabla */
    dateEditor(props) {
        return this.inputDateEditor(props, 'dateLog');
    }
    batchEditor(props) {
        return this.inputTextEditor(props, 'batchTest');
    }
    resultL(props) {
        return this.inputTextEditor(props, 'resultL');
    }
    resultA(props) {
        return this.inputTextEditor(props, 'resultA');
    }
    resultE(props) {
        return this.inputTextEditor(props, 'resultE');
    }
    resultPR(props) {
        return this.inputTextEditor(props, 'resultPR');
    }
    observationEditor(props) {
        return this.inputTextEditor(props, 'comment');
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
            case 'resultA':
                if (value.resultA !== null) {
                    if ((value.minA <= parseFloat(value.resultA)) & (value.maxA >= parseFloat(value.resultA))) {
                        return <div style={{ fontWeight: 'bold' }}>{value.resultA}</div>
                    } else {
                        return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px', textAlign: 'center', fontWeight: 'bold' }}>{value.resultA}</div>
                    }
                } else
                    return null;
            case 'resultL':
                if (value.resultL !== null) {
                    if ((value.minL <= parseFloat(value.resultL)) & (value.maxL >= parseFloat(value.resultL))) {
                        return <div style={{ fontWeight: 'bold' }}>{value.resultL}</div>
                    } else {
                        return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px', textAlign: 'center', fontWeight: 'bold' }}>{value.resultL}</div>
                    }
                } else
                    return null;
            case 'resultE':
                if (value.resultE !== null) {
                    if ((value.minE <= parseFloat(value.resultE)) & (value.maxE >= parseFloat(value.resultE))) {
                        return <div style={{ fontWeight: 'bold' }}>{value.resultE}</div>
                    } else {
                        return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px', textAlign: 'center', fontWeight: 'bold' }}>{value.resultE}</div>
                    }
                } else
                    return null;
            case 'resultPR':
                if (value.resultPR !== null) {
                    if ((value.minPR <= parseFloat(value.resultPR)) & (value.maxPR >= parseFloat(value.resultPR))) {
                        return <div style={{ fontWeight: 'bold' }}>{value.resultPR}</div>
                    } else {
                        return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px', textAlign: 'center', fontWeight: 'bold' }}>{value.resultPR}</div>
                    }
                } else
                    return null;
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
        this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
    }

    /* Metodo para aumentar un registro a la Data */
    addLineData() {
        var index = this.state.testDimensionalesData.length + 1;
        var dataTMP = this.state.testDimensionalesData;
        var registerNew = {
            item: index, idProperty: '', dateLog: null, batchTest: '', minA: this.state.eAnchoMin, maxA: this.state.eAnchoMax, resultA: null, minL: this.state.eLongitudMin, maxL: this.state.eLongitudMax, resultL: null, minE: this.state.eEspesorMin, maxE: this.state.eEspesorMax, resultE: null,
            minPR: this.state.ePesoRolloMin, maxPR: this.state.ePesoRolloMax, resultPR: null, prommissing: '', comment: ''
        }
        dataTMP.push(registerNew);
        this.setState({ testDimensionalesData: dataTMP });
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
        var capturedData = this.state.testDimensionalesData;
        var property = this.state.dataProperty;
        var Test = [];
        this.setState({ visibleModalP: false });

        capturedData.forEach(function (o) {
            if ((o.resultA !== null) & (o.resultE !== null) & (o.resultL !== null) & (o.resultPR !== null)) {
                var testTMP = { idProperty: '', dateLog: null, timeLog: '', batchTest: '', resultTest: null, prommissing: '', min: null, max: null };
                testTMP.idProperty = 'PROP_10';
                testTMP.dateLog = formattedDateAndHour(o.dateLog);
                testTMP.batchTest = o.batchTest;
                testTMP.resultTest = o.resultA;
                testTMP.min = o.minA;
                testTMP.max = o.maxA;
                testTMP.idTest = o.idTestA;
                Test.push(testTMP);
                testTMP = {};
                testTMP.idProperty = 'PROP_11';
                testTMP.dateLog = formattedDateAndHour(o.dateLog);
                testTMP.batchTest = o.batchTest;
                testTMP.resultTest = o.resultL;
                testTMP.min = o.minL;
                testTMP.max = o.maxL;
                testTMP.idTest = o.idTestL;
                Test.push(testTMP);
                testTMP = {};
                testTMP.idProperty = 'PROP_12';
                testTMP.dateLog = formattedDateAndHour(o.dateLog);
                testTMP.batchTest = o.batchTest;
                testTMP.resultTest = o.resultE;
                testTMP.min = o.minE;
                testTMP.max = o.maxE;
                testTMP.idTest = o.idTestE;
                Test.push(testTMP);
                testTMP = {};
                testTMP.idProperty = 'PROP_13';
                testTMP.dateLog = formattedDateAndHour(o.dateLog);
                testTMP.batchTest = o.batchTest;
                testTMP.resultTest = o.resultPR;
                testTMP.min = o.minPR;
                testTMP.max = o.maxPR;
                testTMP.idTest = o.idTestPR;
                Test.push(testTMP);
            }
        })
        if (Test.length !== 0) {
            Test.map(function (x) {
                x.sapCode = property.sapCode;
                x.productName = property.nameProduct;
                x.idProduct = property.idProduct;
                if ((parseFloat(x.resultTest) >= parseFloat(x.min)) & (parseFloat(x.resultTest) <= parseFloat(x.max))) {
                    x.passTest = true;
                    x.prommissing = true;
                } else {
                    x.passTest = false;
                    x.prommissing = true;
                }
                x.owner = that.props.currentUser.idUser;
            })
            SaveTest(Test, function (data, status, msg) {
                switch (status) {
                    case 'OK':
                        console.log(data)
                        that.showSuccess(msg);
                        that.dataTratamient(data);
                        that.setState({ testPesoAreaData: data })
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
        var dataMap = this.state.testDimensionalesData;
        if (dataTest != null) {
            dataMap.map(function (o) {
                dataTest.map(function (x) {
                    if (x.batchTest == o.batchTest) {
                        switch (x.idProperty) {
                            case 'PROP_10':
                                o.idTestA = x.idTest
                                break;
                            case 'PROP_11':
                                o.idTestL = x.idTest
                                break;
                            case 'PROP_12':
                                o.idTestE = x.idTest
                                break;
                            case 'PROP_13':
                                o.idTestPR = x.idTest
                                break;
                            default: break;
                        }
                    }
                })
            })

            this.setState({ testDimensionalesData: dataMap })
        }
    }



    /* Metodo para realizar nuevo ensayo */
    setFieldsNewTest() {
        setnewTest();
    }

    componentWillMount() {
        var pp = getPropertyInformation();
        if (pp !== null) {
            pp.properties.map(function (obj) {
                switch (obj.propertyList.idProperty) {
                    case 'PROP_10':
                        that.state.eAnchoMin = obj.minProperty;
                        that.state.eAnchoMax = obj.maxProperty;
                        break;
                    case 'PROP_11':
                        that.state.eLongitudMin = obj.minProperty;
                        that.state.eLongitudMax = obj.maxProperty;
                        break;
                    case 'PROP_12':
                        that.state.eEspesorMin = obj.minProperty;
                        that.state.eEspesorMax = obj.maxProperty;
                        break;
                    case 'PROP_13':
                        that.state.ePesoRolloMin = obj.minProperty;
                        that.state.ePesoRolloMax = obj.maxProperty;
                        break;
                    default:
                        break;
                }
            })
            this.state.testDimensionalesData.map(function (obj) {
                obj.minL = that.state.eLongitudMin;
                obj.maxL = that.state.eLongitudMax;
                obj.minA = that.state.eAnchoMin;
                obj.maxA = that.state.eAnchoMax;
                obj.minE = that.state.eEspesorMin;
                obj.maxE = that.state.eEspesorMax;
                obj.minPR = that.state.ePesoRolloMin;
                obj.maxPR = that.state.ePesoRolloMax;
            })
            this.setState({ dataProperty: pp })
        }
    }
    componentDidMount() {
        /* var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion }); */
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
                <Column header="Especificación (m)" colSpan={2} style={{ width: '10%', backgroundColor: '#bbdefb' }} />
                <Column header="LONGITUD" rowSpan={2} style={{ width: '6%', backgroundColor: '#bbdefb' }} />
                <Column header="Especificación (cm)" colSpan={2} style={{ width: '10%', backgroundColor: '#dcedc8' }} />
                <Column header="ANCHO" rowSpan={2} style={{ width: '6%', backgroundColor: '#dcedc8' }} />
                <Column header="Especificación (mm)" colSpan={2} style={{ width: '10%', backgroundColor: '#bbdefb' }} />
                <Column header="ESPESOR" rowSpan={2} style={{ width: '6%', backgroundColor: '#bbdefb' }} />
                <Column header="Especificación (Kg)" colSpan={2} style={{ width: '10%', backgroundColor: '#dcedc8' }} />
                <Column header="PESO ROLLO" rowSpan={2} style={{ width: '6%', backgroundColor: '#dcedc8' }} />
                <Column header="Observación" rowSpan={2} style={{ width: '15%' }} />
            </Row>
            <Row>
                <Column header="MIN" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="MAX" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />
                <Column header="MIN" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="MAX" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />

            </Row>
        </ColumnGroup>;
        return (
            <div className="p-grid">
                <Growl ref={(el) => this.growl = el} />
                <div className="p-col-12">
                    <div className="card" style={{ backgroundColor: '#457fca', justifyContent: 'center', textAlign: 'center',  marginBottom: '2%' }}>
                        <h3 style={{ color: '#ffff', fontWeight: 'bold' }}>BITÁCORA DE CONTROL PROPIEDADES DIMENSIONALES </h3>
                    </div>
                    <Toolbar>
                        <div className="p-toolbar-group-right">
                            <Button label="Nuevo Item" icon="pi pi-plus" onClick={this.addLineData} />
                            <Button label="Nuevo Ensayo" icon="pi pi-undo" className="p-button-warning" onClick={() => this.setFieldsNewTest()} />
                            <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={() => this.onShowModalTest()} />
                        </div>
                    </Toolbar>
                    <DataTable value={this.state.testDimensionalesData} editable={true} headerColumnGroup={headerGroup}>
                        <Column field='item' />
                        <Column field="dateLog" editor={this.dateEditor} body={this.renderDate} style={{ height: '3.5em' }} />
                        <Column field="batchTest" editor={this.batchEditor} style={{ height: '3.5em' }} />
                        <Column field="minL" style={{ height: '3.5em', width: '3%', backgroundColor: '#bbdefb' }} />
                        <Column field="maxL" style={{ height: '3.5em', width: '3%', backgroundColor: '#bbdefb' }} />
                        <Column field="resultL" editor={this.resultL} style={{ height: '3.5em', backgroundColor: '#bbdefb' }} body={this.promTemplate} />
                        <Column field="minA" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="maxA" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="resultA" editor={this.resultA} style={{ height: '3.5em', backgroundColor: '#dcedc8' }} body={this.promTemplate} />
                        <Column field="minE" style={{ height: '3.5em', width: '3%', backgroundColor: '#bbdefb' }} />
                        <Column field="maxE" style={{ height: '3.5em', width: '3%', backgroundColor: '#bbdefb' }} />
                        <Column field="resultE" editor={this.resultE} style={{ height: '3.5em', backgroundColor: '#bbdefb' }} body={this.promTemplate} />
                        <Column field="minPR" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="maxPR" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="resultPR" editor={this.resultPR} style={{ height: '3.5em', backgroundColor: '#dcedc8' }} body={this.promTemplate} />
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

export default connect(mapStateToProps)(DimensionalesForm)