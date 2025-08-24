import * as  actionType from './actionTypes'
import { toast } from 'react-toastify'
import LoginService from '../../service/LoginService'

import { getDecodedToken } from '../../config/auth/credentialConfiguration'
import MenuService from '../../service/MenuService'

const loginUser = (currentUser) => {
    return { type: actionType.LOGIN_USER, payload: { currentUser } }
}

export const setCurrentUser = (currentUser) => {
    return { type: actionType.CURRENT_USER, payload: { currentUser } }
}

const signOutUser = () => {
    return { type: actionType.LOGOUT_USER }
}

/* let navigateCallback;
export const setCallback = (callback) => {
    navigateCallback = callback;
}; */

export const login = (credentials) => async (dispatch) => {
    try {
        const dataUser = await LoginService.login(credentials)

        const user = getDecodedToken();

        dispatch(loginUser(user.user_name))
      
       const menusPorUsuario = await MenuService.listarPorUsuario(user.user_name)
       dispatch(setCurrentUser(menusPorUsuario))
        
      
        toast.info('BIENVENIDO ', {
            position: toast.POSITION.BUTTOM_CENTER
        })

      /*   if (navigateCallback) {
            navigateCallback('/home');
        } */



        //dispatch(menuUser(dataUser.role))

    } catch (error) {
        toast.error('Credenciales inválidas ', {
            position: toast.POSITION.TOP_RIGHT
        })
        throw error
    }
}

export const getUser = (idUser) => async (dispatch) => {
    try {        
        const user = await MenuService.listarPorUsuario(idUser)       
        dispatch(setCurrentUser(user))
    } catch (error) {
         toast.error(error)
    }
}

export const logout = () => (dispatch) => {
    try {
        LoginService.logout()
        dispatch(signOutUser())
    /*     if (navigateCallback) {
            navigateCallback('/');
        } */
    } catch (error) {
        toast.error(error)
    }
}

