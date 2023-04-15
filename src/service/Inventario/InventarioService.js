import http from '../http';

const apiEndpoint = '/inventarioProductos'

const InventarioService = {
    listar: () => http.request.get(apiEndpoint),
    listarPorId: (id) => http.request.get(`${apiEndpoint}/${id}`),
    registrar: (inventario) => http.request.post(apiEndpoint, inventario),
    actualizar: (inventario) => http.request.put(apiEndpoint, inventario),
    registrarMovimiento: (inventario) => http.request.post(`${apiEndpoint}/registrarMovimiento`, inventario),
    listarDetallePorCriterios: (page, size, criterios) => http.request.post(`${apiEndpoint}/listarPorCriteriosDetalle/?page=${page}&size=${size}`, criterios),
}

export default InventarioService
