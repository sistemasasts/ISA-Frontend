import React, { Component } from 'react';
import classNames from 'classnames';
import AppTopbar from './AppTopbar';
import AppInlineProfile from './AppInlineProfile';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { Route, HashRouter, Router } from 'react-router-dom';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'font-awesome/css/font-awesome.css';
import 'primereact/resources/primereact.min.css';
import './MainPage.css';
import { connect } from 'react-redux';
import Product from './components/quality-development/Producto/Product';
import HCC from './components/quality-development/Hcc';
import ProductoNoConforme from './components/quality-development/Pnc/Pnc';
import { ResultTest } from './components/quality-development/TestResuts';
import Complaint from './components/quality-development/ReclamosMP';
import WFlow from './components/quality-development/WorkFlow';
import { ReportData } from './components/quality-development/Report';

/* ==================== ACTIONS =======================  */
import { getUser } from './store/actions/loginAction';
import MenuService from './service/MenuService';
import { Home } from './components/Home';
import Propiedades from './components/quality-development/Propiedades/Propiedades';
import Proveedor from './components/quality-development/Proveedor/Proveedor';
import SalidaMaterial from './components/quality-development/ExitMaterialPNC/SalidaMaterial';
import Especificacion from './components/quality-development/Especificaciones/Especificacion';
import NotFound from './pages/NotFound';
import ProductoInstructivo from './components/quality-development/Producto/ProductoInstructivo';
import ProductNew from './components/quality-development/Producto/ProductNew';
import NormaLaboratorio from './components/quality-development/NormasLaboratorio/NormaLaboratorio';
import ConfigFormTestEntryMP from './components/quality-development/Test-type/ConfigFormTestEntryMP';
import ConfiguracionSF from './components/quality-development/Solicitud-flujo/ConfiguracionSF';
import PrincipalSE from './components/quality-development/SolicitudEnsayo/PrincipalSE';
import FormularioSE from './components/quality-development/SolicitudEnsayo/FormularioSE';
import ValidarPrincipal from './components/quality-development/SolicitudEnsayo/SolicitudValidar/ValidarPrincipal';
import VerValidar from './components/quality-development/SolicitudEnsayo/SolicitudValidar/VerValidar';
import ResponderPrincipal from './components/quality-development/SolicitudEnsayo/SolicitudResponder/ResponderPrincipal';
import VerResponder from './components/quality-development/SolicitudEnsayo/SolicitudResponder/VerResponder';
import AprobarPrincipal from './components/quality-development/SolicitudEnsayo/SolicitudAprobar/AprobarPrincipal';
import VerAprobar from './components/quality-development/SolicitudEnsayo/SolicitudAprobar/VerAprobar';
import PrincipalSPP from './components/quality-development/SolicitudPruebasEnProceso/PrincipalSPP';
import FormularioSPP from './components/quality-development/SolicitudPruebasEnProceso/FormularioSPP';
import ValidarPrincipalSPP from './components/quality-development/SolicitudPruebasEnProceso/SolicitudValidar/ValidarPrincipalSPP';
import VerValidarSPP from './components/quality-development/SolicitudPruebasEnProceso/SolicitudValidar/VerValidarSPP';
import ResponderPrincipalSPP from './components/quality-development/SolicitudPruebasEnProceso/ResponderCalidad/ResponderPrincipalSPP';
import VerResponderSPP from './components/quality-development/SolicitudPruebasEnProceso/ResponderCalidad/VerResponderSPP';
import ConsultaPrincipal from './components/quality-development/SolicitudConsulta/ConsultaPrincipal';
import VerSE from './components/quality-development/SolicitudConsulta/VerSE';
import VerSPP from './components/quality-development/SolicitudConsulta/VerSPP';
import ConfiguracionSPP from './components/quality-development/Solicitud-flujo/ConfiguracionSPP';
import AsignarResponsablePrincipalSPP from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionPlanta/AsignarResponsablePrincipalSPP';
import VerAsignarResponsableSPP from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionPlanta/VerAsignarResponsableSPP';
import PlantaPrincipal from './components/quality-development/SolicitudPruebasEnProceso/ResponderPlanta/PlantaPrincipal';
import VerPlantaSPP from './components/quality-development/SolicitudPruebasEnProceso/ResponderPlanta/VerPlantaSPP';
import AsignarResponsableMantenimiento from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionMantenimiento/AsignarResponsableMantenimiento';
import AsignarResponsableCalidad from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionDesarrolloProductos/AsignarResponsableCalidad';
import ResponderMantePrincipalSPP from './components/quality-development/SolicitudPruebasEnProceso/ResponderMantenimiento/ResponderMantePrincipalSPP';
import VerResponderManteSPP from './components/quality-development/SolicitudPruebasEnProceso/ResponderMantenimiento/VerResponderManteSPP';
import AprobacionMantenimiento from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionMantenimiento/AprobacionMantenimiento';
import VerAprobarManteSPP from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionMantenimiento/VerAprobarManteSPP';
import AprobacionCalidad from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionDesarrolloProductos/AprobacionCalidad';
import VerAprobarCalidadSPP from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionDesarrolloProductos/VerAprobarCalidadSPP';
import AprobacionPlanta from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionPlanta/AprobacionPlanta';
import VerAprobarPlantaSPP from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionPlanta/VerAprobarPlantaSPP';
import AprobacionPrincipalSPP from './components/quality-development/SolicitudPruebasEnProceso/AprobacionSolicitud/AprobacionPrincipalSPP';
import VerAprobacionSPP from './components/quality-development/SolicitudPruebasEnProceso/AprobacionSolicitud/VerAprobacionSPP';
import AjusteMaquinariaPrincipal from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionMantenimiento/AjusteMaquinariaPrincipal';
import VerAjusteMaquinaria from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionMantenimiento/VerAjusteMaquinaria';
import ReasignarResponsableCalidad from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionDesarrolloProductos/ReasignarResponsableCalidad';
import ReasignarResponsableMantenimiento from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionMantenimiento/ReasignarResponsableMantenimiento';
import ReasignarResponsablePlanta from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionPlanta/ReasignarResponsablePlanta';
import ConsultaPrincipalPP from './components/quality-development/SolicitudConsulta/ConsultaPrincipalPP';
import InformeSPP from './components/quality-development/SolicitudPruebasEnProceso/ValoresInforme/InformeSPP';
import InformeSPPLectura from './components/quality-development/SolicitudPruebasEnProceso/ValoresInforme/InformeSPPLectura';
import ConsultaTest from './components/quality-development/Test-type/ConsultaTest';
import Usuario from './components/administracion/usuarios/Usuario';
import UsuarioFormulario from './components/administracion/usuarios/UsuarioFormulario';
import VerAprobarSE from './components/quality-development/SolicitudPruebasEnProceso/CoordinacionDesarrolloProductos/VerAprobarSE';
import SEPlanesAccion from './components/quality-development/SolicitudEnsayo/SolicitudPlanesAccion/SEPlanesAccion';
import UnidadMedida from './components/quality-development/UnidadesMedida/UnidadMedida';
import RevisarPlanAccionPrincipal from './components/quality-development/RevisionPlanAccion/RevisarPlanAccionPrincipal';
import SEPlanesAccionVer from './components/quality-development/RevisionPlanAccion/SEPlanesAccionVer';
import SEPlanesAccionRev from './components/quality-development/SolicitudEnsayo/SolicitudPlanesAccion/SEPlanesAccionRev';
import Defecto from './components/quality-development/Pnc/Defectos/Defecto';
import PncPrincipal from './components/quality-development/Pnc/PncPrincipal';
import Form from './components/quality-development/Pnc/Form';
import PncAprobacionPrincipal from './components/quality-development/Pnc/Aprobacion/PncAprobacionPrincipal';
import PncVerAprobacion from './components/quality-development/Pnc/Aprobacion/PncVerAprobacion';
import PncSalidaMaterialForm from './components/quality-development/Pnc/SalidaMaterial/PncSalidaMaterialForm';
import PncPAProcesarPrincipal from './components/quality-development/Pnc/PlanAccion/Procesar/PncPAProcesarPrincipal';
import PncVerPAProcesar from './components/quality-development/Pnc/PlanAccion/Procesar/PncVerPAProcesar';
import PncPAValidarPrincipal from './components/quality-development/Pnc/PlanAccion/Validar/PncPAValidarPrincipal';
import PncVerPAValidar from './components/quality-development/Pnc/PlanAccion/Validar/PncVerPAValidar';



class MainPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			layoutMode: 'static',
			profileMode: 'inline',
			layoutCompact: true,
			overlayMenuActive: false,
			staticMenuDesktopInactive: false,
			staticMenuMobileActive: false,
			rotateMenuButton: false,
			topbarMenuActive: false,
			activeTopbarItem: null,
			darkMenu: false,
			menuActive: false,
			theme: 'blue',
			layout: 'blue',
			version: 'v4',
			configDialogActive: false,
			logeado: false,
			menu: []
		};

		this.onDocumentClick = this.onDocumentClick.bind(this);
		this.onMenuClick = this.onMenuClick.bind(this);
		this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
		this.onTopbarMenuButtonClick = this.onTopbarMenuButtonClick.bind(this);
		this.onTopbarItemClick = this.onTopbarItemClick.bind(this);
		this.onMenuItemClick = this.onMenuItemClick.bind(this);
		this.onRootMenuItemClick = this.onRootMenuItemClick.bind(this);
		this.changeMenuMode = this.changeMenuMode.bind(this);
		this.changeMenuColor = this.changeMenuColor.bind(this);
		this.changeProfileMode = this.changeProfileMode.bind(this);
		this.changeVersion = this.changeVersion.bind(this);
		this.changeLayout = this.changeLayout.bind(this);
		this.changeTheme = this.changeTheme.bind(this);
		this.onConfigButtonClick = this.onConfigButtonClick.bind(this);
		this.onConfigCloseClick = this.onConfigCloseClick.bind(this);
		this.onConfigClick = this.onConfigClick.bind(this);
		this.createMenu();
	}

	onMenuClick(event) {
		this.menuClick = true;
	}

	onMenuButtonClick(event) {
		this.menuClick = true;
		this.setState(({
			rotateMenuButton: !this.state.rotateMenuButton,
			topbarMenuActive: false
		}));

		if (this.state.layoutMode === 'overlay') {
			this.setState({
				overlayMenuActive: !this.state.overlayMenuActive
			});
		}
		else {
			if (this.isDesktop())
				this.setState({ staticMenuDesktopInactive: !this.state.staticMenuDesktopInactive });
			else
				this.setState({ staticMenuMobileActive: !this.state.staticMenuMobileActive });
		}

		event.preventDefault();
	}

	onTopbarMenuButtonClick(event) {
		this.topbarItemClick = true;
		this.setState({ topbarMenuActive: !this.state.topbarMenuActive });
		this.hideOverlayMenu();
		event.preventDefault();
	}

	onTopbarItemClick(event) {
		this.topbarItemClick = true;

		if (this.state.activeTopbarItem === event.item)
			this.setState({ activeTopbarItem: null });
		else
			this.setState({ activeTopbarItem: event.item });

		event.originalEvent.preventDefault();
	}

	onMenuItemClick(event) {
		if (!event.item.items) {
			this.hideOverlayMenu();
		}
		if (!event.item.items && this.isHorizontal()) {
			this.setState({
				menuActive: false
			})
		}
	}

	onRootMenuItemClick(event) {
		this.setState({
			menuActive: !this.state.menuActive
		});
	}

	onConfigButtonClick(event) {
		this.configClick = true;
		this.setState({ configDialogActive: !this.state.configDialogActive })
	}

	onConfigCloseClick() {
		this.setState({ configDialogActive: false })
	}

	onConfigClick() {
		this.configClick = true;
	}

	onDocumentClick(event) {
		if (!this.topbarItemClick) {
			this.setState({
				activeTopbarItem: null,
				topbarMenuActive: false
			});
		}

		if (!this.menuClick) {
			if (this.isHorizontal() || this.isSlim()) {
				this.setState({
					menuActive: false
				})
			}

			this.hideOverlayMenu();
		}

		if (!this.configClick) {
			this.setState({ configDialogActive: false });
		}

		if (!this.rightPanelClick) {
			this.setState({
				rightPanelActive: false
			})
		}

		this.topbarItemClick = false;
		this.menuClick = false;
		this.configClick = false;
		this.rightPanelClick = false;
	}

	hideOverlayMenu() {
		this.setState({
			rotateMenuButton: false,
			overlayMenuActive: false,
			staticMenuMobileActive: false
		})
	}

	isTablet() {
		let width = window.innerWidth;
		return width <= 1024 && width > 640;
	}

	isDesktop() {
		return window.innerWidth > 1024;
	}

	isMobile() {
		return window.innerWidth <= 640;
	}

	isOverlay() {
		return this.state.layoutMode === 'overlay';
	}

	isHorizontal() {
		return this.state.layoutMode === 'horizontal';
	}

	isSlim() {
		return this.state.layoutMode === 'slim';
	}

	changeMenuMode(event) {
		this.setState({ layoutMode: event.layoutMode })
		if (event.layoutMode === 'horizontal') {
			this.setState({ profileMode: 'top' })
		}
	}

	changeMenuColor(event) {
		this.setState({ darkMenu: event.darkMenu })
	}

	changeProfileMode(event) {
		this.setState({ profileMode: event.profileMode })
	}

	changeVersion(event) {
		this.setState({ version: event.version });
		if (event.version === 'v3') {
			this.changeStyleSheetUrl('layout-css', this.state.layout, 'layout');
			this.changeStyleSheetUrl('theme-css', this.state.theme, 'theme');
		} else {
			this.changeStyleSheetUrl('layout-css', this.state.layout + '-v4', 'layout');
			this.changeStyleSheetUrl('theme-css', this.state.theme + '-v4', 'theme');
		}
	}

	changeLayout(event) {
		this.setState({ layout: event.layout });
		if (this.state.version === 'v3') {
			this.changeStyleSheetUrl('layout-css', event.layout, 'layout');
		} else {
			this.changeStyleSheetUrl('layout-css', event.layout + '-v4', 'layout');
		}

		if (event.special) {
			this.setState({
				darkMenu: true
			})
		}
	}

	changeTheme(event) {
		this.setState({ theme: event.theme });
		if (this.state.version === 'v3') {
			this.changeStyleSheetUrl('theme-css', event.theme, 'theme');
		} else {
			this.changeStyleSheetUrl('theme-css', event.theme + '-v4', 'theme');
		}
	}

	changeStyleSheetUrl(id, value, prefix) {
		let element = document.getElementById(id);
		let urlTokens = element.getAttribute('href').split('/');
		urlTokens[urlTokens.length - 1] = prefix + '-' + value + '.css';
		let newURL = urlTokens.join('/');

		this.replaceLink(element, newURL);
	}

	isIE() {
		return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
	}

	replaceLink(linkElement, href) {
		if (this.isIE()) {
			linkElement.setAttribute('href', href);
		}
		else {
			const id = linkElement.getAttribute('id');
			const cloneLinkElement = linkElement.cloneNode(true);

			cloneLinkElement.setAttribute('href', href);
			cloneLinkElement.setAttribute('id', id + '-clone');

			linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

			cloneLinkElement.addEventListener('load', () => {
				linkElement.remove();
				cloneLinkElement.setAttribute('id', id);
			});
		}
	}

	createMenu() {

		var menuPrincipal = [];
		this.props.currentUser && this.props.currentUser.role.menus.map(function (obj, index) {
			if (obj.itemDescription === 'Inicio')
				var menuItem = { label: '', icon: '', to: '/home' };
			else
				var menuItem = { label: '', icon: '', to: undefined };
			menuItem.label = obj.itemDescription;
			menuItem.icon = obj.iconMenu;
			menuItem.to = obj.ref;

			if (obj.subMenus.length !== 0 || obj.subMenus.length !== undefined) {
				menuItem.items = [];
				obj.subMenus.map(function (obj2, i) {
					var itemsAux = { label: '', icon: '', to: undefined };
					itemsAux.label = obj2.desc;
					itemsAux.icon = obj2.icon;
					itemsAux.to = obj2.ref;
					menuItem.items.push(itemsAux);
				})

			} else {
				menuItem.command = () => { window.location.hash = obj.ref };
			}
			menuPrincipal.push(menuItem);


		})
		this.menu = menuPrincipal;
		this.menu2 = [
			{
				label: 'Bootstrap Version', icon: 'fa fa-fw  fa-tags',
				items: [
					{ label: 'Bootstrap v3', icon: 'fa fa-fw fa-tag', command: () => this.changeVersion({ version: 'v3' }) },
					{ label: 'Bootstrap v4', icon: 'fa fa-fw fa-tag', command: () => this.changeVersion({ version: 'v4' }) }
				]
			},
			{
				label: 'Dashboard', icon: 'fa fa-fw fa-dashboard', items: [
					{ label: 'Generic', icon: 'fa fa-fw fa-home', to: '/' },
					{ label: 'Banking', icon: 'fa fa-fw fa-bank', to: '/dashboard_banking' },
				]
			},
			{
				label: 'Customization', icon: 'fa fa-fw fa-bars', badge: '8',
				items: [
					{ label: 'Static Menu', icon: 'fa fa-fw fa-bars', command: () => this.setState({ layoutMode: 'static' }) },
					{ label: 'Overlay Menu', icon: 'fa fa-fw fa-bars', command: () => this.setState({ layoutMode: 'overlay' }) },
					{ label: 'Slim Menu', icon: 'fa fa-fw fa-bars', command: () => this.setState({ layoutMode: 'slim' }) },
					{ label: 'Horizontal Menu', icon: 'fa fa-fw fa-bars', command: () => this.setState({ layoutMode: 'horizontal', profileMode: 'top' }) },
					{ label: 'Inline Profile', icon: 'fa fa-sun-o fa-fw', command: () => this.setState({ profileMode: 'inline' }) },
					{ label: 'Top Profile', icon: 'fa fa-moon-o fa-fw', command: () => this.setState({ profileMode: 'top' }) },
					{ label: 'Light Menu', icon: 'fa fa-sun-o fa-fw', command: () => this.setState({ darkMenu: false }) },
					{ label: 'Dark Menu', icon: 'fa fa-moon-o fa-fw', command: () => this.setState({ darkMenu: true }) }
				]
			},
			{
				label: 'Layout Colors', icon: 'fa fa-fw fa-magic',
				items: [
					{
						label: 'Flat',
						icon: 'fa fa-fw fa-circle',
						items: [
							{ label: 'Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'blue' }) } },
							{ label: 'Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'purple' }) } },
							{ label: 'Cyan', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'cyan' }) } },
							{ label: 'Indigo', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'indigo' }) } },
							{ label: 'Teal', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'teal' }) } },
							{ label: 'Pink', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'pink' }) } },
							{ label: 'Lime', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'lime' }) } },
							{ label: 'Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'green' }) } },
							{ label: 'Amber', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'amber' }) } },
							{ label: 'Dark Grey', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'darkgrey' }) } },
						]
					},
					{
						label: 'Special',
						icon: 'fa fa-fw fa-fire',
						items: [
							{ label: 'Influenza', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'influenza', special: true }) } },
							{ label: 'Suzy', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'suzy', special: true }) } },
							{ label: 'Calm', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'calm', special: true }) } },
							{ label: 'Crimson', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'crimson', special: true }) } },
							{ label: 'Night', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'night', special: true }) } },
							{ label: 'Skyling', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'skyline', special: true }) } },
							{ label: 'Sunkist', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'sunkist', special: true }) } },
							{ label: 'Little Leaf', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'littleleaf', special: true }) } },
							{ label: 'Joomla', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'joomla', special: true }) } },
							{ label: 'Firewatch', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeLayout({ layout: 'firewatch', special: true }) } }
						]
					}
				]
			},
			{
				label: 'Themes', icon: 'fa fa-fw fa-paint-brush', badge: '5',
				items: [
					{ label: 'Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'blue' }) } },
					{ label: 'Cyan', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'cyan' }) } },
					{ label: 'Indigo', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'indigo' }) } },
					{ label: 'Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'purple' }) } },
					{ label: 'Teal', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'teal' }) } },
					{ label: 'Orange', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'orange' }) } },
					{ label: 'Deep Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'deeppurple' }) } },
					{ label: 'Light Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'lightblue' }) } },
					{ label: 'Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'green' }) } },
					{ label: 'Light Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'lightgreen' }) } },
					{ label: 'Lime', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'lime' }) } },
					{ label: 'Amber', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'amber' }) } },
					{ label: 'Brown', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'brown' }) } },
					{ label: 'Dark Grey', icon: 'fa fa-fw fa-paint-brush', command: (event) => { this.changeTheme({ theme: 'darkgrey' }) } },
				]
			},
			{
				label: 'Components', icon: 'fa fa-fw fa-sitemap',
				items: [
					{ label: 'Sample Page', icon: 'fa fa-fw fa-columns', to: '/sample' },
					{ label: 'Forms', icon: 'fa fa-fw fa-code', to: '/forms' },
					{ label: 'Data', icon: 'fa fa-fw fa-table', to: '/data' },
					{ label: 'Panels', icon: 'fa fa-fw fa-list-alt', to: '/panels' },
					{ label: 'Overlays', icon: 'fa fa-fw fa-square', to: '/overlays' },
					{ label: 'Menus', icon: 'fa fa-fw fa-minus-square-o', to: '/menus' },
					{ label: 'Messages', icon: 'fa fa-fw fa-circle-o-notch', to: '/messages' },
					{ label: 'Charts', icon: 'fa fa-fw fa-area-chart', to: '/charts' },
					{ label: 'Misc', icon: 'fa fa-fw fa-user-secret', to: '/misc' }
				]
			},
			{
				label: 'Pages', icon: 'fa fa-fw fa-life-saver',
				items: [
					{ label: 'Empty Page', icon: 'fa fa-fw fa-square-o', to: '/empty' },
					{ label: 'Invoice', icon: 'fa fa-fw fa-list-alt', to: '/invoice' },
					{ label: 'Help Page', icon: 'fa fa-fw fa-question-circle', to: '/help' },
					{ label: 'Wizard', icon: 'fa fa-fw fa-star', to: '/wizard' },
					{ label: 'Landing', icon: 'fa fa-fw fa-certificate', url: 'assets/pages/landing.html', target: '_blank' },
					{ label: 'Login', icon: 'fa fa-fw fa-sign-in', to: '/login' },
					{ label: 'Error', icon: 'fa fa-fw fa-exclamation-circle', to: '/error' },
					{ label: 'Not Found', icon: 'fa fa-fw fa-times', to: '/notfound' },
					{ label: 'Access Denied', icon: 'fa fa-fw fa-exclamation-triangle', to: '/access' }
				]
			},
			{
				label: 'Menu Hierarchy', icon: 'fa fa-fw fa-gg',
				items: [
					{
						label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
						items: [
							{
								label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
								items: [
									{ label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in' },
									{ label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in' },
									{ label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in' },
								]
							},
							{
								label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
								items: [
									{ label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in' },
									{ label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in' }
								]
							},
						]
					},
					{
						label: 'Submenu 2', icon: 'fa fa-fw fa-sign-in',
						items: [
							{
								label: 'Submenu 2.1', icon: 'fa fa-fw fa-sign-in',
								items: [
									{ label: 'Submenu 2.1.1', icon: 'fa fa-fw fa-sign-in' },
									{ label: 'Submenu 2.1.2', icon: 'fa fa-fw fa-sign-in' },
									{ label: 'Submenu 2.1.3', icon: 'fa fa-fw fa-sign-in' },
								]
							},
							{
								label: 'Submenu 2.2', icon: 'fa fa-fw fa-sign-in',
								items: [
									{ label: 'Submenu 2.2.1', icon: 'fa fa-fw fa-sign-in' },
									{ label: 'Submenu 2.2.2', icon: 'fa fa-fw fa-sign-in' }
								]
							},
						]
					}
				]
			},
			{ label: 'Utils', icon: 'fa fa-fw fa-wrench', command: () => { window.location = "#/utils" } },
			{ label: 'Docs', icon: 'fa fa-fw fa-book', command: () => { window.location = "#/documentation" } },
			{ label: 'Buy Now', icon: 'fa fa-fw fa-credit-card', command: () => { window.location = "https://www.primefaces.org/store" } },
		];
	}

	async componentWillMount() {
		try {
			/* const menusPorUsuario = await MenuService.listarPorUsuario(this.props.currentUser)
			console.log(menusPorUsuario); */
			this.createMenu();
		} catch (error) {
			console.log(error)
		}
	}

	render() {
		let layoutClassName = classNames('layout-wrapper', {
			'menu-layout-static': this.state.layoutMode !== 'overlay',
			'menu-layout-overlay': this.state.layoutMode === 'overlay',
			'layout-menu-overlay-active': this.state.overlayMenuActive,
			'menu-layout-slim': this.state.layoutMode === 'slim',
			'menu-layout-horizontal': this.state.layoutMode === 'horizontal',
			'layout-menu-static-inactive': this.state.staticMenuDesktopInactive,
			'layout-menu-static-active': this.state.staticMenuMobileActive
		});
		let menuClassName = classNames('layout-menu-container', { 'layout-menu-dark': this.state.darkMenu });
		return (
			<div className={layoutClassName} onClick={this.onDocumentClick}>
				<div>
					<AppTopbar profileMode={this.state.profileMode} horizontal={this.isHorizontal()}
						topbarMenuActive={this.state.topbarMenuActive} activeTopbarItem={this.state.activeTopbarItem}
						onMenuButtonClick={this.onMenuButtonClick} onTopbarMenuButtonClick={this.onTopbarMenuButtonClick}
						onTopbarItemClick={this.onTopbarItemClick} />

					<div className={menuClassName} onClick={this.onMenuClick}>
						<div className="menu-scroll-content">
							{(this.state.profileMode === 'inline' && this.state.layoutMode !== 'horizontal') && <AppInlineProfile />}
							<AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} onRootMenuItemClick={this.onRootMenuItemClick}
								layoutMode={this.state.layoutMode} active={this.state.menuActive} />
						</div>
					</div>

					<div className="layout-main">


						<Route path="/quality-development_product" component={Product} />
						<Route path="/quality-development_product_instructivo/:idProduct" component={ProductoInstructivo} />
						<Route path="/quality-development_product_new" component={ProductNew} />
						<Route path="/quality-development_hcc" component={HCC} />
						<Route path="/quality-development_pnc" component={ProductoNoConforme} />
						{/* <Route path="/quality-development_pnc" component={NotFound} /> */}
						<Route path="/quality-development_resulttest" component={ResultTest} />
						<Route path="/quality-development_complaint" component={Complaint} />
						<Route path="/quality-development_wflow" component={WFlow} />
						<Route path="/quality-development_report" component={ReportData} />
						<Route path="/quality-development_propertylist" component={Propiedades} />
						<Route path="/quality-development_providers" component={Proveedor} />
						<Route path="/quality-development_salida_material/:idpnc" component={SalidaMaterial} />
						<Route path="/quality-development/especificaciones" component={Especificacion} />
						<Route path="/quality-development_laboratory_norms" component={NormaLaboratorio} />
						<Route path="/quality-development_config_entrymp" component={ConfigFormTestEntryMP} />
						<Route path="/quality-development_config_solicitudse" component={ConfiguracionSF} />
						<Route path="/quality-development_config_solicitudpp" component={ConfiguracionSPP} />
						<Route path="/quality-development_solicitudse" component={PrincipalSE} />
						<Route path="/quality-development_solicitudse_new" component={FormularioSE} />
						<Route path="/quality-development_solicitudse_edit/:idSolicitud" component={FormularioSE} />
						<Route path="/quality-development_solicitudse_planesaccion/:idSolicitud" component={SEPlanesAccion} />
						<Route path="/quality-development_solicitudse_validar" component={ValidarPrincipal} />
						<Route path="/quality-development_solicitudse_validar_solicitud/:idSolicitud" component={VerValidar} />
						<Route path="/quality-development_solicitudse_procesar" component={ResponderPrincipal} />
						<Route path="/quality-development_solicitudse_procesar_solicitud/:idSolicitud" component={VerResponder} />
						<Route path="/quality-development_solicitudse_aprobar" component={AprobarPrincipal} />
						<Route path="/quality-development_solicitudse_aprobar_solicitud/:idSolicitud" component={VerAprobar} />
						<Route path="/quality-development_solicitudpp" component={PrincipalSPP} />
						<Route path="/quality-development_solicitudpp_new" component={FormularioSPP} />
						<Route path="/quality-development_solicitudpp_edit/:idSolicitud" component={FormularioSPP} />
						<Route path="/quality-development_solicitudpp_validar" component={ValidarPrincipalSPP} />
						<Route path="/quality-development_solicitudpp_validar_solicitud/:idSolicitud" component={VerValidarSPP} />
						<Route path="/quality-development_solicitudpp_procesar" component={ResponderPrincipalSPP} />
						<Route path="/quality-development_solicitudpp_procesar_solicitud/:idSolicitud" component={VerResponderSPP} />
						<Route path="/quality-development_consulta_solicitud" component={ConsultaPrincipal} />
						<Route path="/quality-development_consulta_solicitudpp" component={ConsultaPrincipalPP} />
						<Route path="/quality-development_consulta_solicitud_verse/:idSolicitud" component={VerSE} />
						<Route path="/quality-development_consulta_solicitud_verspp/:idSolicitud" component={VerSPP} />
						<Route path="/quality-development_solicitudpp_asignar" component={AsignarResponsablePrincipalSPP} />
						<Route path="/quality-development_solicitudpp_asignar_responsable/:idSolicitud" component={VerAsignarResponsableSPP} />
						<Route path="/quality-development_solicitudpp_planta_reasignar" component={ReasignarResponsablePlanta} />
						<Route path="/quality-development_solicitudpp_planta_principal" component={PlantaPrincipal} />
						<Route path="/quality-development_solicitudpp_planta_ver/:idSolicitud" component={VerPlantaSPP} />
						<Route path="/quality-development_solicitudpp_mantenimiento_asignacion" component={AsignarResponsableMantenimiento} />
						<Route path="/quality-development_solicitudpp_mantenimiento_reasignacion" component={ReasignarResponsableMantenimiento} />
						<Route path="/quality-development_solicitudpp_mantenimiento_principal" component={ResponderMantePrincipalSPP} />
						<Route path="/quality-development_solicitudpp_mantenimiento_ver/:idSolicitud" component={VerResponderManteSPP} />
						<Route path="/quality-development_solicitudpp_calidad_asignacion" component={AsignarResponsableCalidad} />
						<Route path="/quality-development_solicitudpp_calidad_reasignacion" component={ReasignarResponsableCalidad} />
						<Route path="/quality-development_solicitudpp_mantenimiento_aprobar_principal" component={AprobacionMantenimiento} />
						<Route path="/quality-development_solicitudpp_mantenimiento_aprobar_ver/:idSolicitud" component={VerAprobarManteSPP} />
						<Route path="/quality-development_solicitudpp_calidad_aprobar_principal" component={AprobacionCalidad} />
						<Route path="/quality-development_solicitudpp_calidad_aprobar_ver/:idSolicitud" component={VerAprobarCalidadSPP} />
						<Route path="/quality-development_solicitudse_calidad_aprobar_ver/:idSolicitud" component={VerAprobarSE} />
						<Route path="/quality-development_solicitudpp_planta_aprobar_principal" component={AprobacionPlanta} />
						<Route path="/quality-development_solicitudpp_planta_aprobar_ver/:idSolicitud" component={VerAprobarPlantaSPP} />
						<Route path="/quality-development_solicitudpp_aprobar_principal" component={AprobacionPrincipalSPP} />
						<Route path="/quality-development_solicitudpp_aprobar_solicitud/:idSolicitud" component={VerAprobacionSPP} />
						<Route path="/quality-development_solicitudpp_ajuste_maquinaria_principal" component={AjusteMaquinariaPrincipal} />
						<Route path="/quality-development_solicitudpp_ajuste_maquinaria_ver/:idSolicitud" component={VerAjusteMaquinaria} />
						<Route path="/quality-development_solicitudpp_informe/:idSolicitud/:tipo/:accion" component={InformeSPP} />
						<Route path="/quality-development_solicitudpp_informe_final/:idSolicitud/:tipo" component={InformeSPPLectura} />
						<Route path="/quality-development_consulta_tests" component={ConsultaTest} />
						<Route path="/quality-development_solicitud_revisar_plan_accion" component={RevisarPlanAccionPrincipal} />
						<Route path="/quality-development_solicitud_revisar_plan_accion_ver/:idSolicitud" component={SEPlanesAccionVer} />
						<Route path="/quality-development_solicitud_revisar_plan_accion_rev/:idSolicitud" component={SEPlanesAccionRev} />

						<Route path="/administracion_usuario" component={Usuario} />
						<Route path="/administracion_usuario_registro/:idUsuario" component={UsuarioFormulario} />
						<Route path="/quality-development_unidad_medida" component={UnidadMedida} />

						{/* --------- PNC ------------- */}
						<Route path="/quality-development_pnc_defecto" component={Defecto} />
						<Route path="/quality-development_pnc_principal" component={PncPrincipal} />
						<Route path="/quality-development_pnc_nuevo" component={Form} />
						<Route path="/quality-development_pnc_edit/:idPnc" component={Form} />
						<Route path="/quality-development_pnc_salida_material_nuevo/:idPnc" component={PncSalidaMaterialForm} />
						<Route path="/quality-development_pnc_salida_material_edit/:idPnc/:idPncSalida" component={PncSalidaMaterialForm} />
						<Route path="/quality-development_pnc_salida_material_aprobacion" component={PncAprobacionPrincipal} />
						<Route path="/quality-development_pnc_salida_material_aprobacion_ver/:idPncSalida" component={PncVerAprobacion} />
						<Route path="/quality-development_pnc_procesarTarea" component={PncPAProcesarPrincipal} />
						<Route path="/quality-development_pnc_procesarTarea_ver/:idPncSalida/:idPlan" component={PncVerPAProcesar} />
						<Route path="/quality-development_pnc_validarTarea" component={PncPAValidarPrincipal} />
						<Route path="/quality-development_pnc_validarTarea_ver/:idPncSalida/:idPlan" component={PncVerPAValidar} />
						{/* --------- PNC ------------- */}

						<Route path="/home" component={Home} />


					</div>

					<div className="layout-mask"></div>

					<AppFooter />

				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUser: (idUser) => dispatch(getUser(idUser)) // will be wrapped into a dispatch call
	}

};


const mapStateToProps = (state) => {
	return {
		currentUser: state.login.currentUser,
	}
}

export default connect(mapStateToProps)(MainPage);
