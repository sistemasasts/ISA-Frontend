import React, { Component } from 'react';

import { AutoComplete } from 'primereact/autocomplete';

import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';

/* ============  D A T A    C A T A L O G O  S =============== */
import { testList } from '../../global/catalogs';

/* ====================  T R A N S A C T I O N S ======================== */
import { GetAllProducts, GetOnlyPropertyByIdProductAndIdProperty, GetProductPropertiesByIdProduct } from '../../utils/TransactionsCalidad';

/* ===========================  U T I L S  ================== */
import { formattedDate, formattedDateAndHour } from '../../utils/FormatDate';

/* ====================  F O R M S   T E S T  ======== */
import ReblandecimientoForm from './Test-type/FReblandecimiento-test';
import PhForm from './Test-type/FPH-test';
import ViscosityForm from './Test-type/FViscosity-test';
import AWeightForm from './Test-type/FPesoXArea-test';
import SujecionGranulosForm from './Test-type/FGranulosSujecion';
import DimensionalesForm from './Test-type/FDimensionales-test';
import ReadTestPFForm from './Test-type/FReadTestPF';
import IngresoMPForm from './Test-type/FIngresoMP';


var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
var that;

export class ResultTest extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
            productName: null,
            productFound: null,
            testEnabled: true,
            test: undefined,
            componentRender: undefined,
            propertyInformation: undefined,
            userLogin: undefined,
        };
        that = this;
        this.onDropdownChangeTest = this.onDropdownChangeTest.bind(this);
        this.renderComponenteForTest = this.renderComponenteForTest.bind(this);
        this.getInformationProperty = this.getInformationProperty.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.setNewTest = this.setNewTest.bind(this);
    }


    /* Métodos  Auto Completado Buscar Producto */
    handleDropdownClick() {
        this.setState({ filteredBrands: [] });
        //mimic remote call
        setTimeout(() => {
            this.setState({ filteredBrands: this.brands });
        }, 100)
    }
    filterProducts(event) {
        let results = nameProducts.filter((brand) => {
            return brand.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({ filteredProducts: results });
    }
    onProductValueChange(e) {
        debugger;
        this.setState({ productName: e.value, filteredProducts: null, testEnabled: false });
    }
    /* FIn Métodos  Auto Completado */

    /* Método Evento listas deplegables */
    onDropdownChangeTest(event) {
        var template = null
        switch (event.value) {
            case 'LeerEnsayos':
                template = <ReadTestPFForm />
                break;
            default:
                this.getInformationProperty(event.value);
                break;
        }
        this.setState({ test: event.value, componentRender: template });

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

    /* Metodo para consulatar las especifiaciones de la Propiedad  */
    getInformationProperty(propertyIdValue) {
        var productF = null;
        this.state.products.map(function (obj) {
            if (obj.nameProduct === that.state.productName) {
                productF = obj;
            }
        })
        if (productF !== null) {

            switch (propertyIdValue) {
                case 'Dimensionales':
                    var obj = { idProduct: productF.idProduct };
                    GetProductPropertiesByIdProduct(obj, function (data, status, msg) {
                        console.log(data);
                        switch (status) {
                            case 'OK':
                                that.showSuccess(msg);
                                var CRTMP = that.renderComponenteForTest();
                                that.setState({ componentRender: CRTMP, propertyInformation: data });
                                break;
                            case 'ERROR':
                                that.showError(msg);
                                that.setState({ componentRender: null, propertyInformation: null });
                                break;
                            case 'INFO':
                                that.setState({ componentRender: null, propertyInformation: null });
                                that.showError(msg);
                                break;
                            default:
                                console.log(data);
                                break;
                        }
                    })
                    break;
                case 'IngresoMP':
                    if (productF.typeProduct === 'MATERIA_PRIMA') {
                        var obj = { idProduct: productF.idProduct };
                        GetProductPropertiesByIdProduct(obj, function (data, status, msg) {
                            debugger
                            console.log(data);
                            switch (status) {
                                case 'OK':
                                    that.showSuccess(msg);
                                    var CRTMP = that.renderComponenteForTest();
                                    that.setState({ componentRender: CRTMP, propertyInformation: data });
                                    break;
                                case 'ERROR':
                                    that.showError(msg);
                                    that.setState({ componentRender: null, propertyInformation: null });
                                    break;
                                case 'INFO':
                                    that.setState({ componentRender: null, propertyInformation: null });
                                    that.showError(msg);
                                    break;
                                default:
                                    console.log(data);
                                    break;
                            }
                        })
                    } else {
                        this.showError('Propiedad no disponible para Producto Terminado');
                    }
                    break;
                default:
                    var obj = { idProduct: productF.idProduct, propertyList: propertyIdValue };
                    GetOnlyPropertyByIdProductAndIdProperty(obj, function (data, status, msg) {
                        console.log(data);
                        switch (status) {
                            case 'OK':
                                that.showSuccess(msg);
                                var CRTMP = that.renderComponenteForTest();
                                that.setState({ componentRender: CRTMP, propertyInformation: data });
                                break;
                            case 'ERROR':
                                that.showError(msg);
                                that.setState({ componentRender: null, propertyInformation: null });
                                break;
                            case 'INFO':
                                that.setState({ componentRender: null, propertyInformation: null });
                                that.showError(msg);
                                break;
                            default:
                                console.log(data);
                                break;
                        }
                    })
                    break;
            }
        } else {
            this.showError('Producto no encontrado');
        }

    }

    componentWillMount() {
        nameProducts = [];
        GetAllProducts(function (items) {
            items.map(function (value, index) {
                nameProducts.push(value.nameProduct);
            })
            that.setState({ products: items })
        });
    }

    componentDidMount() {
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion });
    }

    /* Método para Renderizar el componente que se necesita */
    renderComponenteForTest() {
        console.log('IngresoRENDER')
        switch (this.state.test) {
            case 'PROP_60':
                return (<PhForm />);
            case 'PROP_14':
                return (<AWeightForm />);
            case 'PROP_61':
                return (<ViscosityForm />);
            case 'PROP_25':
                return (<SujecionGranulosForm />);
            case 'PROP_1':
                return (<ReblandecimientoForm />);
            case 'Dimensionales':
                return (<DimensionalesForm />);
            case 'LeerEnsayos':
                return (<ReadTestPFForm />);
            case 'IngresoMP':
                return (<IngresoMPForm />);
            default:
                return (<div></div>);

        }
    }

    /* Método para setear campos y realizar nueva nusqueda */
    setNewTest() {
        this.setState({ test: null, testEnabled: false, nameProduct: null });
    }

    render() {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-lg-12">
                    <div className="card shadow-box p-shadow-3" style={{ backgroundColor: '#d4e157' }}>
                        <Growl ref={(el) => this.growl = el} />
                        <h1 style={{ marginLeft: '10px' }} >REGISTRO DE ENSAYOS LABORATORIO DE CALIDAD</h1>
                        <div className='p-grid form-group p-fluid'>
                            <div className='p-col-12 p-lg-4'>
                                <label htmlFor="float-input">Buscar Producto</label>
                                <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                    suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.productName}
                                    onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                                />
                            </div>
                            <div className='p-col-12 p-lg-4'>
                                <label htmlFor="float-input">Ensayo</label>
                                <Dropdown disabled={this.state.testEnabled} options={testList} value={this.state.test} onChange={this.onDropdownChangeTest} autoWidth={false} placeholder="Selecione" />

                            </div>
                        </div>

                    </div>
                    <div className="card">
                        {this.state.componentRender}
                    </div>
                </div>
            </div >
        )
    }
}

export function getPropertyInformation() {
    return that.state.propertyInformation;
}

export function setnewTest() {
    that.setState({ test: null, testEnabled: false, nameProduct: null, componentRender: undefined });
}

export function getProductFound() {
    var productF = null;
    that.state.products.map(function (obj) {
        if (obj.nameProduct === that.state.productName) {
            productF = obj;
        }
    })

    return productF
}

export function getProviders() {
    var providersF = [];
    if (that.state.propertyInformation.providers !== undefined) {
        that.state.propertyInformation.providers.map(function (obj) {
            var items = { label: null, value: null }
            items.label = obj.nameProvider;
            items.value = obj.idProvider;
            providersF.push(items);
        })

    }

    return providersF;
}