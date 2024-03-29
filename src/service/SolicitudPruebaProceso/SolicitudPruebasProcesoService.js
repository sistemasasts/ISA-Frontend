import http from "../http";
import httpFiles from "../httpFiles";

const apiEndpoint = '/solicitudesPruebasProceso'

const SolicitudPruebasProcesoService = {
    listarAreas: () => http.request.get(`${apiEndpoint}/areas`),
    listarOrigen: () => http.request.get(`${apiEndpoint}/origenes`),
    listarTodos: () => http.request.get(`${apiEndpoint}/nombreSolicitante`),
    listarTodosValidar: () => http.request.get(`${apiEndpoint}/usuarioValidador`),
    listarPorAsignarResponsable: () => http.request.get(`${apiEndpoint}/usuarioGestion`),
    create: (solicitud) => http.request.post(apiEndpoint, solicitud),
    actualizar: (solicitud) => http.request.put(apiEndpoint, solicitud),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    enviarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/enviarSolicitud/`, solicitud),
    validarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/validarSolicitud/`, solicitud),
    asignarResponsable: (solicitud) => http.request.post(`${apiEndpoint}/asignarResponsable/`, solicitud),
    reasignarResponsable: (solicitud) => http.request.post(`${apiEndpoint}/reasignarResponsable/`, solicitud),
    listarAsignadas: (criterioConsulta) => http.request.get(`${apiEndpoint}/solicitudesAsignadas/${criterioConsulta}`),
    marcarPruebaNoRealizada: (solicitud) => http.request.post(`${apiEndpoint}/marcarPruebaNoRealizada/`, solicitud),
    marcarPruebaNoRealizadaDefinitiva: (solicitud) => http.request.post(`${apiEndpoint}/marcarPruebaNoRealizadaDefinitiva/`, solicitud),
    marcarPruebaRealizada: (solicitud) => http.request.post(`${apiEndpoint}/marcarPruebaRealizada/`, solicitud),
    procesar: (solicitud) => http.request.post(`${apiEndpoint}/procesar/`, solicitud),
    procesarAprobacion: (aprobacion) => http.request.post(`${apiEndpoint}/procesarAprobacion/`, aprobacion),
    listarPorAsignarResponsableCM: (orden) => http.request.get(`${apiEndpoint}/solicitudesPorAsignar/${orden}`),
    listarPorReasignarResponsable: (orden) => http.request.get(`${apiEndpoint}/solicitudesPorReasignar/${orden}`),
    listarPorAprobar: (orden) => http.request.get(`${apiEndpoint}/solicitudesPorAprobar/${orden}`),
    regresarNovedadFormaSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/regresarSolicitudNovedadForma/`, solicitud),
    anularSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/anularSolicitud/`, solicitud),
    listarTipoAprobacion: () => http.request.get(`${apiEndpoint}/tiposAprobacion`),
    rechazarSolicitud: (solicitud) => http.request.post(`${apiEndpoint}/rechazarSolicitud/`, solicitud),
    generarReporte: (id) => httpFiles.request.get(`${apiEndpoint}/reporte/${id}`),
    repetirPrueba: (solicitudId) => http.request.get(`${apiEndpoint}/repetirPrueba/${solicitudId}`),
    consultar: (page, size, consulta) => http.request.post(`${apiEndpoint}/consulta/?page=${page}&size=${size}`, consulta),
    listarEstados: () => http.request.get(`${apiEndpoint}/estados`),
    listarTiposAprobacion: () => http.request.get(`${apiEndpoint}/tiposAprobacion`),
    //Crud material formula
    agregarMaterialFomula: (solicitudId, material) => http.request.post(`${apiEndpoint}/agregarMaterialFormula/${solicitudId}`, material),
    editarMaterialFomula: (solicitudId, material) => http.request.post(`${apiEndpoint}/editarMaterialFormula/${solicitudId}`, material),
    eliminarMaterialFomula: (solicitudId, materialId) => http.request.get(`${apiEndpoint}/eliminarMaterialFormula/${solicitudId}/${materialId}`),

}

export default SolicitudPruebasProcesoService;
