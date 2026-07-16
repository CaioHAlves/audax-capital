import { ListProducts } from './list-products';
import { CreateProduct } from './create-product';
import { InMemoryProductRepository } from '../infrastructure/persistence/in-memory-product-repository';
import { IdGenerator } from '../domain/id-generator';

class SequentialIdGenerator implements IdGenerator {
  private counter = 0;

  generate(): string {
    this.counter += 1;
    return `id-${this.counter}`;
  }
}

describe('ListProducts', () => {
  let repository: InMemoryProductRepository;
  let list: ListProducts;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    const create = new CreateProduct(repository, new SequentialIdGenerator());
    list = new ListProducts(repository);

    for (let i = 1; i <= 3; i += 1) {
      await create.execute({
        name: `Produto ${i}`,
        sku: `SKU-${i}`,
        price: i * 10,
        stock: i,
      });
    }
  });

  it('retorna a pagina com total de itens', async () => {
    const result = await list.execute({ page: 1, limit: 2 });

    expect(result.total).toBe(3);
    expect(result.items).toHaveLength(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
  });

  it('retorna a pagina seguinte', async () => {
    const result = await list.execute({ page: 2, limit: 2 });

    expect(result.items).toHaveLength(1);
  });

  it('aplica valores padrao para paginacao invalida', async () => {
    const result = await list.execute({ page: 0, limit: -5 });

    expect(result.page).toBe(1);
    expect(result.limit).toBeGreaterThan(0);
  });
});
