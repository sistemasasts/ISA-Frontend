import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { Component } from 'react';

class Confirmacion extends Component {

    constructor() {
        super();
        this.state = {
            identificador: null,
            display: false,
            contenido: null
        };
        this.accionOK = this.accionOK.bind(this);
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData();
        }
    }

    fetchData() {
        console.log(this.props)
        const contenidoEnviado = this.props.contenido;
        const identificador = this.props.identificador;
        const mostrar = this.props.mostrar;
        this.setState({ contenido: contenidoEnviado, identificador: identificador, display: mostrar });
    }

    componentDidMount() {
        this.fetchData();
    }

    accionOK() {
        this.props.origen.respuestaConfirmacion(this.state.identificador);
        this.setState({ display: false });
    }

    cerrarDialogo() {
        this.props.origen.setState({ mostrarConfirmacion: false })
        this.setState({
            display: false,
            contenido: null,
        })
    }

    render() {
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Sí" icon="pi pi-check" onClick={this.accionOK} />
            <Button label="No" icon="pi pi-times" className="p-button-secondary" onClick={this.cerrarDialogo} />
        </div>;
        return (
            <Dialog header="Confirmación" visible={this.state.display} style={{ width: '30vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                <p>
                    {this.state.contenido}
                </p>
            </Dialog>
        )
    }
}
export default Confirmacion;
