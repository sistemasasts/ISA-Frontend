import Axios from "axios";
import history from '../history'
import { getJwt } from '../config/auth/credentialConfiguration'
import { toast } from "react-toastify";

/**
 * X-Custom-Header poner en la habilitación de los CORS Backend
 */
//baseURL Pruebas: 'http://192.168.4.18:8069/ISACore',
//baseURL Prod: 'http://192.168.4.18:8555/ISACore',
const http = Axios.create({
    baseURL: 'http://localhost:8440',

    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
    /*     timeout: 4000,
        headers: { 'X-Custom-Header': 'foobar' } */
});



// To add token to the header with bearer schema
http.interceptors.request.use(
    (config) => {
        document.body.classList.add('loading-indicator');
        const token = getJwt()
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

http.interceptors.response.use(undefined, (error) => {
    console.log(error)
    document.body.classList.remove('loading-indicator');
    if (error.message === 'Network Error' && !error.response) {
        console.log('Network error - make sure the API server is running')
    }

    const { status, data, config } = error.response

    if (status === 401) {
        localStorage.clear()
        toast.error('La sesión ha expirado, vuelva a iniciar sesión ! ', {
            position: toast.POSITION.TOP_RIGHT
        })
        history.push('/')
    }

    // eslint-disable-next-line no-prototype-builtins
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        //history.push('/notFound')
    }

    if (status === 500) {

        //dispatch.dispatch({type: 'CLOSE_MODAL'})
        if (data.message === null || data.message === undefined)
            toast.error('Server error - Contactese con el administrador del sistema !', {
                position: toast.POSITION.TOP_RIGHT
            })
        else
            toast.error(`ERROR - ${data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
        console.log('Server error - check the terminal for more info!')
    }

    throw error.response
})


const responseBody = response => response.data;

const request = {
    get: url => http.get(url).then(responseBody).finally(()=>{document.body.classList.remove('loading-indicator')}),
    post: (url, body) => http.post(url, body).then(responseBody).finally(()=>{document.body.classList.remove('loading-indicator')}),
    put: (url, body) => http.put(url, body).then(responseBody).finally(()=>{document.body.classList.remove('loading-indicator')}),
    delete: (url) => http.delete(url).then(responseBody).finally(()=>{document.body.classList.remove('loading-indicator')})
}

export default {
    request
};
