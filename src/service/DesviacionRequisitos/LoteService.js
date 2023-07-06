import http from "../http";

const apiEndpoint = "/lote";

const LoteService = {
    listarPorDesviacionId: (desviacionId) => http.request.get(`${apiEndpoint}/desviacion/${desviacionId}`),
    crear: (lote) => http.request.post(apiEndpoint, lote),
    actualizar: (lote) => http.request.put(apiEndpoint, lote),
    listarPorLoteId: (loteId) => http.request.get(`${apiEndpoint}/${loteId}`),
    eliminarPorId: (loteId) => http.request.delete(`${apiEndpoint}/${loteId}`)
}

export default LoteService