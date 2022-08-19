import http from './http';

const apiEndpoint = '/laboratoryNorms'

const NormasLaboratorioService = {
    list: () => http.request.get(apiEndpoint),
    listarVigentes: () => http.request.get(`${apiEndpoint}/vigentes`),
    details: (id) => http.request.get(`${apiEndpoint}/${id}`),
    create: (norma) => http.request.post(apiEndpoint, norma),
    update: (norma) => http.request.put(apiEndpoint, norma),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`),
    listarEstadosNorma: () => http.request.get(`${apiEndpoint}/listState`),
  
  }
  
  export default NormasLaboratorioService