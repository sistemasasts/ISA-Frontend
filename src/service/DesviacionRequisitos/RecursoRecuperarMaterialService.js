import http from "../http";

const apiEndpoint = "/recursoMaterial";

const RecursoRecuperarMaterialService = {
    listarPorDesviacionId: (desviacionId) => http.request.get(`${apiEndpoint}/desviacion/${desviacionId}`),
    crear: (recurso) => http.request.post(apiEndpoint, recurso),
    actualizar: (recurso) => http.request.put(apiEndpoint, recurso),
    listarPorLoteId: (recursoId) => http.request.get(`${apiEndpoint}/${recursoId}`),
    eliminarPorId: (recursoId) => http.request.delete(`${apiEndpoint}/${recursoId}`)
}

export default RecursoRecuperarMaterialService