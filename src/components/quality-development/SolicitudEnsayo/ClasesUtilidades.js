export function determinarColor(estado) {
    switch (estado) {
        case 'NUEVO': return 'customer-badge-default';
        case 'EN_PROCESO':
        case 'ENVIADO_REVISION':
        case 'REVISION_INFORME':
        case 'PENDIENTE_APROBACION':
        case 'PENDIENTE_PRUEBAS_PROCESO':
        case 'GESTION_PRUEBAS_PROCESO':
            return 'customer-badge-warning';
        case 'REGRESADO_NOVEDAD_FORMA':
        case 'RECHAZADO':
        case 'ANULADO':
        case 'PRUEBA_NO_EJECUTADA':
        case 'PRUEBA_NO_REALIZADA':
            return 'customer-badge-danger';
        case 'FINALIZADO':
        case 'PROCESO_FINALIZADO':
        case 'LIBRE_USO':
        case 'GESTIONAR_IMPLEMENTAR_CAMBIOS':
        case 'ENVIAR_SOLUCIONES_TECNICAS':
        case 'CREACION_MATERIA_PRIMA':
            return 'customer-badge-success';
        default: return 'customer-badge-default'
    }
}

export function determinarColorTipoAprobacion(tipoAprobacion) {
    switch (tipoAprobacion) {
        case 'LIBRE USO':
        case 'NIVEL LABORATORIO':
        case 'NIVEL PLANTA':
        case 'SOLICITUD SOLUCIONES TÉCNICAS':
        case 'CREACIÓN DE MATERIAS PRIMAS':
        case 'GESTIONAR E IMPLEMENTAR CAMBIOS':
        case 'SOLICITUD PRUEBA PROCESO':
            return 'customer-badge-default';
        case 'REPETIR PRUEBA':
        case 'MATERIAL NO VALIDADO':
        case 'AJUSTE MAQUINARIA':
        case 'NO_APROBADO':
            return 'customer-badge-danger';

        default: return ''
    }
}

export function determinarColorTipoSolicitud(tipo) {
    switch (tipo) {
        case 'SOLICITUD_ENSAYOS':
            return 'customer-badge-success';
        case 'SOLICITUD_PRUEBAS_EN_PROCESO':
            return 'customer-badge-default';

        default: return ''
    }
}

export function determinarColorVigencia(vigencia) {
    if (vigencia <= 0)
        return 'customer-badge-danger';

    if (vigencia > 1)
        return 'customer-badge-success';

    if (vigencia === 1)
        return 'customer-badge-warning';

}

export function determinarColorActivo(estado) {
    if (estado)
        return 'customer-badge-default'
    else
        return 'customer-badge-danger';

}

export function determinarColorPNC(estado) {
    switch (estado) {
        case 'CREADO': return 'customer-badge-default';
        case 'EN_PROCESO':
            case 'PENDIENTE_APROBACION':
            return 'customer-badge-warning';
        case 'ANULADO':
        case 'RECHAZADO':
            return 'customer-badge-danger';
        case 'CERRADO':
            return 'customer-badge-success';
        default: return 'customer-badge-default'
    }
}
