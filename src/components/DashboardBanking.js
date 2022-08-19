import React, {Component} from 'react';
import {CarService} from '../service/CarService';
import {Panel} from 'primereact/components/panel/Panel';
import {Button} from 'primereact/components/button/Button';
import {ProgressBar} from 'primereact/progressbar';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";

export class DashboardBanking extends Component {

	constructor() {
		super();
		this.state = {
			city: null,
			selectedCar: null
		};
		this.onCityChange = this.onCityChange.bind(this);
		this.carservice = new CarService();
	}

	onCityChange(e) {
		this.setState({city: e.value});
	}

	componentDidMount() {
		this.carservice.getCarsSmall().then(data => this.setState({cars: data}));
	}

	render() {
		let cities = [
			{label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}},
			{label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}},
			{label: 'London', value: {id: 3, name: 'London', code: 'LDN'}},
			{label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}},
			{label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}}
		];

		const financialHeader1 = (
			<span className="panel-heading-title">Accounts</span> &&
			<span className="panel-heading-desc"> Last Update: Justnow </span>
		);

		const financialHeader2 = (
			<span className="panel-heading-title">Debts</span> &&
			<span className="panel-heading-desc"> Last Update: Just now </span>
		);

		const expensesHeader = (
			<span className="panel-heading-title">Expenses</span> &&
			<span className="panel-heading-desc">Last Update: Just now</span>
		)

		return (
			<div className="dashboard-banking">
				<div className="p-grid overview-boxes">
					<div className="p-col-12 p-md-4 p-lg-2">
						<div className="overview clearfix">
							<div className="overview-icon">
								<img src="assets/layout/images/dashboard-banking/icon-transfer.png" alt="avalon-layout"
									 width="52" className="icon-transfer"/>
							</div>

							<div className="overview-text">
								<span className="overview-title">Make</span>
								<span className="overview-subtitle">Swift Transfer</span>
							</div>
						</div>
					</div>

					<div className="p-col-12 p-md-4 p-lg-2">
						<div className="overview clearfix">
							<div className="overview-icon">
								<img src="assets/layout/images/dashboard-banking/icon-creditcards.png"
									 alt="avalon-layout"
									 width="52" className="icon-creditcards"/>
							</div>

							<div className="overview-text">
								<span className="overview-title">Pay</span>
								<span className="overview-subtitle">Credit Cards</span>
							</div>
						</div>
					</div>

					<div className="p-col-12 p-md-4 p-lg-2">
						<div className="overview clearfix">
							<div className="overview-icon">
								<img src="assets/layout/images/dashboard-banking/icon-cardtransfer.png"
									 alt="avalon-layout"
									 width="52" className="icon-cardtransfer"/>
							</div>

							<div className="overview-text">
								<span className="overview-title">Make</span>
								<span className="overview-subtitle">Card Transfer</span>
							</div>
						</div>
					</div>

					<div className="p-col-12 p-md-4 p-lg-2">
						<div className="overview clearfix">
							<div className="overview-icon">
								<img src="assets/layout/images/dashboard-banking/icon-receivemoney.png"
									 alt="avalon-layout"
									 width="52" className="icon-receivemoney"/>
							</div>

							<div className="overview-text">
								<span className="overview-title">Receive</span>
								<span className="overview-subtitle">Money</span>
							</div>
						</div>
					</div>

					<div className="p-col-12 p-md-4 p-lg-2">
						<div className="overview clearfix">
							<div className="overview-icon">
								<img src="assets/layout/images/dashboard-banking/icon-transactions.png"
									 alt="avalon-layout"
									 width="52" className="icon-transactions"/>
							</div>

							<div className="overview-text">
								<span className="overview-title">See</span>
								<span className="overview-subtitle">Transactions</span>
							</div>
						</div>
					</div>

					<div className="p-col-12 p-md-4 p-lg-2">
						<div className="overview clearfix">
							<div className="overview-icon">
								<img src="assets/layout/images/dashboard-banking/icon-ticket.png" alt="avalon-layout"
									 width="52" className="icon-ticket"/>
							</div>

							<div className="overview-text">
								<span className="overview-title">Open</span>
								<span className="overview-subtitle">Ticket</span>
							</div>
						</div>
					</div>
				</div>

				<div className="p-grid currency-panel">
					<div className="p-col-12 p-md-6 p-lg-3 clearfix">
						<div className="dashboard-currency">
							<div className="dashboard-currency-icon">
								<img src="assets/layout/images/dashboard-banking/icon-dollar.png" alt="avalon-layout"
									 width="30" className="icon-dollar"/>
							</div>

							<div className="dashboard-currency-label">
								<div className="dashboard-currency-title">USD</div>
								<div className="dashboard-currency-subtitle">US Dollar</div>
							</div>

							<div className="dashboard-currency-rates">
								<div className="dashboard-currency-rate">
									<span className="currency-rate-title">Latest</span>
									<span className="currency-rate-value">3,5232</span>
								</div>

								<div className="dashboard-currency-rate">
									<span className="currency-rate-title">Change</span>
									<span className="currency-rate-value">-0.85</span>
								</div>
							</div>
						</div>
					</div>

					<div className="p-col-12 p-md-6 p-lg-3 clearfix">
						<div className="dashboard-currency">
							<div className="dashboard-currency-icon">
								<img src="assets/layout/images/dashboard-banking/icon-euro.png" alt="avalon-layout"
									 width="30" className="icon-euro"/>
							</div>

							<div className="dashboard-currency-label">
								<div className="dashboard-currency-title">EUR</div>
								<div className="dashboard-currency-subtitle">Euro</div>
							</div>

							<div className="dashboard-currency-rates">
								<div className="dashboard-currency-rate">
									<span className="currency-rate-title">Latest</span>
									<span className="currency-rate-value">4,1246</span>
								</div>

								<div className="dashboard-currency-rate">
									<span className="currency-rate-title">Change</span>
									<span className="currency-rate-value">-0.16</span>
								</div>
							</div>
						</div>
					</div>

					<div className="p-col-12 p-md-6 p-lg-3 clearfix">
						<div className="dashboard-currency">
							<div className="dashboard-currency-icon">
								<img src="assets/layout/images/dashboard-banking/icon-gbp.png" alt="avalon-layout"
									 width="30" className="icon-gbp"/>
							</div>

							<div className="dashboard-currency-label">
								<div className="dashboard-currency-title">GBP</div>
								<div className="dashboard-currency-subtitle">Pound</div>
							</div>

							<div className="dashboard-currency-rates">
								<div className="dashboard-currency-rate">
									<span className="currency-rate-title">Latest</span>
									<span className="currency-rate-value">4,6300</span>
								</div>

								<div className="dashboard-currency-rate">
									<span className="currency-rate-title">Change</span>
									<span className="currency-rate-value">-0.25</span>
								</div>
							</div>
						</div>
					</div>

					<div className="p-col-12 p-md-6 p-lg-3 clearfix">
						<div className="dashboard-currency">
							<div className="dashboard-currency-icon">
								<img src="assets/layout/images/dashboard-banking/icon-gold.png" alt="avalon-layout"
									 width="30" className="icon-gold"/>
							</div>

							<div className="dashboard-currency-label">
								<div className="dashboard-currency-title currency-gold">GOLD</div>
							</div>

							<div className="dashboard-currency-rates">
								<div className="dashboard-currency-rate">
									<span className="currency-rate-title">Latest</span>
									<span className="currency-rate-value">143,059</span>
								</div>

								<div className="dashboard-currency-rate">
									<span className="currency-rate-title">Change</span>
									<span className="currency-rate-value">-0.85</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="p-grid financial-overview">
					<div className="p-col-12 p-md-12 p-lg-4 ">
						<Panel className="account" header={financialHeader1}>

							<div className="financial-overview-total">
								<span className="financial-overview-total-label">Grand Total</span>
								<span className="financial-overview-total-value">624,504.00</span>

								<div className="clearfix"></div>
							</div>

							<div className="panel-inner">
								<div className="financial-overview-line">
									<div className="line-left">
											<span className="line-icon">
												<i className="fa fa-credit-card"></i>
											</span>
										<span className="line-label">Bank Accounts</span>
									</div>

									<div className="line-right">
										<span className="line-value">$320,521.25</span>
										<a href="/" className="line-caret"><i className="fa fa-angle-double-right"></i></a>
									</div>

									<div className="clearfix"></div>
								</div>

								<div className="financial-overview-line">
									<div className="line-left pull-left">
									<span className="line-icon">
										<i className="fa fa-shield"></i>
									</span>
										<span className="line-label">Savings</span>
									</div>

									<div className="line-right pull-right ">
										<span className="line-value">$94,305.00</span>
										<a href="/" className="line-caret"><i className="fa fa-angle-double-right"></i></a>
									</div>

									<div className="clearfix"></div>
								</div>

								<div className="financial-overview-line">
									<div className="line-left pull-left">
									<span className="line-icon">
										<i className="fa fa-cc-amex"></i>
									</span>
										<span className="line-label">Amex</span>
									</div>

									<div className="line-right pull-right ">
										<span className="line-value">$5,000.00</span>
										<a href="/" className="line-caret"><i className="fa fa-angle-double-right"></i></a>
									</div>

									<div className="clearfix"></div>
								</div>

								<div className="financial-overview-line">
									<div className="line-left pull-left">
									<span className="line-icon">
										<i className="fa fa-cc-visa"></i>
									</span>
										<span className="line-label">Visa</span>
									</div>

									<div className="line-right pull-right ">
										<span className="line-value">$21.25</span>
										<a href="/" className="line-caret"><i className="fa fa-angle-double-right"></i></a>
									</div>

									<div className="clearfix"></div>
								</div>
							</div>
						</Panel>
					</div>

					<div className="p-col-12 p-md-12 p-lg-4 ">
						<Panel header={financialHeader2}>

							<div className="financial-overview-total">
								<span className="financial-overview-total-label">Grand Total</span>
								<span className="financial-overview-total-value">125,330.00</span>

								<div className="clearfix"></div>
							</div>

							<div className="panel-inner">
								<div className="financial-overview-line">
									<div className="line-left pull-left">
									<span className="line-icon">
										<i className="fa fa-briefcase"></i>
									</span>
										<span className="line-label">Used Credits</span>
									</div>

									<div className="line-right pull-right">
										<span className="line-value">$100,240.00</span>
										<a href="/" className="line-caret"><i className="fa fa-angle-double-right"></i></a>
									</div>

									<div className="clearfix"></div>
								</div>

								<div className="financial-overview-line">
									<div className="line-left pull-left">
									<span className="line-icon">
										<i className="fa fa-calendar-o"></i>
									</span>
										<span className="line-label">Loans</span>
									</div>

									<div className="line-right pull-right ">
										<span className="line-value">$25,090.00</span>
										<a href="/" className="line-caret"><i className="fa fa-angle-double-right"></i></a>
									</div>

									<div className="clearfix"></div>
								</div>

								<div className="financial-overview-line">
									<div className="line-left pull-left">
									<span className="line-icon">
										<i className="fa fa-flag-checkered"></i>
									</span>
										<span className="line-label">Overdrafts</span>
									</div>

									<div className="line-right pull-right ">
										<span className="line-value">$0</span>
										<a href="/" className="line-caret"><i className="fa fa-angle-double-right"></i></a>
									</div>

									<div className="clearfix"></div>
								</div>
							</div>
						</Panel>
					</div>

					<div className="p-col-12 p-md-12 p-lg-4">
						<Panel className="financial-overview">
							<a href="/" className="thumbnail nopadding">
								<img src="assets/layout/images/dashboard-banking/asset-japan.png" alt="avalon-layout"
									 width="30" className="asset-japan "/>
							</a>
							<div className="panel-inner no-padding-top">
								<h3><strong>Journey to Japan</strong></h3>
								<div className="progress">
									<ProgressBar value={30} className="pro"></ProgressBar>
								</div>

								<div className="progress-explaination">
									<p><span style={{color: '#292b2c'}}><b>$3,000.00</b></span> from $10,000.00</p>
								</div>

								<div className="progress-buttons">
									<Button label="Deposit"></Button>
									<a href="/" className="pull-right button-link">Withdraw</a>
								</div>
							</div>

							<div className="clearfix"></div>
						</Panel>
					</div>
				</div>

				<div className="p-grid">
					<div className="p-col-12 p-md-12 p-lg-4 ">
						<Panel className="expenses" header={expensesHeader}>

							<img src="assets/layout/images/dashboard-banking/chart-expenses.png" alt="avalon-layout"
								 className="chart-expenses"/>

							<div className="chart-details pull-right">
								<div className="chart-label">
									<i className="fa fa-circle shape1"></i>Segment 1
								</div>
								<div className="chart-label-name">Advertisement</div>
								<div className="chart-status status1">
									<i className="fa fa-angle-up"></i>5% increased
								</div>

								<div className="chart-label">
									<i className="fa fa-circle shape2"></i>Segment 2
								</div>
								<div className="chart-label-name">Bills</div>
								<div className="chart-status status1">
									<i className="fa fa-angle-up"></i>12% increased
								</div>

								<div className="chart-label">
									<i className="fa fa-circle shape3"></i>Segment 3
								</div>
								<div className="chart-label-name">Salaries</div>
								<div className="chart-status status2">
									<i className="fa fa-angle-down"></i>3% decreased
								</div>
							</div>

							<div className="clearfix"></div>
						</Panel>
					</div>

					<div className="p-col-12 p-md-12 p-lg-8 ">
						<Panel className="messages" header={<div className="panel-heading-title">Messages</div>}>
							<div className="p-grid-row">
								<div className="message-box">
									<div className="message">
										<img src="assets/layout/images/dashboard-banking/profile.png"
											 alt="avalon-layout"
											 className="messager-img"/>

										<div className="messager">Joshua Williams
											<i className="fa fa-circle online"></i>
											<span className="date pull-right">Today</span>
										</div>

										<div className="message-text">Paenitet me quod tu me rogas? Oh, sic, qui stultus
											plastic continentis rogavi te ut emas. Vides non manducare acidum
											hydrofluoric per plastic.
										</div>
									</div>

									<div className="clearfix"></div>
								</div>

								<div className="message-box">
									<div className="message">
										<img src="assets/layout/images/dashboard-banking/profile1.png"
											 alt="avalon-layout"
											 className="messager-img"/>

										<div className="messager">Adelle Charles
											<i className="fa fa-circle offline"></i>
											<span className="date pull-right">Today</span>
										</div>

										<div className="message-text">Quinquaginta septem est - pars tua, triginta
											quinque millia. Est autem extra plus quindecim, tota tua est, quom
											meruisset.
										</div>
									</div>

									<div className="clearfix"></div>
								</div>

								<div className="message-box">
									<div className="message">
										<img src="assets/layout/images/dashboard-banking/profile2.png"
											 alt="avalon-layout"
											 className="messager-img"/>

										<div className="messager">Marcos Moralez
											<i className="fa fa-circle online"></i>
											<span className="date pull-right">Yesterday</span>
										</div>

										<div className="message-text">Fac nos fecit. SIC.</div>
									</div>

									<div className="clearfix"></div>
								</div>

								<div className="message-box">
									<div className="message">
										<img src="assets/layout/images/dashboard-banking/profile3.png"
											 alt="avalon-layout"
											 className="messager-img"/>

										<div className="messager">Matt Litherland
											<i className="fa fa-circle online"></i>
											<span className="date pull-right">3 days ago</span>
										</div>

										<div className="message-text">Puto quia una res potest - venimus in cognitionem.
											Vide pretium in manibus.
										</div>
									</div>

									<div className="clearfix"></div>
								</div>
							</div>
						</Panel>
					</div>
				</div>

				<div className="p-grid">
					<div className="p-col-12 p-md-12 p-lg-6">
						<Panel header={<div className="panel-heading-title">Monthly Statistics</div>}>
							<img src="assets/layout/images/dashboard-banking/asset-graph.png" alt="avalon-layout" className="asset-graph p-grid-responsive"/>
						</Panel>
					</div>

					<div className="p-col-12 p-md-12 p-lg-6">
						<Panel header={<div className="panel-heading-title">Transactions</div>}>
							<table style={{width:'100%'}}>
								<tbody>
								<tr className="transaction">
									<td>
										<img src="assets/layout/images/dashboard-banking/asset-visa.png" alt="avalon-layout" className="asset-visa p-grid-responsive"/>
									</td>

									<td className="transaction-date-cont transaction-item ">
										<span className="transaction-title">07 July 2017</span>
										<span className="transaction-subtitle">16.21</span>
									</td>

									<td className="transaction-name transaction-item ">
										<span className="transaction-title"><strong>Recharge Card</strong></span>
										<span className="transaction-subtitle">Card *8076</span>
									</td>

									<td className="transaction-button transaction-item ">
										<Button label="See Details" className="secondary-btn"></Button>
									</td>
								</tr>
								<tr className="transaction">
									<td className="transaction-img ">
										<img src="assets/layout/images/dashboard-banking/asset-netflix.png" alt="avalon-layout" className=" p-grid-responsive"/>
									</td>

									<td className="transaction-date-cont transaction-item">
										<span className="transaction-title">06 July 2017</span>
										<span className="transaction-subtitle">11.05</span>
									</td>

									<td className="transaction-name transaction-item ">
										<span className="transaction-title"><strong>Online Payment</strong></span>
										<span className="transaction-subtitle">Netflix</span>
									</td>

									<td className="transaction-button transaction-item ">
										<Button label="See Details" className="secondary-btn"></Button>
									</td>
								</tr>
								<tr className="transaction">
									<td className="transaction-img ">
										<img src="assets/layout/images/dashboard-banking/asset-spotify.png" alt="avalon-layout" className=" p-grid-responsive"/>
									</td>

									<td className="transaction-date-cont transaction-item ">
										<span className="transaction-title">05 July 2017</span>
										<span className="transaction-subtitle">08.59</span>
									</td>

									<td className="transaction-name transaction-item ">
										<span className="transaction-title"><strong>Online Payment</strong></span>
										<span className="transaction-subtitle">Spotify</span>
									</td>

									<td className="transaction-button transaction-item ">
										<Button label="See Details" className="secondary-btn"></Button>
									</td>
								</tr>
								<tr className="transaction">
									<td className="transaction-img ">
										<img src="assets/layout/images/dashboard-banking/asset-newyorker.png" alt="avalon-layout" className=" p-grid-responsive"/>
									</td>

									<td className="transaction-date-cont transaction-item ">
										<span className="transaction-title">05 July 2017</span>
										<span className="transaction-subtitle">14.49</span>
									</td>

									<td className="transaction-name transaction-item ">
										<span className="transaction-title"><strong>Purchase</strong></span>
										<span className="transaction-subtitle">The New Yorker</span>
									</td>

									<td className="transaction-button transaction-item ">
										<Button label="See Details" className="secondary-btn"></Button>
									</td>
								</tr>
								</tbody>
							</table>
						</Panel>
					</div>
				</div>


				<div className="p-grid">
					<div className="p-col-12 p-md-12 p-lg-8 ">
						<Panel className="p-g-nopad assets" header={<div className="panel-heading-title">Your Assets</div>}>
							<DataTable value={this.state.cars} responsive={true} selectionMode="single" selection={this.state.selectedCar} onSelectionChange={(e) => this.setState({selectedCar: e.value})}>
								<Column field="vin" header="Vin" sortable={true} />
								<Column field="year" header="Year" sortable={true} />
								<Column field="brand" header="Brand" sortable={true} />
								<Column field="color" header="Color" sortable={true} />
							</DataTable>
						</Panel>
					</div>

					<div className="p-col-12 p-md-12 p-lg-4 no-margin-top">
						<Panel className="customer-support" header={<div className="panel-heading-title">Customer Support</div>}>
							<div className="support-top">
								<img src="assets/layout/images/dashboard-banking/icon-customersupport.png" alt="avalon-layout" className="pull-left"/>

								<div className="support-estimation">
									<span className="est-title"><strong>Estimated Wait Time</strong></span>
									<span className="est-time">21 minutes</span>
								</div>

								<div className="clearfix"></div>
							</div>

							<div className="p-grid">
								<div className="p-col-12">
									<Dropdown value={this.state.city} options={cities} placeholder="Select a City" className="p-grid-col-12" onChange={this.onCityChange} autoWidth={false} />
								</div>
								<div className="p-col-12">
									<InputText type="text" placeholder="Name" className="p-grid-col-12"/>
								</div>
								<div className="p-col-12">
									<InputText type="text" placeholder="Subject" className="p-grid-col-12"/>
								</div>
								<div className="p-col-12">
									<InputTextarea type="text" placeholder="Message" rows={2} autoResize={false} className="p-grid-col-12"/>
								</div>
								<div className="p-col-12 btn-padding">
									<Button type="button" label="Send" icon="fa fa-send" className="p-grid-col-12"></Button>
								</div>
							</div>
						</Panel>
					</div>
				</div>

			</div>
		);
	}
}