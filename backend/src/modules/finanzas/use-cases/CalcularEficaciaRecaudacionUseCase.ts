import { IFacturaRepository } from '../domain/ports/IFacturaRepository';

// Conjunto de estados considerados como factura pagada. Preserva la semántica
// previa del helper legacy en getDashStats (acepta tanto 'Pagado' como 'Pagada').
const ESTADOS_PAGADOS: ReadonlySet<string> = new Set(['Pagado', 'Pagada']);

export class CalcularEficaciaRecaudacionUseCase {
  constructor(private readonly repo: IFacturaRepository) {}

  async execute(): Promise<number> {
    const estados = await this.repo.getEstados();
    const total = estados.length;
    if (total === 0) return 0;
    const pagadas = estados.filter((e) => ESTADOS_PAGADOS.has(e)).length;
    return Math.round((pagadas / total) * 100);
  }
}
