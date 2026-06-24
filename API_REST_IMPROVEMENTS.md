# Mejoras en API REST - Documentación Completa

## 📋 Resumen de Cambios

Se han implementado mejoras significativas en la API REST genérica para mejorar **robustez, seguridad y mantenibilidad**. Los cambios incluyen:

1. ✅ **Validación con Zod** - Esquemas de validación por recurso
2. ✅ **Control de Acceso por Roles (RBAC)** - Sistema de permisos granular
3. ✅ **Métodos CRUD Completos** - GET, POST, PATCH, PUT, DELETE
4. ✅ **Dispatcher de Servicios** - Patrón Factory para reutilizar lógica de negocio
5. ✅ **Manejo de Errores Centralizado** - Clase `ApiError` mejorada

---

## 🗂️ Archivos Nuevos y Modificados

### Archivos Nuevos:

| Archivo | Propósito |
|---------|-----------|
| `src/lib/api/rbac.config.ts` | Configuración de Control de Acceso por Roles |
| `src/lib/api/schemas.ts` | Mapeo de esquemas Zod para validación |
| `src/lib/api/serviceDispatcher.ts` | Dispatcher de servicios de negocio (Factory Pattern) |

### Archivos Modificados:

| Archivo | Cambios |
|---------|---------|
| `src/lib/api/resourceService.ts` | Validación Zod, RBAC, Dispatcher integrado |
| `src/app/api/[resource]/route.ts` | GET y POST con autenticación y RBAC |
| `src/app/api/[resource]/[id]/route.ts` | GET, PATCH, PUT, DELETE con autenticación y RBAC |

---

## 🔒 1. Control de Acceso por Roles (RBAC)

### Configuración en `src/lib/api/rbac.config.ts`

Define qué roles pueden realizar qué operaciones:

```typescript
export const rolePermissions: Record<UserRole, Set<Operation>> = {
  admin: new Set(['list', 'get', 'create', 'update', 'delete']),
  entrenador: new Set(['list', 'get', 'create', 'update']),
  jugador: new Set(['list', 'get']),
}
```

### Permisos Específicos por Recurso

Algunos recursos tienen reglas personalizadas:

```typescript
export const resourceRolePermissions: Record<string, Record<UserRole, Set<Operation>>> = {
  jugadores: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get']), // Entrenador NO puede crear/editar
    jugador: new Set(['get']), // Solo ver sus propios datos
  },
  
  audit_logs: {
    admin: new Set(['list', 'get']),
    entrenador: new Set([]),
    jugador: new Set([]),
  },
  // ... más recursos
}
```

### Cómo se Aplica

En cada endpoint API, se valida automáticamente:

```typescript
// En src/app/api/[resource]/route.ts
const user = await requireAuthenticatedUserWithRole(params.resource, 'create')
// ↑ Si el usuario no tiene permiso 'create' para este recurso, lanza ApiError 403
```

### Agregar Nuevos Permisos

Para personalizarpermisos de un recurso nuevo:

```typescript
// En src/lib/api/rbac.config.ts
export const resourceRolePermissions: Record<string, Record<UserRole, Set<Operation>>> = {
  mi_nuevo_recurso: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get']),
    jugador: new Set(['list']),
  },
  // ...
}
```

---

## ✓ 2. Validación con Zod

### Configuración en `src/lib/api/schemas.ts`

Mapea recursos a esquemas Zod:

```typescript
export const resourceSchemas: Record<string, z.ZodSchema> = {
  jugadores: CreatePlayerSchema,      // Valida con src/types/domain/player.schema.ts
  partidos: CreateMatchSchema,         // Valida con src/types/domain/match.schema.ts
  entrenamientos: CreateTrainingSchema, // Valida con src/types/domain/training.schema.ts
  // ...
}
```

### Cómo Funciona

Cuando haces una solicitud POST o PATCH:

```javascript
// POST /api/jugadores
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "posicion": "Delantero"
  // Validado contra CreatePlayerSchema
}

// Si hay un error de validación:
{
  "error": "Validación fallida: nombre: String must contain at least 1 character(s)"
}
```

### Agregar Validación a un Recurso Nuevo

1. Crea un esquema en `src/types/domain/`:

```typescript
// src/types/domain/mirecurso.schema.ts
import { z } from 'zod'

export const CreateMiRecursoSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().optional(),
})
```

2. Registra en `src/lib/api/schemas.ts`:

```typescript
import { CreateMiRecursoSchema } from '@/types/domain/mirecurso.schema'

export const resourceSchemas: Record<string, z.ZodSchema> = {
  mi_recurso: CreateMiRecursoSchema,
  // ...
}
```

---

## 🏭 3. Dispatcher de Servicios (Factory Pattern)

### Ubicación: `src/lib/api/serviceDispatcher.ts`

Conecta la API REST genérica con la lógica de negocio específica:

```typescript
export const serviceDispatcher: Record<string, ResourceService> = {
  jugadores: playerService,      // Usa playerService
  partidos: matchService,         // Usa matchService
  entrenamientos: trainingService, // Usa trainingService
  torneos: tournamentService,     // Usa tournamentService
  // Sin servicio específico = acceso directo a Supabase
}
```

### Cómo Funciona

Cuando se hace una solicitud:

```
1. GET /api/jugadores
2. resourceService.listResource('jugadores', ...) 
3. getServiceForResource('jugadores') → playerService
4. playerService.getAll()
5. Devuelve datos a través de la lógica de negocio
```

### Agregar un Nuevo Servicio

1. Asegúrate que tu servicio tenga la interfaz correcta:

```typescript
// src/services/miservicio.ts
export const miService = {
  getAll: () => Promise<any[]>,
  getById: (id: string) => Promise<any>,
  create: (data: any) => Promise<any>,
  update: (id: string, data: any) => Promise<any>,
  delete: (id: string) => Promise<any>,
}
```

2. Registra en `src/lib/api/serviceDispatcher.ts`:

```typescript
import { miService } from '@/services/miservicio'

export const serviceDispatcher: Record<string, ResourceService> = {
  mi_recurso: miService,
  // ...
}
```

---

## 🔄 4. Métodos CRUD Completos

### Rutas y Métodos

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/[resource]` | GET | Listar todos los recursos |
| `/api/[resource]` | POST | Crear un recurso (requiere `create` permiso) |
| `/api/[resource]/[id]` | GET | Obtener un recurso por ID |
| `/api/[resource]/[id]` | PATCH/PUT | Actualizar un recurso (requiere `update` permiso) |
| `/api/[resource]/[id]` | DELETE | Eliminar un recurso (requiere `delete` permiso) |

### Ejemplos de Uso

```bash
# GET - Listar jugadores
curl -H "Authorization: Bearer <token>" \
  https://tuapp.com/api/jugadores?categoria=juvenil&limit=10

# POST - Crear jugador
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Pérez","posicion":"Delantero"}' \
  https://tuapp.com/api/jugadores

# PATCH - Actualizar jugador
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"posicion":"Portero"}' \
  https://tuapp.com/api/jugadores/123-abc

# DELETE - Eliminar jugador
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  https://tuapp.com/api/jugadores/123-abc
```

### Respuestas

**Éxito:**
```json
{
  "id": "uuid",
  "nombre": "Juan",
  "apellido": "Pérez",
  "posicion": "Delantero"
}
```

**Error de Autenticación:**
```json
{
  "error": "No autorizado. Inicia sesión para acceder a esta API."
}
```
Status: **401**

**Error de Permisos:**
```json
{
  "error": "No tienes permiso para create este recurso. Rol: jugador"
}
```
Status: **403**

**Error de Validación:**
```json
{
  "error": "Validación fallida: nombre: String must contain at least 1 character(s)"
}
```
Status: **400**

**Recurso No Encontrado:**
```json
{
  "error": "No se encontró el recurso solicitado."
}
```
Status: **404**

---

## 🔑 5. Sistema de Autenticación y Usuarios

### Obtención del Usuario Autenticado

```typescript
const user = await requireAuthenticatedUserWithRole(resource, operation)
// Retorna:
// {
//   id: "user-uuid",
//   email: "usuario@ejemplo.com",
//   rol: "admin" | "entrenador" | "jugador",
//   activo: true
// }
```

### Flujo de Autenticación

1. El usuario inicia sesión y obtiene un JWT
2. El JWT se envía en el header `Authorization: Bearer <token>`
3. Se llama a `supabase.auth.getUser()` para validar
4. Se obtiene el rol desde la tabla `perfiles` usando `getUserProfile()`
5. Se valida el rol contra los permisos del recurso y operación

### Tabla `perfiles`

Estructura requerida:

```sql
CREATE TABLE perfiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  nombre TEXT,
  apellido TEXT,
  rol TEXT NOT NULL, -- 'admin', 'entrenador', 'jugador'
  activo BOOLEAN DEFAULT true,
  -- ... otros campos
)
```

---

## 📊 6. Casos de Uso Completos

### Caso 1: Crear Jugador (Admin/Entrenador)

```typescript
// Frontend
const response = await fetch('/api/jugadores', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: 'Juan',
    apellido: 'Pérez',
    posicion: 'Delantero',
    categoria: 'juvenil',
    numero_camiseta: 7
  })
})

// Backend
1. GET en src/app/api/[resource]/route.ts
2. requireAuthenticatedUserWithRole('jugadores', 'create')
   - Obtiene usuario de Supabase
   - Valida rol admin/entrenador
   - Si falla: lanza ApiError 403
3. validateResourcePayload('jugadores', body)
   - Valida contra CreatePlayerSchema
   - Si falla: lanza ApiError 400 con detalles
4. getServiceForResource('jugadores')
   - Encuentra playerService
   - Llama playerService.create(data)
5. Retorna el jugador creado con status 201
```

### Caso 2: Jugador intenta Eliminar a Otro Jugador

```typescript
// Frontend
const response = await fetch('/api/jugadores/other-id', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${jugador_token}` }
})

// Backend
1. requireAuthenticatedUserWithRole('jugadores', 'delete')
   - Obtiene usuario (rol: 'jugador')
   - Valida: canPerformOperation('jugador', 'jugadores', 'delete')
   - Busca en resourceRolePermissions['jugadores']['jugador']
   - Solo tiene ['get'], NO tiene 'delete'
   - Lanza ApiError 403: "No tienes permiso para delete este recurso"

// Response
{
  "error": "No tienes permiso para delete este recurso. Rol: jugador"
}
Status: 403
```

### Caso 3: Crear Entrenamiento con Datos Inválidos

```typescript
// Frontend
const response = await fetch('/api/entrenamientos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${entrenador_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    titulo: '', // ❌ vacío, requiere min 1
    fecha: '2024-01-20',
    categoria: 'juvenil'
  })
})

// Backend
1. requireAuthenticatedUserWithRole('entrenamientos', 'create') ✓
2. validateResourcePayload('entrenamientos', body)
   - Valida contra CreateTrainingSchema
   - titulo: z.string().min(1) → FALLA
   - Lanza z.ZodError
3. Captura error y lanza:
   ApiError: "Validación fallida: titulo: String must contain at least 1 character(s)"

// Response
{
  "error": "Validación fallida: titulo: String must contain at least 1 character(s)"
}
Status: 400
```

---

## 🔧 7. Configuración y Personalización

### Cambiar Permisos de un Rol

```typescript
// En src/lib/api/rbac.config.ts
export const rolePermissions: Record<UserRole, Set<Operation>> = {
  admin: new Set(['list', 'get', 'create', 'update', 'delete']),
  entrenador: new Set(['list', 'get', 'create', 'update']), // Cambio aquí
  jugador: new Set(['list', 'get', 'create']), // Los jugadores PUEDEN crear
}
```

### Cambiar Permisos de un Recurso Específico

```typescript
// En src/lib/api/rbac.config.ts
export const resourceRolePermissions: Record<string, Record<UserRole, Set<Operation>>> = {
  jugadores: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get', 'create', 'update', 'delete']), // Ahora SÍ pueden
    jugador: new Set(['get']),
  },
}
```

### Agregar Validación Más Estricta

```typescript
// En src/types/domain/mirecurso.schema.ts
export const CreateMiRecursoSchema = z.object({
  nombre: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'Solo letras y espacios'),
  
  email: z.string().email('Email inválido'),
  
  edad: z.number().int().min(0).max(120),
  
  status: z.enum(['activo', 'inactivo'], {
    errorMap: () => ({ message: 'Debe ser activo o inactivo' })
  })
})
```

---

## 🐛 8. Manejo de Errores

### Todos los Errores Retornan JSON Consistente

```typescript
export class ApiError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}
```

### Códigos de Estado HTTP

| Código | Situación |
|--------|-----------|
| **200** | GET exitoso |
| **201** | POST exitoso (creación) |
| **204** | DELETE exitoso (algunas APIs) |
| **400** | Error de validación, datos inválidos |
| **401** | No autenticado |
| **403** | Autenticado pero sin permisos |
| **404** | Recurso no encontrado |
| **500** | Error interno del servidor |

### Captura Recomendada en Frontend

```typescript
async function apiCall(method: string, resource: string, id?: string, body?: any) {
  try {
    const path = id ? `/api/${resource}/${id}` : `/api/${resource}`
    const response = await fetch(path, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const data = await response.json()

    if (!response.ok) {
      // El error viene en data.error
      throw new Error(data.error || 'Error desconocido')
    }

    return data
  } catch (error) {
    console.error(`Error en ${method} ${resource}:`, error.message)
    throw error
  }
}
```

---

## 📝 9. Checklist para Agregar un Nuevo Recurso

Para agregar un nuevo recurso con validación y RBAC completo:

- [ ] **1. Crear Esquema**: `src/types/domain/[recurso].schema.ts`
- [ ] **2. Registrar Esquema**: En `src/lib/api/schemas.ts` → `resourceSchemas`
- [ ] **3. Crear Servicio** (opcional): `src/services/[recurso]Service.ts`
- [ ] **4. Registrar Servicio** (opcional): En `src/lib/api/serviceDispatcher.ts`
- [ ] **5. Configurar RBAC**: En `src/lib/api/rbac.config.ts` → `resourceRolePermissions`
- [ ] **6. Agregar Configuración**: En `src/lib/api/resourceConfig.ts` (si no existe)
- [ ] **7. Probar Endpoints**: GET, POST, PATCH, DELETE

---

## 🚀 10. Mejores Prácticas

### ✓ DO (Haz)

```typescript
// Validar todos los inputs
export const CreateUserSchema = z.object({
  email: z.string().email(),
  rol: z.enum(['admin', 'entrenador', 'jugador'])
})

// Usar RBAC para cada operación
const user = await requireAuthenticatedUserWithRole('users', 'delete')

// Reutilizar servicios de negocio
const service = getServiceForResource('jugadores')
if (service?.update) await service.update(id, data)

// Logs útiles en errores
console.error('Error creando jugador:', error.message)
```

### ✗ DON'T (No Hagas)

```typescript
// ❌ No validar inputs
const data = await request.json()
db.insert(data) // ¡Peligro de SQL injection!

// ❌ No revisar permisos
await deleteResource(resource, id) // ¿Sin verificar rol?

// ❌ No reutilizar lógica
// Repetir la misma validación en múltiples endpoints

// ❌ No manejar errores específicos
throw new Error('Error') // ¿Qué tipo de error? ¿Qué código HTTP?
```

---

## 📞 Soporte y Debugging

### Verificar que todo está integrado

```bash
# 1. Verifica que los archivos existen
ls src/lib/api/
# Debe mostrar: rbac.config.ts, schemas.ts, serviceDispatcher.ts, resourceService.ts, resourceConfig.ts

# 2. Verifica que los imports funcionan
npm run build

# 3. Prueba un endpoint
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/jugadores
```

### Errores Comunes

**Error: "Recurso desconocido"**
- Solución: Agregar el recurso a `resourceConfig.ts`

**Error: "No tienes permiso"**
- Solución: Verificar `rbac.config.ts` para ese recurso/rol

**Error: "Validación fallida"**
- Solución: Revisar el esquema en `src/types/domain/[recurso].schema.ts`

**Error: "Usuario no autenticado"**
- Solución: Asegúrate de enviar el header `Authorization: Bearer <token>`

---

## 📚 Referencias

- [Documentación de Zod](https://zod.dev/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Control de Acceso Basado en Roles (RBAC)](https://en.wikipedia.org/wiki/Role-based_access_control)
