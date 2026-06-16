import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity, UsuarioProps } from '../domain/entities/UsuarioEntity';
import { UsuarioMapper } from './UsuarioMapper';
import { AppError } from '../../../shared/errors/AppError';

export class SupabaseUsuarioRepository implements IUsuarioRepository {
  constructor(private readonly supabase: { from: (table: string) => any }) {}

  async getAll(): Promise<UsuarioEntity[]> {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .order('rol');

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map((row: Record<string, unknown>) => UsuarioMapper.toDomain(row));
  }

  async getById(id: string): Promise<UsuarioEntity | null> {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return UsuarioMapper.toDomain(data);
  }

  async getByRol(rol: string): Promise<UsuarioEntity[]> {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('rol', rol)
      .order('nombre', { ascending: true });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map((row: Record<string, unknown>) => UsuarioMapper.toDomain(row));
  }

  async getInactivos(): Promise<UsuarioEntity[]> {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('activo', false);

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map((row: Record<string, unknown>) => UsuarioMapper.toDomain(row));
  }

  async count(): Promise<number> {
    const { count, error } = await this.supabase
      .from('perfiles')
      .select('*', { count: 'exact', head: true });

    if (error) throw new AppError(error.message, 500);
    return count ?? 0;
  }

  async upsert(usuario: UsuarioEntity): Promise<void> {
    const { error } = await this.supabase
      .from('perfiles')
      .upsert([UsuarioMapper.toPersistence(usuario)]);

    if (error) throw new AppError(error.message, 500);
  }

  async update(id: string, data: Partial<UsuarioProps>): Promise<UsuarioEntity> {
    const dbUpdate = UsuarioMapper.toUpdatePersistence({
      nombre: data.nombre,
      apellido: data.apellido,
      rol: data.rol,
      telefono: data.telefono,
      fecha_nacimiento: data.fechaNacimiento,
      posicion: data.posicion,
      categoria: data.categoria,
      genero: data.genero,
      documento: data.documento,
      activo: data.activo,
    });

    const { data: updated, error } = await this.supabase
      .from('perfiles')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return UsuarioMapper.toDomain(updated);
  }
}
