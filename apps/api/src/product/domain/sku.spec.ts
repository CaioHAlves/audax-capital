import { Sku } from './sku';
import { InvalidSkuError } from './product.errors';

describe('Sku', () => {
  it('cria um SKU valido e normaliza para maiusculas', () => {
    const sku = Sku.create('ab-123');

    expect(sku.value).toBe('AB-123');
  });

  it('considera iguais dois SKUs com o mesmo valor normalizado', () => {
    expect(Sku.create('ab-123').equals(Sku.create('AB-123'))).toBe(true);
  });

  it('rejeita SKU curto demais', () => {
    expect(() => Sku.create('ab')).toThrow(InvalidSkuError);
  });

  it('rejeita SKU com caracteres invalidos', () => {
    expect(() => Sku.create('ab_123!')).toThrow(InvalidSkuError);
  });

  it('rejeita SKU vazio', () => {
    expect(() => Sku.create('   ')).toThrow(InvalidSkuError);
  });
});
