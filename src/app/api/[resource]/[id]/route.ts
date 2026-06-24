import { NextResponse } from 'next/server'
import { getResourceById, updateResource, deleteResource, requireAuthenticatedUser, ApiError } from '@/lib/api/resourceService'

/**
 * @swagger
 * /api/{resource}/{id}:
 *   get:
 *     tags:
 *       - Recursos dinámicos
 *     summary: Obtener un recurso por identificador
 *     description: >
 *       Devuelve un único recurso por su identificador cuando la operación de lectura está habilitada en resourceConfig.
 *       El esquema del registro depende del recurso solicitado.
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del registro a consultar.
 *     responses:
 *       '200':
 *         description: Recurso encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       '400':
 *         description: Identificador inválido.
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
 *         description: El recurso no permite lectura.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso no encontrado o recurso desconocido.
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
export async function GET(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  try {
    const { resource, id } = await params
    await requireAuthenticatedUser()
    const item = await getResourceById(resource, id)
    if (!item) {
      return NextResponse.json({ error: 'No se encontró el recurso solicitado.' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  try {
    const { resource, id } = await params
    await requireAuthenticatedUser()
    const body = await request.json()
    const updated = await updateResource(resource, id, body)
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/{resource}/{id}:
 *   put:
 *     tags:
 *       - Recursos dinámicos
 *     summary: Actualizar un recurso existente
 *     description: >
 *       Actualiza un registro existente del recurso solicitado cuando la operación de actualización está habilitada.
 *       Este endpoint está implementado como alias de PATCH y acepta solo campos listados en writableColumns para el recurso.
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del registro a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             description: Cuerpo de la petición. Solo se aceptan columnas marcadas como editables para el recurso solicitado.
 *     responses:
 *       '200':
 *         description: Recurso actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       '400':
 *         description: Identificador inválido, cuerpo inválido o campos no permitidos.
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
 *         description: El recurso no permite actualización.
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
export async function PUT(request: Request, context: { params: Promise<{ resource: string; id: string }> }) {
  return PATCH(request, context)
}

/**
 * @swagger
 * /api/{resource}/{id}:
 *   delete:
 *     tags:
 *       - Recursos dinámicos
 *     summary: Eliminar un recurso existente
 *     description: >
 *       Elimina un registro existente del recurso solicitado cuando la operación de eliminación está habilitada.
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del registro a eliminar.
 *     responses:
 *       '200':
 *         description: Recurso eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       '400':
 *         description: Identificador inválido.
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
 *         description: El recurso no permite eliminación.
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
export async function DELETE(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  try {
    const { resource, id } = await params
    await requireAuthenticatedUser()
    const result = await deleteResource(resource, id)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
