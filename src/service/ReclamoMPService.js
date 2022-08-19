import http from './http';

const apiEndpoint = '/complaints'

const ReclamoMPService = {
    cerrar: (id) => http.request.get(`${apiEndpoint}/close/${id}`),
  }
  
  export default ReclamoMPService