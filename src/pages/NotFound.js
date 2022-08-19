import React, {Component} from 'react';
import {Button} from "primereact/button";

export default class NotFound extends Component {

	render() {
		return <div className="p-grid p-col-12" style={{textAlign:'center'}}>
			
			<div className="exception-panel">
				<div className="exception-image">
					<img src="assets/layout/images/exception/icon-error.png" alt="avalon-react"/>
				</div>
				<div className="exception-panel-content">
					<div className="information-text">
						<h3>Ups</h3>
						<p>Servicio en contrucción favor continuar con otras opciones </p>
					</div>
					{/* <Button label="Go To Dashboard" onClick={() => {window.location = "/#"}} /> */}
				</div>
			</div>
		</div>
	}
}