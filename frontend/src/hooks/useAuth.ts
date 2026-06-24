'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/api/authService'
import type {
  AuthUserResponseDTO,
  RegisterUsuarioDTO,
} from 'datagoal-backend/modules/usuarios/dtos/AuthResponseDTO'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUserResponseDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authService.getUser().then(setUser)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const authUser = await authService.login(email, password)
      setUser(authUser)

      if (authUser.rol === 'admin') router.push('/dashboard/admin')
      else if (authUser.rol === 'entrenador') router.push('/dashboard/entrenador')
      else if (authUser.rol === 'jugador') router.push('/dashboard/jugador')
      else router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    fields: RegisterUsuarioDTO
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      await authService.register(fields)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)

    try {
      await authService.logout()
      setUser(null)
      router.push('/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesion.')
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error, login, register, logout }
}
