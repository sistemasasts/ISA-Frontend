import React, {Component} from 'react';
import {Button} from "primereact/button";

export default class Error extends Component {

	render() {
		return <div className="exception-body error">
			<div className="exception-text">
				<div className="exception-box">
					<span>Error</span>
				</div>
				<span> Occured</span>
			</div>
			<div className="exception-panel">
				<div className="exception-image">
					<img src="assets/layout/images/exception/icon-error.png" alt="avalon-react"/>
				</div>
				<div className="exception-panel-content">
					<div className="information-text">
						<h3>An error occured.</h3>
						<p>Please contact system administrator.</p>
					</div>
					<Button label="Go To Dashboard" onClick={() => {window.location = "/#"}} />
				</div>
			</div>
		</div>
	}
}