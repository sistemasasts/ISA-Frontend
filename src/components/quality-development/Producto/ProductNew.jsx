import { Button } from 'primereact/button';
import React, { Component } from 'react';
import ProductoForm from './ProductoForm';
import history from '../../../history';


class ProductNew extends Component {
    constructor() {
        super();
        this.state = {
            productoSeleccionado: null,
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="p-fluid">
                <div className="card card-w-title">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button icon='pi pi-arrow-left' onClick={() => history.push("/quality-development_product")} />
                        <h1>Crear Producto</h1>
                    </div>
                    <ProductoForm producto={this.state.productoSeleccionado} />
                </div>
            </div>
        )
    }

}

export default ProductNew;