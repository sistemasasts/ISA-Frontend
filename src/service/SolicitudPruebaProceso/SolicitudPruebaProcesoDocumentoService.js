import http from "../http";
import httpFiles from "../httpFiles";

const apiEndPoint = '/solicitudDocumentos';

const SolicitudPruebaProcesoDocumentoService = {
    listarArchivos: (estado, orden, idSolicitud) => http.request.get(`${apiEndPoint}/solicitudPruebasProceso/${estado}/${orden}/${idSolicitud}`),
    subirArchivo: (criterio) => http.request.post(`${apiEndPoint}/solicitudPruebasProceso`, criterio),
    subirArchivoImagen1: (criterio) => http.request.post(`${apiEndPoint}/solicitudPruebasProceso/imagen1`, criterio),
    ver: (id) => httpFiles.request.get(`${apiEndPoint}/solicitudPruebasProceso/ver/${id}`),
    verImagen: (id) => http.request.get(`${apiEndPoint}/solicitudPruebasProceso/ver/imagen/${id}`),
    eliminar: (id) => http.request.delete(`${apiEndPoint}/solicitudPruebasProceso/${id}`),
    descargarComprimido: (historialId) => httpFiles.request.get(`${apiEndPoint}/solicitudPruebasProceso/comprimido/${historialId}`),
};

export default SolicitudPruebaProcesoDocumentoService;
