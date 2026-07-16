import { CreateProduct } from './create-product';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product-repository';
import { IdGenerator } from '../domain/id-generator';
import { DuplicateSkuError } from '../domain/product.errors';

class FixedIdGenerator implements IdGenerator {
  private counter = 0;

  generate(): string {
    this.counter += 1;
    return `id-${this.counter}`;
  }
}

const input = {
  name: 'Teclado Mecanico',
  sku: 'kbd-01',
  price: 199.9,
  stock: 10,
};

describe('CreateProduct', () => {
  let repository: InMemoryProductRepository;
  let useCase: CreateProduct;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    useCase = new CreateProduct(repository, new FixedIdGenerator());
  });

  it('cria um produto e o persiste', async () => {
    const result = await useCase.execute(input);

    expect(result.id).toBe('id-1');
    expect(result.sku).toBe('KBD-01');
    expect(result.price).toBe(199.9);

    const stored = await repository.findById('id-1');
    expect(stored).not.toBeNull();
  });

  it('rejeita SKU duplicado ignorando maiusculas', async () => {
    await useCase.execute(input);

    await expect(
      useCase.execute({ ...input, sku: 'KBD-01' }),
    ).rejects.toBeInstanceOf(DuplicateSkuError);
  });
});
