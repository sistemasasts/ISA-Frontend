import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import {  HashRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'prismjs/themes/prism-coy.css';
import 'react-toastify/dist/ReactToastify.min.css'
import configureStore from './store/configureStore';
import App from './App';

const store = configureStore()

const rootEl = document.getElementById('root')


const app = (

  <HashRouter>
    <Provider store={store}>
      
        <App>
        </App>     

    </Provider >
 </HashRouter>

)
ReactDOM.render(app, rootEl);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();


