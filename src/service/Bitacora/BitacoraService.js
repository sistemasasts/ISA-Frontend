import http from "../http";

const apiEndpoint = "/bitacora";

const BitacoraService = {
    list: () => http.request.get(apiEndpoint),
    crear: (bitacora) => http.request.post(apiEndpoint, bitacora),
    actualizar: (bitacora) => http.request.put(apiEndpoint, bitacora),
}

export default BitacoraService