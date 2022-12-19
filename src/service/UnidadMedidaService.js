import http from './http';

const apiEndpoint = '/unidadesMedida'

const UnidadMedidaService = {
    list: () => http.request.get(apiEndpoint),
    listarActivos: () => http.request.get(`${apiEndpoint}/activos`),
    create: (norma) => http.request.post(apiEndpoint, norma),
    update: (norma) => http.request.put(apiEndpoint, norma),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`),

}

export default UnidadMedidaService
