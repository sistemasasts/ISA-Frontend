import http from './http';

const apiEndPoint = '/informationAditional';

const InformationAditionalService = {
    list: (id) => http.request.get(`${apiEndPoint}/${id}`),
    agregarImagen: (criteria) => http.request.post(apiEndPoint, criteria),
    leerImagenes: (id) => http.request.get(`${apiEndPoint}/readFiles/${id}`),
    actualizar: (criteria) => http.request.put(apiEndPoint, criteria),
    eliminar: (id) => http.request.delete(`${apiEndPoint}/${id}`),
};

export default InformationAditionalService;

