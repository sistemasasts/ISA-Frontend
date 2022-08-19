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
};

export default ProductoService;

