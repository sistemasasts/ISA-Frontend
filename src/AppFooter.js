import React, { Component } from 'react';

export class AppFooter extends Component {

    render() {
        return  <div className="layout-footer">
                    <span className="footer-text-left">
                        <img alt="Logo" src="assets/layout/images/logo-imptek.svg" />
                    </span>
                    <span className="footer-text-right">
                        <button className="p-link"><i className="fa fa-facebook"></i></button>
                        <button className="p-link"><i className="fa fa-twitter"></i></button>
                        <button className="p-link"><i className="fa fa-github"></i></button>
                    </span>
                </div>
    }
}