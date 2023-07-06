import http from '../http';

const apiEndpoint = '/defectos'

const DefectoService = {
    list: () => http.request.get(apiEndpoint),
    listarActivos: () => http.request.get(`${apiEndpoint}/activos`),
    crear: (norma) => http.request.post(apiEndpoint, norma),
    actualizar: (norma) => http.request.put(apiEndpoint, norma),

}

export default DefectoService
