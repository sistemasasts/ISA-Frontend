import http from './http';

const apiEndpoint = '/propertylists'

const PropiedadService = {
    list: () => http.request.get(apiEndpoint),
    details: (id) => http.request.get(`${apiEndpoint}/${id}`),
    create: (propiedad) => http.request.post(apiEndpoint, propiedad),
    update: (propiedad) => http.request.put(apiEndpoint, propiedad),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`),
    listNormsNOAsignadas: (id) => http.request.get(`${apiEndpoint}/normsAssignNot/${id}`),   
  }
  
  export default PropiedadService