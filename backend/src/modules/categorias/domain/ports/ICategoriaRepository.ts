export interface CategoriaMaestraSelectorItem {
  id: string;
  nombre: string;
}

export interface EquipoSelectorItem {
  id: string;
  equipo: string;
  categoria_id: string;
}

export interface EquipoInput {
  equipo: string;
  tecnicoId: string | null;
  sede: string;
  fundacion: number;
  categoriaId: string;
  color: string | null;
  horario: string | null;
}

export interface CategoriaMaestraInput {
  nombre: string;
  edades: string | null;
  modalidad: string | null;
}

export interface ICategoriaRepository {
  existeEquipoEnCategoria(equipo: string, categoriaId: string): Promise<boolean>;
  crearEquipo(input: EquipoInput): Promise<void>;
  actualizarEquipo(id: string, input: EquipoInput): Promise<void>;
  crearCategoriaMaestra(input: CategoriaMaestraInput): Promise<void>;
  actualizarCategoriaMaestra(id: string, input: CategoriaMaestraInput): Promise<void>;
  getCategoriasMaestrasActivasParaSelector(): Promise<CategoriaMaestraSelectorItem[]>;
  getEquiposActivosParaSelector(): Promise<EquipoSelectorItem[]>;
}
