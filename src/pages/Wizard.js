import React, {Component} from 'react';
import classNames from 'classnames';
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {Checkbox} from "primereact/checkbox";

export class Wizard extends Component {
	constructor() {
		super();
		this.state = {
			activeContent: 'register',
			activeTab: 'register',
			activeCard: 'pro',
			dropdownOptions: [
				{label: 'Select Time Zone', value: null},
				{label: 'UTC-12.00', value: {id: 1, name: 'UTC-12.00', code: '-12'}},
				{label: 'UTC-11.00', value: {id: 2, name: 'UTC-11.00', code: '-11'}},
				{label: 'UTC-10.00', value: {id: 3, name: 'UTC-10.00', code: '-10'}},
				{label: 'UTC-09.30', value: {id: 4, name: 'UTC-09.30', code: '-93'}},
				{label: 'UTC-09.00', value: {id: 5, name: 'UTC-09.00', code: '-09'}},
				{label: 'UTC-08.00', value: {id: 6, name: 'UTC-08.00', code: '-08'}},
				{label: 'UTC-07.00', value: {id: 7, name: 'UTC-07.00', code: '-07'}},
				{label: 'UTC-06.00', value: {id: 8, name: 'UTC-06.00', code: '-06'}},
				{label: 'UTC-05.00', value: {id: 9, name: 'UTC-05.00', code: '-05'}},
				{label: 'UTC-04.00', value: {id: 10, name: 'UTC-04.00', code: '-04'}},
				{label: 'UTC-03.30', value: {id: 11, name: 'UTC-03.30', code: '-33'}},
				{label: 'UTC-03.00', value: {id: 12, name: 'UTC-03.00', code: '-03'}},
				{label: 'UTC-02.00', value: {id: 13, name: 'UTC-02.00', code: '-02'}},
				{label: 'UTC-01.00', value: {id: 14, name: 'UTC-01.00', code: '-01'}},
				{label: 'UTC-+00.00', value: {id: 15, name: 'UTC-+00.00', code: '-00'}},
				{label: 'UTC+01.00', value: {id: 16, name: 'UTC+01.00', code: '+01'}},
				{label: 'UTC+02.00', value: {id: 17, name: 'UTC+02.00', code: '+02'}},
				{label: 'UTC+03.00', value: {id: 18, name: 'UTC+03.00', code: '+03'}},
				{label: 'UTC+03.30', value: {id: 19, name: 'UTC+03.30', code: '+33'}},
				{label: 'UTC+04.00', value: {id: 20, name: 'UTC+04.00', code: '+04'}},
				{label: 'UTC+04.30', value: {id: 21, name: 'UTC+04.30', code: '+43'}},
				{label: 'UTC+05.00', value: {id: 22, name: 'UTC+05.00', code: '+05'}},
				{label: 'UTC+05.30', value: {id: 23, name: 'UTC+05.30', code: '+53'}},
				{label: 'UTC+05.45', value: {id: 24, name: 'UTC+05.45', code: '+54'}},
				{label: 'UTC+06.00', value: {id: 25, name: 'UTC+06.00', code: '+06'}},
				{label: 'UTC+06.30', value: {id: 26, name: 'UTC+06.30', code: '+63'}},
				{label: 'UTC+07.00', value: {id: 27, name: 'UTC+07.00', code: '+07'}},
				{label: 'UTC+08.00', value: {id: 28, name: 'UTC+08.00', code: '+08'}},
				{label: 'UTC+08.45', value: {id: 29, name: 'UTC+08.45', code: '+84'}},
				{label: 'UTC+09.00', value: {id: 30, name: 'UTC+09.00', code: '+09'}},
				{label: 'UTC+09.30', value: {id: 31, name: 'UTC+09.30', code: '+93'}},
				{label: 'UTC+10.00', value: {id: 32, name: 'UTC+10.00', code: '+10'}},
				{label: 'UTC+10.30', value: {id: 33, name: 'UTC+10.30', code: '+13'}},
				{label: 'UTC+11.00', value: {id: 34, name: 'UTC+01.00', code: '+11'}},
				{label: 'UTC+12.00', value: {id: 35, name: 'UTC+01.00', code: '+12'}},
				{label: 'UTC+12.45', value: {id: 36, name: 'UTC+01.00', code: '+24'}},
				{label: 'UTC+13.00', value: {id: 37, name: 'UTC+01.00', code: '+13'}},
				{label: 'UTC+14.00', value: {id: 38, name: 'UTC+01.00', code: '+14'}},
			],
			dropdownOptions2: [
				{label: 'Where did you hear Ultima', value: null},
				{label: 'Blogs', value: 'Blogs'},
				{label: 'Google Ads', value: 'google'},
				{label: 'Your Forum', value: 'prime-forum'},
				{label: 'Youtube', value: 'Youtube'},
				{label: 'Reddit', value: 'Reddit'},
				{label: 'Events', value: 'Events'},
				{label: 'Other', value: 'Other'}
			]
		};
	}


	clickNext(step) {
		if (step === 'register') {
			if (this.state.activeTab === 'register') {
				this.setState({
					activeTab: 'register',
					activeContent: 'register'
				});
			} else if (this.state.activeTab === 'tier') {
				setTimeout(() => {
					this.setState({
						activeContent: 'register'
					});
				}, 600);
				this.setState({
					activeTab: 'register'
				});
			} else {
				this.setState({activeTab: 'tier'});
				setTimeout(() => {
					this.setState({
						activeTab: 'register',
					});
				}, 600);
				setTimeout(() => {
					this.setState({
						activeContent: 'register'
					});
				}, 1200);
			}
		}
		if (step === 'tier') {
			this.setState({
				activeTab: 'tier'
			});
			setTimeout(() => {
				this.setState({
					activeContent: 'tier'
				});
			}, 600);
		}

		if (step === 'payment') {
			if (this.state.activeTab === 'payment') {
				this.setState({
					activeTab: 'payment',
					activeContent: 'payment'
				});
			} else if (this.state.activeTab === 'tier') {
				setTimeout(() => {
					this.setState({
						activeContent: 'payment'
					});
				}, 600);
				this.setState({
					activeTab: 'payment'
				});
			} else {
				this.setState({activeTab: 'tier'});
				setTimeout(() => {
					this.setState({
						activeTab: 'payment'
					});
				}, 600);
				setTimeout(() => {
					this.setState({
						activeContent: 'payment'
					});
				}, 1200);
			}
		}
	}

	selectTier(card) {
		this.setState({activeCard: card});
		setTimeout(() => {
			this.setState({activeTab: 'payment'});
		}, 600 );
		setTimeout(() => {
			this.setState({activeContent: 'payment'});
		}, 600);
	}

	render() {
		return (
			<div className="wizard-body">
				<div className="wizard-wrapper">
					<div className="wizard-container">
						<div className="wizard-header">
							<div className="wizard-tabs-container">
								<div
									className={classNames("wizard-tab register-tab", {'active-tab': this.state.activeTab !== null})}
									onClick={() => this.clickNext('register')}>
									<div className="tab-progressbar"/>
									<div className="tab-header"/>
								</div>
								<div
									className={classNames("wizard-tab tier-tab", {'active-tab': this.state.activeTab === 'tier' || this.state.activeTab === 'payment'})}
									onClick={() => this.clickNext('tier')}>
									<div className="tab-progressbar"/>
									<div className="tab-header"/>
								</div>
								<div
									className={classNames("wizard-tab payment-tab", {'active-tab': this.state.activeTab === 'payment'})}
									onClick={() => this.clickNext('payment')}>
									<div className="tab-progressbar"/>
									<div className="tab-header"/>
								</div>
							</div>
						</div>

						<div className={classNames("wizard-content register", {'active-content': this.state.activeContent === 'register'})}>
							<div className="content-header">
								<div className="p-grid">
									<div className="p-col-6 title">
										<h1>REGISTER</h1>
										<span>Please complete steps to register</span>
									</div>
									<div className="p-col-6 icon">
										<img src="assets/layout/images/extensions/icon-register.svg"
											 className="layout-image" alt="avalon-layout"/>
									</div>
								</div>
							</div>


							<div className="content">
								<div className="p-grid forms">
									<div className="p-col-12 p-lg-6">
										<label htmlFor="name">Username</label>
										<InputText id="name" placeholder="Name" className="form-element"/>

										<label htmlFor="email">Email</label>
										<InputText id="email" placeholder="Email" className="form-element"/>

										<label htmlFor="password">Password</label>
										<InputText id="password" placeholder="Password" className="form-element"/>
									</div>

									<div className="p-col-12 p-lg-6">
										<label htmlFor="timezone">Timezone</label>
										<Dropdown id="timezone" className="form-element"
												  options={this.state.dropdownOptions}
												  value={this.state.dropdownTime}
												  onChange={event => this.setState({dropdownTime: event.value})}/>

										<label htmlFor="popup">Birthdate</label>
										<Calendar id="popup" appendTo={document.body}
												  placeholder="Birthdate" className="form-element" value={this.state.date}
												  onChange={(e) => this.setState({date: e.value})}/>

										<label htmlFor="avalon">Where did you hear Avalon</label>
										<Dropdown id="avalon" appendTo={document.body} className="form-element"
												  options={this.state.dropdownOptions2}
												  value={this.state.dropdownHear}
												  onChange={event => this.setState({dropdownHear: event.value})}/>
									</div>
								</div>

								<div className="p-grid button">
									<Button className="continue-button" label="CONTINUE" style={{width: '100%'}} onClick={() => this.clickNext('tier')}/>
								</div>
							</div>
						</div>

						<div className={classNames("wizard-content tier", {'active-content': this.state.activeContent === 'tier'})}>
							<div className="content-header">
								<div className="p-grid">
									<div className="p-col-6 title">
										<h1>CHOOSE TIER</h1>
										<span>Now choose your account type</span>
									</div>
									<div className="p-col-6 icon">
										<img src="assets/layout/images/extensions/icon-tier@2x.png"
											 className="layout-image" alt="avalon-layout"/>
									</div>
								</div>
							</div>

							<div className="content">
								<div className="p-grid cards">
									<div className="p-col-12 p-md-4">
										<div className={classNames("tier-card basic", {'active-tier-card': this.state.activeCard === 'basic'})}
											 onClick={() => this.selectTier('basic')}>
											<div className="tier-card-header">
												<div className="ui-g-8">
													<h1>BEGINNER</h1>
													<span>For starters and side projects</span>
												</div>
												<div className="ui-g-4 icon">
													<i className="fa fa-check"/>
												</div>
											</div>
											<div className="tier-card-content">
												<div className="row even">
													Responsive
												</div>
												<div className="row">
													Push Mesaages
												</div>
											</div>
										</div>
									</div>

									<div className="p-col-12 p-md-4">
										<div className={classNames("tier-card pro", {'active-tier-card': this.state.activeCard === 'pro'})}
											 onClick={() => this.selectTier('pro')}>
											<div className="tier-card-header">
												<div className="ui-g-8">
													<h1>PROFFESIONAL</h1>
													<span>For companies</span>
												</div>
												<div className="ui-g-4 icon">
													<i className="fa fa-check"></i>
												</div>
											</div>
											<div className="tier-card-content">
												<div className="row even">
													Responsive
												</div>
												<div className="row">
													Push Mesaages
												</div>
												<div className="row even">
													7/24 Support
												</div>
											</div>
										</div>
									</div>

									<div className="p-col-12 p-md-4">
										<div className={classNames("tier-card pro-plus", {'active-tier-card': this.state.activeCard === 'pro-plus'})}
											 onClick={() => this.selectTier('pro-plus')}>
											<div className="tier-card-header">
												<div className="ui-g-8">
													<h1>ENTERPRISE</h1>
													<span>For custom needs</span>
												</div>
												<div className="ui-g-4 icon">
													<i className="fa fa-check"/>
												</div>
											</div>
											<div className="tier-card-content">
												<div className="row even">
													Responsive
												</div>
												<div className="row">
													Push Mesaages
												</div>
												<div className="row even">
													7/24 High Priority Support
												</div>
												<div className="row">
													Free Shipping
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="p-grid button">
									<Button className="continue-button" label="CONTINUE" style={{width: '100%'}} onClick={() => this.clickNext('payment')}/>
								</div>
							</div>
						</div>

						<div
							className={classNames("wizard-content payment", {'active-content': this.state.activeContent === 'payment'})}>
							<div className="p-grid p-nogutter">
								<div className="p-md-8 p-col-12 payment-info">
									<div className="content-header">
										<div className="ui-g">
											<div className="ui-g-12 title">
												<h1>PAYMENT</h1>
												<span>Give me the money</span>
											</div>
										</div>
									</div>

									<div className="content">
										<div className="p-grid forms">
											<div className="p-col-12">
												<label htmlFor="cardName">Cardholder Name</label>
												<InputText type="text" id="cardName" placeholder="Cardholder Name" className="form-element" />
											</div>
											<div className="p-col-12 p-md-6">
												<label htmlFor="cardNumber">Card Number</label>
												<InputText type="text" id="cardNumber" placeholder="Card Number" className="form-element" />
											</div>
											<div className="p-col-6 p-md-3">
												<label htmlFor="cardDate">Date</label>
												<InputText type="text" id="cardDate" placeholder="MO/YE" className="form-element" />
											</div>
											<div className="p-col-6 p-md-3">
												<label htmlFor="ccv">CCV</label>
												<InputText type="text" id="ccv" placeholder="XYZ" className="form-element" />
											</div>
										</div>

										<div className="p-grid checkbox">
											<Checkbox inputId="cb1" checked={this.state.checked}
													  onChange={e => this.setState({checked: e.checked})}/>
											<label htmlFor="cb1" className="p-checkbox-label" style={{marginBottom: '20px'}}>Save credit card information for future usage</label>
										</div>

										<div className="p-grid button">
											<Button type="button" label="CONTINUE" style={{width: '100%'}}/>
										</div>
									</div>
								</div>

								<div className="p-md-4 p-col-12 order-info">
									<div className={classNames('order order-default', {'selected-order': this.state.activeCard === ''})}>
										<div className="summary">
											<div className="p-grid">
												<div className="p-col-12">
													<h1>ORDER SUMMARY</h1>
												</div>
											</div>
											<div className="p-grid">
												<div className="p-col-8">Tier -</div>
												<div className="p-col-4 price">$0.00</div>
											</div>
											<div className="p-grid">
												<div className="p-col-8">VAT (%18)</div>
												<div className="p-col-4 price">$0.00</div>
											</div>
										</div>
										<div className="p-grid total">
											<div className="p-col-8">Total</div>
											<div className="p-col-4 price">$0.00</div>
											<div className="p-col-12">
												Please select one tier.
											</div>
										</div>
									</div>
									<div
										className={classNames('order order-basic', {'selected-order': this.state.activeCard === 'basic'})}>
										<div className="summary">
											<div className="p-grid">
												<div className="p-col-12">
													<h1>ORDER SUMMARY</h1>
												</div>
											</div>
											<div className="p-grid">
												<div className="p-col-8">Tier - Basic</div>
												<div className="p-col-4 price">$5.00</div>
											</div>
											<div className="p-grid">
												<div className="p-col-8">VAT (%18)</div>
												<div className="p-col-4 price">$0.90</div>
											</div>

										</div>
										<div className="p-grid total">
											<div className="p-col-8">Total</div>
											<div className="p-col-4 price">$5.90</div>
										</div>
									</div>
									<div
										className={classNames('order order-pro', {'selected-order': this.state.activeCard === 'pro'})}>
										<div className="summary">
											<div className="p-grid">
												<div className="p-col-12">
													<h1>ORDER SUMMARY</h1>
												</div>
											</div>
											<div className="p-grid">
												<div className="p-col-8">Tier - Pro</div>
												<div className="p-col-4 price">$25.00</div>
											</div>
											<div className="p-grid">
												<div className="p-col-8">VAT (%18)</div>
												<div className="p-col-4 price">$4.50</div>
											</div>
										</div>
										<div className="p-grid total">
											<div className="p-col-8">Total</div>
											<div className="p-col-4 price">$29.50</div>
										</div>
									</div>
									<div
										className={classNames('order order-pro-plus', {'selected-order': this.state.activeCard === 'pro-plus'})}>
										<div className="summary">
											<div className="p-grid">
												<div className="p-col-12">
													<h1>ORDER SUMMARY</h1>
												</div>
											</div>
											<div className="p-grid">
												<div className="p-col-8">Tier - Pro+</div>
												<div className="p-col-4 price">$50.00</div>
											</div>
											<div className="p-grid">
												<div className="p-col-8">VAT (%18)</div>
												<div className="p-col-4 price">$9.00</div>
											</div>
										</div>
										<div className="p-grid total">
											<div className="p-col-8">Total</div>
											<div className="p-col-4 price">$59.00</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
