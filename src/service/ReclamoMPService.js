import http from './http';
import httpFiles from './httpFiles';

const apiEndpoint = '/complaints'

const ReclamoMPService = {

  listarPorCriterios: (page, size, criterios) => http.request.post(`${apiEndpoint}/listarPorCriterios/?page=${page}&size=${size}`, criterios),
  registrar: (reclamo) => http.request.post(`${apiEndpoint}/registrar`, reclamo),
  actualizar: (reclamo) => http.request.put(`${apiEndpoint}/actualizar`, reclamo),
  listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
  cerrar: (reclamo) => http.request.post(`${apiEndpoint}/close`, reclamo),
  agregarProblema: (criterio) => httpFiles.request.post(`${apiEndpoint}/crearProblema`, criterio),
  listarProblemas: (id) => http.request.get(`${apiEndpoint}/listarProblemas/${id}`),
  eliminarProblema: (reclamoId, problemaId) => http.request.delete(`${apiEndpoint}/eliminarProblema/${reclamoId}/${problemaId}`),
  enviar: (reclamo) => http.request.post(`${apiEndpoint}/enviar`, reclamo),
  listarAsignadasPorEstado: (estado) => http.request.get(`${apiEndpoint}/listarAsignadasPorEstado/${estado}`),
  procesarCalidad: (reclamo) => http.request.post(`${apiEndpoint}/procesarCalidad`, reclamo),
  procesarCompras: (reclamo) => http.request.post(`${apiEndpoint}/procesarCompras`, reclamo),
  anular: (reclamo) => http.request.post(`${apiEndpoint}/anular`, reclamo),

  crearAccionEjecutada: (accion) => http.request.post(`${apiEndpoint}/crearAccionEjecutada`, accion),
  actualizarAccionEjecutada: (accion) => http.request.put(`${apiEndpoint}/actualizarAccionEjecutada`, accion),
  eliminarAccionEjecutada: (reclamoId, accionId) => http.request.delete(`${apiEndpoint}/eliminarAccionEjecutada/${reclamoId}/${accionId}`),

  crearPlanAccion: (accion) => http.request.post(`${apiEndpoint}/crearPlanAccion`, accion),
  actualizarPlanAccion: (accion) => http.request.put(`${apiEndpoint}/actualizarPlanAccion`, accion),
  eliminarPlanAccion: (reclamoId, accionId, dto) => http.request.post(`${apiEndpoint}/eliminarPlanAccion/${reclamoId}/${accionId}`, dto),

  listarHistorial: (id) => http.request.get(`${apiEndpoint}/historial/${id}`),
  generarReporte: (id) => httpFiles.request.get(`${apiEndpoint}/reporte/${id}`),

  notificarReclamo: (accion) => http.request.post(`${apiEndpoint}/notificarReclamo`, accion),
  enviarPlanesAccion: (accion) => http.request.post(`${apiEndpoint}/enviarPlanesAccion`, accion),
  listarPendientesPlanesAccion: () => http.request.get(`${apiEndpoint}/listarPlanesAccionAsignadasPorEstado`),

  procesarPlanAccion: (accion) => http.request.post(`${apiEndpoint}/procesarPlanAccion`, accion),
  validarPlanAccion: (accion) => http.request.post(`${apiEndpoint}/validarPlanAccion`, accion),

  obtenerEstados: () => http.request.get(`${apiEndpoint}/catalogoEstado`),
  
}

export default ReclamoMPService