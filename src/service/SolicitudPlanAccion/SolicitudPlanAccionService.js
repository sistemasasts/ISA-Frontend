import http from "../http";

const apiEndpoint = '/solicitudPlanesAccion'

const SolicitudPlanAccionService = {
    listarPorTipo: (tipo, solicitudId) => http.request.get(`${apiEndpoint}/${tipo}/${solicitudId}`),
    create: (plan) => http.request.post(apiEndpoint, plan),
    actualizar: (plan) => http.request.put(apiEndpoint, plan),
    marcarCumplimiento: (plan) => http.request.put(`${apiEndpoint}/marcarCumplimiento`, plan),
    eliminar: (id) => http.request.delete(`${apiEndpoint}/${id}`)
}

export default SolicitudPlanAccionService;
