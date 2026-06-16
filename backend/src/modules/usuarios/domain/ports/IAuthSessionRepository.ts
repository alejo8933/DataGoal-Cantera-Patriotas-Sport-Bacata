export interface IAuthSessionRepository {
  getCurrentUserId(): Promise<string | null>;
  updatePassword(password: string): Promise<void>;
}
