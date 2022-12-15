import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';
import React, { Component } from 'react';
import EncuestaSatisfaccionService from '../../../service/EncuestaSatisfaccionService';
import * as _ from "lodash";
import { Growl } from 'primereact/growl';

class EncuestaSatisfaccion extends Component {
    constructor() {
        super();
        this.state = {
            solicitudId: null,
            display: false,
            comentario: null,
            satisfaccion: null,
            tipoSolicitud: null,
            escala: [],
        };
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
        this.registrar = this.registrar.bind(this);
    }

    async componentDidMount() {
        const catalog = await EncuestaSatisfaccionService.listarEscala();
        this.setState({ escala: catalog });
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData();
        }
    }

    fetchData() {
        const mostrar = this.props.mostrar;
        const tipo = this.props.tipo;
        const id = this.props.solicitud;
        this.setState({ display: mostrar, tipoSolicitud: tipo, solicitudId: id });
    }

    async registrar() {
        if (_.isEmpty(this.state.satisfaccion)) {
            this.growl.show({ severity: 'error', detail: 'Obligatorio seleccione su satisfacción!' });
            return false;
        }
        await EncuestaSatisfaccionService.registrar(this.crearObj());
        this.cerrarDialogo();
    }

    crearObj() {
        return {
            solicitudId: this.state.solicitudId,
            tipoSolicitud: this.state.tipoSolicitud,
            satisfaccion: this.state.satisfaccion,
            comentario: this.state.comentario
        }
    }

    cerrarDialogo() {
        //this.props.origen.setState({ mostrarConfirmacion: false })
        this.setState({
            display: false,
            tipoSolicitud: null,
            solicitudId: null
        })
    }


    render() {
        return (
            <div>
                <Growl ref={(el) => this.growl = el} style={{ marginTop: '75px' }} />
                <Dialog header="Encuesta de satisfacción" visible={this.state.display} style={{ width: '50vw' }} onHide={() => this.cerrarDialogo()} blockScroll closeOnEscape={false} closable={false}>
                    <p style={{ fontSize: '20px', textAlign: 'center' }}>
                        Por favor evalúe su experiencia en el manejo de su solicitud de soporte por el Centro de Investigación de Materiales Imptek
                    </p>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginTop: '10px' }}>

                            <img src="assets/layout/images/escala/MUY_MALO.png" alt="" style={{ width: '45px', height: '45px', marginLeft: '15px', marginRight: '15px' }} />
                            <img src="assets/layout/images/escala/MALO.png" alt="" style={{ width: '45px', height: '45px', marginLeft: '15px', marginRight: '15px' }} />
                            <img src="assets/layout/images/escala/REGULAR.png" alt="" style={{ width: '45px', height: '45px', marginLeft: '15px', marginRight: '15px' }} />
                            <img src="assets/layout/images/escala/BUENO.png" alt="" style={{ width: '45px', height: '45px', marginLeft: '15px', marginRight: '15px' }} />
                            <img src="assets/layout/images/escala/MUY_BUENO.png" alt="" style={{ width: '45px', height: '45px', marginLeft: '15px', marginRight: '15px' }} />

                        </div>
                        <SelectButton value={this.state.satisfaccion} options={this.state.escala} onChange={(e) => this.setState({ satisfaccion: e.value })}/>
                        {/* <Button style={{backgroundImage:'url(assets/layout/images/escala/MUY_MALO.png)', backgroundRepeat:'no-repeat' ,width:'78px', height:'78px'}} className="p-button-danger" label=' '></Button> */}
                    </div>
                    <div className='p-grid p-fluid' style={{ marginTop: '10px' }}>
                        <div className='p-col-12 p-lg-12'>
                            <label htmlFor="float-input">Comentario</label>
                            <InputTextarea value={this.state.comentario} onChange={(e) => this.setState({ comentario: e.target.value })} rows={3} />
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                        <Button className="p-button" label='ENVIAR ENCUESTA' onClick={this.registrar}></Button>
                    </div>
                </Dialog>
            </div>

        )
    }
}
export default EncuestaSatisfaccion;
