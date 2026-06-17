'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SupabaseUsuarioRepository } from '@backend/modules/usuarios/infrastructure/SupabaseUsuarioRepository';
import { SupabaseAuthAdminRepository } from '@backend/modules/usuarios/infrastructure/SupabaseAuthAdminRepository';
import { SupabaseMatrizSeguridadRepository } from '@backend/modules/usuarios/infrastructure/SupabaseMatrizSeguridadRepository';
import { SupabaseAuthSessionRepository } from '@backend/modules/usuarios/infrastructure/SupabaseAuthSessionRepository';
import { UsuarioMapper } from '@backend/modules/usuarios/infrastructure/UsuarioMapper';
import { GetPerfilesUseCase } from '@backend/modules/usuarios/use-cases/GetPerfilesUseCase';
import { GetPerfilByIdUseCase } from '@backend/modules/usuarios/use-cases/GetPerfilByIdUseCase';
import { GetPerfilesCountUseCase } from '@backend/modules/usuarios/use-cases/GetPerfilesCountUseCase';
import { CreateUsuarioUseCase } from '@backend/modules/usuarios/use-cases/CreateUsuarioUseCase';
import { UpdateUsuarioUseCase } from '@backend/modules/usuarios/use-cases/UpdateUsuarioUseCase';
import { SyncPerfilesUseCase } from '@backend/modules/usuarios/use-cases/SyncPerfilesUseCase';
import { SyncUserProfileUseCase } from '@backend/modules/usuarios/use-cases/SyncUserProfileUseCase';
import { UpdateMiPerfilUseCase } from '@backend/modules/usuarios/use-cases/UpdateMiPerfilUseCase';
import { ValidarCodigoRegistroUseCase } from '@backend/modules/usuarios/use-cases/ValidarCodigoRegistroUseCase';
import { GenerarMatrizUsuarioUseCase } from '@backend/modules/usuarios/use-cases/GenerarMatrizUsuarioUseCase';
import { ObtenerMatrizUsuarioUseCase } from '@backend/modules/usuarios/use-cases/ObtenerMatrizUsuarioUseCase';
import { ValidarRetoMatrizUseCase } from '@backend/modules/usuarios/use-cases/ValidarRetoMatrizUseCase';
import { GetPerfilesByRolUseCase } from '@backend/modules/usuarios/use-cases/GetPerfilesByRolUseCase';
import {
  GetDestinatarioIdsUseCase,
  type RolDestino,
} from '@backend/modules/usuarios/use-cases/GetDestinatarioIdsUseCase';
import { CambiarPasswordUseCase } from '@backend/modules/usuarios/use-cases/CambiarPasswordUseCase';
import { AppError } from '@backend/shared/errors/AppError';
import type { UsuarioResponseDTO, PerfilResumenDTO } from '@backend/modules/usuarios/dtos/UsuarioResponseDTO';
import type { RolUsuario } from '@backend/modules/usuarios/domain/entities/UsuarioEntity';
import type { MatrixData } from './usuarios.types';

function getUsuarioRepo(supabase: Awaited<ReturnType<typeof createClient>>) {
  return new SupabaseUsuarioRepository(supabase);
}

function getAdminRepos() {
  const adminClient = createAdminClient();
  return {
    usuarioRepo: new SupabaseUsuarioRepository(adminClient),
    authAdminRepo: new SupabaseAuthAdminRepository(adminClient),
  };
}

function handleError(error: unknown, fallback: string) {
  if (error instanceof AppError) {
    return { success: false as const, message: error.message };
  }
  if (error instanceof Error && error.message.includes('Service Role')) {
    return { success: false as const, message: error.message };
  }
  console.error(fallback, error);
  return { success: false as const, message: fallback };
}

export async function obtenerPerfiles(): Promise<UsuarioResponseDTO[]> {
  try {
    const supabase = await createClient();
    const useCase = new GetPerfilesUseCase(getUsuarioRepo(supabase));
    const perfiles = await useCase.execute();
    return perfiles.map(UsuarioMapper.toDTO);
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
    return [];
  }
}

export async function obtenerPerfilesInactivos(): Promise<UsuarioResponseDTO[]> {
  try {
    const supabase = await createClient();
    const useCase = new GetPerfilesUseCase(getUsuarioRepo(supabase));
    const perfiles = await useCase.execute(true);
    return perfiles.map(UsuarioMapper.toDTO);
  } catch (error) {
    console.error('Error al obtener perfiles inactivos:', error);
    return [];
  }
}

export async function obtenerPerfilActual(): Promise<UsuarioResponseDTO | null> {
  try {
    const supabase = await createClient();
    const sessionRepo = new SupabaseAuthSessionRepository(supabase);
    const userId = await sessionRepo.getCurrentUserId();
    if (!userId) return null;

    const useCase = new GetPerfilByIdUseCase(getUsuarioRepo(supabase));
    const perfil = await useCase.execute(userId);
    return perfil ? UsuarioMapper.toDTO(perfil) : null;
  } catch (error) {
    console.error('Error al obtener perfil actual:', error);
    return null;
  }
}

export async function contarPerfiles(): Promise<number> {
  try {
    const supabase = await createClient();
    const useCase = new GetPerfilesCountUseCase(getUsuarioRepo(supabase));
    return await useCase.execute();
  } catch {
    return 0;
  }
}

export async function getUserProfile(userId: string): Promise<PerfilResumenDTO | null> {
  try {
    const { usuarioRepo } = getAdminRepos();
    const useCase = new GetPerfilByIdUseCase(usuarioRepo);
    const perfil = await useCase.execute(userId);
    return perfil ? UsuarioMapper.toResumen(perfil) : null;
  } catch {
    return null;
  }
}

export async function crearUsuario(formData: FormData) {
  try {
    const { authAdminRepo, usuarioRepo } = getAdminRepos();
    const useCase = new CreateUsuarioUseCase(authAdminRepo, usuarioRepo);

    const rol = formData.get('rol')?.toString().trim() ?? '';
    await useCase.execute({
      email: formData.get('email')?.toString().trim() ?? '',
      password: formData.get('password')?.toString().trim() ?? '',
      rol: rol as RolUsuario,
      nombre: formData.get('nombre')?.toString().trim() ?? '',
      apellido: formData.get('apellido')?.toString().trim() ?? '',
      telefono: formData.get('telefono')?.toString().trim() || null,
      fechaNacimiento: formData.get('fecha_nacimiento')?.toString() || null,
      posicion: formData.get('posicion')?.toString() || null,
      categoria: formData.get('categoria')?.toString() || null,
    });

    revalidatePath('/dashboard/admin/usuarios');
    return {
      success: true,
      message: `Perfil de ${rol} creado exitosamente.`,
    };
  } catch (error) {
    return handleError(error, 'Error del servidor al crear usuario.');
  }
}

export async function editarUsuario(formData: FormData) {
  try {
    const { usuarioRepo } = getAdminRepos();
    const useCase = new UpdateUsuarioUseCase(usuarioRepo);

    const id = formData.get('id')?.toString() ?? '';
    const rol = formData.get('rol')?.toString().trim() ?? '';

    await useCase.execute(id, {
      nombre: formData.get('nombre')?.toString().trim() || null,
      apellido: formData.get('apellido')?.toString().trim() || null,
      rol: rol as RolUsuario,
      telefono: formData.get('telefono')?.toString().trim() || null,
      fechaNacimiento: formData.get('fecha_nacimiento')?.toString() || null,
      posicion: formData.get('posicion')?.toString() || null,
      categoria: formData.get('categoria')?.toString() || null,
    });

    revalidatePath('/dashboard/admin/usuarios');
    return { success: true, message: 'Perfil de usuario actualizado con éxito.' };
  } catch (error) {
    return handleError(error, 'No se pudo actualizar el perfil técnico.');
  }
}

export async function sincronizarPerfiles() {
  try {
    const { authAdminRepo, usuarioRepo } = getAdminRepos();
    const useCase = new SyncPerfilesUseCase(authAdminRepo, usuarioRepo);
    const { sincronizados } = await useCase.execute();

    revalidatePath('/dashboard/admin/usuarios');
    return { success: true, message: `Se han sincronizado ${sincronizados} usuarios.` };
  } catch (error) {
    return handleError(error, 'Error en la sincronización.');
  }
}

export async function syncUserProfile(profileData: {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
  posicion?: string | null;
  categoria?: string | null;
}) {
  try {
    const { usuarioRepo } = getAdminRepos();
    const useCase = new SyncUserProfileUseCase(usuarioRepo);
    await useCase.execute({
      id: profileData.id,
      email: profileData.email,
      nombre: profileData.nombre,
      apellido: profileData.apellido,
      rol: profileData.rol,
      telefono: profileData.telefono,
      fechaNacimiento: profileData.fecha_nacimiento,
      posicion: profileData.posicion,
      categoria: profileData.categoria,
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof AppError ? error.message : 'Error al sincronizar perfil';
    return { success: false, error: message };
  }
}

export async function actualizarMiPerfil(formData: FormData) {
  try {
    const supabase = await createClient();
    const sessionRepo = new SupabaseAuthSessionRepository(supabase);
    const userId = await sessionRepo.getCurrentUserId();
    if (!userId) return { success: false, message: 'Sesión no válida.' };

    const useCase = new UpdateMiPerfilUseCase(getUsuarioRepo(supabase));
    await useCase.execute(userId, {
      nombre: formData.get('nombre')?.toString().trim() ?? '',
      apellido: formData.get('apellido')?.toString().trim() ?? '',
      telefono: formData.get('telefono')?.toString().trim() || null,
      genero: formData.get('genero')?.toString() || null,
      documento: formData.get('documento')?.toString().trim() || null,
      fechaNacimiento: formData.get('fecha_nacimiento')?.toString() || null,
    });

    revalidatePath('/dashboard', 'layout');
    return { success: true, message: 'Perfil actualizado correctamente.' };
  } catch (error) {
    return handleError(error, 'No se pudieron guardar los cambios.');
  }
}

export async function cambiarPassword(formData: FormData) {
  try {
    const supabase = await createClient();
    const sessionRepo = new SupabaseAuthSessionRepository(supabase);
    const useCase = new CambiarPasswordUseCase(sessionRepo);

    await useCase.execute(
      formData.get('password')?.toString() ?? '',
      formData.get('confirmPassword')?.toString() ?? ''
    );

    return { success: true, message: 'Contraseña actualizada correctamente.' };
  } catch (error) {
    return handleError(error, 'Error al actualizar la contraseña.');
  }
}

export async function validarCodigoRegistro(rol: string, codigo: string) {
  try {
    const useCase = new ValidarCodigoRegistroUseCase({
      codeAdmin: process.env.REGISTRY_CODE_ADMIN,
      codeTrainer: process.env.REGISTRY_CODE_TRAINER,
    });
    useCase.execute(rol, codigo);
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'Error al validar el código.' };
  }
}

export async function generarMatrizUsuario() {
  try {
    const supabase = await createClient();
    const sessionRepo = new SupabaseAuthSessionRepository(supabase);
    const matrizRepo = new SupabaseMatrizSeguridadRepository(supabase);
    const useCase = new GenerarMatrizUsuarioUseCase(sessionRepo, matrizRepo);
    const matrix = await useCase.execute();

    revalidatePath('/dashboard/admin/perfil/seguridad');
    return { success: true, matrix };
  } catch (error) {
    return handleError(error, 'No se pudo generar la matriz.');
  }
}

export async function obtenerMatrizUsuario() {
  try {
    const supabase = await createClient();
    const sessionRepo = new SupabaseAuthSessionRepository(supabase);
    const matrizRepo = new SupabaseMatrizSeguridadRepository(supabase);
    const useCase = new ObtenerMatrizUsuarioUseCase(sessionRepo, matrizRepo);
    const matrix = await useCase.execute();
    return { success: true, matrix };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'No tienes una matriz de seguridad activa.' };
  }
}

export async function validarRetoMatriz(reto: MatrixData) {
  try {
    const supabase = await createClient();
    const sessionRepo = new SupabaseAuthSessionRepository(supabase);
    const matrizRepo = new SupabaseMatrizSeguridadRepository(supabase);
    const useCase = new ValidarRetoMatrizUseCase(sessionRepo, matrizRepo);
    await useCase.execute(reto);
    return { success: true, message: 'Validación exitosa.' };
  } catch (error) {
    return handleError(error, 'Error de validación.');
  }
}

export async function actualizarPerfilJugador(data: {
  nombre: string;
  apellido: string;
}) {
  try {
    const supabase = await createClient();
    const sessionRepo = new SupabaseAuthSessionRepository(supabase);
    const userId = await sessionRepo.getCurrentUserId();
    if (!userId) return { success: false, message: 'Sesión no válida.' };

    const useCase = new UpdateMiPerfilUseCase(getUsuarioRepo(supabase));
    await useCase.execute(userId, {
      nombre: data.nombre,
      apellido: data.apellido,
    });

    revalidatePath('/dashboard/jugador/perfil');
    return { success: true };
  } catch (error) {
    return handleError(error, 'No se pudo actualizar el perfil.');
  }
}

export async function obtenerEntrenadores(): Promise<Array<{ id: string; nombre: string; apellido: string }>> {
  try {
    const supabase = await createClient();
    const useCase = new GetPerfilesByRolUseCase(getUsuarioRepo(supabase));
    const entrenadores = await useCase.execute('entrenador');
    return entrenadores.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      apellido: e.apellido,
    }));
  } catch (error) {
    console.error('Error al obtener entrenadores:', error);
    return [];
  }
}

export async function obtenerIdsPorRol(destino: RolDestino): Promise<string[]> {
  try {
    const supabase = await createClient();
    const sessionRepo = new SupabaseAuthSessionRepository(supabase);
    const solicitanteId = await sessionRepo.getCurrentUserId();
    if (!solicitanteId) return [];

    const { usuarioRepo } = getAdminRepos();
    const solicitante = await new GetPerfilByIdUseCase(usuarioRepo).execute(
      solicitanteId
    );
    if (!solicitante) return [];

    const useCase = new GetDestinatarioIdsUseCase(usuarioRepo);
    return await useCase.execute(solicitante.rol, destino);
  } catch (error) {
    console.error('Error al obtener destinatarios:', error);
    return [];
  }
}

export async function obtenerPerfilPorId(userId: string): Promise<UsuarioResponseDTO | null> {
  try {
    const supabase = await createClient();
    const useCase = new GetPerfilByIdUseCase(getUsuarioRepo(supabase));
    const perfil = await useCase.execute(userId);
    return perfil ? UsuarioMapper.toDTO(perfil) : null;
  } catch {
    return null;
  }
}

