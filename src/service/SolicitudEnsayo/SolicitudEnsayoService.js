import http from "../http";

const apiEndpoint = '/solicitudesEnsayo'

const SolicitudEnsayoService = {
    listarTodos: () => http.request.get(`${apiEndpoint}/nombreSolicitante`),
    listarTodosValidar: () => http.request.get(`${apiEndpoint}/usuarioValidador`),
    listarTodosPorResponder: () => http.request.get(`${apiEndpoint}/usuarioGestion`),
    listarTodosPorAprobar: () => http.request.get(`${apiEndpoint}/usuarioAprobador`),
    create: (solicitud) => http.request.post(apiEndpoint, solicitud),
    actualizar: (solicitud) => http.request.put(apiEndpoint, solicitud),
    listarPrioridadNivel: () => http.request.get(`${apiEndpoint}/prioridadesNivel`),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    enviarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/enviarSolicitud/`, solicitud),
    validarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/validarSolicitud/`, solicitud),
    responderSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/responderSolicitud/`, solicitud),
    aprobarInforme: (solicitud) => http.request.post(`${apiEndpoint}/aprobarInforme/`, solicitud),
    rechazarInforme: (solicitud) => http.request.post(`${apiEndpoint}/rechazarInforme/`, solicitud),
    aprobarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/aprobarSolicitud/`, solicitud),
    regresarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/regresarInformeSolicitud/`, solicitud),
    anularSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/anularSolicitud/`, solicitud),
    rechazarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/rechazarSolicitud/`, solicitud),
    regresarNovedadSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/regresarNovedadSolicitud/`, solicitud),
    listarTiposAprobacion: () => http.request.get(`${apiEndpoint}/tiposAprobacion`),
    listarEstados: () => http.request.get(`${apiEndpoint}/estados`),
    consultar: (page, size, consulta) => http.request.post(`${apiEndpoint}/consulta/?page=${page}&size=${size}`, consulta),
    crearAPartirSolicitudPadre: (id) => http.request.get(`${apiEndpoint}/crearAPartirSolicitudPadre/${id}`),
    finalizarProceso: (solicitud) => http.request.post(`${apiEndpoint}/finalizarProceso/`, solicitud),
    iniciarPruebaEnProceso: (solicitud) => http.request.post(`${apiEndpoint}/iniciarPruebaEnProceso/`, solicitud),
    confirmarPlanesAccion: (solicitud) => http.request.post(`${apiEndpoint}/confirmarPlanesAccion/`, solicitud),
    finalizarRevisionPlanesAccion: (solicitud) => http.request.post(`${apiEndpoint}/finalizarRevisionPlanesAccion/`, solicitud),
    listarPorRevisarPlanAccion: () => http.request.get(`${apiEndpoint}/pendienteRevisarPlanAccion`),

}

export default SolicitudEnsayoService;
