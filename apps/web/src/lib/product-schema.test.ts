import { describe, expect, it } from 'vitest';
import { createProductSchema } from './product-schema';

describe('createProductSchema', () => {
  it('aceita um produto valido e converte numeros', () => {
    const result = createProductSchema.safeParse({
      name: 'Teclado',
      sku: 'KBD-1',
      price: '199.90',
      stock: '10',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(199.9);
      expect(result.data.stock).toBe(10);
    }
  });

  it('aceita preco com virgula ou ponto', () => {
    const comma = createProductSchema.safeParse({
      name: 'Teclado',
      sku: 'KBD-1',
      price: '20,13',
      stock: '1',
    });
    const dot = createProductSchema.safeParse({
      name: 'Teclado',
      sku: 'KBD-1',
      price: '21.13',
      stock: '1',
    });

    expect(comma.success).toBe(true);
    expect(dot.success).toBe(true);
    if (comma.success) expect(comma.data.price).toBe(20.13);
    if (dot.success) expect(dot.data.price).toBe(21.13);
  });

  it('rejeita preco com mais de duas casas decimais', () => {
    const result = createProductSchema.safeParse({
      name: 'Teclado',
      sku: 'KBD-1',
      price: '20,135',
      stock: '1',
    });

    expect(result.success).toBe(false);
  });

  it('rejeita preco nao positivo', () => {
    const result = createProductSchema.safeParse({
      name: 'Teclado',
      sku: 'KBD-1',
      price: '0',
      stock: '1',
    });

    expect(result.success).toBe(false);
  });

  it('rejeita SKU invalido', () => {
    const result = createProductSchema.safeParse({
      name: 'Teclado',
      sku: 'ab',
      price: '10',
      stock: '1',
    });

    expect(result.success).toBe(false);
  });
});
