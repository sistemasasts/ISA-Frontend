import http from './http';

const apiEndpoint = '/api/v1/perfiles'

const PerfilService = {
  list: () => http.request.get(apiEndpoint),
  listarActivos: () => http.request.get(`${apiEndpoint}/activo`),
  listarRoles: () => http.request.get(`${apiEndpoint}/roles`),
  create: (perfil) => http.request.post(apiEndpoint, perfil),
  update: (perfil) => http.request.put(`${apiEndpoint}`, perfil),
}

export default PerfilService