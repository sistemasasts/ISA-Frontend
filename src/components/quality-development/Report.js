import React, { Component } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Growl } from 'primereact/growl';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

/* ====================  T R A N S A C T I O N S ======================== */
import { GenerateDataReport } from '../../utils/TransactionsCalidad';

/* ====================  U T I L S  ======== */
import { formattedDate } from '../../utils/FormatDate';

/* =============  SUB-COMPONENTS  ======== */
import { PW, show_msgPW, hide_msgPW } from '../../global/SubComponents/PleaseWait'; //Sub-Componente "Espere Por favor..."

var that;
export class ReportData extends Component {

    constructor() {
        super();
        this.state = {
            data: null,
            dateIni: null,
            dateFin: null,
        };
        that = this;
        this.generateData = this.generateData.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.exportDataToExcel = this.exportDataToExcel.bind(this);
    }
    /* Metodo para lanzar mensajes */
    showMessage(message, type) {
        switch (type) {
            case 'error':
                this.growl.show({ severity: 'error', summary: 'Error', detail: message });
                break;
            case 'success':
                this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
                break;
            case 'info':
                this.growl.show({ severity: 'info', summary: 'Información', detail: message });
                break;
            default: break;
        }
    }

    generateData() {
        try {
            if (this.state.dateIni !== null && this.state.dateFin !== null) {
                var param = { dateIni: null, dateFin: null };
                param.dateIni = formattedDate(this.state.dateIni);
                param.dateFin = formattedDate(this.state.dateFin);
                show_msgPW();
                GenerateDataReport(param, function (data, status, msg) {
                    hide_msgPW();
                    switch (status) {
                        case 'OK':
                            that.showMessage(msg);
                            that.setState({ data: data });
                            break;
                        case 'ERROR':
                            that.showError(msg);
                            break;
                        default: break;
                    }
                })
            } else {
                this.showMessage("Favor ingrese los parametros", 'error');
            }
        } catch (e) {
            console.log(e);
        }

    }

    exportDataToExcel() {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'data';
        const ws = XLSX.utils.json_to_sheet(this.state.data);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    render() {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="p-toolbar-group-right">
                    <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
                </div>
                <div className="p-toolbar-group-left">
                    <Button label='Exportar' icon='fa fa-download' onClick={() => this.exportDataToExcel()} />
                </div>
            </Toolbar>
        </div>
        return (
            <div className='p-grid' >
                <Growl ref={(el) => this.growl = el} />
                <Card>
                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>REPORTES</span>
                    <div className='p-grid form-group p-fluid' >
                        <div className='p-col-12 p-lg-12'><span>* Favor ingrese los parametros para buscar la información</span></div>
                        <div className='p-col-12 p-lg-2'>
                            <label htmlFor="float-input">Fecha Inicio</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.dateIni} locale={es} showIcon="true" onChange={(e) => this.setState({ dateIni: e.value })}></Calendar>
                        </div>
                        <div className='p-col-12 p-lg-2'>
                            <label htmlFor="float-input">Fecha Fin</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.dateFin} locale={es} showIcon="true" onChange={(e) => this.setState({ dateFin: e.value })}></Calendar>
                        </div>
                        <div className='p-col-12 p-lg-1'>
                            <br />
                            <Button label='Bucar' icon='fa fa-search' onClick={() => this.generateData()} />
                        </div>
                    </div>


                    <div className='p-col-12 p-lg-12'>
                        <DataTable value={this.state.data} header={header} globalFilter={this.state.globalFilter} scrollable={true} scrollHeight="600px"      >
                            <Column field="dateOrder" header="Fecha Orden" style={{ width: '8%', textAlign: 'center' }} />
                            <Column field="nameProduct" header="Producto" style={{ width: '20%', textAlign: 'center' }} />
                            <Column field="typeProduct" header="Tipo Producto" style={{ width: '20%', textAlign: 'center' }} />
                            <Column field="batch" header="Lote" style={{ width: '7%', textAlign: 'center' }} />
                            <Column field="of" header="Orden Fabricación" style={{ width: '8%' }} />
                            <Column field="result" header="Resultado" style={{ width: '7%', textAlign: 'center' }} />
                            <Column field="resultView" header="Resultado visual" style={{ width: '7%', textAlign: 'center' }} />
                            <Column field="nameProperty" header="Propiedad" style={{ width: '20%', textAlign: 'center' }} />

                        </DataTable>

                    </div>
                </Card>
                <PW />
            </div>
        )
    }
}