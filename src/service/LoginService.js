import http from './http';
import { setToken, removeToken } from '../config/auth/credentialConfiguration';
import { LOGIN_ENDPOINT, TOKEN_AUTH_USERNAME, TOKEN_AUTH_PASSWORD, HOST, AUTH_ENDPOINT } from '../infrastructure/appConstants';
import Axios from 'axios';

const apiEndPoint = '/security/api';


const LoginService = {
    login: async (credentials) => {

        const body = `grant_type=password&username=${encodeURIComponent(credentials.usuario)}&password=${encodeURIComponent(credentials.contrasena)}`;

        const token = Buffer.from(`${TOKEN_AUTH_USERNAME}:${TOKEN_AUTH_PASSWORD}`, 'utf8').toString('base64')

        try {
            var response = await Axios.post(`${HOST}${AUTH_ENDPOINT}`, body, {
                headers: {
                    'Authorization': `Basic ${token}`
                }
            })

            if (response.data.access_token) setToken(response.data.access_token);
            return response
        } catch (error) {
            throw error
        }

    },
    currentUser: (idUser) => http.request.get(`${HOST}${LOGIN_ENDPOINT}`,idUser),
    logout: () => removeToken()
}

export default LoginService
