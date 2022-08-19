import http from "../http";

const apiEndpoint = '/solicitudesPruebasProceso'

const SolicitudPruebasProcesoService = {
    listarTodos: () => http.request.get(`${apiEndpoint}/nombreSolicitante`),
    listarTodosValidar: () => http.request.get(`${apiEndpoint}/usuarioValidador`),
    listarTodosPorResponder: () => http.request.get(`${apiEndpoint}/usuarioGestion`),
    create: (solicitud) => http.request.post(apiEndpoint, solicitud),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    enviarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/enviarSolicitud/`, solicitud),
    validarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/validarSolicitud/`, solicitud),
    responderSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/responderSolicitud/`, solicitud),
    regresarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/regresarInformeSolicitud/`, solicitud),
    anularSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/anularSolicitud/`, solicitud),
    rechazarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/rechazarSolicitud/`, solicitud),

}

export default SolicitudPruebasProcesoService;