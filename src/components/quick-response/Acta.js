import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Panel } from 'primereact/components/panel/Panel';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import { Button } from 'primereact/components/button/Button';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { Editor } from 'primereact/components/editor/Editor';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { PickList } from 'primereact/components/picklist/PickList';
import { DataList } from 'primereact/components/dataview/DataView';

//================IMPORT DE VARIABLES=====================
import { comites } from './data';

var itemsAgendaTMP = [];
let es = {
    firstDayOfWeek: 1,
    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
};
let aux = [];


export class ActaQuickResponse extends Component {

    constructor() {
        super();
        this.state = {
            date: '',
            resumen: '',
            participantes: '',
            showModalParticipantes: false,
            showModalAgenda: false,
            showModalPlanes: false,
            itemTextAgenda: '',
            itemsAgenda: [],
            city: '',
            cities:[],
            picklistSourceCars:[],
            picklistTargetCars:[]

        }

        this.dataListTemplate = this.dataListTemplate.bind(this);
        this.addListItem = this.addListItem.bind(this);
        this.onDropdownChange = this.onDropdownChange.bind(this);
        this.dataListBoxCommitte = this.dataListBoxCommitte.bind(this);

        //this.showParticipantes=this.showParticipantes.bind(this);
    }

    componentDidMount() {
        debugger
        var data2=this.dataListBoxCommitte();
        this.setState({cities: data2});
        var data= comites[1].employees;
        this.setState({picklistSourceCars:data});
    }

    //********************===============FUNCIONES===============*************************

    //******===== DEFINE EL TEMPLATE VIEW DE LA DATA =========== */
    dataListTemplate(car) {

        if (!car) {
            return;
        }
        return (
            <div style={{ borderBottom: '1px solid #bdbdbd' }} className="clearfix car-item">
                <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} style={{ display: 'inline-block', margin: '24px', verticalAlign: 'middle', width: 48 }} />
                <div className="car-details" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <p>{car.nombre}</p>
                    <p style={{ color: '#757575' }}>{car.year} - {car.color}</p>
                </div>
                <Button icon="fa-search" style={{ margin: '24px 24px 0 0', float: 'right' }} />
            </div>);
    }

    //**======= GUARDA LA LISTA DE ITEMS ======== */
    addListItem() {
        if (this.state.itemTextAgenda != '') {
            var item = { nombre: this.state.itemTextAgenda }
            itemsAgendaTMP.push(item);
            this.setState({ itemsAgenda: itemsAgendaTMP })
        }
    }

    onDropdownChange(event) {
        this.setState({ city: event.value })
        console.log("Event===>"+event.value);
        
    }

    pickListTemplate(car) {
        if (!car) {
            return;
        }
        return <div className="ui-helper-clearfix">
            <div style={{ fontSize: '16px', float: 'right', margin: '15px 5px 0 0' }}>{car.name}</div>
        </div>
    }

    dataListBoxCommitte() {
        var aux=[];
        comites.forEach(function (element) {
            console.log(element);
            var item = new Object();
            item.label = element.name;
            item.value = element.idCommittee;
            aux.push({ label: element.name, value: element.idCommittee })
        });
        return aux;
    }


    render() {
        
        return (
            <div>
                <div className="ui-g">

                    <div className="ui-g-4" style={{ paddingBottom: '0' }}>
                        <div className="card" style={{ textAlign: "center", padding: '8px' }}>
                            <h3>SGQ-00</h3>
                        </div>
                    </div>
                    <div className="ui-g-4" style={{ paddingBottom: '0' }}>
                        <div className="card" style={{ textAlign: "center", padding: '8px' }}>
                            <h3>Reunión Respuesta Rápida</h3>
                        </div>
                    </div>
                    <div className="ui-g-4" style={{ paddingBottom: '0' }}>
                        <div className="card" style={{ textAlign: "center", padding: '8px' }}>
                            <h3>Revisión: 01</h3>
                        </div>
                    </div>
                </div>
                <div className="ui-g">
                    <div className="ui-g-12 ui-md-6 ui-lg-12 ui-fluid contact-form">
                        <div className="card">
                            <h2>Acta de Reunión</h2>
                            <div className="ui-g form-group">
                                <div className="ui-g-12">
                                    <div className="ui-g-9">
                                        <label htmlFor="acSimple">Asunto a Tratar</label>
                                        <div className="ui-g-12" style={{ paddingLeft: '0' }}>
                                            <InputText type="text" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="ui-g-3">
                                        <label htmlFor="acSimple">Fecha Próxima Reunión</label>
                                        <div className="ui-g-12" style={{ paddingLeft: '0' }}>
                                            <Calendar locale={es} dateFormat="dd/mm/yy" showIcon={true} value={this.state.date} onChange={(e) => this.setState({ date: e.value })}></Calendar>
                                        </div>
                                    </div>
                                </div>
                                <div className='ui-g-12'>
                                    <div className="ui-g-9">
                                        <label htmlFor="acAdvanced">Resumen</label>
                                        <div className="ui-g-12" style={{ paddingLeft: '0' }}>
                                            <Editor style={{ height: '120px' }} />
                                        </div>
                                    </div>
                                    <div className="ui-g-3" style={{ marginTop: '25px' }}>
                                        <Button label="Asistencia" style={{ marginBottom: '10px', height: '40px' }} className="success-btn" icon='fa fa-user-plus' onClick={() => this.setState({ showModalParticipantes: true })} />
                                        <Button label="Agenda" style={{ marginBottom: '10px', height: '40px' }} className="info-btn" icon='fa fa-book' onClick={() => this.setState({ showModalAgenda: true })} />
                                        <Button label="Planes" style={{ marginBottom: '10px', height: '40px' }} className="warning-btn" icon='fa fa-calendar-check-o' onClick={() => this.setState({ showModalPlanes: true })} />
                                    </div>
                                </div>
                                <div className="ui-g-4">
                                    <Button label="Terminar Reunión" />
                                </div>

                            </div>
                        </div>
                    </div>


                </div>

                <Dialog header="Participantes" visible={this.state.showModalParticipantes} width="900px" modal={true} onHide={() => this.setState({ showModalParticipantes: false })}>
                    <div className="card">
                        <div className="ui-g form-group ui-fluid">
                            <div className="ui-g-1">
                                <label>Comites</label>
                            </div>
                            <div className="ui-g-10">
                                <Dropdown options={this.state.cities} onChange={this.onDropdownChange} style={{ width: '300px' }} placeholder="Selecione un comite" />

                            </div>
                        </div>
                        <PickList source={this.state.picklistSourceCars} target={this.state.picklistTargetCars} sourceHeader="Disponible" targetHeader="Selecionados"
                            responsive={true} itemTemplate={(car) => <span>{car.name}</span>}
                            onChange={(e) => this.setState({ picklistSourceCars: e.source, picklistTargetCars: e.target })} />
                    </div>
                </Dialog>

                <Dialog header="Agenda" visible={this.state.showModalAgenda} width="900px" modal={true} onHide={() => this.setState({ showModalAgenda: false })}>
                    <div>
                        <div className="card">
                            <div className="ui-g form-group ui-fluid">
                                <div className="ui-g-9">
                                    <span className="ui-float-label">
                                        <label htmlFor="float-input">Item</label>
                                        <InputText id="float-input" type="text" onChange={(e) => this.setState({ itemTextAgenda: e.target.value })} />
                                    </span>
                                </div>
                                <div className="ui-g-3" >
                                    <Button label='Añadir' className="success-btn" icon='fa fa-user-plus' style={{ marginTop: '16px' }} onClick={this.addListItem} />
                                </div>
                            </div>
                            <DataList value={this.state.itemsAgenda} paginator={true} rows={3} className="cars-datalist" header="Lista de actividades"
                                itemTemplate={this.dataListTemplate} />
                        </div>
                    </div>

                </Dialog>

                <Dialog header="Planes de Acción" visible={this.state.showModalPlanes} width="350px" modal={true} onHide={() => this.setState({ showModalPlanes: false })}>

                </Dialog>


            </div>
        )
    }
}