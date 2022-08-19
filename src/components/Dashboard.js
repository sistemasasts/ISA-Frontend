import React, { Component } from 'react';
import { CarService } from '../service/CarService';
import { Panel } from 'primereact/components/panel/Panel';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import { Button } from 'primereact/components/button/Button';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { InputText } from 'primereact/components/inputtext/InputText';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { FullCalendar } from 'primereact/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ProductoService from '../service/productoService';

export class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
            tasks: [],
            city: null,
            selectedCar: null,
            fullcalendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                defaultDate: '2017-02-01',
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                }
            },
            events: [

                {
                    "id": 1,
                    "title": "All Day Event",
                    "start": "2017-02-01"
                },
                {
                    "id": 2,
                    "title": "Long Event",
                    "start": "2017-02-07",
                    "end": "2017-02-10"
                },
                {
                    "id": 3,
                    "title": "Repeating Event",
                    "start": "2017-02-09T16:00:00"
                },
                {
                    "id": 4,
                    "title": "Repeating Event",
                    "start": "2017-02-16T16:00:00"
                },
                {
                    "id": 5,
                    "title": "Conference",
                    "start": "2017-02-11",
                    "end": "2017-02-13"
                },
                {
                    "id": 6,
                    "title": "Meeting",
                    "start": "2017-02-12T10:30:00",
                    "end": "2017-02-12T12:30:00"
                },
                {
                    "id": 7,
                    "title": "Lunch",
                    "start": "2017-02-12T12:00:00"
                },
                {
                    "id": 8,
                    "title": "Meeting",
                    "start": "2017-02-12T14:30:00"
                },
                {
                    "id": 9,
                    "title": "Happy Hour",
                    "start": "2017-02-12T17:30:00"
                },
                {
                    "id": 10,
                    "title": "Dinner",
                    "start": "2017-02-12T20:00:00"
                },
                {
                    "id": 11,
                    "title": "Birthday Party",
                    "start": "2017-02-13T07:00:00"
                },
                {
                    "id": 12,
                    "title": "Click for Google",
                    "url": "http://google.com/",
                    "start": "2017-02-28"
                }
            ]
        };
        this.onTaskChange = this.onTaskChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.carservice = new CarService();
    }

    onTaskChange(e) {
        let selectedTasks = [...this.state.tasks];
        if (e.checked)
            selectedTasks.push(e.value);
        else
            selectedTasks.splice(selectedTasks.indexOf(e.value), 1);

        this.setState({ tasks: selectedTasks });
    }

    onCityChange(e) {
        this.setState({ city: e.value });
    }

    async componentDidMount() {
        debugger
        //this.carservice.getCarsSmall().then(data => this.setState({ cars: data }));
        //const lista = await ProductoService.list();
        var LoginValidate= { transactionName: "AAS", transactionCode: "TxAAS", parameters: { userName: 'dalpala', pass: '1723535553' } }

        LoginValidate.parameters = JSON.stringify(LoginValidate.parameters);
        console.log(LoginValidate)
        var data= await ProductoService.login(LoginValidate);
        console.log(LoginValidate)
        console.log(data);
        //this.setState({ productos: lista });
        
    }

    render() {
        let cities = [
            { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
            { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
            { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
            { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
            { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
        ];

        return <div className="p-grid dashboard">

            <div className="p-col-12 p-md-6 p-lg-3">
                <div className="p-grid overview-box overview-box-1">
                    <div className="overview-box-title">
                        <i className="fa fa-inbox"></i>
                        <span>Unread Messages</span>
                    </div>
                    <div className="overview-box-count">150</div>
                    <div className="overview-box-stats">12 less than yesterday</div>
                </div>
            </div>
            <div className="p-col-12 p-md-6 p-lg-3">
                <div className="p-grid overview-box overview-box-2">
                    <div className="overview-box-title">
                        <i className="fa fa-map-pin"></i>
                        <span>Check-ins</span>
                    </div>
                    <div className="overview-box-count">532</div>
                    <div className="overview-box-stats">46 more than yesterday</div>
                </div>
            </div>
            <div className="p-col-12 p-md-6 p-lg-3">
                <div className="p-grid overview-box overview-box-3">
                    <div className="overview-box-title">
                        <i className="fa fa-folder"></i>
                        <span>Files</span>
                    </div>
                    <div className="overview-box-count">450</div>
                    <div className="overview-box-stats">30 more than yesterday</div>
                </div>
            </div>
            <div className="p-col-12 p-md-6 p-lg-3">
                <div className="p-grid overview-box overview-box-4">
                    <div className="overview-box-title">
                        <i className="fa fa-user"></i>
                        <span>Users</span>
                    </div>
                    <div className="overview-box-count">532</div>
                    <div className="overview-box-stats">250 more than yesterday</div>
                </div>
            </div>

            <div className="p-col-12 p-lg-6 global-sales">
                <Panel header={<span><i className="fa fa-globe"></i><span>Global Sales</span></span>}>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Total Sales</th>
                                <th>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td><img alt="Brazil Flag" src="assets/layout/images/dashboard/flag-brazil.png" width="45" /></td>
                                <td>BRAZIL</td>
                                <td>4234</td>
                                <td>+35%</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td><img alt="China Flag" src="assets/layout/images/dashboard/flag-china.png" width="45" /></td>
                                <td>CHINA</td>
                                <td>3214</td>
                                <td>-25%</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td><img alt="Belgium Flag" src="assets/layout/images/dashboard/flag-belgium.png" width="45" /></td>
                                <td>BELGIUM</td>
                                <td>2842</td>
                                <td>+28%</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td><img alt="France Flag" src="assets/layout/images/dashboard/flag-france.png" width="45" /></td>
                                <td>FRANCE</td>
                                <td>1942</td>
                                <td>+15%</td>
                            </tr>
                        </tbody>
                    </table>
                </Panel>
            </div>

            <div className="p-col-12 p-lg-6 product-statistics">
                <Panel header={<span><i className="fa fa-line-chart"></i><span>Product Statistics</span></span>}>
                    <table>
                        <tbody>
                            <tr>
                                <td className="col-overview col-wait">
                                    <div>W</div>
                                </td>
                                <td className="col-status">
                                    <span className="status-time">Last Update: 12m ago</span>
                                    <span className="status-text">Currently Waiting</span>
                                </td>
                                <td className="col-numbers">
                                    <div>253 <span>Shipments</span></div>
                                    <div>584 <span>Orders</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="col-overview col-success">
                                    <div>S</div>
                                </td>
                                <td className="col-status">
                                    <span className="status-time">Last Update: 12m ago</span>
                                    <span className="status-text">Successfully Completed</span>
                                </td>
                                <td className="col-numbers">
                                    <div>312 <span>Shipments</span></div>
                                    <div>409 <span>Orders</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="col-overview col-delay">
                                    <div>D</div>
                                </td>
                                <td className="col-status">
                                    <span className="status-time">Last Update: 6m ago</span>
                                    <span className="status-text">Delayed</span>
                                </td>
                                <td className="col-numbers">
                                    <div>122 <span>Shipments</span></div>
                                    <div>341 <span>Orders</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="col-overview col-preorder">
                                    <div>P</div>
                                </td>
                                <td className="col-status">
                                    <span className="status-time">Last Update: 15m ago</span>
                                    <span className="status-text">Preordered</span>
                                </td>
                                <td className="col-numbers">
                                    <div>221 <span>Shipments</span></div>
                                    <div>332 <span>Orders</span></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Panel>
            </div>

            <div className="p-col-12 graphs">
                <div className="p-grid">
                    <div className="p-col-12 p-lg-4">
                        <div className="graph">
                            <div className="p-grid">
                                <div className="p-col-4">
                                    <span className="graph-title">Logins</span>
                                    <span className="graph-value">52003</span>
                                    <span className="graph-change">+32</span>
                                </div>
                                <div className="p-col-8">
                                    <img alt="Chart 1" src="assets/layout/images/dashboard/graph-1.svg" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-col-12 p-lg-4">
                        <div className="graph">
                            <div className="p-grid">
                                <div className="p-col-4">
                                    <span className="graph-title">Views</span>
                                    <span className="graph-value">532</span>
                                    <span className="graph-change">+24792</span>
                                </div>
                                <div className="p-col-8">
                                    <img alt="Chart 2" src="assets/layout/images/dashboard/graph-2.svg" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-col-12 p-lg-4">
                        <div className="graph">
                            <div className="p-grid">
                                <div className="p-col-4">
                                    <span className="graph-title">Sales</span>
                                    <span className="graph-value">$5521</span>
                                    <span className="graph-change">+243</span>
                                </div>
                                <div className="p-col-8">
                                    <img alt="Chart 3" src="assets/layout/images/dashboard/graph-3.svg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-6 p-lg-4 task-list">
                <Panel header="Tasks" style={{ minHeight: '415px' }}>
                    <ul>
                        <li>
                            <Checkbox value="task1" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task1') > -1 ? true : false}></Checkbox>
                            <span className="task-name">Sales Reports</span>
                            <i className="fa fa-briefcase"></i>
                        </li>
                        <li>
                            <Checkbox value="task2" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task2') > -1 ? true : false}></Checkbox>
                            <span className="task-name">Pay Invoices</span>
                            <i className="fa fa-credit-card"></i>
                        </li>
                        <li>
                            <Checkbox value="task3" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task3') > -1 ? true : false}></Checkbox>
                            <span className="task-name">Dinner with Tony</span>
                            <i className="fa fa-cutlery"></i>
                        </li>
                        <li>
                            <Checkbox value="task4" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task4') > -1 ? true : false}></Checkbox>
                            <span className="task-name">Client Meeting</span>
                            <i className="fa fa-user"></i>
                        </li>
                        <li>
                            <Checkbox value="task5" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task5') > -1 ? true : false}></Checkbox>
                            <span className="task-name">New Theme</span>
                            <i className="fa fa-paint-brush"></i>
                        </li>
                        <li>
                            <Checkbox value="task6" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task6') > -1 ? true : false}></Checkbox>
                            <span className="task-name">Flight Ticket</span>
                            <i className="fa fa-fighter-jet"></i>
                        </li>
                        <li>
                            <Checkbox value="task6" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task7') > -1 ? true : false}></Checkbox>
                            <span className="task-name">Generate Charts</span>
                            <i className="fa fa-area-chart"></i>
                        </li>
                        <li>
                            <Checkbox value="task6" onChange={this.onTaskChange} checked={this.state.tasks.indexOf('task8') > -1 ? true : false}></Checkbox>
                            <span className="task-name">Call Client</span>
                            <i className="fa fa-phone"></i>
                        </li>
                    </ul>
                </Panel>
            </div>
            <div className="p-col-12 p-md-6 p-lg-4 p-fluid contact-form">
                <Panel header="Contact Us" style={{ minHeight: '415px' }}>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <Dropdown value={this.state.city} options={cities} placeholder="Select a City" onChange={this.onCityChange} autoWidth={false} />
                        </div>
                        <div className="p-col-12">
                            <InputText type="text" placeholder="Name" />
                        </div>
                        <div className="p-col-12">
                            <InputText type="text" placeholder="Age" />
                        </div>
                        <div className="p-col-12">
                            <InputText type="text" placeholder="Email" />
                        </div>
                        <div className="p-col-12">
                            <InputTextarea type="text" placeholder="Message" />
                        </div>
                        <div className="p-col-12">
                            <Button type="button" label="Send" icon="fa fa-send"></Button>
                        </div>
                    </div>
                </Panel>
            </div>
            <div className="p-col-12 p-lg-4 contacts">
                <Panel header="Team" style={{ minHeight: '415px' }}>
                    <ul>
                        <li className="clearfix">
                            <img alt="User" src="assets/layout/images/avatar.png" width="45" />
                            <div className="contact-info">
                                <span className="name">Madison Hughes (me)</span>
                                <span className="location">jane@pn-manhattan.com</span>
                            </div>
                            <div className="contact-actions">
                                <span className="connection-status online">online</span>
                                <i className="fa fa-paper-plane-o"></i>
                                <i className="fa fa-phone"></i>
                            </div>
                        </li>
                        <li className="clearfix">
                            <img alt="Contact 1" src="assets/layout/images/avatar1.png" width="45" />
                            <div className="contact-info">
                                <span className="name">Joshua Williams</span>
                                <span className="location">joshua@pn-manhattan.com</span>
                            </div>
                            <div className="contact-actions">
                                <span className="connection-status online">online</span>
                                <i className="fa fa-paper-plane-o"></i>
                                <i className="fa fa-phone"></i>
                            </div>
                        </li>
                        <li className="clearfix">
                            <img alt="Contact 2" src="assets/layout/images/avatar2.png" width="45" />
                            <div className="contact-info">
                                <span className="name">Emily Clark</span>
                                <span className="location">emily@pn-manhattan.com</span>
                            </div>
                            <div className="contact-actions">
                                <span className="connection-status offline">offline</span>
                                <i className="fa fa-paper-plane-o"></i>
                                <i className="fa fa-phone"></i>
                            </div>
                        </li>
                        <li className="clearfix">
                            <img alt="Contact 3" src="assets/layout/images/avatar3.png" width="45" />
                            <div className="contact-info">
                                <span className="name">Tim Johnson</span>
                                <span className="location">tim@pn-manhattan.com</span>
                            </div>
                            <div className="contact-actions">
                                <span className="connection-status online">online</span>
                                <i className="fa fa-paper-plane-o"></i>
                                <i className="fa fa-phone"></i>
                            </div>
                        </li>
                        <li className="clearfix">
                            <img alt="Contact 4" src="assets/layout/images/avatar4.png" width="45" />
                            <div className="contact-info">
                                <span className="name">David Stark</span>
                                <span className="location">kelly@pn-manhattan.com</span>
                            </div>
                            <div className="contact-actions">
                                <span className="connection-status offline">offline</span>
                                <i className="fa fa-paper-plane-o"></i>
                                <i className="fa fa-phone"></i>
                            </div>
                        </li>
                    </ul>
                </Panel>
            </div>

            <div className="p-col-12 p-lg-8 chat">
                <Panel header="Chat" className="no-pad">
                    <ul>
                        <li className="clearfix message-from">
                            <img alt="Contact 2" src="assets/layout/images/avatar2.png" />
                            <span>Retro occupy organic, stumptown shabby chic pour-over roof party DIY normcore.</span>
                        </li>
                        <li className="clearfix message-own">
                            <img alt="User" src="assets/layout/images/avatar.png" />
                            <span>Actually artisan organic occupy, Wes Anderson ugh whatever pour-over gastropub selvage.</span>
                        </li>
                        <li className="clearfix message-from">
                            <img alt="Contact 2" src="assets/layout/images/avatar2.png" />
                            <span>Chillwave craft beer tote bag stumptown quinoa hashtag.</span>
                        </li>
                        <li className="clearfix message-own">
                            <img alt="User" src="assets/layout/images/avatar.png" />
                            <span>Dreamcatcher locavore iPhone chillwave, occupy trust fund slow-carb distillery art party narwhal.</span>
                        </li>
                        <li className="clearfix message-own">
                            <span>Sed ut perspiciatis unde omnis iste natus.</span>
                        </li>
                        <li className="clearfix message-from">
                            <img alt="Contact 2" src="assets/layout/images/avatar2.png" />
                            <span>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.</span>
                        </li>
                        <li className="clearfix message-own">
                            <img alt="User" src="assets/layout/images/avatar.png" />
                            <span>At vero eos et accusamus.</span>
                        </li>
                    </ul>
                    <div className="new-message">
                        <div className="message-attachment">
                            <i className="fa fa-paperclip"></i>
                        </div>
                        <div className="message-input">
                            <input type="text" placeholder="Write a message" className="p-inputtext" />
                        </div>
                    </div>
                </Panel>

                <Panel header="Recent Sales">
                    <DataTable value={this.state.cars} header="Recent Sales" style={{ marginBottom: '20px' }} responsive={true}
                        selectionMode="single" selection={this.state.selectedCar} onSelectionChange={(e) => this.setState({ selectedCar: e.value })}>
                        <Column field="vin" header="Vin" sortable={true} />
                        <Column field="year" header="Year" sortable={true} />
                        <Column field="brand" header="Brand" sortable={true} />
                        <Column field="color" header="Color" sortable={true} />
                    </DataTable>
                </Panel>
            </div>

            <div className="p-col-12 p-lg-4">
                <div className="card timeline p-fluid">
                    <div className="p-grid">
                        <div className="p-col-3">
                            <span className="event-time">just now</span>
                            <i className="fa fa-map-signs" style={{ color: '#3984b8' }}></i>
                        </div>
                        <div className="p-col-9">
                            <span className="event-owner" style={{ color: '#3984b8' }}>Katherine May</span>
                            <span className="event-text">Lorem ipsun dolor amet</span>
                            <div className="event-content">
                                <img alt="Bridge" src="assets/layout/images/dashboard/bridge.png" width="100" />
                            </div>
                        </div>

                        <div className="p-col-3">
                            <span className="event-time">12h ago</span>
                            <i className="fa fa-star" style={{ color: '#f6ac2b' }}></i>
                        </div>
                        <div className="p-col-9">
                            <span className="event-owner" style={{ color: '#f6ac2b' }}>Brandon Santos</span>
                            <span className="event-text">Ab nobis, magnam sunt eum. Laudantium, repudiandae, similique!.</span>
                        </div>

                        <div className="p-col-3">
                            <span className="event-time">15h ago</span>
                            <i className="fa fa-comment" style={{ color: '#7e8dcd' }}></i>
                        </div>
                        <div className="p-col-9">
                            <span className="event-owner" style={{ color: '#7e8dcd' }}>Stephan Ward</span>
                            <span className="event-text">Omnis veniam quibusdam ratione est repellat qui nam quisquam ab mollitia dolores ullam voluptates, similique, dignissimos.</span>
                            <div className="event-content">
                                <img alt="Nature" src="assets/demo/images/nature/nature1.jpg" width="100" />
                            </div>
                        </div>

                        <div className="p-col-3">
                            <span className="event-time">2d ago</span>
                            <i className="fa fa-map" style={{ color: '#e175a0' }}></i>
                        </div>
                        <div className="p-col-9">
                            <span className="event-owner" style={{ color: '#e175a0' }}>Jason Smith</span>
                            <span className="event-text">Laudantium, repudiandae, similique!</span>
                            <div className="event-content">
                                <img alt="Map" src="assets/layout/images/dashboard/map.png" />
                            </div>
                        </div>

                        <div className="p-col-3">
                            <span className="event-time">1w ago</span>
                            <i className="fa fa-heart" style={{ color: '#39b8b6' }}></i>
                        </div>
                        <div className="p-col-9">
                            <span className="event-owner">Kevin Cox</span>
                            <span className="event-text">Quibusdam ratione est repellat qui nam quisquam veniam quibusdam ratione.</span>
                        </div>

                        <div className="p-col-3">
                            <span className="event-time">2w ago</span>
                            <i className="fa fa-history" style={{ color: '#3eb839' }}></i>
                        </div>
                        <div className="p-col-9">
                            <span className="event-owner" style={{ color: '#3eb839' }}>Walter White</span>
                            <span className="event-text">I am the one who knocks!</span>
                        </div>

                        <div className="p-col-12">
                            <Button type="button" label="Refresh" icon="fa fa-refresh" className="rounded-btn raised-btn"></Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12">
                <Panel header="Calendar" style={{ height: '100%' }}>
                    <FullCalendar events={this.state.events} options={this.state.fullcalendarOptions} />
                </Panel>
            </div>
        </div>
    }
}
