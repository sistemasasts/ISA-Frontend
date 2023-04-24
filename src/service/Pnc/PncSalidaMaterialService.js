import http from '../http';

const apiEndpoint = '/pncSalidasMaterial'

const PncSalidaMaterialService = {
    listarPorPncId: (pncId) => http.request.get(`${apiEndpoint}/pnc/${pncId}`),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    listarPorIdCompleto: (id) => http.request.get(`${apiEndpoint}/completo/${id}`),
    listarPorEstado: (estado) => http.request.get(`${apiEndpoint}/estado/${estado}`),
    listarDestinoFinal: () => http.request.get(`${apiEndpoint}/catalogoDestino`),
    crear: (norma) => http.request.post(apiEndpoint, norma),
    actualizar: (norma) => http.request.put(apiEndpoint, norma),
    listarHistorial: (id) => http.request.get(`${apiEndpoint}/historial/${id}`),
    listarEstados: () => http.request.get(`${apiEndpoint}/catalogoEstados`),
    eliminar: (pncId, id) => http.request.delete(`${apiEndpoint}/${pncId}/${id}`),

    enviar: (salida) => http.request.post(`${apiEndpoint}/enviarAprobar`, salida),
    aprobar: (norma) => http.request.post(`${apiEndpoint}/aprobar`, norma),
    regresar: (salida) => http.request.post(`${apiEndpoint}/regresar`, salida),

}

export default PncSalidaMaterialService;
