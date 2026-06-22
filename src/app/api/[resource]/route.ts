import { NextResponse } from 'next/server'
import {
  listResource,
  createResource,
  requireAuthenticatedUserWithRole,
  ApiError,
} from '@/lib/api/resourceService'

export async function GET(request: Request, { params }: { params: { resource: string } }) {
  try {
    const user = await requireAuthenticatedUserWithRole(params.resource, 'list')
    const items = await listResource(params.resource, new URL(request.url).searchParams, user)
    return NextResponse.json(items)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { resource: string } }) {
  try {
    const user = await requireAuthenticatedUserWithRole(params.resource, 'create')
    const body = await request.json()
    const created = await createResource(params.resource, body, user)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
