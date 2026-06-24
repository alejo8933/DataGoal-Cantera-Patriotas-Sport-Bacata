import { createClient as createBrowserClient } from '@/lib/supabase/client';
import type { IPlayerRepository } from '@/repositories/IPlayerRepository';
import type { Player, CreatePlayer } from '@/types/domain/player.schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseJugadorRepository } from '@backend/modules/jugadores/infrastructure/SupabaseJugadorRepository';
import { GetJugadoresUseCase } from '@backend/modules/jugadores/use-cases/GetJugadoresUseCase';
import { CreateJugadorUseCase } from '@backend/modules/jugadores/use-cases/CreateJugadorUseCase';
import { UpdateJugadorUseCase } from '@backend/modules/jugadores/use-cases/UpdateJugadorUseCase';
import { DeleteJugadorUseCase } from '@backend/modules/jugadores/use-cases/DeleteJugadorUseCase';
import { JugadorMapper } from '@backend/modules/jugadores/infrastructure/JugadorMapper';

export class SupabasePlayerRepository implements IPlayerRepository {
  constructor(private customClient?: SupabaseClient<any, any, any>) {}

  private getClient() {
    return this.customClient || createBrowserClient();
  }

  private getCleanRepo() {
    return new SupabaseJugadorRepository(this.getClient());
  }

  async getAll(): Promise<Player[]> {
    const useCase = new GetJugadoresUseCase(this.getCleanRepo());
    const entities = await useCase.execute();
    return entities.map((e) => {
      const dto = JugadorMapper.toDTO(e);
      return {
        id: dto.id,
        nombre: dto.nombre,
        apellido: dto.apellido,
        posicion: dto.posicion || '',
        categoria: dto.categoriaId,
        numero_camiseta: dto.numeroCamiseta,
        goles: dto.goles,
        asistencias: dto.asistencias,
        tarjetas_amarillas: dto.tarjetasAmarillas,
        tarjetas_rojas: dto.tarjetasRojas,
      };
    });
  }

  async getById(id: string): Promise<Player | null> {
    const cleanRepo = this.getCleanRepo();
    const entity = await cleanRepo.getById(id);
    if (!entity) return null;
    const dto = JugadorMapper.toDTO(entity);
    return {
      id: dto.id,
      nombre: dto.nombre,
      apellido: dto.apellido,
      posicion: dto.posicion || '',
      categoria: dto.categoriaId,
      numero_camiseta: dto.numeroCamiseta,
      goles: dto.goles,
      asistencias: dto.asistencias,
      tarjetas_amarillas: dto.tarjetasAmarillas,
      tarjetas_rojas: dto.tarjetasRojas,
    };
  }

  async getByCategoria(categoria: string): Promise<Player[]> {
    const useCase = new GetJugadoresUseCase(this.getCleanRepo());
    const entities = await useCase.execute(categoria);
    return entities.map((e) => {
      const dto = JugadorMapper.toDTO(e);
      return {
        id: dto.id,
        nombre: dto.nombre,
        apellido: dto.apellido,
        posicion: dto.posicion || '',
        categoria: dto.categoriaId,
        numero_camiseta: dto.numeroCamiseta,
        goles: dto.goles,
        asistencias: dto.asistencias,
        tarjetas_amarillas: dto.tarjetasAmarillas,
        tarjetas_rojas: dto.tarjetasRojas,
      };
    });
  }

  async create(datos: CreatePlayer): Promise<Player> {
    const useCase = new CreateJugadorUseCase(this.getCleanRepo());
    const entity = await useCase.execute({
      nombre: datos.nombre,
      apellido: datos.apellido,
      posicion: datos.posicion || null,
      categoriaId: datos.categoria,
      equipoId: null,
      numeroCamiseta: datos.numero_camiseta || null,
    });
    const dto = JugadorMapper.toDTO(entity);
    return {
      id: dto.id,
      nombre: dto.nombre,
      apellido: dto.apellido,
      posicion: dto.posicion || '',
      categoria: dto.categoriaId,
      numero_camiseta: dto.numeroCamiseta,
      goles: dto.goles,
      asistencias: dto.asistencias,
      tarjetas_amarillas: dto.tarjetasAmarillas,
      tarjetas_rojas: dto.tarjetasRojas,
    };
  }

  async update(id: string, datos: Partial<CreatePlayer>): Promise<Player> {
    const useCase = new UpdateJugadorUseCase(this.getCleanRepo());
    
    const mapped: any = {};
    if (datos.nombre !== undefined) mapped.nombre = datos.nombre;
    if (datos.apellido !== undefined) mapped.apellido = datos.apellido;
    if (datos.posicion !== undefined) mapped.posicion = datos.posicion || null;
    if (datos.categoria !== undefined) mapped.categoriaId = datos.categoria;
    if (datos.numero_camiseta !== undefined) mapped.numeroCamiseta = datos.numero_camiseta || null;

    const entity = await useCase.execute(id, mapped);
    const dto = JugadorMapper.toDTO(entity);
    return {
      id: dto.id,
      nombre: dto.nombre,
      apellido: dto.apellido,
      posicion: dto.posicion || '',
      categoria: dto.categoriaId,
      numero_camiseta: dto.numeroCamiseta,
      goles: dto.goles,
      asistencias: dto.asistencias,
      tarjetas_amarillas: dto.tarjetasAmarillas,
      tarjetas_rojas: dto.tarjetasRojas,
    };
  }

  async delete(id: string): Promise<void> {
    const useCase = new DeleteJugadorUseCase(this.getCleanRepo());
    await useCase.execute(id);
  }
}