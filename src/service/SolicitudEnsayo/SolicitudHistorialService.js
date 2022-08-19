import http from "../http";

const apiEndpoint = '/solicitudHistorial'

const SolicitudHistorialService = {
    listarPorIdSolicitud: (id) => http.request.get(`${apiEndpoint}/${id}`),
    listarPorIdSolicitudPruebasProceso: (id) => http.request.get(`${apiEndpoint}/pruebasProceso/${id}`),
}

export default SolicitudHistorialService;