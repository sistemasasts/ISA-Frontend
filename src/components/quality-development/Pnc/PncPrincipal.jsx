import React, { Component } from 'react';

class PncPrincipal extends Component {

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
    }
}

export default PncPrincipal;