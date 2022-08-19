import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { debounce } from '@fullcalendar/core';
import { connect } from 'react-redux';
import { logout } from './store/actions/loginAction';

class AppTopbar extends Component {

    static defaultProps = {
        onMenuButtonClick: null,
        onTopbarMenuButtonClick: null,
        onTopbarItemClick: null,
        profileMode: null,
        horizontal: false,
        topbarMenuActive: false,
        activeTopbarItem: null
    }

    static propTypes = {
        onMenuButtonClick: PropTypes.func.isRequired,
        onTopbarMenuButtonClick: PropTypes.func.isRequired,
        onTopbarItemClick: PropTypes.func.isRequired,
        profileMode: PropTypes.string.isRequired,
        horizontal: PropTypes.bool.isRequired,
        topbarMenuActive: PropTypes.bool.isRequired,
        activeTopbarItem: PropTypes.string
    }

    constructor() {
        super();
        this.state = {};
        this.cerrarSesion = this.cerrarSesion.bind(this);
    }

    onTopbarItemClick(event, item) {
        if (this.props.onTopbarItemClick) {
            this.props.onTopbarItemClick({
                originalEvent: event,
                item: item
            });
        }
    }

    cerrarSesion(){
        this.props.logout();
    }


    render() {
        let topbarItemsClassName = classNames('topbar-items fadeInDown', { 'topbar-items-visible': this.props.topbarMenuActive });
        
        return <div className="topbar clearfix">
            <div className="topbar-left">
                <img alt="Logo" src="assets/layout/images/logo-letter-white.png" className="topbar-logo" />
            </div>

            <div className="topbar-right">
                <button className="p-link" id="menu-button" onClick={this.props.onMenuButtonClick}>
                    <i className="fa fa-angle-left"></i>
                </button>

                <button className="p-link" id="topbar-menu-button" onClick={this.props.onTopbarMenuButtonClick}>
                    <i className="fa fa-bars"></i>
                </button>
                <ul className={topbarItemsClassName}>
                    {(this.props.profileMode === 'top' || this.props.horizontal) &&
                        <li className={classNames('profile-item', { 'active-top-menu': this.props.activeTopbarItem === 'profile' })}
                            onClick={(e) => this.onTopbarItemClick(e, 'profile')}>
                            <button className="p-link">
                                <img alt="User" className="profile-image" src="assets/layout/images/avatar.png" />
                                <span className="topbar-item-name">Isabel Lopez</span>
                                <span className="topbar-item-role">Marketing</span>
                            </button>

                            <ul className="layout-menu fadeInDown">
                                <li role="menuitem">
                                    <button className="p-link">
                                        <i className="fa fa-fw fa-user"></i>
                                        <span>Profile</span>
                                    </button>
                                </li>
                                <li role="menuitem">
                                    <button className="p-link">
                                        <i className="fa fa-fw fa-user-secret"></i>
                                        <span>Privacy</span>
                                    </button>
                                </li>
                                <li role="menuitem">
                                    <button className="p-link">
                                        <i className="fa fa-fw fa-cog"></i>
                                        <span>Settings</span>
                                    </button>
                                </li>
                                <li role="menuitem">
                                    <button className="p-link">
                                        <i className="fa fa-fw fa-sign-out"></i>
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </li>}

                    <li className={classNames({ 'active-top-menu': this.props.activeTopbarItem === 'settings' })}
                        onClick={(e) => this.onTopbarItemClick(e, 'settings')}>
                        <button className="p-link">
                            <i className="topbar-icon fa fa-fw fa-cog"></i>
                            <span className="topbar-item-name">Settings</span>
                        </button>
                        <ul className="layout-menu fadeInDown">
                      {/*       <li role="menuitem">
                                <button className="p-link">
                                    <i className="fa fa-fw fa-paint-brush"></i>
                                    <span>Change Theme</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link">
                                    <i className="fa fa-fw fa-star-o"></i>
                                    <span>Favorites</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link">
                                    <i className="fa fa-fw fa-lock"></i>
                                    <span>Lock Screen</span>
                                </button>
                            </li> */}
                            <li role="menuitem">
                                <button className="p-link" onClick={this.cerrarSesion}>
                                    <i className="fa fa-fw fa-lock"></i>
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </li>
                  {/*   <li className={classNames({ 'active-top-menu': this.props.activeTopbarItem === 'messages' })}
                        onClick={(e) => this.onTopbarItemClick(e, 'messages')}>
                        <button className="p-link">
                            <i className="topbar-icon fa fa-fw fa-envelope-o"></i>
                            <span className="topbar-badge">5</span>
                            <span className="topbar-item-name">Messages</span>
                        </button>
                        <ul className="layout-menu fadeInDown">
                            <li role="menuitem">
                                <button className="p-link topbar-message">
                                    <img alt="Avatar 1" src="assets/layout/images/avatar1.png" width="35" />
                                    <span>Give me a call</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link topbar-message">
                                    <img alt="Avatar 2" src="assets/layout/images/avatar2.png" width="35" />
                                    <span>Sales reports attached</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link topbar-message">
                                    <img alt="Avatar 3" src="assets/layout/images/avatar3.png" width="35" />
                                    <span>About your invoice</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link topbar-message">
                                    <img alt="Avatar 4" src="assets/layout/images/avatar2.png" width="35" />
                                    <span>Meeting today at 10pm</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link topbar-message">
                                    <img alt="Avatar 5" src="assets/layout/images/avatar4.png" width="35" />
                                    <span>Out of office</span>
                                </button>
                            </li>
                        </ul>
                    </li> */}
                   {/*  <li className={classNames({ 'active-top-menu': this.props.activeTopbarItem === 'notifications' })}
                        onClick={(e) => this.onTopbarItemClick(e, 'notifications')}>
                        <button className="p-link">
                            <i className="topbar-icon fa fa-fw fa-bell-o"></i>
                            <span className="topbar-badge animated rubberBand">4</span>
                            <span className="topbar-item-name">Notifications</span>
                        </button>
                        <ul className="layout-menu fadeInDown">
                            <li role="menuitem">
                                <button className="p-link">
                                    <i className="fa fa-fw fa-tasks"></i>
                                    <span>Pending tasks</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link">
                                    <i className="fa fa-fw fa-calendar-check-o"></i>
                                    <span>Meeting today at 3pm</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link">
                                    <i className="fa fa-fw fa-download"></i>
                                    <span>Download documents</span>
                                </button>
                            </li>
                            <li role="menuitem">
                                <button className="p-link">
                                    <i className="fa fa-fw fa-plane"></i>
                                    <span>Book flight</span>
                                </button>
                            </li>
                        </ul>
                    </li> */}
                    <li className="topbar-item-name" style={{ color: '#fff' }}>
                    
                        <strong>Usuario: </strong><span>{this.props.currentUser&&this.props.currentUser.employee.lastName + ' ' + this.props.currentUser.employee.name}</span>
                    </li>

                  {/*   <li className={classNames('search-item', { 'active-top-menu': this.props.activeTopbarItem === 'search' })}
                        onClick={(e) => this.onTopbarItemClick(e, 'search')}>
                        <div className="topbar-search">
                            <input type="text" placeholder="Search" />
                            <i className="fa fa-search"></i>
                        </div>
                    </li> */}
                </ul>
            </div>
        </div>;
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

export default connect(mapStateToProps, mapDispatchToProps)(AppTopbar);