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
class PhForm extends Component {
    constructor() {
        super();
        this.state = {
            testPhData: [
                { item: 1, idProperty: '', dateLog: null, timeLog: '', batchTest: '', provider: '', temperature: '', resultTest: null, comment: '', prommissing: '', min: null, max: null },
                { item: 2, idProperty: '', dateLog: null, timeLog: '', batchTest: '', provider: '', temperature: '', resultTest: null, comment: '', prommissing: '', min: null, max: null },
                { item: 3, idProperty: '', dateLog: null, timeLog: '', batchTest: '', provider: '', temperature: '', resultTest: null, comment: '', prommissing: '', min: null, max: null },

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
        this.temperatureEditor = this.temperatureEditor.bind(this);
        this.pHEditor = this.pHEditor.bind(this);
        this.averagEditor = this.averagEditor.bind(this);
        this.observationEditor = this.observationEditor.bind(this);
        this.providerEditor = this.providerEditor.bind(this);
        this.colorTemplate = this.colorTemplate.bind(this);
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
        let updatedTestData = this.state.testPhData;
        updatedTestData[props.rowIndex][props.field] = value;
        this.setState({ testPhData: updatedTestData });
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
        return <div className='p-fluid'><Calendar appendTo={document.body} id={props.rowIndex} dateFormat="yy/mm/dd" value={this.state.testPhData[props.rowIndex][field]} locale={es} showTime={true} onChange={(e) => this.onEditorValueChange(props, e.value)} /></div>
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
        return <Dropdown value={this.state.testPhData[props.rowIndex][field]} options={desicionCMB}
            onChange={(e) => this.onEditorValueChange(props, e.value)} style={{ width: '100%' }} />

    }



    /* Metodos para editar cada uno de los campos de la tabla */
    dateEditor(props) {
        return this.inputDateEditor(props, 'dateLog');
    }
    batchEditor(props) {
        return this.inputTextEditor(props, 'batchTest');
    }
    providerEditor(props) {
        return this.inputTextEditor(props, 'provider');
    }
    temperatureEditor(props) {
        return this.inputTextEditor(props, 'temperature');
    }
    pHEditor(props) {
        return this.inputTextEditor(props, 'resultTest');
    }
    observationEditor(props) {
        return this.inputTextEditor(props, 'comment');
    }
    averagEditor(props) {
        return this.inputDropDownEditor(props, 'prommissing');
    }
    colorTemplate = (value, column) => {
        if (value[column.field] !== null) {
            var vT = parseFloat(value[column.field]);
            if ((vT !== null) & (vT !== '')) {
                if ((vT <= this.state.dataProperty.propertyMax) & (vT >= this.state.dataProperty.propertyMin))
                    return <span>{value[column.field]}</span>;
                else
                    return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px' }}>{value[column.field]}</div>
            } else {
                return null;
            }

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
        var index = this.state.testPhData.length + 1;
        var dataTMP = this.state.testPhData;
        var registerNew = { item: index, idProperty: '', dateLog: null, timeLog: '', batchTest: '', provider: '', temperature: '', resultTest: null, comment: '', prommissing: '', min: this.state.dataProperty.propertyMin, max: this.state.dataProperty.propertyMax }
        dataTMP.push(registerNew);
        this.setState({ testPhData: dataTMP });
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
        var capturedData = this.state.testPhData;
        var property = this.state.dataProperty;
        var Test = [];
        this.setState({ visibleModalP: false });
        capturedData.forEach(function (obj) {
            if (obj.resultTest !== null) {
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
        if (Test.length !== 0) {
            SaveTest(Test, function (data, status, msg) {
                that.dataTratamient(data);
                switch (status) {
                    case 'OK':
                        that.showSuccess(msg);
                        that.setState({ testPhData: data })
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
        if (pp.productType == 'MATERIA_PRIMA') {
            var tt = { idProduct: pp.productId, idProperty: pp.propertyId }
            GetTestByProductIDByBatchNull(tt, function (items, status, msg) {
                if (status == 'OK') {
                    that.dataTratamient(items);
                    that.setState({ testPhData: items })
                }

            })
        }
        var addMinMax = this.state.testPhData.map(function (o) {
            o.min = pp.propertyMin;
            o.max = pp.propertyMax;

        })
        this.setState({ dataProperty: getPropertyInformation() })
    }
   /*  componentDidMount() {
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion });
    } */

    render() {
        const footer = (
            <div>
                <Button label="Aceptar" icon="pi pi-check" className="p-button-primary" onClick={() => this.saveData()} />
                <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({ visibleModalP: false })} className="p-button-danger" />
            </div>
        );
        return (
            <div className="p-grid">
                <Growl ref={(el) => this.growl = el} />
                <div className="p-col-12">
                    <div className="card" style={{ backgroundColor: '#457fca', justifyContent: 'center', textAlign: 'center', marginBottom: '2%' }}>
                        <h3 style={{ color: '#ffff', fontWeight: 'bold' }}>BITÁCORA DE CONTROL PH </h3>
                    </div>
                    <Toolbar>
                        <div className="p-toolbar-group-right">
                            <Button label="Nuevo Item" icon="pi pi-plus" onClick={this.addLineData} />
                            <Button label="Nuevo Ensayo" icon="pi-flaskpi-step-backward-alt" className="p-button-warning" onClick={() => this.setFieldsNewTest()} />
                            <Button label="Guardar" icon="pi pi-save" className="p-button-success" onClick={() => this.onShowModalTest()} />
                        </div>
                    </Toolbar>
                    <DataTable value={this.state.testPhData} editable={true}>
                        <Column field='item' style={{ height: 'em', width: '2%' }} />
                        <Column field="dateLog" header="Fecha" editor={this.dateEditor} body={this.renderDate} style={{ height: '3.5em', width:'15%' }} />
                        <Column field="batchTest" header="Lote" editor={this.batchEditor} style={{ height: '3.5em' }} />
                        <Column field="provider" header="Proveedor" editor={this.providerEditor} style={{ height: '3.5em' }} />
                        <Column field="temperature" header="Temperatura (°C)" editor={this.temperatureEditor} style={{ height: '3.5em' }} />
                        <Column field="resultTest" header="pH" editor={this.pHEditor} style={{ height: '3.5em' }} body={this.colorTemplate} />
                        <Column field="min" header="Min" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="max" header="Max" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="prommissing" header="Promediar" editor={this.averagEditor} style={{ height: '3.5em' }} />
                        <Column field="comment" header="Observación" editor={this.observationEditor} style={{ height: '3.5em', width: '30%' }} />
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

export default connect(mapStateToProps)(PhForm);
