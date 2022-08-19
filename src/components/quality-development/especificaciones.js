import React, { Component } from 'react';
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { SplitButton } from 'primereact/components/splitbutton/SplitButton';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { TabView, TabPanel } from 'primereact/components/tabview/TabView';
import { Card } from 'primereact/components/card/Card';
//import {Card} from 'primereact/components/card/Card';


/* ======  DATA CATALOGOS ======== */
import { tipoProducto } from '../../global/catalogs';

export class Caracteristicas extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="ui-g-12">
                <Card>
                    <div className='ui-g'>
    
                    </div>
                </Card>

            </div>
        )
    }
}
