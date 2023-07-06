import http from './http';
import httpFiles from './httpFiles';

const apiEndPoint = '/products';

const ProductoService = {
    list: () => http.request.get(apiEndPoint),
    listarPorId: async (id) => await http.request.get(`${apiEndPoint}/${id}`),
    update: async (producto) => await http.request.put(apiEndPoint, producto),
    create: async (producto) => await http.request.post(apiEndPoint, producto),
    listarTipoProducto: async () => await http.request.get(`${apiEndPoint}/typeProduct`),
    listarOrigenProducto: async () => await http.request.get(`${apiEndPoint}/originProduct`),
    registrarApprobationCriteria: (id, criteria) => http.request.post(`${apiEndPoint}/approbationCriteria/${id}`, criteria),
    generarReporte: (id) => httpFiles.request.get(`${apiEndPoint}/report/${id}`),
    generarRevision: (id) => http.request.get(`${apiEndPoint}/generateNextReview/${id}`),
    listarPorNombreCriterio: (criterio) => http.request.get(`${apiEndPoint}/porNombre/${criterio}`),
    listarReactivosPorNombreCriterio: (criterio) => http.request.get(`${apiEndPoint}/reactivosPorNombre/${criterio}`),
    
    subirImagenPatron: (productoId, file) => http.request.post(`${apiEndPoint}/imagenPatron/${productoId}`, file),
    obtenerImagenPatron: (productoId) => http.request.get(`${apiEndPoint}/obtenerImagenPatron/${productoId}`),
};

export default ProductoService;

