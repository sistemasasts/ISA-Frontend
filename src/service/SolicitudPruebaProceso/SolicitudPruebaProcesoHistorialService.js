import http from "../http";

const apiEndpoint = '/solicitudHistorialPP'

const SolicitudPruebaProcesoHistorialService = {
    listarPorIdSolicitud: (id) => http.request.get(`${apiEndpoint}/${id}`),
    listarCompletoPorIdSolicitud: (id) => http.request.get(`${apiEndpoint}/completo/${id}`),
}

export default SolicitudPruebaProcesoHistorialService;