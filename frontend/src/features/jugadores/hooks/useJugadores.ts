'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SupabaseJugadorRepository } from 'datagoal-backend/modules/jugadores/infrastructure/SupabaseJugadorRepository';
import { GetJugadoresUseCase } from 'datagoal-backend/modules/jugadores/use-cases/GetJugadoresUseCase';
import { JugadorMapper } from 'datagoal-backend/modules/jugadores/infrastructure/JugadorMapper';
import type { JugadorResponseDTO } from 'datagoal-backend/modules/jugadores/dtos/JugadorResponseDTO';

export function useJugadores(categoriaId?: string) {
  const [jugadores, setJugadores] = useState<JugadorResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const supabase = createClient();
    const repo = new SupabaseJugadorRepository(supabase);
    const useCase = new GetJugadoresUseCase(repo);

    useCase.execute(categoriaId)
      .then((entities) => {
        if (active) {
          const dtos = entities.map(JugadorMapper.toDTO);
          setJugadores(dtos);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error al cargar jugadores.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [categoriaId]);

  return { jugadores, loading, error };
}
