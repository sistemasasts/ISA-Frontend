import http from './http';

const apiEndpoint = '/role'

const RoleService = {
    listar: () => http.request.get(`${apiEndpoint}/findAll`),
}

export default RoleService
