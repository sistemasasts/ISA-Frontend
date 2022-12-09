import http from "./http";

const apiEndPoint = '/aprobacionSolicitud';

const AprobacionSolicitudService = {
    listarPendientesValidar: () => http.request.get(`${apiEndPoint}/pendientesValidar`),
    listarPendientesRevisarInforme: () => http.request.get(`${apiEndPoint}/pendientesAprobarInforme`),
    listarPendientesAprobarSolicitud: () => http.request.get(`${apiEndPoint}/pendientesAprobarSolicitud`),

};

export default AprobacionSolicitudService;
