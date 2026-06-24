'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, Pencil, Save, UserRound, X } from 'lucide-react'
import {
  actualizarMiPerfilJugador,
  obtenerMiPerfilJugador,
} from '@/lib/actions/jugadores.actions'
import type { MiPerfilJugadorResponseDTO } from 'datagoal-backend/modules/jugadores/dtos/PerfilJugadorResponseDTO'

export default function JugadorPerfilPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<MiPerfilJugadorResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [numero, setNumero] = useState('')
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    obtenerMiPerfilJugador()
      .then((perfilData) => {
        if (!active) return
        if (!perfilData) {
          router.push('/login')
          return
        }

        setData(perfilData)
        setNombre(perfilData.perfil.nombre || perfilData.jugador?.nombre || '')
        setApellido(perfilData.perfil.apellido || perfilData.jugador?.apellido || '')
        setNumero(perfilData.jugador?.numeroCamiseta?.toString() ?? '')
        setFotoUrl(perfilData.jugador?.fotoUrl ?? null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [router])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setNewFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const cancelEditing = () => {
    if (!data) return
    setNombre(data.perfil.nombre || data.jugador?.nombre || '')
    setApellido(data.perfil.apellido || data.jugador?.apellido || '')
    setNumero(data.jugador?.numeroCamiseta?.toString() ?? '')
    setNewFile(null)
    setPreviewUrl(null)
    setError(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setUpdating(true)
    setError(null)

    const formData = new FormData()
    formData.set('nombre', nombre)
    formData.set('apellido', apellido)
    formData.set('numero_camiseta', numero)
    if (fotoUrl) formData.set('foto_url', fotoUrl)
    if (newFile) formData.set('avatar', newFile)

    const result = await actualizarMiPerfilJugador(formData)
    if (!result.success) {
      setError(result.message)
      setUpdating(false)
      return
    }

    setFotoUrl(result.fotoUrl)
    setData((current) =>
      current
        ? {
            perfil: { ...current.perfil, nombre, apellido },
            jugador: current.jugador
              ? {
                  ...current.jugador,
                  nombre,
                  apellido,
                  numeroCamiseta: numero ? Number(numero) : null,
                  fotoUrl: result.fotoUrl,
                }
              : null,
          }
        : current
    )
    setNewFile(null)
    setPreviewUrl(null)
    setIsEditing(false)
    setUpdating(false)
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    )
  }

  if (!data) return null

  const { perfil, jugador } = data
  const nombreCompleto =
    `${nombre} ${apellido}`.trim() || perfil.email?.split('@')[0] || 'Sin nombre'
  const categoria = perfil.categoria || jugador?.categoria || 'General'
  const posicion = perfil.posicion || jugador?.posicion || 'Polivalente'

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Mi perfil atletico</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona tu informacion personal y deportiva.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-black"
          >
            <Pencil size={16} />
            Editar perfil
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="group relative mx-auto mb-5 h-36 w-36 overflow-hidden rounded-3xl border-4 border-white bg-gray-100 shadow-lg">
            {previewUrl || fotoUrl ? (
              <img
                src={previewUrl || fotoUrl || ''}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                <UserRound size={60} />
              </div>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Cambiar foto"
              >
                <Camera size={28} />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <h2 className="text-2xl font-black text-gray-900">{nombreCompleto}</h2>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-red-600">
            Jugador
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <ProfileValue label="Categoria" value={categoria} />
            <ProfileValue label="Posicion" value={posicion} />
          </div>
        </aside>

        <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Datos del jugador</h2>
            <p className="text-sm text-gray-500">{perfil.email}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProfileInput
              label="Nombre"
              value={nombre}
              editing={isEditing}
              onChange={setNombre}
            />
            <ProfileInput
              label="Apellido"
              value={apellido}
              editing={isEditing}
              onChange={setApellido}
            />
            <ProfileInput
              label="Numero de camiseta"
              value={numero}
              editing={isEditing}
              onChange={setNumero}
              type="number"
            />
            <ProfileValue
              label="Fecha de ingreso"
              value={
                jugador?.fechaIngreso
                  ? new Date(jugador.fechaIngreso).toLocaleDateString('es-CO')
                  : 'No registrada'
              }
            />
            <ProfileValue label="Telefono" value={perfil.telefono || 'No registrado'} />
            <ProfileValue
              label="Fecha de nacimiento"
              value={
                perfil.fechaNacimiento
                  ? new Date(perfil.fechaNacimiento).toLocaleDateString('es-CO')
                  : 'No registrada'
              }
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          {isEditing && (
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                onClick={cancelEditing}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-700"
              >
                <X size={16} />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Guardar cambios
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ProfileValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-gray-800">{value}</p>
    </div>
  )
}

function ProfileInput({
  label,
  value,
  editing,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  editing: boolean
  onChange: (value: string) => void
  type?: 'text' | 'number'
}) {
  if (!editing) return <ProfileValue label={label} value={value || 'No registrado'} />

  return (
    <label className="space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <input
        type={type}
        min={type === 'number' ? 1 : undefined}
        max={type === 'number' ? 99 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      />
    </label>
  )
}
