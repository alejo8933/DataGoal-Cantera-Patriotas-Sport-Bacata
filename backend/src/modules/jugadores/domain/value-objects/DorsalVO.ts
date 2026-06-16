import { AppError } from '../../../../shared/errors/AppError';

export class DorsalVO {
  private readonly _value: number | null;

  constructor(value: number | null | undefined) {
    if (value === undefined || value === null) {
      this._value = null;
      return;
    }

    if (!Number.isInteger(value) || value < 1 || value > 99) {
      throw new AppError('El número de camiseta debe ser un entero entre 1 y 99.', 400);
    }

    this._value = value;
  }

  get value(): number | null {
    return this._value;
  }
}
