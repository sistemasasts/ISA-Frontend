import http from "../http";
import httpFiles from "../httpFiles";

const apiEndpoint = '/solicitudPPInforme'

const InformeSPPService = {
    obtenerPorIdSolicitud: (id) => http.request.get(`${apiEndpoint}/${id}`),
    actualizar: (informe) => http.request.put(`${apiEndpoint}/produccion`, informe),
    actualizarMantenimiento: (informe) => http.request.put(`${apiEndpoint}/mantenimiento`, informe),
    actualizarCalidad: (informe) => http.request.put(`${apiEndpoint}/calidad`, informe),
    actualizarAdministrador: (informe) => http.request.put(`${apiEndpoint}/administrador`, informe),
    agregarMaterialUtilizado: (material, informeId) => http.request.post(`${apiEndpoint}/agregarMaterialUtilizado/${informeId}`, material),
    editarMaterialUtilizado: (material, informeId) => http.request.post(`${apiEndpoint}/editarMaterialUtilizado/${informeId}`, material),
    eliminarMaterialUtilizado: (materialId, informeId) => http.request.delete(`${apiEndpoint}/eliminarMaterialUtilizado/${informeId}/${materialId}`),
    agregarCondicionOperacion: (condicionOperacion, informeId) => http.request.post(`${apiEndpoint}/agregarCondicionOperacion/${informeId}`, condicionOperacion),
    editarCondicionOperacion: (condicionOperacion, informeId) => http.request.post(`${apiEndpoint}/editarCondicionOperacion/${informeId}`, condicionOperacion),
    eliminarCondicionOperacion: (condicionOperacionId, informeId, tipo) => http.request.delete(`${apiEndpoint}/eliminarCondicionOperacion/${informeId}/${condicionOperacionId}/${tipo}`),
    agregarCondicion: (condicion, informeId) => http.request.post(`${apiEndpoint}/agregarCondicion/${informeId}`, condicion),
    editarCondicion: (condicion, informeId) => http.request.post(`${apiEndpoint}/editarCondicion/${informeId}`, condicion),
    eliminarCondicion: (condicionOperacionId, condicionId, informeId, tipo) => http.request.delete(`${apiEndpoint}/eliminarCondicion/${informeId}/${condicionOperacionId}/${condicionId}/${tipo}`),
    generarReporte: (id) => httpFiles.request.get(`${apiEndpoint}/reporte/${id}`),
}

export default InformeSPPService;
