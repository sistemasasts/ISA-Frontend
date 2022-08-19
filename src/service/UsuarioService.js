import http from './http';

const apiEndpoint = '/userimptek'

const UsuarioService = {
    list: () => http.request.get(apiEndpoint),
    details: (id) => http.request.get(`${apiEndpoint}/${id}`),
    create: (usuario) => http.request.post(apiEndpoint, usuario),
    update: (usuario) => http.request.put(apiEndpoint, usuario),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`)  
  
  }

  export default UsuarioService