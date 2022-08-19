import http from './http';

const apiEndpoint = '/configuracionesse'

const ConfigSolicitudSEServices = {
    listarTodos: () => http.request.get(`${apiEndpoint}`),
    listarTipoSolicitud: () => http.request.get(`${apiEndpoint}/tipoSolicitud`),
    listarOrdenFlujo: () => http.request.get(`${apiEndpoint}/ordenFlujo`),
    create: (config) => http.request.post(apiEndpoint, config),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`),

}

export default ConfigSolicitudSEServices