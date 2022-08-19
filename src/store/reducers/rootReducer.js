import {combineReducers} from 'redux'

import loginReducer from './loginReducer'
import modalWaitReducer from './modalWaitReducer'

const rootReducer = combineReducers({
    login: loginReducer,
    modalWait: modalWaitReducer
})

export default rootReducer