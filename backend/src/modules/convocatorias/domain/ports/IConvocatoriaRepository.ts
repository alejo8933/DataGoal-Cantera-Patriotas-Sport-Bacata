export interface ConvocatoriaReadModel {
  id: string;
  notas: string;
  convocadosIds: string[];
}

export interface UpsertConvocatoriaInput {
  partidoId: string;
  jugadorIds: string[];
  notas: string;
}

export interface IConvocatoriaRepository {
  getByPartidoId(partidoId: string): Promise<ConvocatoriaReadModel | null>;
  upsertConvocatoria(input: UpsertConvocatoriaInput): Promise<string>;
}
