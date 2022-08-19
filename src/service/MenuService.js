import http from './http';

const apiEndpoint = '/menus'

const MenuService = {
  list: () => http.request.get(apiEndpoint),
  listarPorUsuario: (username) => http.request.post(`${apiEndpoint}/usuario`, username),
  details: (id) => http.request.get(`${apiEndpoint}/${id}`),
  create: (menu) => http.request.post(apiEndpoint, menu),
  update: (menu) => http.request.put(`${apiEndpoint}/${menu.id}`, menu),
  delete: (id) => http.request.delete(`${apiEndpoint}/${id}`)

}

export default MenuService