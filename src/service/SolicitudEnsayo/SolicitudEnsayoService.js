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
    aprobarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/aprobarSolicitud/`, solicitud),
    regresarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/regresarInformeSolicitud/`, solicitud),
    anularSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/anularSolicitud/`, solicitud),
    rechazarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/rechazarSolicitud/`, solicitud),
    listarTiposAprobacion: () => http.request.get(`${apiEndpoint}/tiposAprobacion`),
    listarEstados: () => http.request.get(`${apiEndpoint}/estados`),
    consultar: (page, size, consulta) => http.request.post(`${apiEndpoint}/consulta/?page=${page}&size=${size}`, consulta),

}

export default SolicitudEnsayoService;
