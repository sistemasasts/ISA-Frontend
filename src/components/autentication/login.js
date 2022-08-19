import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Growl } from 'primereact/growl';

/* ====================  T R A N S A C T I O N S ======== */

import { login } from '../../store/actions/loginAction'
import { connect } from 'react-redux';

var that;
var obj = {};
class Login extends Component {

    static propTypes = {
        login: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: '',
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
            stateLogin: true,
            dataMenu: undefined,
        };
        that = this;
        this.validateUser = this.validateUser.bind(this);
        this.verificaError();
    }


    validateUser() {
        if (this.state.user !== '' && this.state.password !== '') {
            try {
               /*  var credentials = { transactionName: "AAS", transactionCode: "TxAAS", parameters: { userName: this.state.user, pass: this.state.password }, }
                credentials.parameters = JSON.stringify(credentials.parameters); */
                var credentials = { usuario: this.state.user, contrasena: this.state.password}


                this.props.login(credentials);

                /*  loginValidate(this.state.user, this.state.password, function (data) {
                     switch (data.status) {
                         case 'OK':
                             that.setState({ stateLogin: false })
                             break;
     
                         case 'ERROR':
                             that.showError(data.message);
                             break;
                         default:
                             console.log(data);
                             localStorage.setItem('dataSession', JSON.stringify(data));
     
                             that.setState({ stateLogin: false, dataMenu: data });
                             break;
                     }
                 }) */

            } catch (error) {
                console.log('Error en el login')
            }

        } else {
            this.showError('Usuario o Contraseña incorrecta');
        }
    }

    verificaError(){
        this.error= this.props.mensaje
    }

    /* Metodos Mensajes Mostrar */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        let msg = { severity: 'success', summary: 'Exito', detail: message };
        this.growl.show(msg);
    }



    render() {
        var imgstyle = {
            height: '100%',
            width: '100%',
            position: 'absolute',
            justifyContent: 'center', textAlign: 'center',
            //background: 'url("./images/logo-imptek.svg") no-repeat',
            //backgroundColor: '#4DA6DE',
            //backgroundColor: '#292b2c',
            backgroundColor: '#b0bec5',
            backgroundsize: 'cover',
            backgroundposition: 'center',
            paddingTop: '10%'
        }

        var formContent = {
            width: '400px',
            position: ' absolute',
            //marginleft: '-200px',
            justifyContent: 'center', textAlign: 'center',
            top: '30px',
            left: '20%',
            color: '#fff'
        }
        var container = {
            width: '40%',
            height: '100%',
            borderradius: '0',
            marginBottom: '0',
            bottom: '0',
            left: '30%',
            position: 'absolute',
            textalign: 'center',
            backgroundColor: '#4DA6DE'
            //backgroundColor: '#292b2c'
            //backgroundColor: '#D1DA28'
        }
        const styles = {
            login_block: {
                //background: 'linear-gradient(to bottom, #FFB88C, #DE6262)',
                background: '#DE6262',
                float: 'left',
                width: '100%',
                padding: '50px',
            },
            banner_sec: {
                background: "url(https://static.pexels.com/photos/33972/pexels-photo.jpg)  no-repeat left bottom",
                backgroundSize: "cover",
                minHeight: "500px",
                borderRadius: "0 10px 10px 0",
                padding: "0"
            },
            container: {
                background: '#fff',
                borderRadius: "10px",
                boxShadow: "15px 20px 0px rgba(0,0,0,0.1)"
            },
            carousel_inner: {
                borderRadius: "0 10px 10px 0"
            },
            carousel_caption: {
                "textAlign": "left",
                "left": "5%"
            },
            login_sec: {
                padding: "50px 30px",
                position: "relative"
            },
            login_sec__copy_text: {
                position: "absolute",
                width: "80%",
                bottom: "20px",
                fontSize: "13px",
                textAlign: "center"
            },
            login_sec__copy_text_i: {
                "color": "#FEB58A"
            },
            login_sec__copy_text_a: {
                "color": "#E36262"
            },
            login_sec_h2: {
                marginBottom: "30px",
                fontWeight: "800",
                fontSize: "30px",
                color: "#DE6262"
            },
            login_sec_h2_after: {
                "content": "\" \"",
                "width": "100px",
                "height": "5px",
                "background": "#FEB58A",
                "display": "block",
                "marginTop": "20px",
                "borderRadius": "3px",
                "marginLeft": "auto",
                "marginRight": "auto"
            },
            btn_login: {
                background: "#DE6262",
                color: "#fff",
                fontWeight: "600"
            },
            banner_text: {
                "width": "70%",
                "position": "absolute",
                "bottom": "40px",
                "paddingLeft": "20px"
            },
            "banner_text_h2": {
                "color": "#fff",
                "fontWeight": "600"
            },
            banner_text_h2_after: {
                "content": "\" \"",
                "width": "100px",
                "height": "5px",
                "background": "#FFF",
                "display": "block",
                "marginTop": "20px",
                "borderRadius": "3px"
            },
            banner_text_p: {
                "color": "#fff"
            }
        }

        return (
            <div style={{
                background: 'linear-gradient(to bottom, #4DA6DE, #D1DA28)', width: '100%', height: '100%', padding: '180px'
            }}>
                <Growl ref={(el) => this.growl = el} />
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css" />
                {/*---- Include the above in your HEAD tag --------*/}
                <div className='p-grid p-fluid' style={{ justifyContent: 'center' }}>
                    <div className='p-col-12 p-lg-6' style={{ background: '#fff', borderRadius: "10px", boxShadow: "15px 20px 0px rgba(0,0,0,0.1)" }}>
                        <div className="p-grid ">
                            <div className="p-col-12 p-lg-6" style={{ padding: "50px 30px", position: "relative" }} >
                                <h2 className="text-center" style={{ marginBottom: "30px", fontWeight: "800", fontSize: "30px", color: "#4DA6DE" }}>Iniciar Sesión</h2>
                                <div className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="text-uppercase">Usuario</label>
                                        <input type="text" className="form-control" placeholder onChange={(e) => this.setState({ user: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1" className="text-uppercase">Contraseña</label>
                                        <input type="password" className="form-control" placeholder onChange={(e) => this.setState({ password: e.target.value })} />
                                    </div>
                                    <div className="form-check">

                                        <button className="btn float-right" style={{ background: "#4DA6DE", color: "#fff", fontWeight: "600" }} onClick={this.validateUser} >Aceptar</button>
                                    </div>
                                </div>
                                {/* <div className="copy-text">Elaborado por T.I ASTS <i className="fa fa-heart" /> by <a href="http://grafreez.com">Grafreez.com</a></div> */}
                                
                                {this.error}
                                <div className="copy-text" style={{ position: "absolute", width: "80%", bottom: "20px", fontSize: "13px", textAlign: "center" }} >Elaborado por el área T.I </div>
                            </div>

                            <div className="p-col-12 p-lg-6 " style={{ background: '#4DA6DE', borderRadius: "0 10px 10px 0", padding: "0 0 0 0" }}>
                                <img style={{ justifyContent: 'center', textAlign: 'center', marginTop: '60px', width: '100%', height: '60%', paddingLeft: '15px', paddingRight: '15px' }} src="assets/layout/images/logo-imptek-white.svg" />
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        )
        


    }



    /*
        bindAction(): Función que dispara las actions para que se actualice el estado de la aplicación.
    */


}

function mapDispatchToProps(dispatch) {
    return {
        login: (credentials) => dispatch(login(credentials)) // will be wrapped into a dispatch call
    }

};

const mapStateToProps = (state) => {
    return {
        currentUser: state.login.currentUser,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)