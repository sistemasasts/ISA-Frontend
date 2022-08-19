import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'
import { connect } from 'react-redux'
import Routes from './config/Routes'
import { getUser } from './store/actions/loginAction'
import { getJwt, getDecodedToken } from './config/auth/credentialConfiguration'
import LoadingComponent from './LoadingComponent'
import { HashRouter } from 'react-router-dom'
import PleaseWaitRedux from './global/SubComponents/PleaseWaitRedux'

const actions = {
    getUser
}

const App = ({ getUser }) => {
    const token = getJwt()
    const [appLoaded, setAppLoaded] = useState(false)

    useEffect(() => {
        if (token) {
            const decodeToken = getDecodedToken();
            getUser(decodeToken.user_name).finally(() => setAppLoaded(true))
        }
        else setAppLoaded(true)
    }, [getUser, token])

    if (!appLoaded) return <LoadingComponent content="Loading App.." />
    return (

        <>
            <ToastContainer position="bottom-right" />
            <Routes />
            <PleaseWaitRedux/>
        </>
    )
}

App.propTypes = {
    getUser: PropTypes.func.isRequired
}

export default connect(null, actions)(App)
