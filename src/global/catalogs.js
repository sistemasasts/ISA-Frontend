
/* ================== ARCHIVO QUE CONTIENE CATALOGOS PARA LA APLICACION======================
 */
export var familiaProducto = [
    { label: 'Láminas', value: 'LAMINAS' },
    { label: 'Líquidos', value: 'LIQUIDOS' },
    { label: 'Metales', value: 'METALES' },
    { label: 'Viales', value: 'VIALES' },
];


export var tipoProducto = [
    { label: 'Producto Terminado', value: 'PRODUCTO_TERMINADO' },
    { label: 'Materia Prima', value: 'MATERIA_PRIMA' },
]

/* Variable que contiene unidades de medida */
export var unidadesMedida = [
    { label: '°C', value: '°C' },
    { label: 'cps', value: 'cps' },
    { label: '%', value: '%' },
    { label: 'l', value: 'l' },
    { label: 'm', value: 'm' },
    { label: 'g', value: 'g' },
    { label: 'mm', value: 'mm' },
    { label: 'ml', value: 'ml' },
    { label: 'cm', value: 'cm' },
    { label: 'm', value: 'm' },
    { label: 'm2', value: 'm2' },
    { label: 'dmm', value: 'dmm' },
    { label: 'in', value: 'in' },
    { label: 'gal', value: 'gal' },
    { label: 'g/ml', value: 'g/ml' },
    { label: 'g/m2', value: 'g/m2' },
    { label: 'kg', value: 'kg' },
    { label: 'Kg/m2', value: 'Kg/m2' },
    { label: 'Kg/mm2', value: 'Kg/mm2' },
    { label: 'N/50mm', value: 'N/50mm' },
    { label: 'mm2/s', value: 'mm2/s' },
    { label: 'Rollo', value: 'Rollo' },
    { label: 'unidad', value: 'u' },
    { label: 'Pa.s', value: 'Pa.s' },
]

/* Variable que contiene catalogo de Diaridad */
export var periocidad = [
    { label: 'Diaria', value: 'Diaria' },
    { label: 'Mensual', value: 'Mensual' },
    { label: 'Trimestral', value: 'Trimestral' },
    { label: 'Semestral', value: 'Semestral' },
    { label: 'Anual', value: 'Anual' },
]

/* Variable que contiene catalogo de Proveedores */
export var proveedoresMP = [
    { label: 'General Polymers', value: 'General Polymers' },
    { label: 'Plasticsacks', value: 'Plasticsacks' },
    { label: 'PlastiCaucho', value: 'PlastiCaucho' },
]

/* Variable que contiene catalogo de Prcedencias */
export var procedencia = [
    { label: 'Producto Terminado', value: 'PRODUCTO_TERMINADO' },
    { label: 'Materia Prima', value: 'MATERIA_PRIMA' },
    { label: 'Producto en Proceso', value: 'PRODUCTO_EN_PROCESO' },
    { label: 'Externo', value: 'EX' },
]

/* Variable que contiene el catalogo de las 5M's */
export var cincoMs = [
    { label: 'Mano de Obra', value: 'Mano de Obra' },
    { label: 'Materia Prima', value: 'Materia Prima' },
    { label: 'Método', value: 'Método' },
    { label: 'Medio Ambiente', value: 'Medio Ambiente' },
    { label: 'Maquiaria', value: 'Maquinaria' },
    { label: 'Otro', value: 'Otro' },
]

/* Variable que contiene los test hasta el Momento */
export var testList = [
    { label: 'pH', value: 'PROP_60' },
    { label: 'Peso por Área', value: 'PROP_14' },
    { label: 'Viscosidad', value: 'PROP_61' },
    { label: 'Sujeción de Gránulos', value: 'PROP_25' },
    { label: 'Punto de Reblandecimiento', value: 'PROP_1' },
    { label: 'Dimesionales', value: 'Dimensionales' },
    { label: 'Ingreso Materia Prima', value: 'IngresoMP' },
    { label: 'Leer Ensayos', value: 'LeerEnsayos' },

]

/* Variable de desicion SI/ NO */
export var desicionCMB = [
    { label: 'Si', value: 'Si' },
    { label: 'No', value: 'No' }
]


/* Variable de acronimo */
export var abbreviation = [
    { label: 'Sr', value: 'Sr' },
    { label: 'Srta', value: 'Srta' },
    { label: 'Sra', value: 'Sra' },
    { label: 'Sres', value: 'Sres' },
    { label: 'Dr', value: 'Dr' },
    { label: 'Dra', value: 'Dra' },
    { label: 'Arq', value: 'Arq' },
    { label: 'Ing', value: 'Ing' },
    { label: 'Msc', value: 'Msc' },
    { label: 'Mg', value: 'Mg' },
    { label: 'Abg', value: 'Abg' },
    { label: 'Lic', value: 'Lic' },
    { label: 'Otro', value: 'Otro' }
]

/* Variable para determinar las propiedades de cada formulario Ingreso de MP */
export var mpEntry = [
    { envases: ['PROP_86', 'PROP_87', 'PROP_88', 'PROP_89', 'PROP_10'] },
    { granulo: ['PROP_102', 'PROP_108', 'PROP_109', 'PROP_110', 'PROP_111', 'PROP_112', 'PROP_113', 'PROP_114', 'PROP_115', 'PROP_117', 'PROP_118', 'PROP_119', 'PROP_120', 'PROP_128'] },
    { caja: ['PROP_10', 'PROP_11', 'PROP_12', 'PROP_92', 'PROP_93', 'PROP_94', 'PROP_95', 'PROP_96', 'PROP_97', 'PROP_98', 'PROP_99',] },
    { tubos: ['PROP_102', 'PROP_11', 'PROP_12', 'PROP_83', 'PROP_84', 'PROP_85'] },
    { armadurasPolietilenos: ['PROP_12', 'PROP_10', 'PROP_14'] },
    { mangaTermoencogible: ['PROP_10', 'PROP_11', 'PROP_12', 'PROP_83', 'PROP_91'] },
    { cintaStickerEtiqueta: ['PROP_10', 'PROP_89', 'PROP_166'] },
    { tapa: ['PROP_12', 'PROP_83', 'PROP_85'] },
]

/* Variable de Lugares para Reclamo de MP */
export var placesRMP=[
    { label: 'Recepción de MP', value: 'Recepción de MP' },
    { label: 'Bodega de MP', value: 'Bodega de MP' },
    { label: 'Producción-Laminación', value: 'Producción-Laminación' },
    { label: 'Producción-Revestimientos', value: 'Producción-Revestimientos' },
    { label: 'Producción-Viales', value: 'Producción-Viales' },
]

/* Variable de lineas de aplicacion para Solicitud de Ensayos */
export var aplicationLine=[
    { label: 'Desinfectantes', value: 'Desinfectantes' },
    { label: 'Laminación', value: 'Laminación' },
    { label: 'Metales', value: 'Metales' },
    { label: 'Paneles', value: 'Paneles' },
    { label: 'Revestimientos', value: 'Revestimientos' },
    { label: 'Viales', value: 'Viales' },
]

/* Variable de lineas de aplicacion para Solicitud de Ensayos */
export var LineDDP04=[
    { label: 'Laminación', value: 'Laminación' },
    { label: 'Metales', value: 'Metales' },
    { label: 'Paneles', value: 'Paneles' },
    { label: 'Revestimientos', value: 'Revestimientos' },
    { label: 'Viales', value: 'Viales' },
]

/* Variable para tipo de Aprobación  */
export var approbateType=[
    { label: 'Laboratorio', value: 'Aprobado Laboratorio' },
    { label: 'Planta', value: 'Aprobado Planta' },
    { label: 'Libre Uso', value: 'Aprobado Libre Uso' },
    { label: 'No Aprobado', value: 'No Aprobado' },
]

/* Variable para Aprobación  */
export var approbateDesicion=[
    { label: 'Aprobado', value: 'Aprobado' },
    { label: 'No Aprobado', value: 'No Aprobado' },
]
export var providers = [
    { label: 'Quimicon', value: 1 }
]

/* Variable para tipo de Destino final  */
export var finaltSource=[
    { label: 'Desecho', value: 'Desecho' },
    { label: 'Donación', value: 'Donación' },
    { label: 'Reproceso', value: 'Reproceso' },
    { label: 'Retrabajo', value: 'Retrabajo' },
    { label: 'Reclasificado', value: 'Reclasificado' },
    { label: 'Reparación', value: 'Reparación' },
    { label: 'Corte de Teja o bandas', value: 'Corte de Teja o bandas' },
    { label: 'Solicitud de Concesión', value: 'Solicitud de Concesión' },
]

/* Variable para linea fabricacion DDP05 */
export var LineaFabricacion =[
    { label: 'Asfalto Modificado', value: 'Asfalto Modificado', unidad:'kg' },
    { label: 'Línea 1', value: 'Línea 1', unidad:'m2' },
    { label: 'Línea 2', value: 'Línea 2', unidad:'m2' },
    { label: 'Cortes', value: 'Línea 1', unidad:'UN' },
    { label: 'Revestimientos Líquidos Acrílicos', value: 'Revestimientos Líquidos Acrílicos', unidad:'UN' },
    { label: 'Emulsiones', value: 'Emulsiones', unidad:'kg' },
    { label: 'Mezcla en Frío', value: 'Mezcla en Frío', unidad:'kg' },
    { label: 'Metales', value: 'Metales', unidad:'UN' },
    
]
