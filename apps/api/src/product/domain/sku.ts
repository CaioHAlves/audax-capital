import { InvalidSkuError } from './product.errors';

const SKU_PATTERN = /^[A-Z0-9-]{3,32}$/;

export class Sku {
  private constructor(public readonly value: string) {}

  static create(raw: string): Sku {
    const normalized = raw.trim().toUpperCase();

    if (!SKU_PATTERN.test(normalized)) {
      throw new InvalidSkuError(
        'SKU deve ter de 3 a 32 caracteres alfanumericos ou hifens',
      );
    }

    return new Sku(normalized);
  }

  equals(other: Sku): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
