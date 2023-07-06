import http from './http';
import httpFiles from './httpFiles';

const apiEndpoint = '/pncs'

const PncService = {

  
  generarReporte: (id) => httpFiles.request.get(`${apiEndpoint}/generarReporte/${id}`)

}



export default PncService