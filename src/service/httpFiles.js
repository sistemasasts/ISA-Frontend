import Axios from "axios";
import { getJwt } from "../config/auth/credentialConfiguration";
import { toast } from "react-toastify";
import history from "../history";


//baseURL PRUEBAS: 'http://192.168.4.18:8069/ISACore',
//baseURL PRODUC: 'http://192.168.4.18:8555/ISACore',
const httpFiles = Axios.create({
    baseURL: 'http://localhost:8440',

    headers: {  
        'Content-Type' : 'application/octet-stream',       
    },
    responseType: 'blob'
    /*     timeout: 4000,
        headers: { 'X-Custom-Header': 'foobar' } */
});

// To add token to the header with bearer schema
httpFiles.interceptors.request.use(
    (config) => {
        const token = getJwt()
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

httpFiles.interceptors.response.use(undefined, (error) => {
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
        history.push('/notFound')
    }

    if (status === 500) {
        
        //dispatch.dispatch({type: 'CLOSE_MODAL'})
        toast.error('Server error - Contactese con el administrador del sistema !', {
            position: toast.POSITION.TOP_RIGHT
        })
        console.log('Server error - check the terminal for more info!')
    }

    throw error.response
})

const responseBody = response => response.data;

const request = {
    get: url => httpFiles.get(url).then(responseBody),
    post: (url, body) => httpFiles.post(url, body).then(responseBody),
    put: (url, body) => httpFiles.put(url, body).then(responseBody),
    delete: (url) => httpFiles.delete(url).then(responseBody)
}

export default {
    request
};
