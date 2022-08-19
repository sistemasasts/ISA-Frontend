import http from './http';

const apiEndPoint = '/product_providers';

const ProductoProveedorService = {
    list: (id) => http.request.get(`${apiEndPoint}/${id}`),
    create: (propiedad) => http.request.post(apiEndPoint, propiedad),
    update: (propiedad) => http.request.put(apiEndPoint, propiedad),
    delete: (idProducto, idProveedor) => http.request.delete(`${apiEndPoint}/${idProducto},/${idProveedor}`),
    listarProveedoresNoAsigandos: (idProducto) => http.request.get(`${apiEndPoint}/proveedores_no_asignados/${idProducto}`),
    listarStatusProveedor: () => http.request.get(`${apiEndPoint}/status`),
};

export default ProductoProveedorService;

