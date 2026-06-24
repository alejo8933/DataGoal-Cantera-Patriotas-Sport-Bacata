import path from 'path'
import { NextResponse } from 'next/server'
import { createSwaggerSpec } from 'next-swagger-doc'

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: path.join(process.cwd(), 'src/app/api'),
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API REST de Patriotas',
        version: '1.0.0',
        description:
          'Documentación OpenAPI para la API REST dinámica del proyecto. Los recursos y sus campos se definen en resourceConfig y pueden variar según el recurso solicitado.',
      },
      servers: [{ url: '/api' }],
      tags: [{ name: 'Recursos dinámicos', description: 'Endpoints REST para recursos configurados dinámicamente.' }],
      components: {
        schemas: {
          ErrorResponse: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                description: 'Mensaje de error devuelto por ApiError.',
              },
            },
            required: ['error'],
          },
        },
      },
    },
  })

  return NextResponse.json(spec)
}
