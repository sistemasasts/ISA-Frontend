import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import ProductoPropiedad from '../Especificaciones/ProductoPropiedad';
import ProductoProveedor from '../Especificaciones/ProductoProveedor';
import ProductoForm from './ProductoForm';
import history from '../../../history';

var that;
class ProductoInstructivo extends Component {

    constructor() {
        super();
        this.state = {
            productoSeleccionado: null,
        };
        that = this;
    }

    componentDidMount() {
        const a = this.props.match.params.idProduct;
        if (a === 'nuevo') {
            const product = null;
            this.setState({ productoSeleccionado: product });
        } else {
            const product = { idProduct: a };
            this.setState({ productoSeleccionado: product });
        }
    }

    render() {
        return (
            <div >
                <div className="card card-w-title">
                    <div className='p-grid'>
                        <div className="p-col-12 p-lg-12">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button icon='pi pi-arrow-left' onClick={() => history.push("/quality-development_product")} />
                                <h1>Editar Producto - Instructivo de Trabajo</h1>
                            </div>

                            <TabView style={{ marginTop: '10px' }} >
                                <TabPanel header="Información" leftIcon="pi pi-info-circle" >
                                    <ProductoForm producto={this.props.match.params.idProduct} />
                                </TabPanel>
                                <TabPanel header="Propiedades" leftIcon="pi pi-sliders-h" >
                                    <ProductoPropiedad producto={this.state.productoSeleccionado} />
                                </TabPanel>

                                <TabPanel header="Proveedores" leftIcon="fa fa-truck" >
                                    <ProductoProveedor producto={this.state.productoSeleccionado} />
                                </TabPanel>
                            </TabView>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default ProductoInstructivo