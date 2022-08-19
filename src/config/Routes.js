import React from 'react'
import { Route, Switch, withRouter, HashRouter } from 'react-router-dom'
import { Home } from '../components/Home'
import { ToastContainer } from 'react-toastify'
import Login from '../components/autentication/login'

import MainPage from '../MainPage'

const Routes = ({ location }) => {
    return (
        <>

            {/* <ToastContainer position="bottom-right" /> */}
            <Route path="/" exact component={Login} />
            <Route
                path="/(.+)"
                render={() => (
                    <>
                        
                            <MainPage />
                       


                        {/* <Switch>

                           
                            <Route component={NotFound} />
                        </Switch> */}



                    </>
                )}
            />


        </>
    )
}

export default withRouter(Routes)
