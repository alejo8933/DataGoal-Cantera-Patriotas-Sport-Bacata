import { ImpactoEstadisticoEvento } from '../entities/EventoPartidoEntity';

export interface IEstadisticasEventoRepository {
  aplicarImpacto(impacto: ImpactoEstadisticoEvento): Promise<void>;
}
