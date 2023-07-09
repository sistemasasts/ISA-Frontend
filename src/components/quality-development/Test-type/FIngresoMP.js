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
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import { DataView } from 'primereact/dataview';
import { TabView, TabPanel } from 'primereact/tabview';
import { ToggleButton } from 'primereact/togglebutton';
import { Card } from 'primereact/card';
import { RadioButton } from 'primereact/radiobutton';

/* ============  D A T A    C A T A L O G O  S =============== */
import { mpEntry, placesRMP, unidadesMedida } from '../../../global/catalogs';

/* ====================  U T I L S  ======== */
import { formattedDateAndHour } from '../../../utils/FormatDate';

/* ====================  T R A N S A C T I O N S ======== */
import { SaveTest, GetTestBatchAndIpProduct, SaveComplaintRMP } from '../../../utils/TransactionsCalidad';

/* =================== FUNCIONES HEREDADAS ============= */
import { getPropertyInformation, getProductFound, setnewTest, getProviders } from '../TestResuts';
import { connect } from 'react-redux';
import ConfigEntryMPServices from '../../../service/ConfigEntryMPServices';
import _ from 'lodash';

var DataResult = {};
var that;
class IngresoMPForm extends Component {
    constructor() {
        super();
        this.state = {
            dataProductProperties: null,
            dataProduct: null,
            dynamicData: [],
            headerForm: null,
            dynamicObjects: null,
            date: new Date(),
            provider: null,
            providersGot: [],
            dataPV: [],
            flagForm: null, //varible para determinar que formulario estamos renderizando.
            visibleModalP: false,
            visibleModalEditar: false,
            batchFound: null,
            batchEnter: null,
            testsGot: null, //variable para guardar los test guardados
            userLogin: null,
            dataTableTest: null,//variable para tabla editar lote
            batchUpdate: null,
            checkProductMP: false,
            visibleModalRMP: false,
            dateRMP: null, //desde aqui empiezan las variables de Reclamo de Materia Prima
            batchProvider: null,
            palletNumber: null,
            unit: null,
            affectProduct: null,
            place: null,
            totalAm: null,
            affectAm: null,
            porcentPNC: null,
            nameProductRMP: null,
            returnApply: null, // finaliza variales de Reclamo de Materia Prima,

        }
        that = this;
        this.buildDataForm = this.buildDataForm.bind(this);
        this.headerColumns = this.headerColumns.bind(this);
        this.getDataMatchPropertiesAndCatalogForm = this.getDataMatchPropertiesAndCatalogForm.bind(this);
        this.inputTextEditor = this.inputTextEditor.bind(this);
        this.editorField = this.editorField.bind(this);
        this.onEditorValueChange = this.onEditorValueChange.bind(this);
        this.themeColumn = this.themeColumn.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.setFieldsNewTest = this.setFieldsNewTest.bind(this);
        this.onProviderChange = this.onProviderChange.bind(this);
        this.saveDataTest = this.saveDataTest.bind(this);
        this.onShowModalTest = this.onShowModalTest.bind(this);
        this.onHideModalTest = this.onHideModalTest.bind(this);
        this.findTests = this.findTests.bind(this);
        this.showModalEditar = this.showModalEditar.bind(this);
        this.updateDataTest = this.updateDataTest.bind(this);
        this.onPlaceChange = this.onPlaceChange.bind(this);
        this.onUnitChange = this.onUnitChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.dataMergeNP = this.dataMergeNP.bind(this);
        this.saveComplaintMP = this.saveComplaintMP.bind(this);
    }

    /* Método para Mostrar mensajes de Información */
    /* Mostrar Mensajes */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
    }
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
            default:
                break;
        }

    }

    /* Metodo para realizar nuevo ensayo */
    setFieldsNewTest() {
        setnewTest();
    }

    /* Metodos para ver/ocultar PopUp  */
    onShowModalTest(event) {
        this.setState({ visibleModalP: true });
    }

    onHideModalTest(event) {
        this.setState({ visibleModalP: false });
    }

    /* Metodo para cambiar la lista desplegable */
    /* Proveedor */
    onProviderChange(e) {
        this.setState({ provider: e.value });
    }

    /* Unidad */
    onUnitChange(e) {
        this.setState({ unit: e.value });
    }
    /* Lugar */
    onPlaceChange(e) {
        this.setState({ place: e.value });
    }
    /* Metodo para RadioButton */
    /* Aplica Devolucion */
    onRadioChange(event) {

        this.setState({ returnApply: event.value })
    }

    /* Metodo paara cambiar el valor de la dataTable */
    onEditorValueChange(props, value) {
        let updatedTestData = this.state.dynamicData;
        updatedTestData[props.rowIndex][props.field] = value;
        this.setState({ dynamicData: updatedTestData });
    }

    /* Metodo que renderiza el objeto Input */
    inputTextEditor(props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }

    /* Metodos para editar cada uno de los campos de la tabla */
    editorField(props) {
        return this.inputTextEditor(props, props.field);
    }
    /* Método que personalización a la columna */
    themeColumn = (value, column) => {
        var m1 = 0;
        var m2 = 0;
        var m3 = 0;
        var count = 0;
        var prom = null;
        switch (column.field) {
            case 'resultTest':
                if (value.m1Ini !== null) {
                    m1 = parseFloat(value.m1Ini);
                    count = count + 1;
                }
                if (value.m2Ini !== null) {
                    m2 = parseFloat(value.m2Ini);
                    count = count + 1;
                }
                if ((value.m3Ini !== null) && (value.m3Ini !== undefined)) {
                    m3 = parseFloat(value.m3Ini);
                    count = count + 1;
                }
                if (this.state.flagForm === 'Cargas Minerales') {
                    if (count !== 0)
                        prom = Math.abs((m1 - m2).toFixed(2));
                    this.state.dynamicData[column.rowIndex][column.field] = prom;
                } else {
                    if (count !== 0)
                        prom = ((m1 + m2 + m3) / count).toFixed(2);
                    this.state.dynamicData[column.rowIndex][column.field] = prom;
                }


                if (prom !== null) {
                    if ((prom <= value.max) & (prom >= value.min))
                        return <span>{prom}</span>;
                    else
                        return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px', textAlign: 'center', fontWeight: 'bold' }}>{prom}</div>
                }
                break;
            default:
                break;
        }
    }

    /* Método que construye las columnas para la data de la tabla  */
    templateColumns(dataOBJ) {
        var generateColumns = [];
        Object.keys(dataOBJ[0]).map(function (o) {
            if (o !== 'idProperty') {
                if ((o === 'caracteristica') || (o === 'min') || (o === 'max') || (o === 'unit')) {
                    generateColumns.push(
                        <Column field={o} style={{ height: '3.5em' }} />
                    )
                } else if (o === 'resultTest') {
                    generateColumns.push(
                        <Column field={o} style={{ height: '3.5em' }} body={that.themeColumn} />
                    )

                } else {
                    generateColumns.push(
                        <Column field={o} style={{ height: '3.5em' }} editor={that.editorField} />
                    )
                }
            }
        });
        return generateColumns;
    }

    /* Método que devuelve la cabecera de la tabla, depende del formulario */
    headerColumns(idForm) {
        if (idForm === 'Cargas Minerales') {
            return (<ColumnGroup>
                <Row>
                    <Column header="Característica" rowSpan={2} />
                    <Column header="Unidades" rowSpan={2} style={{ width: '10%' }} />
                    <Column header="Especificaciones" colSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                    <Column header="Mediciones" colSpan={2} style={{ width: '40%', backgroundColor: '#bbdefb' }} />
                    <Column header="Resultado" rowSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                </Row>
                <Row>
                    <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="M1" style={{ backgroundColor: '#bbdefb' }} />
                    <Column header="M2" style={{ backgroundColor: '#bbdefb' }} />
                </Row>
            </ColumnGroup>);

        } else {
            return (<ColumnGroup>
                <Row>
                    <Column header="Característica" rowSpan={2} />
                    <Column header="Unidades" rowSpan={2} style={{ width: '10%' }} />
                    <Column header="Especificaciones" colSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                    <Column header="Mediciones" colSpan={3} style={{ width: '40%', backgroundColor: '#bbdefb' }} />
                    <Column header="Resultado" rowSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                </Row>
                <Row>
                    <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="M1" style={{ backgroundColor: '#bbdefb' }} />
                    <Column header="M2" style={{ backgroundColor: '#bbdefb' }} />
                    <Column header="M3" style={{ backgroundColor: '#bbdefb' }} />
                </Row>
            </ColumnGroup>);
        }

    }

    /* Método que devuelve la data final de la Table haciendo Match entre Propiedades del producto y las del formulario */
    async getDataMatchPropertiesAndCatalogForm(dataProduct, valueName) {
        try {
            var data = [];
            var dPV = [];
            const configurations = await ConfigEntryMPServices.listOnlyPropertiesByProductTypeText(dataProduct.typeProductTxt);
            if (configurations === null) {
                console.log('Configuraciones no encontradas');
                return false;
            }

            _.forEach(dataProduct.propiedades, (x) => {
                if (_.some(configurations, { idProperty: x.propertyList.idProperty })) {
                    const datForm = {};
                    if (x.typeProperty === 'T') {
                        datForm.caracteristica = x.propertyList.nameProperty;
                        datForm.idProperty = x.propertyList.idProperty;
                        datForm.unit = x.unitProperty;
                        datForm.min = x.minProperty;
                        datForm.max = x.maxProperty;
                        datForm.m1Ini = null;
                        datForm.m2Ini = null;
                        if (dataProduct.typeProductTxt !== 'Cargas Minerales')
                            datForm.m3Ini = null;
                        datForm.resultTest = null;
                        data.push(datForm);
                    } else {
                        var pvO = { idProperty: null, caracteristica: null, test_result_view: null }
                        pvO.caracteristica = x.propertyList.nameProperty;
                        pvO.idProperty = x.propertyList.idProperty;
                        dPV.push(pvO);
                    }

                }
            })

            this.state.dataPV = dPV;
            return data;
        } catch (e) {
            console.log(e);
        }
    }
    /* Método que captura el valor de InputText del DataList */
    onWriting(e, id) {
        DataResult[id] = e.target.value;
        this.setState({ reloadTextInput: true });
    }

    /* Método para crear los componentes del Datalista para las propiedades Visibles */
    propertyTemplateDL(prop) {
        return (
            prop && <div className="p-grid p-fluid" style={{ padding: '1em' }}>
                <div className="p-col-12 p-md-2" >
                    {prop.caracteristica}
                </div>

                <div className="p-col-12 p-md-6 ">
                    <InputText placeholder='Resultado' value={DataResult[prop.idProperty] ? DataResult[prop.idProperty] : ''} onChange={(e) => this.onWriting(e, prop.idProperty)} />
                </div>
            </div>
        );
    }

    /* Método que construye el formulario para cada tipo de producto */
    async buildDataForm(dataProduct) {
        if (dataProduct !== null) {

            if (dataProduct.typeProductTxt !== null) {
                var header = that.headerColumns(dataProduct.typeProductTxt);
                var data = await this.getDataMatchPropertiesAndCatalogForm(dataProduct, dataProduct.typeProductTxt);
                console.log(data);
                var dF = that.templateColumns(data);
                that.setState({ headerForm: header, dynamicData: data, dynamicObjects: dF, flagForm: dataProduct.typeProductTxt });

            } else {
                //that.showError('Producto no mapeado \n contacte al Administrador');
                console.log('Error nombre')
            }

        } else {
            console.log('Data no encontrada')
        }
    }

    /* Método para hacer merg entre data guardada con nombres de las propiedades */
    dataMergeNP(data, nUP) {
        if (data != null) {
            data.map(function (d) {
                nUP.map(function (x) {
                    if (x.id === d.idProperty) {
                        d.caracteristica = x.name;
                        d.unit = x.unit;
                    }
                })
            })
        }
    }

    /* Método para guardar la data del TEST */
    saveDataTest() {
        var objAUX = this.state.dynamicData;
        var nameUnitProperty = [];
        var dataSend = [];
        var objPV = DataResult;
        objAUX.map(function (obj) {
            if (obj.testResult !== null) {
                obj.idProvider = that.state.provider;
                obj.dateLog = formattedDateAndHour(that.state.date);
                obj.sapCode = that.state.dataProduct.sapCode;
                obj.productName = that.state.dataProduct.nameProduct;
                obj.idProduct = that.state.dataProduct.idProduct;
                obj.batchTest = that.state.batchEnter;
                obj.owner = that.state.userLogin.idUser;
                obj.prommissing = true;
                let nu = { name: null, unit: null, id: null };
                nu.name = obj.caracteristica;
                nu.unit = obj.unit;
                nu.id = obj.idProperty;
                nameUnitProperty.push(nu);
                delete obj.caracteristica;
                delete obj.unit;
                dataSend.push(obj);
            }
        })

        if (Object.entries(objPV).length !== 0) {
            Object.keys(objPV).map(function (o) {
                var oAux = { idProperty: null, test_result_view: null };
                oAux.idProperty = o;
                oAux.test_result_view = objPV[o];
                oAux.idProvider = that.state.provider;
                oAux.dateLog = formattedDateAndHour(that.state.date);
                oAux.sapCode = that.state.dataProduct.sapCode;
                oAux.productName = that.state.dataProduct.nameProduct;
                oAux.idProduct = that.state.dataProduct.idProduct;
                oAux.batchTest = that.state.batchEnter;
                oAux.prommissing = true;
                oAux.owner = that.state.userLogin.idUser;
                dataSend.push(oAux);
            })

        }
        if (dataSend.length !== 0) {
            SaveTest(dataSend, function (data, status, msg) {
                switch (status) {
                    case 'OK':
                        that.showMessage(msg, 'success');
                        that.dataMergeNP(data, nameUnitProperty);
                        that.buildDataForm(that.state.dataProductProperties);
                        if (that.state.checkProductMP) {
                            that.setState({ testsGot: data, visibleModalP: false });
                        } else {
                            var npD = that.state.dataProduct.nameProduct;
                            var up = that.state.dataProduct.unit;
                            var d = that.state.date;
                            that.setState({ testsGot: data, visibleModalP: false, visibleModalRMP: true, dateRMP: d, nameProductRMP: npD, unit: up });
                        }
                        break;
                    case 'ERROR':
                        that.showMessage(msg, 'error');
                        that.setState({ visibleModalP: false });
                        break;
                    default:
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        } else {
            that.showMessage('Ingrese los datos solicitados', 'error');
        }
    }

    /* Metodo para acutlizar el lote de los test cosultados */
    updateDataTest() {
        if (this.state.batchUpdate !== null) {
            this.state.testsGot.map(function (obj) {
                obj.batchTest = that.state.batchUpdate;
            })
            SaveTest(this.state.testsGot, function (data, status, msg) {
                switch (status) {
                    case 'OK':
                        that.showMessage(msg, 'success');
                        var aux = [];
                        aux.push(data[0]);
                        that.setState({ testsGot: data, dataTableTest: aux, visibleModalEditar: false, batchUpdate: null });
                        break;
                    case 'ERROR':
                        that.showMessage(msg, 'error');
                        break;
                    default:
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        } else {
            this.showMessage('Ingrese el número de Lote', 'error');
        }

    }


    /* Metodo para conusltar a la BBDD los test por lote y productoID */
    findTests() {
        var testTMP = { batchTest: null, idProduct: null };
        if (this.state.batchFound !== null) {
            testTMP.batchTest = this.state.batchFound;
            testTMP.idProduct = this.state.dataProduct.idProduct;
            GetTestBatchAndIpProduct(testTMP, function (data, status, msg) {
                switch (status) {
                    case 'OK':
                        that.showMessage(msg, 'success');
                        var aux = [];
                        aux.push(data[0]);
                        that.setState({ testsGot: data, dataTableTest: aux });
                        break;
                    case 'ERROR':
                        that.showMessage(msg, 'error');
                        break;
                    default:
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        } else {
            that.showMessage('Ingrese el número de lote', 'error');
        }
    }

    /* Metodo para guardar el Reclamo Materia Prima */
    saveComplaintMP() {
        var comp = {
            idProduct: null, idProvider: null, batchProvider: null, palletNumber: null, affectedProduct: null, affectedProduct: null, totalAmount: null, place: null, dateComplaint: null,
            applyReturn: null, porcentComplaint: null, asUser: null, state: null, listProblems: []
        };
        comp.idProduct = this.state.dataProduct.idProduct;
        comp.idProvider = this.state.provider;
        comp.place = this.state.place;
        comp.unitP = this.state.unit;
        comp.batchProvider = this.state.batchProvider;
        comp.palletNumber = this.state.palletNumber;
        comp.affectedAmount = this.state.affectAm;
        comp.affectedProduct = this.state.affectProduct
        comp.totalAmount = this.state.totalAm;
        comp.dateComplaint = formattedDateAndHour(this.state.dateRMP);
        if (this.state.returnApply === 'SI')
            comp.applyReturn = 1;
        else
            comp.applyReturn = 0;
        comp.porcentComplaint = this.state.porcentPNC;
        comp.asUser = this.state.userLogin.idUser;
        comp.state = 'Abierto';
        SaveComplaintRMP(comp, function (data, status, msg) {
            switch (status) {
                case 'OK':
                    that.showMessage(msg, 'success');
                    that.setState({ visibleModalRMP: false });
                    break;
                case 'ERROR':
                    that.showMessage(msg, 'error');
                    break;
                default:
                    that.showMessage(msg, 'info');
                    break;
            }
        })


    }

    /* Metodo para crear template de la tabla */
    actionTemplate(rowData, column) {
        return (<div>
            <Button type="button" icon='pi pi-pencil' style={{ width: '20%' }} className="p-button-success" onClick={() => that.showModalEditar()}></Button>
        </div>);
    }

    showModalEditar() {
        this.setState({ visibleModalEditar: true });
    }

    componentWillMount() {
        var pp = getPropertyInformation();
        var productoF = getProductFound();
        var providersFound = getProviders();
        console.log(productoF);
        this.setState({ dataProductProperties: pp, dataProduct: productoF, providersGot: providersFound });
        this.buildDataForm(pp);
    }

    componentDidMount() {

        this.setState({ userLogin: this.props.currentUser });
    }

    render() {
        const footer = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={() => this.saveDataTest()} />
                <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({ visibleModalP: false })} className="p-button-danger" />
            </div>
        );
        const footerEditar = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={() => this.updateDataTest()} />
                <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({ visibleModalEditar: false })} className="p-button-danger" />
            </div>
        );
        const footerRMP = (
            <div>
                <Button label="Omitir" icon="fa fa-arrow-right" className="p-button-warning" onClick={() => this.saveComplaintMP()} />
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={() => this.saveComplaintMP()} />
            </div>
        );
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        return (
            <div className="p-grid" >
                <Growl ref={(el) => this.growl = el} />
                <div className="p-col-12" style={{ paddingTop: 0 }}>
                    <div className="card" style={{ backgroundColor: '#457fca', justifyContent: 'center', textAlign: 'center', marginBottom: '1%' }}>
                        <h3 style={{ color: '#ffff', fontWeight: 'bold' }}>BITÁCORA INGRESO MATERIA PRIMA </h3>
                    </div>
                    <TabView style={{ marginBottom: '10px' }}>
                        <TabPanel header="Consultas" leftIcon="fa fa-list">
                            <div className="card" style={{ backgroundColor: '#ECEFF1' }}>
                                <div className="p-grid  p-fluid">

                                    <div className="p-col-1" style={{ fontWeight: 'bold' }}><label htmlFor="year">Lote Ensayo</label></div>
                                    <div className="p-col-4" >
                                        <InputText placeholder='20200810' value={this.state.batchFound} onChange={(e) => this.setState({ batchFound: e.target.value })} />
                                    </div>
                                    <div className="p-col-1" >
                                        <Button label="Buscar" icon="fa fa-search" onClick={() => this.findTests()} />
                                    </div>

                                </div>
                            </div>
                            <DataTable value={this.state.dataTableTest} paginator={true} rows={10} >
                                <Column field="dateLog" header="Fecha" style={{ width: '15%', justifyContent: 'center', textAlign: 'center', }} />
                                <Column field="batchTest" header="Lote" style={{ width: '10%', justifyContent: 'center', textAlign: 'center', }} />
                                <Column field="productName" header="Producto" style={{ justifyContent: 'center', textAlign: 'center', }} />
                                <Column header="Editar" body={this.actionTemplate} style={{ justifyContent: 'center', textAlign: 'center', width: '25%' }} />
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="Ingreso" leftIcon="pi pi-plus">
                            <Toolbar>
                                <div className="p-toolbar-group-right">
                                    <Button label="Nuevo Ensayo" icon="pi pi-undo" className="p-button-warning" onClick={() => this.setFieldsNewTest()} />
                                    <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={() => this.onShowModalTest()} />
                                </div>
                                <div className="p-toolbar-group-left">
                                    <Calendar dateFormat="yy/mm/dd" value={this.state.date} locale={es} showTime={true} onChange={(e) => this.setState({ date: e.value })} showIcon={true} />
                                    <Dropdown style={{ marginLeft: '35px', width: '200px' }} value={this.state.provider} options={this.state.providersGot} onChange={this.onProviderChange} placeholder="Proveedor" />
                                    <InputText style={{ marginLeft: '10px' }} placeholder='Lote' value={this.state.batchEnter} onChange={(e) => this.setState({ batchEnter: e.target.value })} />
                                </div>
                            </Toolbar>
                            <DataTable value={this.state.dynamicData} editable={true} headerColumnGroup={this.state.headerForm}>
                                {this.state.dynamicObjects}
                            </DataTable>
                            <DataView value={this.state.dataPV} itemTemplate={this.propertyTemplateDL.bind(this)} rows={70} ></DataView>

                        </TabPanel>
                    </TabView>
                </div>
                <Dialog header="Confirmación" visible={this.state.visibleModalP} style={{ width: '35vw' }} footer={footer} modal={true} onHide={() => this.setState({ visibleModalP: false })}>
                    <div className="p-col-12" style={{ marginBottom: '10px', justifyContent: 'center' }}>
                        <label style={{ color: '#1e88e5' }}> Para guardar/salvar la información ingresada </label>
                    </div>
                    <div className="p-grid">
                        <div className="p-grid-col-4" style={{ padding: '4px 10px' }}><label style={{ fontWeight: 'bold', color: '#1e88e5' }} htmlFor="year">Se acepta el producto ?</label></div>
                        <div className="p-grid-col-8" style={{ padding: '4px 10px' }}>
                            <ToggleButton style={{ width: '150px' }} onLabel="SI" offLabel="NO" onIcon="fa fa-check" offIcon="fa fa-times"
                                checked={this.state.checkProductMP} onChange={(e) => this.setState({ checkProductMP: e.value })} />
                        </div>
                    </div>
                </Dialog>
                <Dialog header="Editar" visible={this.state.visibleModalEditar} style={{ width: '40vw' }} footer={footerEditar} modal={true} onHide={() => this.setState({ visibleModalEditar: false })}>
                    <div className="p-grid p-grid-responsive p-fluid">

                        <div className="p-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Lote</label></div>
                        <div className="p-grid-col-9" style={{ padding: '4px 10px' }}>
                            <InputText placeholder='Lote' value={this.state.batchUpdate} onChange={(e) => this.setState({ batchUpdate: e.target.value })} />
                        </div>

                    </div>
                </Dialog>
                <Dialog header="Registrar Reclamo Materia Prima" visible={this.state.visibleModalRMP} style={{ width: '60%', backgroundColor: '#eceff1' }} footer={footerRMP} modal={true} onHide={() => this.setState({ visibleModalRMP: false })}>
                    <Card style={{ backgroundColor: '', marginBottom: '5%' }}>
                        <div className='p-grid p-fluid'>
                            <div className="p-grid form-group">
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Producto</label>
                                    <InputText value={this.state.nameProductRMP} disabled={true} />
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Fecha</label>
                                    <Calendar dateFormat="yy/mm/dd" value={this.state.dateRMP} locale={es} showTime={true} onChange={(e) => this.setState({ dateRMP: e.value })} showIcon={true} />
                                </div>
                                <div className="p-col-12 p-md-4"></div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Lote Proveedor</label>
                                    <div className="p-inputgroup">
                                        <InputText placeholder='Lote' value={this.state.batchProvider} onChange={(e) => this.setState({ batchProvider: e.target.value })} />
                                        <span className="p-inputgroup-addon">
                                            <i className="fa fa-car"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Lote Interno #Pallet</label>
                                    <InputText placeholder='Pallet número' value={this.state.palletNumber} onChange={(e) => this.setState({ palletNumber: e.target.value })} />
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Unidad</label>
                                    <Dropdown value={this.state.unit} options={unidadesMedida} autoWidth={false} onChange={this.onUnitChange} placeholder="Seleccione" />
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Producto Afectado</label>
                                    <div className="p-inputgroup">
                                        <InputText placeholder='Nombre' value={this.state.affectProduct} onChange={(e) => this.setState({ affectProduct: e.target.value })} />
                                        <span className="p-inputgroup-addon">
                                            <i className="fa fa-product-hunt"></i>
                                        </span>
                                    </div>

                                </div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Lugar</label>
                                    <Dropdown value={this.state.place} options={placesRMP} autoWidth={false} onChange={this.onPlaceChange} placeholder="Seleccione" />
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Cantidad Total</label>
                                    <div className="p-inputgroup">
                                        <InputText placeholder='Número de unidades' keyfilter="num" value={this.state.totalAm} onChange={(e) => this.setState({ totalAm: e.target.value })} />
                                        <span className="p-inputgroup-addon">
                                            <i className="fa fa-sort-amount-asc"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">Cantidad Afectada</label>
                                    <div className="p-inputgroup">
                                        <InputText placeholder='Número de unidades' keyfilter="num" value={this.state.affectAm} onChange={(e) => this.setState({ affectAm: e.target.value })} />
                                        <span className="p-inputgroup-addon">
                                            <i className="fa fa-sort-amount-asc"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="p-col-12 p-md-4">
                                    <label htmlFor="float-input">PNC Reclamo</label>
                                    <div className="p-inputgroup">
                                        <InputText placeholder='' keyfilter="num" value={this.state.porcentPNC} onChange={(e) => this.setState({ porcentPNC: e.target.value })} />
                                        <span className="p-inputgroup-addon">
                                            <i className="fa fa-percent"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="p-col-12 p-md-4" style={{ marginBottom: '5%' }}>
                                    <div className="p-g-12 p-md-12">
                                        <label htmlFor="float-input">Aplica Devolución</label>
                                    </div>
                                    <div className="p-col-12 p-md-2">
                                        <RadioButton value="SI" inputId="rb1" onChange={this.onRadioChange} checked={this.state.returnApply === "SI"} />
                                        <label htmlFor="rb1" style={{ marginLeft: '5px' }}>Si</label>
                                    </div>
                                    <div className="p-col-12 p-md-2">
                                        <RadioButton value="NO" inputId="rb2" onChange={this.onRadioChange} checked={this.state.returnApply === "NO"} />
                                        <label htmlFor="rb2" style={{ marginLeft: '5px' }}>No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
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

export default connect(mapStateToProps)(IngresoMPForm)