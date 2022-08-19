import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { logout } from './store/actions/loginAction';

class AppInlineProfile extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
        this.cerrarSesion = this.cerrarSesion.bind(this);
    }

    onClick(event) {
        this.setState({ expanded: !this.state.expanded });
        event.preventDefault();
    }

    cerrarSesion(){
        this.props.logout();
    }

    render() {

        let nombres = this.props.currentUser && this.props.currentUser.employee.name.split(' ')
        let apellidos = this.props.currentUser && this.props.currentUser.employee.lastName.split(' ')
        let area = this.props.currentUser && this.props.currentUser.employee.area.nameArea
        let cedula = this.props.currentUser && this.props.currentUser.employee.ciEmployee
        let rutaFoto= `assets/layout/images/${cedula}.png`;

        return <div>
            <div className={classNames('profile', { 'profile-expanded': this.state.expanded })}>
                <button className="p-link" onClick={this.onClick}>
                    <img alt="Profile" className="profile-image" src={rutaFoto} />
                    <span className="profile-name">{nombres && nombres[0]} {apellidos && apellidos[0]}</span>
                    <i className="fa fa-fw fa-caret-down"></i>
                    <span className="profile-role">{area && area}</span>
                </button>
            </div>

            <ul className="layout-menu profile-menu">
                <li role="menuitem">
                    <button className="p-link" tabIndex={this.state.expanded ? null : '-1'}>
                        <i className="fa fa-fw fa-user"></i>
                        <span>Profile</span>
                    </button>
                    <div className="layout-menu-tooltip">
                        <div className="layout-menu-tooltip-arrow"></div>
                        <div className="layout-menu-tooltip-text">Profile</div>
                    </div>
                </li>

                <li role="menuitem">
                    <button className="p-link" tabIndex={this.state.expanded ? null : '-1'} onClick={this.cerrarSesion}>
                        <i className="fa fa-fw fa-sign-out"></i>
                        <span>Logout</span>
                    </button>
                    <div className="layout-menu-tooltip">
                        <div className="layout-menu-tooltip-arrow"></div>
                        <div className="layout-menu-tooltip-text">Logout</div>
                    </div>
                </li>
            </ul>
        </div>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()) // will be wrapped into a dispatch call
    }

};

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AppInlineProfile)