import React, {Component} from 'react';
import {Button} from "primereact/button";

export default class Access extends Component {

	render() {
		return <div className="exception-body access">
			<div className="exception-text">
				<div className="exception-box">
					<span>Access</span>
				</div>
				<span> Denied</span>
			</div>
			<div className="exception-panel">
				<div className="exception-image">
					<img src="assets/layout/images/exception/icon-error.png" alt="avalon-react"/>
				</div>
				<div className="exception-panel-content">
					<div className="information-text">
						<h3>Access denied to this resource.</h3>
						<p>You don't have the necessary permission.</p>
					</div>
					<Button label="Go To Dashboard" onClick={() => {window.location = "/#"}} />
				</div>
			</div>
		</div>
	}
}