import http from './http';

const apiEndpoint = '/providers'

const ProveedorService = {
    list: () => http.request.get(apiEndpoint),
    details: (id) => http.request.get(`${apiEndpoint}/${id}`),
    create: (proveedor) => http.request.post(apiEndpoint, proveedor),
    update: (proveedor) => http.request.put(apiEndpoint, proveedor),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`)
  
  }
  
  export default ProveedorService