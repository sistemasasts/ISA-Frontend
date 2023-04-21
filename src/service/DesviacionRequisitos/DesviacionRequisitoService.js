import http from "../http";

const apiEndpoint = "/desviacion-requisito";

const DesviacionRequisitoService = {
    list: () => http.request.get(apiEndpoint),
    crear: (desviacionRequisito) => http.request.post(apiEndpoint, desviacionRequisito),
    actualizar: (desviacionRequisito) => http.request.put(apiEndpoint, desviacionRequisito),
    obtenerPorId: (desviacionId) => http.request.get(`${apiEndpoint}/${desviacionId}`)
}

export default DesviacionRequisitoService