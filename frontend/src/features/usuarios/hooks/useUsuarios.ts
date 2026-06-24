'use client';

import { useState, useEffect } from 'react';
import type { UsuarioResponseDTO } from 'datagoal-backend/modules/usuarios/dtos/UsuarioResponseDTO';
import { obtenerPerfiles } from '@/lib/actions/usuarios.actions';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    obtenerPerfiles()
      .then((data) => {
        if (active) setUsuarios(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error al cargar usuarios.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { usuarios, loading, error };
}
