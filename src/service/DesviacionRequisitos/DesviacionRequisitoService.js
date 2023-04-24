import http from "../http";

const apiEndpoint = "/desviacion-requisito";

const DesviacionRequisitoService = {
    list: () => http.request.get(apiEndpoint),
    listarPorCriterios: (criterios) => http.request.post(`${apiEndpoint}/criterios?page=${criterios.page}&size=${criterios.size}`, criterios.consulta),
    crear: (desviacionRequisito) => http.request.post(apiEndpoint, desviacionRequisito),
    actualizar: (desviacionRequisito) => http.request.put(apiEndpoint, desviacionRequisito),
    obtenerPorId: (desviacionId) => http.request.get(`${apiEndpoint}/${desviacionId}`),
    obtenerReporte: (desviacionId) => http.request.get(`${apiEndpoint}/reporte/${desviacionId}`)
}

export default DesviacionRequisitoService