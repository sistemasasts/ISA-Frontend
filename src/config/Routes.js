import React from 'react'
import { Route, useLocation } from 'react-router-dom';
import Login from '../components/autentication/login'
import LoginMSAL from '../components/autentication/loginMSAL'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";

import MainPage from '../MainPage'



const Routes = ({ location }) => {
    return (
        <>
<Routes>
        {/* <ToastContainer position="bottom-right" /> */}
            <Route path="/" element={Login} />
            <Route
                path="/(.+)"
                element={MainPage}
            />
</Routes>

           


        </>
    )
}

function WithRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        return (
            <Component
                {...props}
                router={{ location }}
            />
        );
    }
    return ComponentWithRouterProp;
}

/**
* Most applications will need to conditionally render certain components based on whether a user is signed in or not. 
* msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will 
* only render their children if a user is authenticated or unauthenticated, respectively. For more, visit:
* https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
*/
const MainContent = () => {
    /**
    * useMsal is hook that returns the PublicClientApplication instance,
    * that tells you what msal is currently doing. For more, visit:
    * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
    */
   console.log("Render routes")

    return (
        <div className="App">
            <AuthenticatedTemplate>
                <Routes>
                    <Route
                        path="/(.+)"
                        element={LoginMSAL}
                    />
                </Routes>
                    
                
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Routes>
                    <Route path="/" exact element={Login} />
                </Routes>
            </UnauthenticatedTemplate>
        </div>
    );
};


export default WithRouter(MainContent);
