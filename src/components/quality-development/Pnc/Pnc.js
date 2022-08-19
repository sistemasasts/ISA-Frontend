import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { AutoComplete } from 'primereact/autocomplete';
import { Growl } from 'primereact/growl';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar'
import { TabView, TabPanel } from 'primereact/tabview';

/* ====================  T R A N S A C T I O N S ======================== */
import { GetAllProducts, GetAllPncs, ClosedPNC, } from '../../../utils/TransactionsCalidad';


/* ====================  C O M P O N E N T S ======================== */
import { connect } from 'react-redux';
import PncForm from './PncForm';
import { Link, NavLink } from 'react-router-dom';
import history from '../../../history';
import PncService from '../../../service/PncService';
import Axios from 'axios';
import { openModal, closeModal } from '../../../store/actions/modalWaitAction';


var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
var that;
class ProductoNoConforme extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
            productName: undefined,
            exitMaterial: 0,
            validityAverage: null,
            balanceMaterial: undefined,
            visibleFormPNC: false,
            idPNC: undefined,
            foundProduct: undefined,
            listPnc: [],
            userLogin: null,
            displayOutputMaterial: 'none',
            displayTablePNC: '',
            selectedPNC: null,
            itemPNC: null,

        };
        that = this;

        this.productFind = this.productFind.bind(this);

        this.setExitMaterial = this.setExitMaterial.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.statusTemplate = this.statusTemplate.bind(this);


        this.closePNC = this.closePNC.bind(this);

        this.onPNCSelect = this.onPNCSelect.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.generarReportePNC = this.generarReportePNC.bind(this);
        this.redirigirSalidaMaterial = this.redirigirSalidaMaterial.bind(this);
    }

    /* =============== I N I C I O   F U N C I O N E S ======================= */

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
        debugger;
        if (e.value.length !== 1) {
            this.state.products.map(function (obj, index) {
                if (obj.nameProduct === e.value) {
                    if (obj.typeProduct === 'PRODUCTO_TERMINADO') {
                        that.setState({ enabledFrecuencia: false });
                    }
                    if (obj.typeProduct === 'MATERIA_PRIMA') {
                        that.setState({ enabledFrecuencia: true });
                    }
                }
            })
        }
        this.setState({ productName: e.value, filteredProducts: null });
    }
    /* FIn Métodos  Auto Completado */

    /*  Metodo Obtener/Buscar Producto*/
    productFind() {
        debugger;
        let finedProduc = undefined;
        if (this.state.productName !== undefined) {
            this.state.products.map(function (value, index) {
                if (value.nameProduct === that.state.productName) {
                    finedProduc = value;
                }
            })
        }
        if (finedProduc !== undefined) {
            this.setState({ viewForm: '', foundProduct: finedProduc })
            this.showSuccess('Producto Encontrado');
        } else {
            this.showError('Producto no Encontrado');
        }
    }

    setExitMaterial(e) {
        debugger
        let a = parseFloat(e.target.value);
        let b = parseFloat(this.state.amountNonConforming);
        let calc = this.state.amountNonConforming - e.target.value;
        if (a > b) {
            this.setState({ exitMaterial: e.target.value, validationTextBalancedMaterial: 'p-state-error', vaidationFontTextBalanceMaerial: '#ef9a9a', balanceMaterial: calc })
        } else {

            if (calc < 0) {
                this.setState({ validationTextBalancedMaterial: 'p-state-error', vaidationFontTextBalanceMaerial: '#ef9a9a', balanceMaterial: calc })
            } else
                this.setState({ exitMaterial: e.target.value, balanceMaterial: calc, validationTextBalancedMaterial: '', vaidationFontTextBalanceMaerial: '', })
        }
    }

    /* Metodos Mensajes Mostrar */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        let msg = { severity: 'success', summary: 'Exito', detail: message };
        this.growl.show(msg);
    }
    /* Metodo para lanzar mensajes */
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
            default: break;
        }
    }
    /* FIN Metodos Mensajes Mostrar */


    /* Método Template DataTable PNC's */
    actionTemplate(rowData, column) {

        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" onClick={() => this.setState({ selectedPNC: rowData, editPNCFile: true })}></Button>
        </div>
    }
    statusTemplate(rowData, column) {
        return <div>
            {rowData.state === 'Cerrado' ? <span style={{ color: '#d9534f', fontWeight: 'bold' }}>{rowData.state}</span> : <span style={{ color: '#388e3c', fontWeight: 'bold' }}>{rowData.state}</span>}
        </div>;
    }

    inventarioTemplate(rowData, column) {
        return <div>
            {rowData.existsInventory ? <span style={{ fontWeight: 'bold' }} >Existe</span> : <span style={{ fontWeight: 'bold' }} >No Existe</span>}
        </div>;
    }

    /* Selecciona un item de la lista de PNCS */
    onPNCSelect(e) {
        this.setState({
            displayOutputMaterial: '',
            itemPNC: Object.assign({}, e.data)
        });
    }

    /* Metodo para Cerrar PNC */
    closePNC() {
        ClosedPNC(this.state.idPNC, function (data) {
            switch (data.status) {
                case 'OK':
                    that.showSuccess(data.message);
                    that.setState({
                        visibleFormPNC: false, viewForm: 'none',
                    });
                    GetAllPncs(function (items) {
                        that.setState({ listPnc: items })
                    })
                    break;
                case 'ERROR':
                    that.showError(data.message);
                    break;
                default: break;
            }
        })
    }


    /* Metodo para registrar la salida de material */
    redirigirSalidaMaterial() {
        if (this.state.selectedPNC) {
            history.push(`/quality-development_salida_material/${this.state.selectedPNC && this.state.selectedPNC.idNCP}`)
        } else {
            this.showMessage('Favor seleccionar un registro', 'error')
        }

    }
    /* Método para generar el reporte de PNC */
    async generarReportePNC() {
        debugger
        if (this.state.selectedPNC !== null) {

            this.props.openModal();
            var data = await PncService.generarReporte(this.state.selectedPNC.idNCP);
            this.props.closeModal();
            const ap = window.URL.createObjectURL(data)
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = ap;
            a.download = `RepPNC${this.state.selectedPNC.idNCP}_${this.state.selectedPNC.product.nameProduct}.pdf`;
            a.click();
            
            this.showMessage('Reporte generado', 'success');
        } else {
            this.showMessage('Seleccione un item', 'error');
        }
    }

    /* ================= F I N   F U N C I O N E S ======================= */

    componentDidMount() {
        nameProducts = [];
        GetAllProducts(function (items) {
            items.map(function (value, index) {
                nameProducts.push(value.nameProduct);
            })
            that.setState({ products: items })
        });

        GetAllPncs(function (items) {
            that.setState({ listPnc: items })
        })

    }

    refrescarLista() {
        GetAllPncs(function (items) {
            that.setState({ listPnc: items })
        })
    }


    render() {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };


        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-right">
                    <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
                </div>

                <div className="p-toolbar-group-left">
                    <Button label='Salida Material' icon='pi pi-folder-open' onClick={() => this.redirigirSalidaMaterial()} />
                    <Button label='Reporte' icon='pi pi-file-pdf' className='p-button-warning' onClick={() => this.generarReportePNC()} />
                </div>
            </Toolbar>
        </div>



        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                <div className="card card-w-title">
                    <h1>Producto No Conforme</h1>
                    <TabView style={{ marginBottom: '10px' }} selected={1}>
                        <TabPanel header="Consultar PNC" leftIcon="fa fa-search" onTabChange={this.changeTab} >
                            {!this.state.editPNCFile &&
                                <DataTable style={{ display: this.state.displayTablePNC }} value={this.state.listPnc} paginator={true} rows={15} header={header} globalFilter={this.state.globalFilter}
                                    selectionMode="single" selection={this.state.selectedPNC} onSelectionChange={(e) => { this.setState({ selectedPNC: e.value }); }}
                                    onRowSelect={this.onTaskSelect}
                                >
                                    <Column field="idNCP" header="PNC" style={{ width: '5%', textAlign: 'center' }} filter sortable />
                                    <Column field="batch" header="Lote" style={{ width: '10%', textAlign: 'center' }} filter sortable />
                                    <Column field="product.nameProduct" header="Producto" style={{ width: '25%', textAlign: 'center' }} filter sortable />
                                    <Column field="existingMaterial" header="Cantidad" style={{ width: '7%', textAlign: 'center' }} filter sortable />
                                    <Column field="unitNCP" header="Unidad" style={{ width: '7%', textAlign: 'center' }} filter sortable />
                                    <Column field="dateProduction" header="Fecha Producción" style={{ width: '10%', textAlign: 'center' }} filter sortable />
                                    <Column field="dateDetection" header="Fecha Detección" style={{ width: '10%', textAlign: 'center' }} filter sortable />
                                    {/* <Column body={this.statusTemplate} header="Estado" style={{ width: '10%', textAlign: 'center' }} sortable /> */}
                                    <Column body={this.inventarioTemplate} header="Inventario" style={{ width: '10%', textAlign: 'center' }} sortable />
                                    <Column body={this.actionTemplate} style={{ width: '10%', textAlign: 'center' }} />
                                </DataTable>}
                            {this.state.editPNCFile && <PncForm pnc={this.state.selectedPNC} pncf={this} />}

                        </TabPanel>

                        <TabPanel header="PNC" leftIcon="fa fa-file" onTabChange={this.changeTab} activeIndex={1}  >
                            <Card style={{ backgroundColor: '#d4e157' }}>
                                <div className='p-grid form-group p-fluid' style={{ justifyContent: 'center' }}>
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
                            {this.state.foundProduct !== undefined ? <PncForm product={this.state.foundProduct} pncf={this} /> : null}


                        </TabPanel>
                    </TabView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductoNoConforme)