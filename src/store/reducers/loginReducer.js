import createReducer from './reducerUtils'
import { LOGIN_USER, LOGOUT_USER, CURRENT_USER, MENU_USER } from '../actions/actionTypes'

const initialState = {
    currentUser: null,
}

const loginUser = (state, payload) => {
    return {
        currentUser: payload.currentUser
    }
}

/* const menuUser = (state, payload) => {
    return {
        menuUser: payload.menu
    }
} */

const setCurrentUser = (state, payload) => {
    return {
        currentUser: payload.currentUser
    }
}

const signOutUser = () => {
    return { currentUser: null }
}

export default createReducer(initialState, {
    [LOGIN_USER]: loginUser,
    //[MENU_USER] : menuUser,
    [LOGOUT_USER]: signOutUser,
    [CURRENT_USER]: setCurrentUser,
    
})
