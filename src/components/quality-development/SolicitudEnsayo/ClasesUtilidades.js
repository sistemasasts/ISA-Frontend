export function determinarColor(estado) {
    switch (estado) {
        case 'NUEVO': return 'customer-badge-default';
        case 'EN_PROCESO':
        case 'ENVIADO_REVISION':
        case 'REVISION_INFORME':
            return 'customer-badge-warning';
        case 'REGRESADO_NOVEDAD_INFORME':
        case 'RECHAZADO':
        case 'ANULADO':
        case 'PRUEBA_NO_EJECUTADA':
        case 'PRUEBA_NO_REALIZADA':
            return 'customer-badge-danger';
        case 'FINALIZADO': return 'customer-badge-success';
        default: return 'customer-badge-default'
    }
}

export function determinarColorTipoAprobacion(tipoAprobacion) {
    switch (tipoAprobacion) {
        case 'LIBRE_USO':
        case 'LABORATORIO':
        case 'PLANTA':
        case 'SOLICITUD SOLUCIONES TÉCNICAS':
        case 'CREACIÓN DE MATERIAS PRIMAS':
        case 'GESTIONAR E IMPLEMENTAR CAMBIOS':
            return 'customer-badge-default';
        case 'REPETIR PRUEBA':
        case 'MATERIAL NO VALIDADO':
        case 'AJUSTE MAQUINARIA':
        case 'NO_APROBADO':
            return 'customer-badge-danger';

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