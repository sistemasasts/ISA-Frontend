import http from "../http";
import httpFiles from "../httpFiles";

const apiEndpoint = "/desviacion-requisito";

const DesviacionRequisitoService = {
    list: () => http.request.get(apiEndpoint),
    listarPorCriterios: (criterios) => http.request.post(`${apiEndpoint}/criterios?page=${criterios.page}&size=${criterios.size}`, criterios.consulta),
    crear: (desviacionRequisito) => http.request.post(apiEndpoint, desviacionRequisito),
    actualizar: (desviacionRequisito) => http.request.put(apiEndpoint, desviacionRequisito),
    obtenerPorId: (desviacionId) => http.request.get(`${apiEndpoint}/${desviacionId}`),
    obtenerReporte: (desviacionId) => httpFiles.request.get(`${apiEndpoint}/reporte/${desviacionId}`),
    agregarDefecto: (desviacionId, defectoId) => http.request.get(`${apiEndpoint}/agregarDefecto/${desviacionId}/${defectoId}`),
    eliminarDefecto: (desviacionId, defectoId) => http.request.delete(`${apiEndpoint}/eliminarDefecto/${desviacionId}/${defectoId}`),
    enviar: (desviacionRequisito) => http.request.post(`${apiEndpoint}/enviar`, desviacionRequisito),
    
    listarPorEstado: (estado) => http.request.get(`${apiEndpoint}/estado/${estado}`),
    listarHistorial: (id) => http.request.get(`${apiEndpoint}/historial/${id}`),
    procesar: (desviacion) => http.request.post(`${apiEndpoint}/procesar`, desviacion),
}

export default DesviacionRequisitoService