'use server'

/**
 * Valida si el código de acceso proporcionado coincide con el configurado para el rol especificado.
 * Esta validación ocurre en el servidor para proteger los códigos secretos.
 */
export async function validarCodigoRegistro(rol: string, codigo: string) {
  if (rol === 'jugador') return { success: true }

  const codeAdmin = process.env.REGISTRY_CODE_ADMIN
  const codeTrainer = process.env.REGISTRY_CODE_TRAINER

  if (rol === 'admin') {
    if (codigo === codeAdmin) {
      return { success: true }
    }
    return { success: false, message: 'El código de acceso para Administrador es incorrecto.' }
  }

  if (rol === 'entrenador') {
    if (codigo === codeTrainer) {
      return { success: true }
    }
    return { success: false, message: 'El código de acceso para Entrenador es incorrecto.' }
  }

  return { success: false, message: 'Rol no válido para validación de código.' }
}

/**
 * Sincroniza el perfil del usuario después del registro usando el rol de servicio
 * Esto evita el bloqueo por RLS cuando el usuario aún no ha confirmado su correo.
 */
export async function syncUserProfile(profileData: any) {
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'Credenciales de servicio no configuradas' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const { error } = await supabaseAdmin
    .from('perfiles')
    .upsert({
      ...profileData,
      activo: true
    })

  if (error) {
    console.error('Error crudo al sincronizar perfil:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Obtiene el perfil de un usuario saltándose RLS.
 * Útil cuando las políticas RLS bloquean la lectura incluso para el propio usuario
 * o si hay problemas de sincronización de caché.
 */
export async function getUserProfile(userId: string) {
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) return null

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  const { data } = await supabaseAdmin
    .from('perfiles')
    .select('rol, activo, nombre, apellido')
    .eq('id', userId)
    .single()

  return data
}

/**
 * Envía correo de recuperación de contraseña usando la cuenta de servicio
 */
export async function sendPasswordResetEmail(email: string) {
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'Credenciales de servicio no configuradas' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/actualizar-password` : undefined,
  } as any)

  if (error) {
    console.error('Error enviando correo de recuperación:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
