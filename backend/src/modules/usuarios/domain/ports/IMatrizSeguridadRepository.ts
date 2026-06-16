import { MatrizCoordenadas } from '../entities/MatrizSeguridadEntity';

export interface IMatrizSeguridadRepository {
  getByPerfilId(perfilId: string): Promise<MatrizCoordenadas | null>;
  upsert(perfilId: string, coordenadas: MatrizCoordenadas): Promise<void>;
}
