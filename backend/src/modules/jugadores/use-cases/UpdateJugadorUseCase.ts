import { IJugadorRepository } from '../domain/ports/IJugadorRepository';
import { JugadorEntity, JugadorProps } from '../domain/entities/JugadorEntity';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateJugadorUseCase {
  constructor(private readonly repo: IJugadorRepository) {}

  async execute(id: string, data: Partial<Omit<JugadorProps, 'id'>>): Promise<JugadorEntity> {
    const jugador = await this.repo.getById(id);
    if (!jugador) {
      throw new AppError('El jugador no existe.', 404);
    }

    // Validar negocio e invariantes recreando la entidad modificada temporalmente
    new JugadorEntity({
      id: jugador.id,
      nombre: data.nombre !== undefined ? data.nombre : jugador.nombre,
      apellido: data.apellido !== undefined ? data.apellido : jugador.apellido,
      posicion: data.posicion !== undefined ? data.posicion : jugador.posicion,
      categoriaId: data.categoriaId !== undefined ? data.categoriaId : jugador.categoriaId,
      equipoId: data.equipoId !== undefined ? data.equipoId : jugador.equipoId,
      numeroCamiseta: data.numeroCamiseta !== undefined ? data.numeroCamiseta : jugador.numeroCamiseta,
      goles: data.goles !== undefined ? data.goles : jugador.goles,
      asistencias: data.asistencias !== undefined ? data.asistencias : jugador.asistencias,
      tarjetasAmarillas: data.tarjetasAmarillas !== undefined ? data.tarjetasAmarillas : jugador.tarjetasAmarillas,
      tarjetasRojas: data.tarjetasRojas !== undefined ? data.tarjetasRojas : jugador.tarjetasRojas,
      activo: data.activo !== undefined ? data.activo : jugador.activo,
    });

    return this.repo.update(id, data);
  }
}
