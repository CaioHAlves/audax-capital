import { UpdateProduct } from './update-product';
import { CreateProduct } from './create-product';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product-repository';
import {
  NegativeStockError,
  ProductNotFoundError,
} from '../domain/product.errors';
import { IdGenerator } from '../domain/id-generator';

class StaticIdGenerator implements IdGenerator {
  generate(): string {
    return 'fixed-id';
  }
}

describe('UpdateProduct', () => {
  let repository: InMemoryProductRepository;
  let update: UpdateProduct;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    update = new UpdateProduct(repository);
    const create = new CreateProduct(repository, new StaticIdGenerator());
    await create.execute({
      name: 'Teclado',
      sku: 'KBD-1',
      price: 100,
      stock: 10,
    });
  });

  it('atualiza nome, preco e estoque mantendo o SKU', async () => {
    const result = await update.execute('fixed-id', {
      name: 'Teclado Pro',
      price: 150,
      stock: 4,
    });

    expect(result.name).toBe('Teclado Pro');
    expect(result.price).toBe(150);
    expect(result.stock).toBe(4);
    expect(result.sku).toBe('KBD-1');
  });

  it('aplica atualizacao parcial', async () => {
    const result = await update.execute('fixed-id', { stock: 0 });

    expect(result.stock).toBe(0);
    expect(result.name).toBe('Teclado');
  });

  it('rejeita estoque negativo', async () => {
    await expect(
      update.execute('fixed-id', { stock: -1 }),
    ).rejects.toBeInstanceOf(NegativeStockError);
  });

  it('lanca erro quando o produto nao existe', async () => {
    await expect(
      update.execute('nao-existe', { name: 'x' }),
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });
});
