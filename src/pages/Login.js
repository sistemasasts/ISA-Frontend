import React, {Component} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from "primereact/button";

export default class Login extends Component {

	render() {
		return <div className="login-body">
			<div className="login-image"></div>
			<div className="card login-panel p-fluid">
				<div className="login-panel-content">
					<div className="p-grid">
						<div className="p-col-3" style={{textAlign:'left'}}>
							<img src="assets/layout/images/login/icon-login.svg" alt="avalon-react"/>
						</div>
						<div className="p-col-9" style={{textAlign:'left'}}>
							<h2 className="welcome-text">Welcome Guest</h2>
							<span className="guest-sign-in">Sign in to Avalon Network</span>
						</div>
						<div className="p-col-12" style={{textAlign:'left'}}>
							<label className="login-label">Username</label>
							<div className="login-input">
								<InputText placeholder="Username"/>
							</div>
						</div>
						<div className="p-col-12" style={{textAlign:'left'}}>
							<label className="login-label">Password</label>
							<div className="login-input">
								<InputText type="password" placeholder="Password"/>
							</div>
						</div>
						<div className="p-col-12 p-md-6 button-pane">
							<Button label="Sign In" onClick={() => {window.location = "/#"}} />
						</div>
						<div className="p-col-12 p-md-6 link-pane">
							<a href="/#">Forget Password?</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
}