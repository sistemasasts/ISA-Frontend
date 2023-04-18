import {useEffect, useState, useRef} from "react";
import BitacoraService from "../../../../service/Bitacora/BitacoraService";
import * as _ from "lodash";
import ProductoService from "../../../../service/productoService";
import {getDecodedToken} from "../../../../config/auth/credentialConfiguration";
import UnidadMedidaService from "../../../../service/UnidadMedidaService";
import PncService from "../../../../service/Pnc/PncService";

const defaultNewBitacora = {
    origen: "",
    fechaLote: "",
    material: "",
    lote: "",
    cantidad: 0,
    unidad: "",
    seguimiento: "",
    afectacion: "",
    motivo: "",
    descripcion: "",
    control: "",
    alcance: ""
}

const defaultEs = {
    firstDayOfWeek: 1,
    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
};
export const useHookBitacora = () => {
    let growl = useRef(null);
    const user = getDecodedToken();
    const [listaBitacora, setListaBitacora] = useState([]);
    const [displayForm, setDisplayForm] = useState(false);
    const [nuevaBitacora, setNuevaBitacora] = useState({...defaultNewBitacora})
    const [bitacoraSel, setBitacoraSel] = useState({});
    const [listaProductos, setListaProductos] = useState([]);
    const [productoSel, setProductoSel] = useState();
    const [es, setEs] = useState(defaultEs)
    const [unidadesMedida, setUnidadesMedida] = useState([]);
    const [catalogoLineaAfectacion, setCatalogoLineaAfectacion] = useState([]);

    useEffect( () => {
        async function obtenerLista() {
            obtenerListaBitacora();
        }
        async function obtenerUnidadesMedida() {
            const responseUnidadesMedidas = await UnidadMedidaService.listarActivos();
            const remappingUnits = responseUnidadesMedidas.map((unit) => ({ label: unit.label, value: unit.label }));
            setUnidadesMedida(remappingUnits);
        }
        async function obtenerCatalogoLineaAfectacion() {
            const responseCatalogoLineaAfecta = await PncService.obtenerLineaAfecta();

            setCatalogoLineaAfectacion(responseCatalogoLineaAfecta);
        }

        obtenerLista();
        obtenerUnidadesMedida();
        obtenerCatalogoLineaAfectacion();
    }, []);

    const obtenerListaBitacora = async () => {
        const requestListaBitacora = await BitacoraService.list();

        setListaBitacora(requestListaBitacora)
    }

    const obtenerListaProductos = async (value) => {
        const responseListaProductos = await ProductoService.listarPorNombreCriterio(value);

        setListaProductos(responseListaProductos)
    }

    const actualizarBitacora = async (bitacora) => {
        await BitacoraService.actualizar({...bitacora, responsable: _.get(user, "user_name")});
        obtenerListaBitacora();
    }

    const clickNuevaBitacora = () => {
        setDisplayForm(true);
    }

    const closeForm = () => {
        setDisplayForm(false);
        setNuevaBitacora(defaultNewBitacora);
    }

    const onRowEditorValidator = (rowData) => {
        let material = rowData['material'];

        return material.length > 0;
    }

    const onRowEditInit = async (event) => {
        setBitacoraSel(event.data);
        const productoBuscado = await ProductoService.listarPorNombreCriterio(event.data.material);
        const producto = productoBuscado.find((prod) => prod.idProduct === event.data.productId)

        setProductoSel(producto);

    }

    const onRowEditSave = (event) => {
        if (onRowEditorValidator(event.data)) {
            actualizarBitacora(event.data);
            growl.current.show({ severity: 'success', summary: "Success", detail: 'Bitacora actualizada exitosamente'});
        }
        else {
            growl.current.show({ severity: 'error', summary: "Error", detail: 'Todos los campos son obligatorios'});
        }
    }

    const onRowEditCancel = (event) => {
        const listaBitacoraTmp = [...listaBitacora];

        listaBitacoraTmp[event.index] = bitacoraSel;
        setListaBitacora(listaBitacoraTmp);

        // obtenerListaBitacora()
    }

    const onEditorValueChangeForRowEditing = (props, value) => {
        console.log(value);
        let bitacoraActualizada = [...props.value];

        if (props.field === "material") {
            setProductoSel(value);
            bitacoraActualizada[props.rowIndex][props.field] = value.nameProduct;
        } else
            bitacoraActualizada[props.rowIndex][props.field] = value;

        setListaBitacora(bitacoraActualizada);
    }

    const createItem = async () => {
        if (_.isEmpty(nuevaBitacora))
            return;

        await BitacoraService.crear({...nuevaBitacora, responsable: _.get(user, "user_name") });

        growl.current.show({ severity: 'success', detail: 'Bitacora registrada exitosamente'});
        obtenerListaBitacora();
        setDisplayForm(false);
        setProductoSel(undefined);
    }

    const handleChangeNewBitacora = (field, value) => {
        const bitacora = { ...nuevaBitacora }

        switch (field) {
            case "material":
                setProductoSel(value);
                bitacora[field] = value.nameProduct;
                bitacora["productId"] = value.idProduct;
                break;
            case "unidad":
                const unit = unidadesMedida.find((unit) => unit.value === value);

                bitacora[field] = _.get(unit, "label");
                break;
            default:
                bitacora[field] = value;
        }
        setNuevaBitacora(bitacora);
    }

    const buscarProductos = (value) => {
        obtenerListaProductos(value)
    }

    return {
        growl,
        listaBitacora,
        displayForm,
        nuevaBitacora,
        listaProductos,
        productoSel,
        es,
        unidadesMedida,
        catalogoLineaAfectacion,
        actions: {
            clickNuevaBitacora,
            onRowEditorValidator,
            onEditorValueChangeForRowEditing,
            closeForm,
            createItem,
            handleChangeNewBitacora,
            onRowEditInit,
            onRowEditSave,
            onRowEditCancel,
            buscarProductos
        }
    };
}