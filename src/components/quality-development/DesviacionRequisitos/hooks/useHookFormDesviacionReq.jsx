import {useEffect, useState, useRef} from "react";
import DesviacionRequisitoService from "../../../../service/DesviacionRequisitos/DesviacionRequisitoService";
import ProductoService from "../../../../service/productoService";
import {getDecodedToken} from "../../../../config/auth/credentialConfiguration";
import UnidadMedidaService from "../../../../service/UnidadMedidaService";
import PncService from "../../../../service/Pnc/PncService";
import history from '../../../../history';
import { useParams } from "react-router-dom";
import * as _ from "lodash";
import {formattedStringtoDate} from "../../../../utils/FormatDate";
import LoteService from "../../../../service/DesviacionRequisitos/LoteService";
import moment from "moment";

const defaultObjDesviacionReq = {
    origen: "",
    seguimiento: "",
    afectacion: "",
    motivo: "",
    descripcion: "",
    control: "",
    alcance: "",
    lotes: [],
    product: {},
}

const defaultLote = {
    fecha: "",
    cantidad: 0,
    unidad: "",
    lote: ""
}

export const defaultEs = {
    firstDayOfWeek: 1,
    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
};
export const useHookFormDesviacionReq = () => {
    let growl = useRef(null);
    const user = getDecodedToken();
    const { idDesvReq } = useParams();
    const [displayForm, setDisplayForm] = useState(false);
    const [nuevaDesviacionReq, setNuevaDesviacionReq] = useState({...defaultObjDesviacionReq})
    const [listaProductos, setListaProductos] = useState([]);
    const [productoSel, setProductoSel] = useState();
    const [es, setEs] = useState(defaultEs)
    const [unidadesMedida, setUnidadesMedida] = useState([]);
    const [catalogoLineaAfectacion, setCatalogoLineaAfectacion] = useState([]);
    const [lote, setLote] = useState(defaultLote);
    const [listaLote, setListaLote] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isEditLocal, setIsEditLocal] = useState(false);

    useEffect( () => {
        async function obtenerUnidadesMedida() {
            const responseUnidadesMedidas = await UnidadMedidaService.listarActivos();
            const remappingUnits = responseUnidadesMedidas.map((unit) => ({ label: unit.label, value: unit.label }));
            setUnidadesMedida(remappingUnits);
        }
        async function obtenerCatalogoLineaAfectacion() {
            const responseCatalogoLineaAfecta = await PncService.obtenerLineaAfecta();

            setCatalogoLineaAfectacion(responseCatalogoLineaAfecta);
        }
        async function obtenerDesviacionRePorId() {
            checkIsEditOrNew();
            checkLotes();
        }
        obtenerUnidadesMedida();
        obtenerCatalogoLineaAfectacion();
        obtenerDesviacionRePorId();
    }, []);

    const checkIsEditOrNew = async () => {
        if (idDesvReq) {
            const desvResp = await DesviacionRequisitoService.obtenerPorId(idDesvReq);

            setNuevaDesviacionReq(desvResp);

            setProductoSel(desvResp.product);
            setIsEdit(true);
        }
    }

    const checkLotes = async () => {
        if (idDesvReq) {
            const lotesResp = await LoteService.listarPorDesviacionId(idDesvReq);
            const n = lotesResp.map((desv) => ({ ...desv, fechaLote: moment(desv.fecha).format("yyyy-MM-DD")}));

            setListaLote(n);
        }
    }
    const obtenerListaProductos = async (value) => {
        const responseListaProductos = await ProductoService.listarPorNombreCriterio(value);

        setListaProductos(responseListaProductos)
    }

    const saveItem = async () => {
        if (_.isEmpty(nuevaDesviacionReq)) {
            growl.current.show({severity: 'error', summary: "Error", detail: 'Todos los campos deben estar llenos'});

            return;
        }

        if (!isEdit && !nuevaDesviacionReq.id) {
            const response = await DesviacionRequisitoService.crear({...nuevaDesviacionReq, responsable: _.get(user, "user_name") });

            setNuevaDesviacionReq(response);

            growl.current.show({ severity: 'success', detail: 'Desviacion de Requisitos registrada exitosamente'});
        } else {
            await DesviacionRequisitoService.actualizar({...nuevaDesviacionReq, responsable: _.get(user, "user_name") });

            growl.current.show({ severity: 'success', detail: 'Desviacion de Requisitos modificada exitosamente'});
        }

        setDisplayForm(false);
        setLote(defaultLote)
        setListaLote([]);
        // if (listaLote.length > 0)
        //     history.push("/quality-development_pnc_desviacion_req");
    }

    const handleChangeNewDesviacionReq = (field, value) => {
        const desviacionReq = { ...nuevaDesviacionReq }

        switch (field) {
            case "product":
                setProductoSel(value);
                if (typeof value === 'object') {
                    desviacionReq[field] = value;
                }
                break;
            default:
                desviacionReq[field] = value;
        }
        setNuevaDesviacionReq(desviacionReq);
    }

    const handleChangeLote = (field, value) => {
        const loteTmp = { ...lote };

        loteTmp[field] = value;
        setLote(loteTmp);
    }

    const buscarProductos = (value) => {
        obtenerListaProductos(value)
    }

    const closeForm = () => {
        setDisplayForm(false);
        setLote(defaultLote);
        setIsEditLocal(false);
    }

    const clickFormLote = async (editLote, rowData) => {
        setDisplayForm(true);
        setIsEditLocal(editLote);
        if (editLote && rowData) {
            const busc = await LoteService.listarPorLoteId(rowData.id);
            console.log(busc);
            _.set(rowData, "fecha", formattedStringtoDate(rowData.fecha));
            setLote(rowData);
        }
    }

    const saveLocalLote = async () => {
        if (!isEditLocal)
            await LoteService.crear({...lote, desviacionRequisito: nuevaDesviacionReq});
        else await LoteService.actualizar(lote);

        const lotesResp = await LoteService.listarPorDesviacionId(_.defaultTo(idDesvReq, nuevaDesviacionReq.id));
        const n = lotesResp.map((desv) => ({ ...desv, fechaLote: moment(desv.fecha).format("yyyy-MM-DD")}));
        setListaLote(n);

        setDisplayForm(false);
    }

    const cancelar = () => {
        history.push("/quality-development_pnc_desviacion_req");
    }

    const eliminarPorId = async (rowData) => {
        if (rowData) {
            await LoteService.eliminarPorId(rowData.id);
            growl.current.show({ severity: 'success', detail: 'Lote eliminado exitosamente'});

            const lotesResp = await LoteService.listarPorDesviacionId(idDesvReq);

            setListaLote(lotesResp);
        }
    }

    return {
        growl,
        displayForm,
        nuevaDesviacionReq,
        listaProductos,
        productoSel,
        es,
        unidadesMedida,
        catalogoLineaAfectacion,
        listaLote,
        lote,
        actions: {
            closeForm,
            createItem: saveItem,
            handleChangeNewDesviacionReq,
            buscarProductos,
            clickFormLote,
            handleChangeLote,
            saveLocalLote,
            cancelar,
            eliminarPorId
        }
    };
}