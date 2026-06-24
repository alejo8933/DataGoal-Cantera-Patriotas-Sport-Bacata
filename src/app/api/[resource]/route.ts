import { NextResponse } from 'next/server'
import {
  listResource,
  createResource,
  requireAuthenticatedUserWithRole,
  ApiError,
} from '@/lib/api/resourceService'

/**
 * @swagger
 * /api/{resource}:
 *   get:
 *     tags:
 *       - Recursos dinámicos
 *     summary: Listar registros de un recurso configurado
 *     description: >
 *       Devuelve la lista de registros del recurso solicitado cuando la operación de listado está habilitada en resourceConfig.
 *       El esquema exacto de cada elemento depende del recurso solicitado y de sus columnas configuradas.
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - asistencias
 *             - audit_logs
 *             - categorias
 *             - categorias_maestras
 *             - convocatoria_jugadores
 *             - convocatorias
 *             - entrenamientos
 *             - evaluaciones
 *             - eventos_partido
 *             - gastos
 *             - jugadores
 *             - kpi_definiciones
 *             - lesiones
 *             - notificaciones
 *             - okr_objetivos
 *             - okr_resultados_clave
 *             - partidos
 *             - perfiles
 *             - rendimiento_equipos
 *             - torneos
 *         description: Identificador del recurso configurado en resourceConfig.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Límite de resultados a devolver.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de registros a saltar.
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Columna usada para ordenar resultados.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Sentido del orden.
 *     responses:
 *       '200':
 *         description: Lista de registros obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
 *       '400':
 *         description: Parámetros de consulta inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado. Se requiere autenticación.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: El recurso no permite listado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso desconocido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  try {
    const { resource } = await params
    const user = await requireAuthenticatedUserWithRole(resource, 'list')
    const items = await listResource(resource, new URL(request.url).searchParams, user)
    return NextResponse.json(items)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/{resource}:
 *   post:
 *     tags:
 *       - Recursos dinámicos
 *     summary: Crear un registro en un recurso configurado
 *     description: >
 *       Crea un nuevo registro en el recurso solicitado cuando la operación de creación está habilitada.
 *       Solo se aceptan campos listados en writableColumns del recurso y el esquema exacto depende del recurso.
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - asistencias
 *             - audit_logs
 *             - categorias
 *             - categorias_maestras
 *             - convocatoria_jugadores
 *             - convocatorias
 *             - entrenamientos
 *             - evaluaciones
 *             - eventos_partido
 *             - gastos
 *             - jugadores
 *             - kpi_definiciones
 *             - lesiones
 *             - notificaciones
 *             - okr_objetivos
 *             - okr_resultados_clave
 *             - partidos
 *             - perfiles
 *             - rendimiento_equipos
 *             - torneos
 *         description: Identificador del recurso configurado en resourceConfig.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             description: Cuerpo de la petición. Solo se aceptan columnas marcadas como editables para el recurso solicitado.
 *     responses:
 *       '201':
 *         description: Registro creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       '400':
 *         description: Cuerpo inválido o campos no permitidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado. Se requiere autenticación.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: El recurso no permite creación.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso desconocido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  try {
    const { resource } = await params
    const user = await requireAuthenticatedUserWithRole(resource, 'create')
    const body = await request.json()
    const created = await createResource(resource, body, user)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
