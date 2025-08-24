import React, { useState, useEffect, useRef } from 'react';
import { Growl } from 'primereact/growl';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/actions/loginAction';
import { loginRequest } from '../../config/auth/authConfig';
import { useMsal } from "@azure/msal-react";


const LoginMSAL = () => {
    // 1. Manejo del estado con useState
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    
    // Simplificación del estado del layout, ya no es necesario
    const [stateLogin, setStateLogin] = useState(true);
    const [dataMenu, setDataMenu] = useState(undefined);

    // 2. Acceso a Redux con useSelector y useDispatch
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.login.currentUser);
    const mensajeError = useSelector(state => state.login.mensaje);

    // 3. Referencia para el componente Growl con useRef
    const growlRef = useRef(null);

    // 4. Métodos para mostrar mensajes
    const showError = (message) => {
        if (growlRef.current) {
            growlRef.current.show({ severity: 'error', summary: 'Error', detail: message });
        }
    };
    
    const showSuccess = (message) => {
        if (growlRef.current) {
            let msg = { severity: 'success', summary: 'Exito', detail: message };
            growlRef.current.show(msg);
        }
    };

    // 5. Lógica para verificar errores (similar a verificaError)
    useEffect(() => {
        if (mensajeError) {
            showError(mensajeError);
        }
    }, [mensajeError]);

    // 6. Lógica de validación del usuario
    const validateUser = () => {
        if (user !== '' && password !== '') {
            try {
                const credentials = { usuario: user, contrasena: password };
                dispatch(login(credentials));
            } catch (error) {
                console.log('Error en el login');
            }
        } else {
            showError('Usuario o Contraseña incorrecta');
        }
    };

    const { instance } = useMsal();

    const handleRedirect = () => {
        instance
                .loginRedirect({
                    ...loginRequest,
                    prompt: 'create',
                })
                .catch((error) => console.log(error));
    };


    // 7. Renderizado del componente (la lógica es la misma)
    return (
        <div style={{
            background: 'linear-gradient(to bottom, #4DA6DE, #D1DA28)', width: '100%', height: '100%', padding: '180px'
        }}>
            <Growl ref={growlRef} />
            <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css" />
            <div className='p-grid p-fluid' style={{ justifyContent: 'center' }}>
                <div className='p-col-12 p-lg-6' style={{ background: '#fff', borderRadius: "10px", boxShadow: "15px 20px 0px rgba(0,0,0,0.1)" }}>
                    <div className="p-grid ">
                        <div className="p-col-12 p-lg-6" style={{ padding: "50px 30px", position: "relative" }} >
                            <h2 className="text-center" style={{ marginBottom: "30px", fontWeight: "800", fontSize: "30px", color: "#4DA6DE" }}>Iniciar Sesión</h2>
                            <div className="login-form">
                                
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1" className="text-uppercase">Contraseña</label>
                                    <input type="password" className="form-control" placeholder onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-check">
                                    <button className="btn float-right" style={{ background: "#4DA6DE", color: "#fff", fontWeight: "600" }} onClick={handleRedirect} >Aceptar</button>
                                </div>
                            </div>
                            <div className="copy-text" style={{ position: "absolute", width: "80%", bottom: "20px", fontSize: "13px", textAlign: "center" }} >Elaborado por el área T.I </div>
                        </div>
                        <div className="p-col-12 p-lg-6 " style={{ background: '#4DA6DE', borderRadius: "0 10px 10px 0", padding: "0 0 0 0" }}>
                            <img style={{ justifyContent: 'center', textAlign: 'center', marginTop: '60px', width: '100%', height: '60%', paddingLeft: '15px', paddingRight: '15px' }} src="assets/layout/images/logo-imptek-white.svg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginMSAL;