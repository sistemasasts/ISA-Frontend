import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import history from '../../../history';
import ProductoService from '../../../service/productoService';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../../store/actions/modalWaitAction';


//Data Test
import { CarService } from '../../../service/CarService';

/* ======  T R A N S A C T I O N S ======== */
import { GetAllProducts, GetProductById, productSave } from '../../../utils/TransactionsCalidad';
import { Toolbar } from 'primereact/toolbar';

var that;
var DataInput = []; //Variable para almacenar los datos modificados.
var nameProducts = []; // Variable para fomrar el Array de nombre de productos.

class Product extends Component {

    constructor() {
        super();
        this.state = {
            tipo: '',
            nombre: '',
            codigo: '',
            familia: '',
            descripcion: '',
            filters: {},
            showModalProduct: false,
            showModalCaraterísticas: false,
            cars: [],
            checkboxValue: [],
            checkboxValueVC: [],
            statePanelInfProduc: 'none',
            unidad: '',
            productFinded: {},
            reloadTextInput: false,
        };
        that = this;
        this.carservice = new CarService();
        this.redirigirProductoEdicion = this.redirigirProductoEdicion.bind(this);
        this.generarReporte = this.generarReporte.bind(this);


    }

    componentDidMount() {
        nameProducts = [];
        GetAllProducts(function (items) {
            debugger;
            items.map(function (value, index) {
                nameProducts.push(value.nameProduct);
            })
            that.setState({ cars: items })
        });
    }

    /* =============== F U N C I O N E S ============== */


    redirigirProductoEdicion(idProduct) {
        history.push(`/quality-development_product_instructivo/${idProduct}`);
    }

    async generarReporte(id, nombre) {
        debugger
        this.props.openModal();
        var data = await ProductoService.generarReporte(id);
        this.props.closeModal();
        const ap = window.URL.createObjectURL(data)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = ap;
        a.download = `Instructivo_Trabajo_${nombre}.pdf`;
        a.click();
        //this.showMessage('Reporte generado', 'success');
    }


    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-file-pdf" className="p-button-success" style={{ marginRight: '.5em' }} onClick={() => that.generarReporte(rowData.idProduct, rowData.nameProduct)} />
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => that.redirigirProductoEdicion(rowData.idProduct)} />
        </div>
    }


    /* ============= FIN FUNCIONES ============ */

    render() {

        let actionHeader = <Button type="button" icon="pi pi-cog" />;
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-left">
                    <Button label='Nuevo' icon='pi pi-plus' onClick={() => history.push("/quality-development_product_new")} />
                </div>
            </Toolbar>
        </div>

        return (
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="card card-w-title datatable-demo">
                        <h1>Productos</h1>
                        <DataTable ref={(el) => this.dt = el} value={this.state.cars} selectionMode="single" header={header} paginator={true} rows={10}
                            responsive={true} selection={this.state.dataTableSelection1} onSelectionChange={event => this.setState({ dataTableSelection1: event.value })}>
                            <Column field="idProduct" header="Código" sortable={true} filter={true} style={{ textAlign: 'center', width: '10em' }} />
                            <Column field="nameProduct" header="Nombre" sortable={true} filter={true} />
                            <Column field="typeProduct" header="Tipo" sortable={true} filter={true} style={{ textAlign: 'center', width: '20em' }} />
                            <Column field="itcdq" header="ITCDQ" sortable={true} filter={true} style={{ textAlign: 'center', width: '15em'}} />
                            <Column field="sapCode" header="Código SAP" sortable={true} filter={true} style={{ textAlign: 'center', width: '9em' }} />
                            <Column header={actionHeader} body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                        </DataTable>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Product)