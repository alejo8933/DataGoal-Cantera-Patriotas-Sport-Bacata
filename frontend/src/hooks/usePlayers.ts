'use client'

import { useJugadores } from '@/features/jugadores/hooks/useJugadores';
import type { Player } from '@/types/domain/player.schema';

export function usePlayers(categoria?: string) {
  const { jugadores, loading, error } = useJugadores(categoria);

  const players: Player[] = jugadores.map((j) => ({
    id: j.id,
    nombre: j.nombre,
    apellido: j.apellido,
    posicion: j.posicion || '',
    categoria: j.categoriaId,
    numero_camiseta: j.numeroCamiseta,
    goles: j.goles,
    asistencias: j.asistencias,
    tarjetas_amarillas: j.tarjetasAmarillas,
    tarjetas_rojas: j.tarjetasRojas,
  }));

  return { players, loading, error };
}