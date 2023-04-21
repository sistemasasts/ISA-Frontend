import {useEffect, useState, useRef} from "react";
import DesviacionRequisitoService from "../../../../service/DesviacionRequisitos/DesviacionRequisitoService";
import history from '../../../../history';

export const useHookDesviacionReq = () => {
    let growl = useRef(null);
    const [listaDesviacionReq, setListaDesviacionReq] = useState([]);
    const [rowSelected, setRowSelected] = useState();

    useEffect( () => {
        async function obtenerLista() {
            obtenerListaDesviacionReq();
        }

        obtenerLista();
    }, []);

    const obtenerListaDesviacionReq = async () => {
        const requestListaDesviacionReq = await DesviacionRequisitoService.list();

        setListaDesviacionReq(requestListaDesviacionReq)
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

    return {
        growl,
        listaDesviacionReq,
        actions: {
            clickNuevaDesviacionReq,
            onEdit,
            onSelectionChange
        }
    };
}