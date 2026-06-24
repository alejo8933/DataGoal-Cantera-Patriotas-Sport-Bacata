export interface IFacturaRepository {
  getEstados(): Promise<string[]>;
}
