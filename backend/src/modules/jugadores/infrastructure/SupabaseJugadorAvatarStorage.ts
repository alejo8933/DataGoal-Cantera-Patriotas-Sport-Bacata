import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../../shared/errors/AppError';
import {
  IJugadorAvatarStorage,
  JugadorAvatarFile,
} from '../domain/ports/IJugadorAvatarStorage';

export class SupabaseJugadorAvatarStorage implements IJugadorAvatarStorage {
  constructor(private readonly supabase: SupabaseClient<any, any, any>) {}

  async upload(userId: string, file: JugadorAvatarFile): Promise<string> {
    const path = `perfiles/${userId}-${crypto.randomUUID()}.${file.extension}`;
    const { error } = await this.supabase.storage
      .from('jugadores')
      .upload(path, file.bytes, {
        contentType: file.contentType,
        upsert: false,
      });

    if (error) throw new AppError(error.message, 500);

    const { data } = this.supabase.storage
      .from('jugadores')
      .getPublicUrl(path);

    return data.publicUrl;
  }
}
