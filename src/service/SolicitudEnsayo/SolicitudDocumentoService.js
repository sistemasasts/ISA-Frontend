import http from "../http";
import httpFiles from "../httpFiles";

const apiEndPoint = '/solicitudDocumentos';

const SolicitudDocumentoService = {
    listarArchivos: (estado, orden, idSolicitud) => http.request.get(`${apiEndPoint}/${estado}/${orden}/${idSolicitud}`),
    listarArchivosPruebasProceso: (estado, orden, idSolicitud) => http.request.get(`${apiEndPoint}/solicitudPruebasProceso/${estado}/${orden}/${idSolicitud}`),
    subirArchivo: (criterio) => http.request.post(apiEndPoint, criterio),
    subirArchivoImagenMuestra: (criterio) => http.request.post(`${apiEndPoint}/imagenMuestra`, criterio),
    subirArchivoPruebasProceso: (criterio) => http.request.post(`${apiEndPoint}/solicitudPruebasProceso`, criterio),
    ver: (id) => httpFiles.request.get(`${apiEndPoint}/ver/${id}`),
    verImagenMuestra: (id) => http.request.get(`${apiEndPoint}/ver/imagenMuestra/${id}`),
    eliminar: (id) => http.request.delete(`${apiEndPoint}/${id}`),
    descargarComprimido: (historialId) => httpFiles.request.get(`${apiEndPoint}/comprimido/${historialId}`),
};

export default SolicitudDocumentoService;
