'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { SupabaseJugadorRepository } from 'datagoal-backend/modules/jugadores/infrastructure/SupabaseJugadorRepository';
import { CreateJugadorUseCase } from 'datagoal-backend/modules/jugadores/use-cases/CreateJugadorUseCase';
import { UpdateJugadorUseCase } from 'datagoal-backend/modules/jugadores/use-cases/UpdateJugadorUseCase';
import { TransferirJugadorUseCase } from 'datagoal-backend/modules/jugadores/use-cases/TransferirJugadorUseCase';
import { JugadorMapper } from 'datagoal-backend/modules/jugadores/infrastructure/JugadorMapper';
import { GetJugadoresUseCase } from 'datagoal-backend/modules/jugadores/use-cases/GetJugadoresUseCase';
import { SupabasePerfilJugadorRepository } from 'datagoal-backend/modules/jugadores/infrastructure/SupabasePerfilJugadorRepository';
import { SupabaseJugadorAvatarStorage } from 'datagoal-backend/modules/jugadores/infrastructure/SupabaseJugadorAvatarStorage';
import { GetMiPerfilJugadorUseCase } from 'datagoal-backend/modules/jugadores/use-cases/GetMiPerfilJugadorUseCase';
import { UpdateMiPerfilJugadorUseCase } from 'datagoal-backend/modules/jugadores/use-cases/UpdateMiPerfilJugadorUseCase';
import { SupabaseUsuarioRepository } from 'datagoal-backend/modules/usuarios/infrastructure/SupabaseUsuarioRepository';
import { SupabaseAuthSessionRepository } from 'datagoal-backend/modules/usuarios/infrastructure/SupabaseAuthSessionRepository';
import { UsuarioMapper } from 'datagoal-backend/modules/usuarios/infrastructure/UsuarioMapper';
import type { MiPerfilJugadorResponseDTO } from 'datagoal-backend/modules/jugadores/dtos/PerfilJugadorResponseDTO';
import { AppError } from 'datagoal-backend/shared/errors/AppError';

function getPerfilJugadorDependencies(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  return {
    sessionRepo: new SupabaseAuthSessionRepository(supabase),
    usuarioRepo: new SupabaseUsuarioRepository(supabase),
    perfilJugadorRepo: new SupabasePerfilJugadorRepository(supabase),
    avatarStorage: new SupabaseJugadorAvatarStorage(supabase),
  };
}

export async function obtenerMiPerfilJugador(): Promise<MiPerfilJugadorResponseDTO | null> {
  try {
    const supabase = await createClient();
    const { sessionRepo, usuarioRepo, perfilJugadorRepo } =
      getPerfilJugadorDependencies(supabase);
    const useCase = new GetMiPerfilJugadorUseCase(
      sessionRepo,
      usuarioRepo,
      perfilJugadorRepo
    );
    const result = await useCase.execute();
    if (!result) return null;

    return {
      perfil: UsuarioMapper.toDTO(result.perfil),
      jugador: result.jugador
        ? {
            id: result.jugador.id,
            userId: result.jugador.userId,
            nombre: result.jugador.nombre,
            apellido: result.jugador.apellido,
            posicion: result.jugador.posicion,
            categoria: result.jugador.categoria,
            numeroCamiseta: result.jugador.numeroCamiseta,
            fotoUrl: result.jugador.fotoUrl,
            fechaIngreso: result.jugador.fechaIngreso,
          }
        : null,
    };
  } catch (error) {
    console.error('Error al obtener el perfil del jugador:', error);
    return null;
  }
}

export async function actualizarMiPerfilJugador(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      sessionRepo,
      usuarioRepo,
      perfilJugadorRepo,
      avatarStorage,
    } = getPerfilJugadorDependencies(supabase);
    const useCase = new UpdateMiPerfilJugadorUseCase(
      sessionRepo,
      usuarioRepo,
      perfilJugadorRepo,
      avatarStorage
    );

    const numeroRaw = formData.get('numero_camiseta')?.toString().trim();
    const avatarValue = formData.get('avatar');
    const avatar =
      avatarValue instanceof File && avatarValue.size > 0
        ? {
            bytes: new Uint8Array(await avatarValue.arrayBuffer()),
            contentType: avatarValue.type,
          }
        : undefined;

    const fotoUrl = await useCase.execute({
      nombre: formData.get('nombre')?.toString() ?? '',
      apellido: formData.get('apellido')?.toString() ?? '',
      numeroCamiseta: numeroRaw ? Number(numeroRaw) : null,
      fotoUrl: formData.get('foto_url')?.toString() || null,
      avatar,
    });

    revalidatePath('/dashboard/jugador/perfil');
    return {
      success: true as const,
      message: 'Perfil sincronizado con exito.',
      fotoUrl,
    };
  } catch (error) {
    const message =
      error instanceof AppError
        ? error.message
        : 'No se pudo actualizar el perfil.';
    return { success: false as const, message };
  }
}

export async function obtenerJugadoresActivos() {
  try {
    const supabase = await createClient();
    const repo = new SupabaseJugadorRepository(supabase);
    const useCase = new GetJugadoresUseCase(repo);
    const jugadores = await useCase.execute();
    return jugadores
      .filter((j) => j.activo)
      .map((j) => ({
        id: j.id,
        nombre: j.nombre,
        apellido: j.apellido,
        numero_camiseta: j.numeroCamiseta,
        posicion: j.posicion,
      }));
  } catch (error) {
    console.error('Error al obtener jugadores activos:', error);
    return [];
  }
}

export async function crearJugador(formData: FormData) {
  try {
    const supabase = await createClient();
    const repo = new SupabaseJugadorRepository(supabase);
    const useCase = new CreateJugadorUseCase(repo);

    const nombre = formData.get('nombre')?.toString().trim();
    const apellido = formData.get('apellido')?.toString().trim();
    const posicion = formData.get('posicion')?.toString().trim() || null;
    const categoriaId = formData.get('categoria_id')?.toString().trim();
    const equipoId = formData.get('equipo_id')?.toString().trim() || null;
    const numeroCamisetaRaw = formData.get('numero_camiseta');
    const numeroCamiseta = numeroCamisetaRaw ? parseInt(numeroCamisetaRaw.toString(), 10) : null;

    if (!nombre || !apellido || !categoriaId) {
      return {
        success: false,
        message: 'Nombre, Apellido y Categoría Maestra son campos estrictamente obligatorios.',
      };
    }

    const jugador = await useCase.execute({
      nombre,
      apellido,
      posicion,
      categoriaId,
      equipoId,
      numeroCamiseta,
    });

    revalidatePath('/dashboard/admin/jugadores');

    return {
      success: true,
      message: 'Jugador creado exitosamente.',
      data: [JugadorMapper.toDTO(jugador)],
    };
  } catch (error: any) {
    console.error('Error insertando jugador:', error);
    return {
      success: false,
      message: error.message || 'Ha ocurrido un error insertando al jugador en la base de datos.',
    };
  }
}

export async function editarJugador(formData: FormData) {
  try {
    const supabase = await createClient();
    const repo = new SupabaseJugadorRepository(supabase);
    const useCase = new UpdateJugadorUseCase(repo);

    const id = formData.get('id')?.toString();
    const nombre = formData.get('nombre')?.toString().trim();
    const apellido = formData.get('apellido')?.toString().trim();
    const posicion = formData.get('posicion')?.toString().trim() || null;
    const categoriaId = formData.get('categoria_id')?.toString().trim();
    const equipoId = formData.get('equipo_id')?.toString().trim() || null;
    const numeroCamisetaRaw = formData.get('numero_camiseta');
    const golesRaw = formData.get('goles');

    if (!id || !nombre || !apellido || !categoriaId) {
      return {
        success: false,
        message: 'ID, Nombre, Apellido y Categoría son campos obligatorios.',
      };
    }

    const numeroCamiseta = numeroCamisetaRaw ? parseInt(numeroCamisetaRaw.toString(), 10) : null;
    const goles = golesRaw ? parseInt(golesRaw.toString(), 10) : 0;

    await useCase.execute(id, {
      nombre,
      apellido,
      posicion,
      categoriaId,
      equipoId,
      numeroCamiseta,
      goles,
    });

    revalidatePath('/dashboard/admin/jugadores');

    return {
      success: true,
      message: 'Jugador actualizado correctamente.',
    };
  } catch (error: any) {
    console.error('Error editando jugador:', error);
    return {
      success: false,
      message: error.message || 'Error al actualizar el jugador.',
    };
  }
}

export async function transferirJugador(id: string, nuevaCategoria: string) {
  try {
    if (!id || !nuevaCategoria) {
      return { success: false, message: 'Datos incompletos.' };
    }

    const supabase = await createClient();
    const repo = new SupabaseJugadorRepository(supabase);
    const useCase = new TransferirJugadorUseCase(repo);

    await useCase.execute(id, nuevaCategoria);

    revalidatePath('/dashboard/admin/jugadores');
    return { success: true, message: 'Traslado completado exitosamente.' };
  } catch (error: any) {
    console.error('Error trasladando jugador:', error);
    return { success: false, message: error.message || 'No se pudo completar el traslado.' };
  }
}
