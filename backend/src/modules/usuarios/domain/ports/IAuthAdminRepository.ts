import { RolUsuario } from '../entities/UsuarioEntity';

export interface AuthUserRecord {
  id: string;
  email: string;
  metadata: Record<string, unknown>;
}

export interface CreateAuthUserInput {
  email: string;
  password: string;
  rol: RolUsuario;
  nombre: string;
  apellido: string;
}

export interface IAuthAdminRepository {
  createUser(input: CreateAuthUserInput): Promise<{ id: string }>;
  listUsers(): Promise<AuthUserRecord[]>;
}
