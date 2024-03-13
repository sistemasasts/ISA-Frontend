import http from "../http";
import httpFiles from "../httpFiles";

const apiEndPoint = '/desviacionDocumentos';

const DesviacionRequsitoDocumentoService = {
    listarArchivos: (orden, idDesviacion) => http.request.get(`${apiEndPoint}/${orden}/${idDesviacion}`),
    subirArchivo: (criterio) => http.request.post(`${apiEndPoint}/subir`, criterio),    
    ver: (id) => httpFiles.request.get(`${apiEndPoint}/ver/${id}`),
    /* verImagen: (id) => http.request.get(`${apiEndPoint}/solicitudPruebasProceso/ver/imagen/${id}`), */
    eliminar: (id) => http.request.delete(`${apiEndPoint}/${id}`),
    descargarComprimido: (historialId) => httpFiles.request.get(`${apiEndPoint}/comprimido/${historialId}`),
};

export default DesviacionRequsitoDocumentoService;
