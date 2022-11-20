import http from "./http";
import httpFiles from "./httpFiles";

const apiEndPoint = '/tests';

const TestService = {
    consultar: (page, size, consulta) => http.request.post(`${apiEndPoint}/consulta/?page=${page}&size=${size}`, consulta),
    generarReporte: (consulta) => httpFiles.request.get(`${apiEndPoint}/reporte/${consulta}`)
};

export default TestService;
