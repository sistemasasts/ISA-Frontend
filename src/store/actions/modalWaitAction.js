import { MODAL_OPEN, MODAL_CLOSE } from './actionTypes'

export const openModal = () => {
    return {
        type: MODAL_OPEN
    }
}

export const closeModal = () => {
    return {
        type: MODAL_CLOSE
    }
}
