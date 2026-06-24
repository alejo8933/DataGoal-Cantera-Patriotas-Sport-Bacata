import { createClient } from '@/lib/supabase/client'
import { syncUserProfile, getUserProfile } from '@/lib/actions/usuarios.actions'
import type {
  AuthUserResponseDTO,
  RegisterUsuarioDTO,
} from '@backend/modules/usuarios/dtos/AuthResponseDTO'

// Browser adapter for Supabase Auth. Profile persistence and reads cross the
// Server Action boundary and are handled by Usuarios use cases.
export const authService = {
  async login(email: string, password: string): Promise<AuthUserResponseDTO> {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Correo o contraseña incorrectos.')

    const perfil = await getUserProfile(data.user.id)

    return {
      id: data.user.id,
      email: data.user.email ?? email,
      rol: perfil?.rol ?? 'jugador',
      activo: perfil?.activo ?? true,
    }
  },

  async register(fields: RegisterUsuarioDTO) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email:    fields.email,
      password: fields.password,
      options: {
        data: {
          rol:              fields.rol,
          nombre:           fields.nombre,
          apellido:         fields.apellido,
          telefono:         fields.telefono,
          fecha_nacimiento: fields.fechaNacimiento,
          posicion:         fields.posicion,
          categoria:        fields.categoria,
        },
      },
    })
    
    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('Este correo electrónico ya está registrado. Si es tu cuenta, intenta iniciar sesión.')
      }
      throw new Error('Error al registrar: ' + error.message)
    }
    if (!data.user) throw new Error('No se pudo crear el usuario.')

    const syncResult = await syncUserProfile({
      id:               data.user.id,
      email:            fields.email,
      nombre:           fields.nombre,
      apellido:         fields.apellido,
      rol:              fields.rol,
      telefono:         fields.telefono,
      fecha_nacimiento: fields.fechaNacimiento,
      posicion:         fields.posicion,
      categoria:        fields.categoria,
    })

    if (!syncResult.success) {
      console.error('Error sincronizando perfil:', syncResult.error)
    }

    return data
  },

  async logout() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error('Error al cerrar sesión.')
  },

  async getUser(): Promise<AuthUserResponseDTO | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const perfil = await getUserProfile(user.id)

    return {
      id:     user.id,
      email:  user.email!,
      rol:    perfil?.rol ?? 'jugador',
      activo: perfil?.activo ?? true,
    }
  },

  async resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    })
    if (error) throw new Error('Error al enviar el correo de recuperación.')
  },

  async updatePassword(password: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error('Error al actualizar la contraseña.')
  }
}
