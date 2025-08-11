import http from './http';

const apiEndpoint = '/api/v1/menus'

const MenuService = {
  list: () => http.request.get(apiEndpoint),
  listarPorUsuario: (username) => http.request.get(`${apiEndpoint}/permisos/por-usuario/${username}`),
  listarPorPerfil: (perfilId) => http.request.get(`${apiEndpoint}/por-perfil/${perfilId}`),
  asignar: (perfilId, data) => http.request.post(`${apiEndpoint}/menu-profile/asignar/${perfilId}`, data),
  create: (menu) => http.request.post(apiEndpoint, menu),
  update: (menu) => http.request.put(`${apiEndpoint}/${menu.id}`, menu),
  delete: (id) => http.request.delete(`${apiEndpoint}/${id}`)

}

export default MenuService