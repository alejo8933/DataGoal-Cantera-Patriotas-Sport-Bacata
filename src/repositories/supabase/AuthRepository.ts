import { createClient } from '@/lib/supabase/server'
import type { IAuthRepository } from '@/repositories/IAuthRepository'

export class SupabaseAuthRepository implements IAuthRepository {
  async sendPasswordReset(email: string): Promise<boolean> {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/actualizar-password` : undefined,
    })
    if (error) {
      console.error('Error enviando reset password:', error.message)
      return false
    }
    return true
  }
}
import { createClient } from '@/lib/supabase/client'
import type { IAuthRepository } from '@/repositories/IAuthRepository'
import type { User, Register } from '@/types/domain/auth.schema'

export class SupabaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return {
      id:     data.user.id,
      email:  data.user.email!,
      rol:    perfil?.rol ?? 'jugador',
      activo: perfil?.activo ?? true,
    }
  }

  async register(datos: Register): Promise<void> {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email:    datos.email,
      password: datos.password,
    })
    if (error) throw new Error(error.message)

    const { error: perfilError } = await supabase
      .from('perfiles')
      .insert({
        id:              data.user!.id,
        nombre:          datos.nombre,
        apellido:        datos.apellido,
        telefono:        datos.telefono,
        fecha_nacimiento: datos.fechaNacimiento,
        posicion:        datos.posicion,
        categoria:       datos.categoria,
        rol:             'jugador',
        activo:          true,
      })
    if (perfilError) throw new Error(perfilError.message)
  }

  async logout(): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  async getUser(): Promise<User | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: perfil } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      id:     user.id,
      email:  user.email!,
      rol:    perfil?.rol ?? 'jugador',
      activo: perfil?.activo ?? true,
    }
  }
}