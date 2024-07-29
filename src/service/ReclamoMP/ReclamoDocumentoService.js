import http from "../http";
import httpFiles from "../httpFiles";

const apiEndPoint = '/reclamoMPDocumentos';

const ReclamoDocumentoService = {
    listarArchivos: (orden, idDesviacion) => http.request.get(`${apiEndPoint}/${orden}/${idDesviacion}`),
    
    listarArchivosPlanAccion: (orden, idDesviacion, idPlanAccion) => http.request.get(`${apiEndPoint}/${orden}/${idDesviacion}/${idPlanAccion}`),

    subirArchivo: (criterio) => http.request.post(`${apiEndPoint}/subir`, criterio),    
    ver: (id) => httpFiles.request.get(`${apiEndPoint}/ver/${id}`),
    /* verImagen: (id) => http.request.get(`${apiEndPoint}/solicitudPruebasProceso/ver/imagen/${id}`), */
    eliminar: (id) => http.request.delete(`${apiEndPoint}/${id}`),
    descargarComprimido: (historialId) => httpFiles.request.get(`${apiEndPoint}/comprimido/${historialId}`),
};

export default ReclamoDocumentoService;
