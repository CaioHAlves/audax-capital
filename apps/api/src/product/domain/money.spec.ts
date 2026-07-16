import { Money } from './money';
import { InvalidMoneyError } from './product.errors';

describe('Money', () => {
  it('cria a partir de um numero decimal e guarda em centavos', () => {
    const price = Money.fromNumber(19.9);

    expect(price.cents).toBe(1990);
    expect(price.toNumber()).toBe(19.9);
  });

  it('arredonda centavos fracionados', () => {
    expect(Money.fromNumber(10.005).cents).toBe(1001);
  });

  it('considera iguais dois valores com os mesmos centavos', () => {
    expect(Money.fromNumber(5).equals(Money.fromNumber(5))).toBe(true);
  });

  it('rejeita preco zero', () => {
    expect(() => Money.fromNumber(0)).toThrow(InvalidMoneyError);
  });

  it('rejeita preco negativo', () => {
    expect(() => Money.fromNumber(-1)).toThrow(InvalidMoneyError);
  });

  it('rejeita valor nao finito', () => {
    expect(() => Money.fromNumber(Number.NaN)).toThrow(InvalidMoneyError);
  });
});
