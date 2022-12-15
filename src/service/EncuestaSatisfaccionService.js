import http from "./http";

const apiEndPoint = '/encuestaSatisfaccion';

const EncuestaSatisfaccionService = {
    registrar: (encuesta) => http.request.post(`${apiEndPoint}`, encuesta),
    existeEncuesta: (tipo, solicitudId) => http.request.get(`${apiEndPoint}/existeEncuesta/${tipo}/${solicitudId}`),
    listarEscala: () => http.request.get(`${apiEndPoint}/escalaSatisfaccion`),
};

export default EncuestaSatisfaccionService;
