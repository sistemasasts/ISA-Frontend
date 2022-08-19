import http from './http';

const apiEndPoint = '/qualityQR/api';


const QualityService={
    post : quality => http.request.post(apiEndPoint,quality),
};

export default QualityService;

