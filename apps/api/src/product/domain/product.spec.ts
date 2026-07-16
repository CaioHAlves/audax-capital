import { Product } from './product';
import {
  InvalidProductNameError,
  NegativeStockError,
} from './product.errors';

const baseProps = {
  id: 'prod-1',
  name: 'Teclado Mecanico',
  sku: 'kbd-01',
  price: 199.9,
  stock: 10,
};

describe('Product', () => {
  it('cria um produto valido normalizando SKU e preco', () => {
    const product = Product.create(baseProps);

    expect(product.id).toBe('prod-1');
    expect(product.name).toBe('Teclado Mecanico');
    expect(product.sku.value).toBe('KBD-01');
    expect(product.price.toNumber()).toBe(199.9);
    expect(product.stock).toBe(10);
  });

  it('rejeita nome vazio', () => {
    expect(() => Product.create({ ...baseProps, name: '  ' })).toThrow(
      InvalidProductNameError,
    );
  });

  it('rejeita estoque negativo na criacao', () => {
    expect(() => Product.create({ ...baseProps, stock: -1 })).toThrow(
      NegativeStockError,
    );
  });

  it('permite renomear e alterar preco e estoque', () => {
    const product = Product.create(baseProps);

    product.rename('Teclado Gamer');
    product.changePrice(249.9);
    product.changeStock(3);

    expect(product.name).toBe('Teclado Gamer');
    expect(product.price.toNumber()).toBe(249.9);
    expect(product.stock).toBe(3);
  });

  it('rejeita alterar estoque para valor negativo', () => {
    const product = Product.create(baseProps);

    expect(() => product.changeStock(-5)).toThrow(NegativeStockError);
  });

  it('reconstroi a partir de um snapshot sem revalidar identidade', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const product = Product.reconstitute({
      id: 'prod-9',
      name: 'Mouse',
      sku: 'MSE-01',
      priceInCents: 5000,
      stock: 2,
      createdAt: now,
      updatedAt: now,
    });

    expect(product.sku.value).toBe('MSE-01');
    expect(product.price.cents).toBe(5000);
  });
});
