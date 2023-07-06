import http from "./http";

const apiEndPoint = '/hccs';

const HccService = {
    registrar: (info) => http.request.post(`${apiEndPoint}/guardarHcc`, info)
};

export default HccService;
