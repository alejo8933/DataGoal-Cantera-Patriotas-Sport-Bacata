export type ResourceOperations = {
  list: boolean
  get: boolean
  create: boolean
  update: boolean
  delete: boolean
}

export type ResourceConfig = {
  tableName: string
  columns: string[]
  writableColumns: string[]
  defaultOrder?: {
    column: string
    ascending: boolean
  }
  operations: ResourceOperations
}

export const resourceConfigs: Record<string, ResourceConfig> = {
  asistencias: {
    tableName: 'asistencias',
    columns: ['id', 'jugador_id', 'entrenamiento_id', 'presente', 'hora_llegada', 'excusa', 'notas', 'created_at'],
    writableColumns: ['jugador_id', 'entrenamiento_id', 'presente', 'hora_llegada', 'excusa', 'notas'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'created_at', ascending: false },
  },
  audit_logs: {
    tableName: 'audit_logs',
    columns: ['id', 'tabla', 'operacion', 'datos_anteriores', 'datos_nuevos', 'usuario_id', 'fecha'],
    writableColumns: [],
    operations: { list: true, get: true, create: false, update: false, delete: false },
    defaultOrder: { column: 'fecha', ascending: false },
  },
  categorias: {
    tableName: 'categorias',
    columns: ['id', 'nombre', 'rango_edad', 'modalidad', 'activo'],
    writableColumns: ['nombre', 'rango_edad', 'modalidad', 'activo'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
  },
  categorias_maestras: {
    tableName: 'categorias_maestras',
    columns: ['id', 'nombre', 'edades', 'modalidad', 'activo', 'created_at'],
    writableColumns: ['nombre', 'edades', 'modalidad', 'activo'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'nombre', ascending: true },
  },
  convocatoria_jugadores: {
    tableName: 'convocatoria_jugadores',
    columns: ['id', 'convocatoria_id', 'jugador_id'],
    writableColumns: ['convocatoria_id', 'jugador_id'],
    operations: { list: true, get: true, create: true, update: false, delete: true },
  },
  convocatorias: {
    tableName: 'convocatorias',
    columns: ['id', 'partido_id', 'notas_entrenador', 'estado', 'created_at'],
    writableColumns: ['partido_id', 'notas_entrenador', 'estado'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'created_at', ascending: false },
  },
  entrenamientos: {
    tableName: 'entrenamientos',
    columns: ['id', 'titulo', 'fecha', 'hora', 'lugar', 'categoria', 'descripcion', 'activo'],
    writableColumns: ['titulo', 'fecha', 'hora', 'lugar', 'categoria', 'descripcion', 'activo'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'fecha', ascending: false },
  },
  evaluaciones: {
    tableName: 'evaluaciones',
    columns: ['id', 'jugador_id', 'tecnica', 'fisica', 'tactica', 'mental', 'notas', 'created_at'],
    writableColumns: ['jugador_id', 'tecnica', 'fisica', 'tactica', 'mental', 'notas'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'created_at', ascending: false },
  },
  eventos_partido: {
    tableName: 'eventos_partido',
    columns: ['id', 'partido_id', 'jugador_id', 'minuto', 'tipo', 'equipo', 'descripcion', 'created_at'],
    writableColumns: ['partido_id', 'jugador_id', 'minuto', 'tipo', 'equipo', 'descripcion'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'created_at', ascending: false },
  },
  gastos: {
    tableName: 'gastos',
    columns: ['id', 'concepto', 'categoria', 'monto', 'fecha', 'created_at'],
    writableColumns: ['concepto', 'categoria', 'monto', 'fecha'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'fecha', ascending: false },
  },
  jugadores: {
    tableName: 'jugadores',
    columns: ['id', 'nombre', 'apellido', 'posicion', 'categoria', 'numero_camiseta', 'goles', 'asistencias', 'tarjetas_amarillas', 'tarjetas_rojas', 'foto_url', 'activo', 'categoria_id', 'equipo_id'],
    writableColumns: ['nombre', 'apellido', 'posicion', 'categoria', 'numero_camiseta', 'goles', 'asistencias', 'tarjetas_amarillas', 'tarjetas_rojas', 'foto_url', 'activo', 'categoria_id', 'equipo_id'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'apellido', ascending: true },
  },
  kpi_definiciones: {
    tableName: 'kpi_definiciones',
    columns: ['slug', 'nombre', 'descripcion', 'unidad'],
    writableColumns: [],
    operations: { list: true, get: true, create: false, update: false, delete: false },
    defaultOrder: { column: 'nombre', ascending: true },
  },
  lesiones: {
    tableName: 'lesiones',
    columns: ['id', 'jugador_id', 'descripcion', 'tipo', 'zona_afectada', 'gravedad', 'mecanismo', 'tratamiento', 'restricciones', 'fecha_lesion', 'fecha_retorno', 'estado', 'created_at'],
    writableColumns: ['jugador_id', 'descripcion', 'tipo', 'zona_afectada', 'gravedad', 'mecanismo', 'tratamiento', 'restricciones', 'fecha_lesion', 'fecha_retorno', 'estado'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'created_at', ascending: false },
  },
  notificaciones: {
    tableName: 'notificaciones',
    columns: ['id', 'user_id', 'titulo', 'descripcion', 'tipo', 'prioridad', 'leida', 'created_at'],
    writableColumns: ['user_id', 'titulo', 'descripcion', 'tipo', 'prioridad', 'leida'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'created_at', ascending: false },
  },
  okr_objetivos: {
    tableName: 'okr_objetivos',
    columns: ['id', 'titulo', 'descripcion', 'tipo', 'actor_id', 'periodo', 'fecha_inicio', 'fecha_fin', 'creado_en', 'updated_at'],
    writableColumns: ['titulo', 'descripcion', 'tipo', 'actor_id', 'periodo', 'fecha_inicio', 'fecha_fin'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'creado_en', ascending: false },
  },
  okr_resultados_clave: {
    tableName: 'okr_resultados_clave',
    columns: ['id', 'objetivo_id', 'nombre', 'valor_inicial', 'valor_meta', 'valor_actual', 'unidad', 'kpi_slug', 'ultimo_calculo'],
    writableColumns: ['objetivo_id', 'nombre', 'valor_inicial', 'valor_meta', 'valor_actual', 'unidad', 'kpi_slug'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'ultimo_calculo', ascending: false },
  },
  partidos: {
    tableName: 'partidos',
    columns: ['id', 'equipo_local', 'equipo_visitante', 'fecha', 'hora', 'lugar', 'goles_local', 'goles_visitante', 'estado', 'categoria', 'descripcion'],
    writableColumns: ['equipo_local', 'equipo_visitante', 'fecha', 'hora', 'lugar', 'goles_local', 'goles_visitante', 'estado', 'categoria', 'descripcion'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'fecha', ascending: false },
  },
  perfiles: {
    tableName: 'perfiles',
    columns: ['id', 'rol', 'activo', 'email', 'nombre', 'apellido', 'estado', 'telefono', 'genero', 'documento', 'fecha_nacimiento', 'posicion', 'categoria'],
    writableColumns: ['rol', 'activo', 'email', 'nombre', 'apellido', 'estado', 'telefono', 'genero', 'documento', 'fecha_nacimiento', 'posicion', 'categoria'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'apellido', ascending: true },
  },
  rendimiento_equipos: {
    tableName: 'rendimiento_equipos',
    columns: ['id', 'equipo', 'categoria', 'partidos', 'ganados', 'empatados', 'perdidos', 'goles_favor', 'goles_contra', 'puntos', 'activo', 'imagen_url', 'fundacion', 'sede', 'tecnico', 'logros', 'tecnico_id', 'categoria_id', 'genero', 'edades', 'cupos', 'horario', 'color'],
    writableColumns: ['equipo', 'categoria', 'partidos', 'ganados', 'empatados', 'perdidos', 'goles_favor', 'goles_contra', 'puntos', 'activo', 'imagen_url', 'fundacion', 'sede', 'tecnico', 'logros', 'tecnico_id', 'categoria_id', 'genero', 'edades', 'cupos', 'horario', 'color'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'equipo', ascending: true },
  },
  torneos: {
    tableName: 'torneos',
    columns: ['id', 'nombre', 'categoria', 'fecha_inicio', 'fecha_fin', 'estado', 'descripcion', 'logo_url', 'resultado'],
    writableColumns: ['nombre', 'categoria', 'fecha_inicio', 'fecha_fin', 'estado', 'descripcion', 'logo_url', 'resultado'],
    operations: { list: true, get: true, create: true, update: true, delete: true },
    defaultOrder: { column: 'fecha_inicio', ascending: false },
  },
}

export function getResourceConfig(resource: string): ResourceConfig | undefined {
  return resourceConfigs[resource]
}
