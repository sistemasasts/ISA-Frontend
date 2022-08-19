import React, { Component } from 'react';

import { Dialog } from 'primereact/components/dialog/Dialog';
import { ProgressSpinner } from 'primereact/components/progressspinner/ProgressSpinner';
import { connect } from 'react-redux';
import { closeModal } from '../../store/actions/modalWaitAction';


/* Component que sirver para mostrar el mensaje de Espere por favor */
var that;
class PleaseWait extends Component {

    constructor() {
        super();
        this.state = {
            waitModalView: false,
        };
        that=this;

    }

    render() {
        setTimeout(function () {
            that.props.closeModal();
         }, 5000);
        return (
            <div className="p-col-12">
                <Dialog visible={this.props.modalWait.open} style={{ width: '20vw' }} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ waitModalView: false })}>
                    <div className="p-grid p-fluid">
                        <div className="p-col-12" style={{ textAlign: 'center', justifyContent: 'center' }}>
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

function mapDispatchToProps(dispatch) {
    return {
        closeModal: () => dispatch(closeModal()) // will be wrapped into a dispatch call
    }

};

const mapStateToProps = (state) => {
    return {
        modalWait: state.modalWait,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PleaseWait)