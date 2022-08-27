import http from "../http";

const apiEndpoint = '/solicitudHistorial'

const SolicitudHistorialService = {
    listarPorIdSolicitud: (id) => http.request.get(`${apiEndpoint}/${id}`),
}

export default SolicitudHistorialService;