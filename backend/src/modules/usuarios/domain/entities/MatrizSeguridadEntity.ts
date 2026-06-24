import { AppError } from '../../../../shared/errors/AppError';

export type MatrizCoordenadas = Record<string, string>;

const FILAS = ['A', 'B', 'C', 'D', 'E'];
const COLUMNAS = ['1', '2', '3', '4', '5'];

export class MatrizSeguridadEntity {
  constructor(
    public readonly perfilId: string,
    public readonly coordenadas: MatrizCoordenadas,
    public readonly actualizadoEn: Date
  ) {
    if (!perfilId) throw new AppError('El perfil es obligatorio para la matriz.', 400);
    if (!MatrizSeguridadEntity.esMatrizCompleta(coordenadas)) {
      throw new AppError('La matriz de seguridad está incompleta.', 400);
    }
  }

  static esMatrizCompleta(coordenadas: MatrizCoordenadas): boolean {
    for (const fila of FILAS) {
      for (const col of COLUMNAS) {
        const key = `${fila}${col}`;
        if (!coordenadas[key] || !/^\d{3}$/.test(coordenadas[key])) {
          return false;
        }
      }
    }
    return true;
  }

  static generarAleatoria(): MatrizCoordenadas {
    const matriz: MatrizCoordenadas = {};
    for (const fila of FILAS) {
      for (const col of COLUMNAS) {
        matriz[`${fila}${col}`] = Math.floor(100 + Math.random() * 900).toString();
      }
    }
    return matriz;
  }

  validarReto(reto: MatrizCoordenadas): boolean {
    for (const key of Object.keys(reto)) {
      if (this.coordenadas[key] !== reto[key]) {
        return false;
      }
    }
    return true;
  }

  static create(perfilId: string, coordenadas?: MatrizCoordenadas): MatrizSeguridadEntity {
    const data = coordenadas ?? MatrizSeguridadEntity.generarAleatoria();
    return new MatrizSeguridadEntity(perfilId, data, new Date());
  }
}
