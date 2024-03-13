import { useEffect, useState, useRef } from "react";
import DesviacionRequisitoService from "../../../../service/DesviacionRequisitos/DesviacionRequisitoService";
import ProductoService from "../../../../service/productoService";
import { getDecodedToken } from "../../../../config/auth/credentialConfiguration";
import UnidadMedidaService from "../../../../service/UnidadMedidaService";
import PncService from "../../../../service/Pnc/PncService";
import DefectoService from "../../../../service/Pnc/DefectoService";
import history from '../../../../history';
import { useParams } from "react-router-dom";
import * as _ from "lodash";
import { formattedStringtoDate } from "../../../../utils/FormatDate";
import LoteService from "../../../../service/DesviacionRequisitos/LoteService";
import RecursoRecuperarMaterialService from "../../../../service/DesviacionRequisitos/RecursoRecuperarMaterialService";
import moment from "moment";
import { CatalogoService } from '../../../../service/CatalogoService';

const defaultObjDesviacionReq = {
    id: 0,
    origen: "",
    seguimiento: "",
    afectacion: "",
    motivo: "",
    descripcion: "",
    control: "",
    alcance: "",
    lotes: [],
    defectos: [],
    product: {},
    productoAfectado: {},
    productoReplanificado: {},
    cantidadAfectada: null,
    unidadAfectada: null,
    cantidadRecuperada: null,
    unidadRecuperada: null,
    desperdicioGenerado: null,
    unidadDesperdicio: null,
    replanificacion: false,
    causa: ""
}

const defaultLote = {
    fecha: "",
    cantidad: 0,
    unidad: "",
    lote: "",
    costo: 0
}

const defaultDefecto = {
    defecto: {},
}

const defaultRecurso = {
    cantidad: 0,
    descripcion: "",
    materialId: 0,
    costo: 0,
    unidad: null,
    costoTotal: 0
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
    const { idDesvReq, orden } = useParams();
    const [displayForm, setDisplayForm] = useState(false);
    const [displayFormRecurso, setDisplayFormRecurso] = useState(false);
    const [displayFormDefecto, setDisplayFormDefecto] = useState(false);
    const [nuevaDesviacionReq, setNuevaDesviacionReq] = useState({ ...defaultObjDesviacionReq })
    const [listaProductos, setListaProductos] = useState([]);
    const [productoSel, setProductoSel] = useState();
    const [productoAfectadoSel, setProductoAfectadoSel] = useState();
    const [productoReplanificadoSel, setProductoReplanificadoSel] = useState();
    const [es, setEs] = useState(defaultEs)
    const [unidadesMedida, setUnidadesMedida] = useState([]);
    const [defectosCatalogo, setDefectosCatalogo] = useState([]);
    const [catalogoLineaAfectacion, setCatalogoLineaAfectacion] = useState([]);
    const [catalogoCausas, setCatalogoCausas] = useState([]);
    const [lote, setLote] = useState(defaultLote);
    const [listaLote, setListaLote] = useState([]);
    const [defecto, setDefecto] = useState(defaultDefecto);
    const [listaDefecto, setListaDefecto] = useState([]);
    const [recurso, setRecurso] = useState(defaultRecurso);
    const [totalRecurso, setTotalRecurso] = useState(0);
    const [listaRecurso, setListaRecurso] = useState([]);
    const [materialSel, setMaterialSel] = useState();
    const [defectoSel, setDefectoSel] = useState();
    const [observacion, setObservacion] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [isEditLocal, setIsEditLocal] = useState(false);
    const [verControles, setVerControles] = useState(false);
    const [verControlesDocumentos, setVerControlesDocumentos] = useState(false);
    const [verControlesAprobacion, setVerControlesAprobacion] = useState(false);
    const [ordenFlujo, setOrdenFlujo] = useState();

    useEffect(() => {
        async function obtenerUnidadesMedida() {
            const responseUnidadesMedidas = await UnidadMedidaService.listarActivos();
            setUnidadesMedida(responseUnidadesMedidas);
        }
        async function obtenerDefectosCatalogo() {
            const responseDefectos = await DefectoService.listarActivos();
            setDefectosCatalogo(responseDefectos);
        }
        async function obtenerCatalogoLineaAfectacion() {
            const responseCatalogoLineaAfecta = await PncService.obtenerLineaAfecta();

            setCatalogoLineaAfectacion(responseCatalogoLineaAfecta);
        }
        async function obtenerDesviacionRePorId() {
            checkIsEditOrNew();
            checkLotes();
            checkRecursos();
        }
        function obtenerCatalogoCausas() {
            const catalogoService = new CatalogoService();
            catalogoService.getCausasDesviacion().then(data => setCatalogoCausas(data));
        }

        obtenerUnidadesMedida();
        obtenerDefectosCatalogo();
        obtenerCatalogoLineaAfectacion();
        obtenerDesviacionRePorId();
        obtenerCatalogoCausas();
    }, []);

    const checkIsEditOrNew = async () => {
        if (idDesvReq) {
            const desvResp = await DesviacionRequisitoService.obtenerPorId(idDesvReq);
            console.log(desvResp)
            setNuevaDesviacionReq(desvResp);

            setProductoSel(desvResp.product);
            setProductoAfectadoSel(desvResp.productoAfectado);
            setProductoReplanificadoSel(desvResp.productoReplanificado);
            setListaDefecto(desvResp.defectos);
            setIsEdit(true);

            if (orden && orden === 'aprobacion') {
                if (desvResp.estado === 'PENDIENTE_APROBACION'){
                    setVerControlesAprobacion(true);
                    setVerControlesDocumentos(true);
                }
                setVerControles(false);
                setIsEdit(false);
                setOrdenFlujo('APROBACION_GERENCIA_CALIDAD');
            } else {
                setOrdenFlujo('INGRESO');
                if (desvResp.estado === 'NUEVO') {
                    setVerControles(true);
                    setVerControlesDocumentos(true);
                    setIsEdit(true);
                }
                else {
                    setVerControles(false);
                    setIsEdit(false);
                }
            }

        }
    }

    const checkLotes = async () => {
        if (idDesvReq) {
            const lotesResp = await LoteService.listarPorDesviacionId(idDesvReq);
            const n = lotesResp.map((desv) => ({ ...desv, fechaLote: moment(desv.fecha).format("yyyy-MM-DD") }));

            setListaLote(n);
        }
    }

    const checkRecursos = async () => {
        if (idDesvReq) {
            const recursosResp = await RecursoRecuperarMaterialService.listarPorDesviacionId(idDesvReq);

            setListaRecurso(recursosResp);
            setTotalRecurso(_.sumBy(recursosResp, (o) => { return o.costoTotal }));
        }
    }

    const obtenerListaProductos = async (value) => {
        const responseListaProductos = await ProductoService.listarPorNombreCriterio(value);

        setListaProductos(responseListaProductos)
    }

    const saveItem = async () => {
        if (_.isEmpty(nuevaDesviacionReq)) {
            growl.current.show({ severity: 'error', summary: "Error", detail: 'Todos los campos deben estar llenos' });

            return;
        }

        if (!isEdit && !nuevaDesviacionReq.id) {
            const response = await DesviacionRequisitoService.crear({ ...nuevaDesviacionReq, responsable: _.get(user, "user_name") });
            setNuevaDesviacionReq(response);
            growl.current.show({ severity: 'success', detail: 'Desviacion de Requisitos registrada exitosamente' });
            setListaDefecto([]);
        } else {
            await DesviacionRequisitoService.actualizar({ ...nuevaDesviacionReq, responsable: _.get(user, "user_name") });

            checkLotes();
            checkRecursos();
            //setListaDefecto();

            growl.current.show({ severity: 'success', detail: 'Desviacion de Requisitos modificada exitosamente' });
        }

        setDisplayForm(false);
        setLote(defaultLote)
        setListaLote([]);
        setDefecto(defaultDefecto)
        setRecurso(defaultRecurso);
        setListaRecurso([]);
    }

    const ejecutarAccion = async (accion) => {
        if (accion === 'RECHAZADO' && _.isEmpty(observacion)){
            growl.current.show({ severity: 'error', detail: 'La observación es obligatorio' });
            return;
        }
        var desviacion = nuevaDesviacionReq;
        desviacion.observacion = observacion;
        desviacion.accion = accion;
        
        await DesviacionRequisitoService.procesar(desviacion);
        growl.current.show({ severity: 'success', detail: 'Desviación procesada' });
        cancelar();

    }

    const handleChangeAprobacion = (field, value) => {
        debugger
        if (field === "observacion")
            setObservacion(value);
    }

    const enviarItem = async () => {
        var desviacion = nuevaDesviacionReq;
        desviacion.observacion = observacion;

        const response = await DesviacionRequisitoService.enviar(desviacion);

        growl.current.show({ severity: 'success', detail: 'Desviacion de Requisitos enviado' });

        cancelar();
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
            case "productoAfectado":
                setProductoAfectadoSel(value);
                if (typeof value === 'object') {
                    desviacionReq[field] = value;
                }
                break;
            case "productoReplanificado":
                setProductoReplanificadoSel(value);
                if (typeof value === 'object') {
                    desviacionReq[field] = value;
                }
                break;
            case "unidadAfectada":
            case "unidadDesperdicio":
            case "unidadRecuperada":
                desviacionReq[field] = { id: value };
                break;
            default:
                desviacionReq[field] = value;
        }
        setNuevaDesviacionReq(desviacionReq);
    }

    const handleChangeLote = (field, value) => {
        const loteTmp = { ...lote };

        if (field === "unidad")
            loteTmp[field] = { id: value };
        else loteTmp[field] = value;

        setLote(loteTmp);
    }

    const handleChangeRecurso = (field, value) => {
        const recursoTmp = { ...recurso };
        switch (field) {
            case "material":
                setMaterialSel(value);
                if (typeof value === 'object') {
                    recursoTmp.materialId = value.idProduct;
                    recursoTmp.descripcion = value.nameProduct;
                } else {
                    recursoTmp.descripcion = value;
                }
                break;
            case "unidad":
                recursoTmp.unidad = { id: value };
                break;
            default:
                recursoTmp[field] = value;
        }

        setRecurso(recursoTmp);
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
            _.set(rowData, "fecha", formattedStringtoDate(rowData.fecha));
            setLote(rowData);
        }
    }

    const saveLocalLote = async () => {
        if (!isEditLocal)
            await LoteService.crear({ ...lote, desviacionRequisito: nuevaDesviacionReq });
        else await LoteService.actualizar(lote);

        const lotesResp = await LoteService.listarPorDesviacionId(_.defaultTo(idDesvReq, nuevaDesviacionReq.id));
        const n = lotesResp.map((desv) => ({ ...desv, fechaLote: moment(desv.fecha).format("yyyy-MM-DD") }));
        setListaLote(n);

        setDisplayForm(false);
    }

    const cancelar = () => {
        if (orden) {
            history.push("/quality-development_desviacion_aprobacion");
        } else {
            history.push("/quality-development_pnc_desviacion_req");
        }

    }

    const eliminarPorId = async (rowData) => {
        if (rowData) {
            await LoteService.eliminarPorId(rowData.id);
            growl.current.show({ severity: 'success', detail: 'Lote eliminado exitosamente' });

            const lotesResp = await LoteService.listarPorDesviacionId(idDesvReq);

            setListaLote(lotesResp);
        }
    }

    /* RECURSOS RECUPERAR MATERIA */
    const closeFormRecurso = () => {
        setMaterialSel(null);
        setDisplayFormRecurso(false);
        setRecurso(defaultRecurso);
        setIsEditLocal(false);
    }

    const clickFormRecurso = async (editRecurso, rowData) => {
        setDisplayFormRecurso(true);
        setIsEditLocal(editRecurso);
        if (editRecurso && rowData) {
            if (rowData.materialId > 0) {
                setMaterialSel({ idProduct: rowData.materialId, nameProduct: rowData.descripcion })
            } else {
                setMaterialSel(rowData.descripcion);
            }
            setRecurso(rowData);
        }
    }

    const saveRecurso = async () => {
        if (!isEditLocal)
            await RecursoRecuperarMaterialService.crear({ ...recurso, desviacionRequisito: nuevaDesviacionReq });
        else await RecursoRecuperarMaterialService.actualizar(recurso);

        const recursosResp = await RecursoRecuperarMaterialService.listarPorDesviacionId(_.defaultTo(idDesvReq, nuevaDesviacionReq.id));

        setListaRecurso(recursosResp);
        setTotalRecurso(_.sumBy(recursosResp, (o) => { return o.costoTotal }));
        setDisplayFormRecurso(false);
    }

    const eliminarRecursoPorId = async (rowData) => {
        if (rowData) {
            await RecursoRecuperarMaterialService.eliminarPorId(rowData.id);
            growl.current.show({ severity: 'success', detail: 'Recurso eliminado exitosamente' });

            const recursosResp = await RecursoRecuperarMaterialService.listarPorDesviacionId(idDesvReq);

            setListaRecurso(recursosResp);
        }
    }

    /* DEFECTOS */
    const closeFormDefecto = () => {
        setDefectoSel(null);
        setDisplayFormDefecto(false);
        setDefecto(defaultDefecto);
        setIsEditLocal(false);
    }

    const clickFormDefecto = async (editDefecto, rowData) => {
        setDisplayFormDefecto(true);
        setIsEditLocal(editDefecto);
        /* if (editDefecto && rowData) {
            const busc = await LoteService.listarPorLoteId(rowData.id);
            _.set(rowData, "fecha", formattedStringtoDate(rowData.fecha));
            setLote(rowData);
        } */
    }

    const eliminarDefectoPorId = async (rowData) => {
        if (rowData) {
            const defectos = await DesviacionRequisitoService.eliminarDefecto(nuevaDesviacionReq.id, rowData.id);
            growl.current.show({ severity: 'success', detail: 'Defecto eliminado exitosamente' });
            setListaDefecto(defectos);
        }
    }

    const handleChangeDefecto = (field, value) => {
        const loteTmp = { ...defecto };
        loteTmp[field] = value;
        setDefecto(loteTmp);
    }

    const saveDefecto = async () => {
        const recursosResp = await DesviacionRequisitoService.agregarDefecto(nuevaDesviacionReq.id, defecto.defecto.id);
        setListaDefecto(recursosResp);
        setDisplayFormDefecto(false);
    }


    return {
        growl,
        displayForm,
        displayFormRecurso,
        displayFormDefecto,
        nuevaDesviacionReq,
        listaProductos,
        productoSel,
        productoAfectadoSel,
        productoReplanificadoSel,
        es,
        unidadesMedida,
        defectosCatalogo,
        catalogoLineaAfectacion,
        catalogoCausas,
        listaLote,
        listaDefecto,
        lote,
        defecto,
        listaRecurso,
        totalRecurso,
        recurso,
        materialSel,
        defectoSel,
        observacion,
        verControles,
        verControlesDocumentos,
        verControlesAprobacion,
        isEdit,
        ordenFlujo,
        actions: {
            closeForm,
            createItem: saveItem,
            enviar: enviarItem,
            ejecutarAccion,
            handleChangeNewDesviacionReq,
            handleChangeAprobacion,
            buscarProductos,
            clickFormLote,
            clickFormDefecto,
            handleChangeLote,
            saveLocalLote,
            cancelar,
            eliminarPorId,
            eliminarDefectoPorId,
            closeFormRecurso,
            handleChangeRecurso,
            clickFormRecurso,
            saveRecurso,
            eliminarRecursoPorId,
            closeFormDefecto,
            handleChangeDefecto,
            saveDefecto
        }
    };
}