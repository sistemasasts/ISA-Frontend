import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'primereact/card';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';

import ProductoPropiedad from './ProductoPropiedad';

import ProductoService from '../../../service/productoService';
import ProductoProveedor from './ProductoProveedor';

var that;
var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
class Especificacion extends Component {
    static propTypes = {
        prop: PropTypes
    }

    constructor() {
        super();
        this.state = {
            products: [],
            productName: undefined,
            productoSeleccionado: {},
            mostrarDetalle: false

        };
        that = this;
        this.refrescarListaProductos = this.refrescarListaProductos.bind(this);
        this.productFind = this.productFind.bind(this);

    }

    /* Métodos  Auto Completado */
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
        if (e.value.length === 0) {
            this.setState({ mostrarDetalle: false, productName: e.value });
        } else {
            this.setState({ productName: e.value, filteredProducts: null });
        }

    }
    /* FIn Métodos  Auto Completado */
    /*  Metodo Obtener/Buscar Producto*/
    productFind() {
        this.setState({ productoSeleccionado: {} });
        let finedProduc = undefined;
        if (this.state.productName !== undefined) {
            this.state.products.map(function (value, index) {
                if (value.nameProduct === that.state.productName) {
                    finedProduc = value;
                }
            })
        }
        if (finedProduc !== undefined) {
            this.setState({ productoSeleccionado: finedProduc, mostrarDetalle: true })
            //this.showSuccess('Producto Encontrado');
        } else {
            //this.showError('Producto no Encontrado');
        }
    }

    async refrescarListaProductos() {
        nameProducts = [];
        const productos = await ProductoService.list();
        debugger
        if (productos !== null) {
            productos.map(function (value, index) {
                nameProducts.push(value.nameProduct);
            })
        }

        this.setState({ products: productos, productoSeleccionado: {} })
    }

    async componentDidMount() {
        console.log();
        this.refrescarListaProductos();
    }

    render() {
        return (
            <div className='p-grid'>
                <div className="p-col-12 p-lg-12">
                    <div className="card card-w-title">
                        {/* <h1>Especificaciones</h1> */}
                        <Card style={{ backgroundColor: '#d4e157', borderRadius: '5px' }}>
                            <h1 style={{ paddingBottom: '0' }}>Especificaciones</h1>
                            <div className='p-grid form-group p-fluid' style={{ justifyContent: 'center', paddingTop: '0' }}>
                                <div className='p-col-4'>
                                    <label htmlFor="float-input">Nombre Producto</label>
                                    <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                        suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.productName}
                                        onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                                    />
                                </div>
                                <div className='p-col-2' style={{ marginTop: '23px' }}>
                                    <Button label='Buscar' icon='fa fa-search' onClick={this.productFind} />
                                </div>
                            </div>
                        </Card>
                        {this.state.mostrarDetalle && <TabView style={{ marginTop: '10px' }} >
                            <TabPanel header="Propiedades" leftIcon="pi pi-sliders-h" >
                                <ProductoPropiedad producto={this.state.productoSeleccionado} />
                            </TabPanel>

                            <TabPanel header="Proveedores" leftIcon="fa fa-truck" >
                                <ProductoProveedor producto={this.state.productoSeleccionado} />
                            </TabPanel>
                        </TabView>}
                    </div>

                </div>
            </div>
        )
    }
}

export default Especificacion;
