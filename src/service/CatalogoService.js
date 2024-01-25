import axios from 'axios';

export class CatalogoService {

    getPeriodicidad() {
        return axios.get('assets/catalogos/periodicidad.json')
            .then(res => res.data.data)
    }

    getProcedencia() {
        return axios.get('assets/catalogos/procedencia.json')
            .then(res => res.data.data)
    }

    getProcedenciaLinea() {
        return axios.get('assets/catalogos/procedenciaLinea.json')
            .then(res => res.data.data)
    }

    getUnidadesMedida() {
        return axios.get('assets/catalogos/unidadesMedida.json')
            .then(res => res.data.data)
    }

    getLineaAfectada() {
        return axios.get('assets/catalogos/lineaAfectada.json')
            .then(res => res.data.data)
    }

    getDestinoFinal() {
        return axios.get('assets/catalogos/destinoFinal.json')
            .then(res => res.data.data)
    }

    getTipoEstadoProveedor() {
        return axios.get('assets/catalogos/tipoEstadoProveedor.json')
            .then(res => res.data.data)
    }

    getTipoGrupoProducto() {
        return axios.get('assets/catalogos/tipoProductoTexto.json')
            .then(res => res.data.data)
    }

    getLineaFabricacion() {
        return axios.get('assets/catalogos/lineaFabricacion.json')
            .then(res => res.data.data)
    }

    getProcesoCondicionOperacion() {
        return axios.get('assets/catalogos/procesoCondicionOperacion.json')
            .then(res => res.data.data)
    }

    getProcesoCondicion() {
        return axios.get('assets/catalogos/procesoCondicion.json')
            .then(res => res.data.data)
    }

    getProcesoCondicionMaquinaria() {
        return axios.get('assets/catalogos/procesoCondicionMaquinaria.json')
            .then(res => res.data.data)
    }

    getBodegasERP() {
        return axios.get('assets/catalogos/bodegaERP.json')
            .then(res => res.data.data)
    }

    getCausasDesviacion() {
        return axios.get('assets/catalogos/causaDesviacion.json')
            .then(res => res.data.data)
    }

}
