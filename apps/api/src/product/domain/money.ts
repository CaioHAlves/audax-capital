import { InvalidMoneyError } from './product.errors';

export class Money {
  private constructor(public readonly cents: number) {}

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents) || cents <= 0) {
      throw new InvalidMoneyError('Preco deve ser maior que zero');
    }

    return new Money(cents);
  }

  static fromNumber(value: number): Money {
    if (!Number.isFinite(value)) {
      throw new InvalidMoneyError('Preco deve ser um numero valido');
    }

    return Money.fromCents(Math.round(value * 100));
  }

  toNumber(): number {
    return this.cents / 100;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }
}
