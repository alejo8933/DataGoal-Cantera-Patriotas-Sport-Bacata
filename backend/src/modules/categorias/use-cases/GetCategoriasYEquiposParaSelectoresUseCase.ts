import {
  CategoriaMaestraSelectorItem,
  EquipoSelectorItem,
  ICategoriaRepository,
} from '../domain/ports/ICategoriaRepository';

export interface CategoriasYEquiposParaSelectoresResult {
  categoriasMaestras: CategoriaMaestraSelectorItem[];
  equipos: EquipoSelectorItem[];
}

export class GetCategoriasYEquiposParaSelectoresUseCase {
  constructor(private readonly repo: ICategoriaRepository) {}

  async execute(): Promise<CategoriasYEquiposParaSelectoresResult> {
    const [categoriasMaestras, equipos] = await Promise.all([
      this.repo.getCategoriasMaestrasActivasParaSelector(),
      this.repo.getEquiposActivosParaSelector(),
    ]);
    return { categoriasMaestras, equipos };
  }
}
