import { TorneoEntity, TorneoProps } from '../entities/TorneoEntity';

export interface ITorneoRepository {
  getAll(): Promise<TorneoEntity[]>;
  getById(id: string): Promise<TorneoEntity | null>;
  getProximos(): Promise<TorneoEntity[]>;
  getHistorial(): Promise<TorneoEntity[]>;
  save(torneo: TorneoEntity): Promise<TorneoEntity>;
  update(id: string, data: Partial<Omit<TorneoProps, 'id'>>): Promise<TorneoEntity>;
  delete(id: string): Promise<void>;
}
