import http from './http';

const apiEndpoint = '/configurationsFormEntry'

const ConfigEntryMPService = {
    listByProductTypeText: (productTypeText) => http.request.get(`${apiEndpoint}/${productTypeText}`),
    listOnlyPropertiesByProductTypeText: (productTypeText) => http.request.get(`${apiEndpoint}/onlyProperties/${productTypeText}`),
    listCatalog: () => http.request.get(`${apiEndpoint}/catalog`),
    create: (config) => http.request.post(apiEndpoint, config),
    delete: (id) => http.request.delete(`${apiEndpoint}/${id}`),

}

export default ConfigEntryMPService