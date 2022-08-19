import { Growl } from 'primereact/growl';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as _ from "lodash";
import Adjuntos from '../SolicitudEnsayo/Adjuntos';
import Historial from '../SolicitudEnsayo/Historial';
import { closeModal, openModal } from '../../../store/actions/modalWaitAction';
import FormularioSPPLectura from '../SolicitudPruebasEnProceso/FormularioSPPLectura';
import SolicitudPruebasProcesoService from '../../../service/SolicitudEnsayo/SolicitudPruebasProcesoService';

const TIPO_SOLICITUD = 'SOLICITUD_PRUEBAS_PROCESO';
let ESTADO = '';
class VerPP extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            observacion: null,
            estado: null,
            mostrarControles: false
        };

    }

    async componentDidMount() {
        this.refrescar(this.props.match.params.idSolicitud);
    }

    async refrescar(idSolicitud) {
        if (idSolicitud) {
            const solicitud = await SolicitudPruebasProcesoService.listarPorId(idSolicitud);
            if (solicitud) {
                ESTADO = solicitud.estado;
                this.setState({
                    id: solicitud.id,
                    estado: solicitud.estado,
                });
            }
        }
    }

    render() {
        return (

            <div className="card card-w-title">
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <FormularioSPPLectura solicitud={this.props.match.params.idSolicitud} />
                {this.state.id > 0 &&
                    <div className='p-grid p-grid-responsive p-fluid'>
                        <div className='p-col-12 p-lg-12 caja'>INFORMACIÓN ADICIONAL</div>
                        <div className='p-col-12 p-lg-12'>
                            <Adjuntos solicitud={this.props.match.params.idSolicitud} orden={"VALIDAR_SOLICITUD"} controles={this.state.mostrarControles} estado={ESTADO} tipo={TIPO_SOLICITUD} />
                            <Historial solicitud={this.props.match.params.idSolicitud} tipo={TIPO_SOLICITUD} />
                        </div>
                    </div>
                }

            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(VerPP);