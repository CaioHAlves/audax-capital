import { DeleteProduct } from './delete-product';
import { CreateProduct } from './create-product';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product-repository';
import { ProductNotFoundError } from '../domain/product.errors';
import { IdGenerator } from '../domain/id-generator';

class StaticIdGenerator implements IdGenerator {
  generate(): string {
    return 'fixed-id';
  }
}

describe('DeleteProduct', () => {
  let repository: InMemoryProductRepository;
  let remove: DeleteProduct;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    remove = new DeleteProduct(repository);
  });

  it('remove um produto existente', async () => {
    const create = new CreateProduct(repository, new StaticIdGenerator());
    await create.execute({ name: 'Mouse', sku: 'MSE-1', price: 50, stock: 5 });

    await remove.execute('fixed-id');

    expect(await repository.findById('fixed-id')).toBeNull();
  });

  it('lanca erro ao remover produto inexistente', async () => {
    await expect(remove.execute('nao-existe')).rejects.toBeInstanceOf(
      ProductNotFoundError,
    );
  });
});
