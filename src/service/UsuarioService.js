import http from './http';

const apiEndpoint = '/userimptek'

const UsuarioService = {
    list: () => http.request.get(apiEndpoint),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    listarAreas: () => http.request.get(`${apiEndpoint}/areas`),
    listarTipos: () => http.request.get(`${apiEndpoint}/tiposEmpleados`),
    details: (id) => http.request.get(`${apiEndpoint}/${id}`),
    create: (usuario) => http.request.post(apiEndpoint, usuario),
    update: (usuario) => http.request.put(apiEndpoint, usuario),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`),
    reestablecerContrasena: (usuario) => http.request.post(`${apiEndpoint}/reestablecerContrasena/`, usuario),

}

export default UsuarioService
