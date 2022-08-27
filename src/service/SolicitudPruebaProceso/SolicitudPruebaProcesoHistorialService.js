import http from "../http";

const apiEndpoint = '/solicitudHistorialPP'

const SolicitudPruebaProcesoHistorialService = {
    listarPorIdSolicitud: (id) => http.request.get(`${apiEndpoint}/${id}`),
}

export default SolicitudPruebaProcesoHistorialService;