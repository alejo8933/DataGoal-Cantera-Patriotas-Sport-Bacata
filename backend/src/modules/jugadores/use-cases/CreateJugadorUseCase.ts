import { IJugadorRepository } from '../domain/ports/IJugadorRepository';
import { JugadorEntity } from '../domain/entities/JugadorEntity';
import { CreateJugadorDTO } from '../dtos/CreateJugadorDTO';
import { AppError } from '../../../shared/errors/AppError';

export class CreateJugadorUseCase {
  constructor(private readonly repo: IJugadorRepository) {}

  async execute(dto: CreateJugadorDTO): Promise<JugadorEntity> {
    const existente = await this.repo.findByNombreCompleto(dto.nombre, dto.apellido);
    if (existente) {
      throw new AppError(
        `El jugador ${dto.nombre} ${dto.apellido} ya está registrado y activo. Para moverlo, use la función de 'Trasladar'.`,
        409
      );
    }

    const jugador = JugadorEntity.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      posicion: dto.posicion,
      categoriaId: dto.categoriaId,
      equipoId: dto.equipoId,
      numeroCamiseta: dto.numeroCamiseta,
    });

    return this.repo.save(jugador);
  }
}
