import {useEffect, useState, useRef} from "react";
import DesviacionRequisitoService from "../../../../service/DesviacionRequisitos/DesviacionRequisitoService";
import history from '../../../../history';
import ProductoService from "../../../../service/productoService";
import {defaultEs} from "./useHookFormDesviacionReq";
import PncService from "../../../../service/Pnc/PncService";
import * as _ from "lodash";
import * as moment from "moment/moment";

const SIZE = 10;
const criteriosDefault = {
    size: SIZE,
    page: 0,
    consulta: {}
}
const paginadorDefault = {
    page: 0,
    totalRecords: 0,
    currenPage: "0",
    first: 0,
    rows: SIZE
}
export const useHookDesviacionReq = () => {
    let growl = useRef(null);
    const [listaDesviacionReq, setListaDesviacionReq] = useState([]);
    const [rowSelected, setRowSelected] = useState();
    const [criterios, setCriterios] = useState(criteriosDefault);
    const [listaProductos, setListaProductos] = useState([]);
    const [productoSel, setProductoSel] = useState();
    const [es, setEs] = useState(defaultEs);
    const [catalogoLineaAfectacion, setCatalogoLineaAfectacion] = useState([]);
    const [activeIndexTab, setActiveIndexTab] = useState();
    const [pagination, setPagination] = useState(paginadorDefault);

    useEffect( () => {
        async function obtenerLista() {
            obtenerListaDesviacionReq();
        }
        async function obtenerCatalogoLineaAfectada() {
            obtenerCatalogoLineaAfectacion();
        }

        obtenerLista();
        obtenerCatalogoLineaAfectada();
    }, []);

    const obtenerListaDesviacionReq = async () => {
        consultaDesviacionesPorPagina();
    }

    const consultaDesviacionesPorPagina = async (page, event) => {
        const criteriosTmp = { ...criterios };
        if(page) _.set(criteriosTmp, "page", page);

        const requestListaDesviacionReq = await DesviacionRequisitoService.listarPorCriterios(criteriosTmp);

        setListaDesviacionReq(requestListaDesviacionReq.content.map((c) => {
            return { ...c, fechaCreacionTrans: moment(c.fechaCreacion).format("yyyy-MM-DD") }
        }));
        const currentPage = `( pág. ${requestListaDesviacionReq.number + 1} de ${requestListaDesviacionReq.totalPages} )  Total ítems  ${requestListaDesviacionReq.totalElements}`;

        if (event) setPagination({ ...pagination, totalRecords: requestListaDesviacionReq.totalElements, currenPage: currentPage, first: event.first, rows: event.rows  });
        else setPagination({ ...pagination, totalRecords: requestListaDesviacionReq.totalElements, currenPage: currentPage });
    }

    const clickNuevaDesviacionReq = () => {
        history.push(`/quality-development_pnc_desviacion_req_nuevo`);
    }

    const onEdit = (rowData) => {
        history.push(`/quality-development_pnc_desviacion_req_edit/${rowData.id}`);
    }

    const onSelectionChange = (rowData) => {
        setRowSelected(rowData);
    }

    const onChangeCriterios = (field, value) => {
        let val;
        const criterioConsulta = { ...criterios };

        switch (field) {
            case "productId":
                setProductoSel(value);
                if (typeof value === 'object')
                    val = _.get(value, "idProduct");
                break;
            case "fechaInicio":
            case "fechaFin":
                val = moment(value).format("YYYY-MM-DD hh:mm:ss.SSS");
                break;
            default:
                val = value;
        }
        criterioConsulta.consulta[field] = val;

        setCriterios(criterioConsulta);
    }

    const buscarProductos = async (value) => {
        const responseListaProductos = await ProductoService.listarPorNombreCriterio(value);

        setListaProductos(responseListaProductos)
    }

    const obtenerCatalogoLineaAfectacion = async () => {
        const responseCatalogoLineaAfecta = await PncService.obtenerLineaAfecta();

        setCatalogoLineaAfectacion(responseCatalogoLineaAfecta);
    }

    const limpiarCriterios = async () => {
        const requestListaDesviacionReq = await DesviacionRequisitoService.listarPorCriterios({ ...criterios, consulta: {} });

        setListaDesviacionReq(requestListaDesviacionReq.content)
        setCriterios({ ...criterios, consulta: {} });
        setProductoSel(undefined);
        setListaProductos([]);
    }

    const onPageChange = async (event) => {
        consultaDesviacionesPorPagina(event.page, event);
    };

    const generarReporte = async (rowData) => {
        const data = await DesviacionRequisitoService.obtenerReporte(rowData.id);
        const ap = window.URL.createObjectURL(data)
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.href = ap;
        a.download = `DesviacionRequisto_${rowData.secuencial}_${rowData.product.nameProduct}.pdf`;
        a.click();
        growl.current.show({ severity: 'success', detail: 'Reporte generado!' });
    }

    return {
        growl,
        listaDesviacionReq,
        criterios,
        listaProductos,
        productoSel,
        es,
        catalogoLineaAfectacion,
        activeIndexTab,
        pagination,
        actions: {
            clickNuevaDesviacionReq,
            onEdit,
            onSelectionChange,
            generarReporte,
            onChangeCriterios,
            buscarProductos,
            obtenerListaDesviacionReq,
            limpiarCriterios,
            setActiveIndexTab,
            onPageChange
        }
    };
}