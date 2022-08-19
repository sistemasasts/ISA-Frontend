import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import App from "./App";
//import Login from "./pages/Login";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";
import Access from "./pages/Access";
import {Wizard} from "./pages/Wizard";
import  Login  from "./components/autentication/login"

class AppWrapper extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0)
		}
	}

	render() {
		switch(this.props.location.pathname) {
		/* 	case "/login":
				return <Route path="/login" component={Login}/> */
			case "/error":
				return <Route path="/error" component={Error}/>
			case "/notfound":
				return <Route path="/notfound" component={NotFound}/>
			case "/access":
				return <Route path="/access" component={Access}/>
			case "/wizard":
				return <Route path="/wizard" component={Wizard}/>
			default:
				return <Login/>;
		}
	}
}

export default withRouter(AppWrapper);
