import React from 'react';
import { Provider } from 'react-redux'
import {  HashRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'prismjs/themes/prism-coy.css';
//import 'react-toastify/dist/ReactToastify.min.css'
import 'react-toastify/dist/ReactToastify.css'; // Ruta corregida
import configureStore from './store/configureStore';
import { msalConfig } from './config/auth/authConfig';
import App from './App';
import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { createRoot } from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
/**
* MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
* For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
*/
const msalInstance = new PublicClientApplication(msalConfig);
// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    }
});


const store = configureStore()

const rootEl = document.getElementById('root')
const root = createRoot(rootEl);

const app = (

 /*  <MsalProvider instance={msalInstance}> */
    <HashRouter>
        <Provider store={store}>      
            <App></App>
        </Provider >
    </HashRouter>
/*  </MsalProvider>   */

)
root.render(app);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();


