import http from "../http";
import httpFiles from "../httpFiles";

const apiEndPoint = '/pncDocumentos';

const PncDocumentoService = {
    listarArchivos: (estado, orden, idSalida) => http.request.get(`${apiEndPoint}/${estado}/${orden}/${idSalida}`),
    listarArchivosPnc: (idPnc) => http.request.get(`${apiEndPoint}/pnc/${idPnc}`),
    listarArchivosPlanesAccion: (orden, idSalida, idPlanAccion) => http.request.get(`${apiEndPoint}/planAccion/${orden}/${idSalida}/${idPlanAccion}`),
    subirArchivo: (criterio) => http.request.post(`${apiEndPoint}/subir`, criterio),    
    subirArchivoPnc: (criterio) => http.request.post(`${apiEndPoint}/subirPnc`, criterio),    
    ver: (id) => httpFiles.request.get(`${apiEndPoint}/ver/${id}`),
    /* verImagen: (id) => http.request.get(`${apiEndPoint}/solicitudPruebasProceso/ver/imagen/${id}`), */
    eliminar: (id) => http.request.delete(`${apiEndPoint}/${id}`),
    descargarComprimido: (historialId) => httpFiles.request.get(`${apiEndPoint}/comprimido/${historialId}`),
};

export default PncDocumentoService;
