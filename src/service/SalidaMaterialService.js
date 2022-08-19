import http from './http';

const apiEndpoint = '/exitmaterials'

const SalidaMaterialService = {
    list: (id) => http.request.get(`${apiEndpoint}/${id}`),
    create: (salida) => http.request.post(apiEndpoint, salida),
    update: (salida) => http.request.put(apiEndpoint, salida),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`)
  
  }
  
  export default SalidaMaterialService