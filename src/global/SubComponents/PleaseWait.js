import React, { Component } from 'react';

import { Dialog } from 'primereact/components/dialog/Dialog';
import { ProgressSpinner } from 'primereact/components/progressspinner/ProgressSpinner';

//import {Card} from 'primereact/components/card/Card';


/* Component que sirver para mostrar el mensaje de Espere por favor */
var that;
export class PW extends Component {

    constructor() {
        super();
        this.state = {
            waitModalView: false,
        };
        that = this;
    }

    render() {
        return (
            <div className="p-col-12">
                <Dialog visible={this.state.waitModalView} style={{ width: '20vw' }} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ waitModalView: false })}>
                    <div className="p-grid p-fluid">
                        <div className="p-col-12" style={{ textAlign: 'center', justifyContent: 'center'}}>
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

export function show_msgPW() {
    that.setState({ waitModalView: true });
}

export function hide_msgPW() {
    that.setState({ waitModalView: false });
}