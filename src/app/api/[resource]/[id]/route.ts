import { NextResponse } from 'next/server'
import { getResourceById, updateResource, deleteResource, requireAuthenticatedUser, ApiError } from '@/lib/api/resourceService'

export async function GET(request: Request, { params }: { params: { resource: string; id: string } }) {
  try {
    await requireAuthenticatedUser()
    const item = await getResourceById(params.resource, params.id)
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

export async function PATCH(request: Request, { params }: { params: { resource: string; id: string } }) {
  try {
    await requireAuthenticatedUser()
    const body = await request.json()
    const updated = await updateResource(params.resource, params.id, body)
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: { resource: string; id: string } }) {
  return PATCH(request, context)
}

export async function DELETE(request: Request, { params }: { params: { resource: string; id: string } }) {
  try {
    await requireAuthenticatedUser()
    const result = await deleteResource(params.resource, params.id)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
