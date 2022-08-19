import http from './http';

const apiEndPoint = '/product_properties';

const EspecificacionService={
    list: (id) => http.request.get(`${apiEndPoint}/especificaciones/${id}`),
    create: (propiedad) => http.request.post(apiEndPoint, propiedad),
    update: (propiedad) => http.request.put(apiEndPoint, propiedad),
    delete: (idProducto, idPropiedad) => http.request.delete(`${apiEndPoint}/${idProducto},/${idPropiedad}`),
    listarPropiedadesNoAsigandas: (idProducto) => http.request.get(`${apiEndPoint}/propiedades_no_asignadas/${idProducto}`),
};

export default EspecificacionService;

