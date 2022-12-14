import http from "../http";

const apiEndpoint = '/solicitudHistorial'

const SolicitudHistorialService = {
    listarPorIdSolicitud: (id) => http.request.get(`${apiEndpoint}/${id}`),
    listarCompletoPorIdSolicitud: (id) => http.request.get(`${apiEndpoint}/completo/${id}`),
}

export default SolicitudHistorialService;
