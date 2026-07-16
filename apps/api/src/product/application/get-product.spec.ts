import { GetProduct } from './get-product';
import { CreateProduct } from './create-product';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product-repository';
import { ProductNotFoundError } from '../domain/product.errors';
import { IdGenerator } from '../domain/id-generator';

class StaticIdGenerator implements IdGenerator {
  generate(): string {
    return 'fixed-id';
  }
}

describe('GetProduct', () => {
  let repository: InMemoryProductRepository;
  let get: GetProduct;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    get = new GetProduct(repository);
  });

  it('retorna o produto pelo id', async () => {
    const create = new CreateProduct(repository, new StaticIdGenerator());
    await create.execute({ name: 'Mouse', sku: 'MSE-1', price: 50, stock: 5 });

    const result = await get.execute('fixed-id');

    expect(result.name).toBe('Mouse');
  });

  it('lanca erro quando o produto nao existe', async () => {
    await expect(get.execute('nao-existe')).rejects.toBeInstanceOf(
      ProductNotFoundError,
    );
  });
});
