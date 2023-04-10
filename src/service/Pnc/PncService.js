import http from '../http';
import httpFiles from '../httpFiles';

const apiEndpoint = '/pncs'

const PncService = {
    listarPorCriterios: (page, size, criterios) => http.request.post(`${apiEndpoint}/listarPorCriterios/?page=${page}&size=${size}`, criterios),
    listarActivos: () => http.request.get(`${apiEndpoint}/activos`),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    crear: (norma) => http.request.post(apiEndpoint, norma),
    actualizar: (norma) => http.request.put(apiEndpoint, norma),
    anular: (norma) => http.request.post(`${apiEndpoint}/anular`, norma),
    consultarSaldo: (id) => http.request.get(`${apiEndpoint}/consultarSaldo/${id}`),

    obtenerProcedenciaLinea: () => http.request.get(`${apiEndpoint}/catalogoProcedencia`),
    obtenerLineaAfecta: () => http.request.get(`${apiEndpoint}/catalogoLineaAfecta`),
    obtenerEstados: () => http.request.get(`${apiEndpoint}/catalogoEstado`),

    agregarDefecto: (info) => http.request.post(`${apiEndpoint}/agregarDefecto`, info),
    actualizarDefecto: (info) => http.request.put(`${apiEndpoint}/actualizarDefecto`, info),
    listarImagenDefecto: (id) => http.request.get(`${apiEndpoint}/defecto/verImagen/${id}`),
    eliminarDefecto: (idPnc, idDefecto) => http.request.delete(`${apiEndpoint}/${idPnc}/${idDefecto}`),
    generarReporte: (id) => httpFiles.request.get(`${apiEndpoint}/generarReporte/${id}`),

}

export default PncService
