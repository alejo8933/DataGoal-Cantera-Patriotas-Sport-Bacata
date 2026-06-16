import { IMatrizSeguridadRepository } from '../domain/ports/IMatrizSeguridadRepository';
import { MatrizCoordenadas } from '../domain/entities/MatrizSeguridadEntity';
import { AppError } from '../../../shared/errors/AppError';

export class SupabaseMatrizSeguridadRepository implements IMatrizSeguridadRepository {
  constructor(private readonly supabase: { from: (table: string) => any }) {}

  async getByPerfilId(perfilId: string): Promise<MatrizCoordenadas | null> {
    const { data, error } = await this.supabase
      .from('perfiles_matrices')
      .select('matriz_data')
      .eq('perfil_id', perfilId)
      .single();

    if (error || !data) return null;
    return data.matriz_data as MatrizCoordenadas;
  }

  async upsert(perfilId: string, coordenadas: MatrizCoordenadas): Promise<void> {
    const { error } = await this.supabase
      .from('perfiles_matrices')
      .upsert({
        perfil_id: perfilId,
        matriz_data: coordenadas,
        actualizado_en: new Date().toISOString(),
      });

    if (error) throw new AppError('No se pudo guardar la matriz de seguridad.', 500);
  }
}
