import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';


var that;
export class ConcessionR extends Component {

    constructor() {
        super();
        this.state = {
            client: null,
            nroInvoice: null,
            seller: null,
            codMaterialPNC01: null,
            validatePercent: null,
            stateMaterial: null,

        };
        that = this;

    }

    componentWillMount() {
        this.setState({
            client: null,
            nroInvoice: null,
            seller: null,
            codMaterialPNC01: null,
            validatePercent: null,
            stateMaterial: null,
        });
    }


    render() {
        return (
            <div>
                <div className='p-grid form-group p-fluid'>
                    <div className='p-col-12 p-lg-12' style={{ padding: '0px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>SOLICITUD DE CONCESIÓN</span>
                    </div>

                    <div className='p-col-12 p-lg-12' style={{ padding: '0px' }}>

                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">Cliente</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon" style={{ background: '#337ab7', color: '#ffffff' }}>
                                    <i className="fa fa-user-o"></i>
                                </span>
                                <InputText placeholder='Nombre' onChange={(e) => this.setState({ client: e.target.value })} value={this.state.client} />
                            </div>


                        </div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">Código Material PNC</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon" style={{ background: '#337ab7', color: '#ffffff' }}>
                                    <i className="fa fa-product-hunt"></i>
                                </span>
                                <InputText placeholder='' onChange={(e) => this.setState({ codMaterialPNC01: e.target.value })} value={this.state.codMaterialPNC01} />
                            </div>

                        </div>
                    </div>


                    <div className='p-col-12 p-lg-12' style={{ padding: '0px' }}>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">#Factura</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon" style={{ background: '#337ab7', color: '#ffffff' }}>
                                    <i className="fa fa-credit-card"></i>
                                </span>
                                <InputText placeholder='Número' onChange={(e) => this.setState({ nroInvoice: e.target.value })} value={this.state.nroInvoice} />
                            </div>
                        </div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">Responsable de Venta</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon" style={{ background: '#337ab7', color: '#ffffff' }}>
                                    <i className="fa fa-user-o"></i>
                                </span>
                                <InputText placeholder='Nombre' onChange={(e) => this.setState({ seller: e.target.value })} value={this.state.seller} />
                            </div>

                        </div>
                        <div className='p-col-12 p-lg-6'>
                            <label htmlFor="float-input">Validez</label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon" style={{ background: '#337ab7', color: '#ffffff' }}>
                                    <i className="fa fa-percent"></i>
                                </span>
                                <InputText placeholder='00.00' onChange={(e) => this.setState({ validatePercent: e.target.value })} value={this.state.validatePercent} />
                            </div>
                        </div>
                    </div>
                    <div className='p-col-12 p-lg-12' style={{ padding: '0px' }}>
                        <label htmlFor="float-input">Condición del Material:</label>
                        <InputTextarea placeholder='Describa' rows={4} onChange={(e) => this.setState({ stateMaterial: e.target.value })} value={this.state.stateMaterial} />

                    </div>
                </div>
            </div>
        )
    }
}

/* Metodo para revolver la data capturada */
export function getDataConcessionRequest() {
    var concessionRequest = { client: null, quantity: null, nroInvoice: null, conditionMaterial: null, seller: null, percentValidity: null, codeMaterialPnc01: null };
    concessionRequest.client = that.state.client;
    concessionRequest.nroInvoice = that.state.nroInvoice;
    concessionRequest.conditionMaterial = that.state.stateMaterial;
    concessionRequest.seller = that.state.seller;
    concessionRequest.percentValidity = that.state.validatePercent;
    concessionRequest.codeMaterialPnc01 = that.state.codMaterialPNC01;
    return concessionRequest;
}
export function setDataDefaultConcessionRequest(){
    that.setState({
        client: null,
        nroInvoice: null,
        seller: null,
        codMaterialPNC01: null,
        validatePercent: null,
        stateMaterial: null,
    });
}