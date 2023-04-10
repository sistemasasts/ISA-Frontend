import React, { Component } from 'react';
import { Carousel } from 'primereact/carousel';
import PncService from '../../../../service/Pnc/PncService';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class DetalleDefectos extends Component {

    constructor() {
        super();
        this.state = {
            idPnc: 0,
            defectos: [],
            mostrar: false,
        }
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
            }
        ];
        this.cerrarDialogo = this.cerrarDialogo.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            this.fetchData(this.props.idPnc);
        }
    }

    async fetchData(data) {
        console.log(data)
        const defectos = await PncService.listarDefectos(data);
        this.setState({ defectos: defectos, mostrar: true })
    }

    async componentDidMount() {
        this.fetchData(this.props.idPnc);
    }

    cerrarDialogo() {
        this.props.that.setState({
            pncSeleccionado: null,
            mostrarDefectos: false
        });
        this.setState({
            mostrar: false, id: null,
            defectos: []
        })
    }


    defectoTemplate(defecto) {
        return (
            <div className="car-details">
                <div className="p-grid p-nogutter">
                    <div className="p-col-12" style={{ textAlign: 'center' }}>
                        <img style={{ width: 'auto', maxHeight: '100%', maxWidth: '100%', display: 'block', margin: 'auto' }}
                            src={`data:${defecto.tipoImagen};base64, ${defecto.base64}`} alt={defecto.defecto} />
                    </div>
                    <div className="p-col-12 car-data" style={{ textAlign: 'center' }}>
                        <div className="car-title" style={{ fontWeight: '200', fontSize: '20px', marginTop: '24px' }}>{defecto.defecto}</div>
                        {/* <div className="car-subtitle">{defecto.cantidad} | {defecto.color}</div> */}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={this.cerrarDialogo} />
        </div>;
        return (
            <div>
                <Dialog header={"Detalle Defectos"} visible={this.state.mostrar} style={{ width: '50vw' }} onHide={() => this.cerrarDialogo()} blockScroll footer={dialogFooter} >
                    <Carousel value={this.state.defectos} itemTemplate={this.defectoTemplate} numVisible={1} numScroll={1}
                        responsiveOptions={this.responsiveOptions}></Carousel>
                </Dialog>
            </div>
        )
    }
}
export default DetalleDefectos;