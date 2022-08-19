import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';


/* ====================  T R A N S A C T I O N S ======== */
import { ReadTestPlaneFile } from '../../../utils/TransactionsCalidad';

/* =================== FUNCIONES HEREDADAS ============= */
import { getProductFound, setnewTest } from '../TestResuts';
import { connect } from 'react-redux';

var that;
class ReadTestPFForm extends Component {
    constructor() {
        super();
        this.state = {
            dataProduct: undefined,
            userLogin: undefined,
            visibleModalP: false,
            batch: null,
            comment: null,
            confirmationModalView: false,
            waitModalView: false,
            testDevice: null,
            waitModalView: false,
        }
        that = this;
        this.readTests = this.readTests.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.registerMoreTest = this.registerMoreTest.bind(this);
        this.cancelMoreTest = this.cancelMoreTest.bind(this);
        this.getCodePropertyRadioButton = this.getCodePropertyRadioButton.bind(this);
    }

    /* Mostrar Mensajes */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        let msg = { severity: 'success', summary: 'Mensaje Exitoso', detail: message };
        this.growl.show(msg);
    }
    showInfo(message) {
        let msg = { severity: 'info', summary: 'INFO', detail: message };
        this.growl.show(msg);
    }

    /* Método para leer los resultados de los test (Equipo Universal) de archivos planos generados   */
    readTests() {
        debugger;
        var test = { batchTest: null, idProduct: null, owner: null, comment: null, idProperty: null }
        test.batchTest = this.state.batch;
        test.idProduct = this.state.dataProduct.idProduct;
        test.owner = this.props.currentUser.idUser;
        test.comment = this.state.comment;
        test.idProperty = this.getCodePropertyRadioButton();

        if ((this.state.testDevice !== null) && (this.state.dataProduct.idProduct !== null)) {
            if (this.state.dataProduct.typeProduct === 'MATERIA_PRIMA') {
                this.setState({ waitModalView: true });
                test.batchTest = '';
                ReadTestPlaneFile(test, function (data, status, msg) {
                    that.setState({ waitModalView: false });
                    switch (status) {
                        case 'OK':
                            that.showSuccess(msg);
                            that.setState({ confirmationModalView: true });
                            break;
                        case 'ERROR':
                            that.showError(msg);
                            break;
                        case 'INFO':
                            that.showInfo(msg);
                            break;
                        default:
                            break;
                    }
                })
            } else {
                if (this.state.batch !== null) {
                    this.setState({ waitModalView: true });
                    ReadTestPlaneFile(test, function (data, status, msg) {
                        that.setState({ waitModalView: false });
                        switch (status) {
                            case 'OK':
                                that.showSuccess(msg);
                                that.setState({ confirmationModalView: true });
                                break;
                            case 'ERROR':
                                that.showError(msg);
                                break;
                            case 'INFO':
                                that.showInfo(msg);
                                break;
                            default:
                                break;
                        }
                    })
                } else {
                    this.showError('Ingrese todos los campos necesarios');
                }
            }

        } else {
            this.showError('Seleccione el dispositivo para el ensayo');
        }
    }

    /* Metodo para castear el tipo de propiedad escogido */
    getCodePropertyRadioButton() {
        switch (this.state.testDevice) {
            case 'EquipoUniversal':
                return 'EquipoUniversal';
            case 'EquipoReblandecimiento':
                return 'PROP_1'
            default:
                return null;
        }
    }

    /* Método para cancelar la lectura de mas ensayos */
    cancelMoreTest() {
        this.setState({ batch: null, comment: null, confirmationModalView: false })
        setnewTest();
    }

    registerMoreTest() {
        this.setState({ confirmationModalView: false })
    }

    componentWillMount() {
        var pp = getProductFound();
        this.setState({ dataProduct: pp })
    }
    componentDidMount() {
       /*  var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion }); */
    }

    render() {
        const footer = (
            <div>
                <Button label="Si" icon="pi pi-check" className="p-button-primary" onClick={() => this.registerMoreTest()} />
                <Button label="No" icon="pi pi-times" onClick={() => this.cancelMoreTest()} className="p-button-danger" />
            </div>
        );
        return (
            <div className="p-grid" style={{ justifyContent: 'center' }}>
                <Growl ref={(el) => this.growl = el} />
                <div className="p-col-12" style={{ width: '50%', }}>
                    <div className="card" style={{ backgroundColor: '#457fca', justifyContent: 'center', textAlign: 'center', marginTop: '2%', marginBottom: '2%' }}>
                        <h3 style={{ color: '#ffff', fontWeight: 'bold' }}>LECTURA DE ENSAYOS </h3>
                    </div>
                    <div className='p-grid form-group p-fluid'>
                        <div className='p-col-12'>
                            <label htmlFor="float-input">ELIJE EL EQUIPO DE ENSAYO</label>
                        </div>
                        <div className='p-col-12 p-md-4'>
                            <RadioButton inputId="rb1" name="city" value="EquipoUniversal" onChange={(e) => this.setState({ testDevice: e.value })} checked={this.state.testDevice === 'EquipoUniversal'} />
                            <label htmlFor="rb1" className="p-radiobutton-label" style={{ marginLeft: '5px' }}>Equipo Universal</label>
                        </div>
                        <div className='p-col-12 p-md-4'>
                            <RadioButton inputId="rb1" name="city" value="EquipoReblandecimiento" onChange={(e) => this.setState({ testDevice: e.value })} checked={this.state.testDevice === 'EquipoReblandecimiento'} />
                            <label htmlFor="rb1" className="p-radiobutton-label" style={{ marginLeft: '5px' }}>Equipo Reblandecimiento</label>
                        </div>
                        <div className='p-col-12'>
                            <label htmlFor="float-input">LOTE</label>
                            <InputText placeholder='Ingrese el número de lote ' onChange={(e) => this.setState({ batch: e.target.value })} value={this.state.batch} />
                        </div>
                        <div className='p-col-12'>
                            <label htmlFor="float-input">OBSERVACIÓN</label>
                            <InputTextarea value={this.state.comment} onChange={(e) => this.setState({ comment: e.target.value })} rows={5}></InputTextarea>
                        </div>
                    </div>
                    <div className='p-grid form-group p-fluid' style={{ justifyContent: 'center' }}>
                        <div className='p-col-3'>
                            <Button label='Aceptar' className='p-button-success' icon="pi pi-check" onClick={this.readTests} />
                        </div>
                        <div className='p-col-3'>
                            <Button label='Cancelar' className='p-button-danger' icon="pi pi-times" onClick={() => setnewTest()} />
                        </div>
                    </div>
                </div>
                <Dialog visible={this.state.confirmationModalView} style={{ width: '20vw' }} footer={footer} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ confirmationModalView: false })}>
                    <div className="p-grid p-grid-responsive p-fluid">
                        <div className="p-col-12" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Desea leer otro ensayo..?</span>
                        </div>
                    </div>
                </Dialog>
                <Dialog visible={this.state.waitModalView} style={{ width: '20vw' }} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ waitModalView: false })}>
                    <div className="p-grid p-grid-responsive p-fluid">
                        <div className="p-col-12" style={{ marginRight: '10px' }}>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration="4s" />
                        </div>
                        <div className="p-col-12" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: '10px', marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Espere por favor... !</span>
                        </div>
                    </div>
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

export default connect(mapStateToProps)(ReadTestPFForm)