import http from "../http";

const apiEndpoint = '/solicitudesPruebasProceso'

const SolicitudPruebasProcesoService = {
    listarAreas: () => http.request.get(`${apiEndpoint}/areas`),
    listarOrigen: () => http.request.get(`${apiEndpoint}/origenes`),
    listarTodos: () => http.request.get(`${apiEndpoint}/nombreSolicitante`),
    listarTodosValidar: () => http.request.get(`${apiEndpoint}/usuarioValidador`),
    listarPorAsignarResponsable: () => http.request.get(`${apiEndpoint}/usuarioGestion`),
    create: (solicitud) => http.request.post(apiEndpoint, solicitud),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    enviarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/enviarSolicitud/`, solicitud),
    validarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/validarSolicitud/`, solicitud),
    asignarResponsable: (solicitud) => http.request.post(`${apiEndpoint}/asignarResponsable/`, solicitud),
    listarAsignadas: (criterioConsulta) => http.request.get(`${apiEndpoint}/solicitudesAsignadas/${criterioConsulta}`),
    marcarPruebaNoRealizada: (solicitud) => http.request.post(`${apiEndpoint}/marcarPruebaNoRealizada/`, solicitud),
    marcarPruebaRealizada: (solicitud) => http.request.post(`${apiEndpoint}/marcarPruebaRealizada/`, solicitud),
    procesar: (solicitud) => http.request.post(`${apiEndpoint}/procesar/`, solicitud),
    procesarAprobacion: (aprobacion) => http.request.post(`${apiEndpoint}/procesarAprobacion/`, aprobacion),
    listarPorAsignarResponsableCM: (orden) => http.request.get(`${apiEndpoint}/solicitudesPorAsignar/${orden}`),
    listarPorAprobar: (orden) => http.request.get(`${apiEndpoint}/solicitudesPorAprobar/${orden}`),
    /*regresarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/regresarInformeSolicitud/`, solicitud), */
    anularSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/anularSolicitud/`, solicitud),
    //rechazarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/rechazarSolicitud/`, solicitud),

}

export default SolicitudPruebasProcesoService;