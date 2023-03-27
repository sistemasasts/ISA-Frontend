import http from '../http';

const apiEndpoint = '/pncPlanesAccion'

const PncPlanAccionService = {
    listarPorSalidaMaterialId: (salidaMaterialId) => http.request.get(`${apiEndpoint}/listarPorSalidaMaterial/${salidaMaterialId}`),
    registrar: (planAccion) => http.request.post(apiEndpoint, planAccion),
    actualizar: (planAccion) => http.request.put(apiEndpoint, planAccion),
    eliminar: (salidaMaterialId, planAccionId) => http.request.delete(`${apiEndpoint}/${salidaMaterialId}/${planAccionId}`),

    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    procesar: (planAccion) => http.request.post(`${apiEndpoint}/procesar`, planAccion),
    listarPorEstado: (estado) => http.request.get(`${apiEndpoint}/listarPorEstado/${estado}`),
}

export default PncPlanAccionService;
