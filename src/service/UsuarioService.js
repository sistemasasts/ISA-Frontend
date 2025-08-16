import http from './http';

const apiEndpoint = '/api/v1/usuarios'

const UsuarioService = {
    list: () => http.request.get(apiEndpoint),
    listarActivos: () => http.request.get(`${apiEndpoint}/activo`),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    listarAreas: () => http.request.get(`${apiEndpoint}/areas`),
    listarEstado: () => http.request.get(`${apiEndpoint}/estado`),
    //listarTipos: () => http.request.get(`${apiEndpoint}/tiposEmpleados`),
    create: (usuario) => http.request.post(apiEndpoint, usuario),
    update: (usuario) => http.request.put(apiEndpoint, usuario),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`),
    listarPerfiles: (usuarioId) => http.request.get(`${apiEndpoint}/usuario-perfil/por-usuario/${usuarioId}`),
    createUsuarioPerfil: (usuarioPerfil) => http.request.post(`${apiEndpoint}/usuario-perfil`, usuarioPerfil),
    deleteUsuarioPerfil: (usuarioId, perfilId) => http.request.delete(`${apiEndpoint}/usuario-perfil/${usuarioId}/${perfilId}`),
    reestablecerContrasena: (usuario) => http.request.post(`${apiEndpoint}/reestablecerContrasena/`, usuario),

}

export default UsuarioService
