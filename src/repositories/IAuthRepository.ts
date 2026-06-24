export interface IAuthRepository {
  sendPasswordReset(email: string): Promise<boolean>
}
import type { User, Register } from '@/types/domain/auth.schema'

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>
  register(data: Register):               Promise<void>
  logout():                               Promise<void>
  getUser():                              Promise<User | null>
}