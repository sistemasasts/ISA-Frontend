import { MODAL_CLOSE, MODAL_OPEN } from '../actions/actionTypes'
import createReducer from './reducerUtils'

const initialState = {
    open: false,
}

const openModal = (state) => {
    return { ...state, open: true}
}

const closeModal = () => {
    return {
        open: false
    }
}

export default createReducer(initialState, {
    [MODAL_OPEN]: openModal,
    [MODAL_CLOSE]: closeModal
})
