import http from './http';

const apiEndPoint = '/informationAditionalFile';

const InformationAditionalFileService = {
    eliminar: (id) => http.request.delete(`${apiEndPoint}/${id}`),
};

export default InformationAditionalFileService;

