import http from '../http';

const apiEndpoint = '/inventarioProductos'

const InventarioService = {
    listar: () => http.request.get(apiEndpoint),
    registrar: (inventario) => http.request.post(apiEndpoint, inventario),
    actualizar: (inventario) => http.request.put(apiEndpoint, inventario),
    registrarMovimiento: (inventario) => http.request.post(`${apiEndpoint}/registrarMovimiento`, inventario),
}

export default InventarioService
