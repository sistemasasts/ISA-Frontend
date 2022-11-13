import http from "./http";

const apiEndPoint = '/tests';

const TestService = {
    consultar: (page, size, consulta) => http.request.post(`${apiEndPoint}/consulta/?page=${page}&size=${size}`, consulta),
};

export default TestService;
