'use server'

import {
  crearPartido as crearPartidoAction,
  editarPartido as editarPartidoAction,
} from '@/lib/actions/partidos.actions'

export async function crearPartido(formData: FormData) {
  return crearPartidoAction(formData)
}

export async function editarPartido(formData: FormData) {
  return editarPartidoAction(formData)
}
