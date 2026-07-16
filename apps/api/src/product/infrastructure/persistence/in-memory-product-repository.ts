import { Product } from '../../domain/product';
import { Sku } from '../../domain/sku';
import {
  Page,
  PageQuery,
  ProductRepository,
} from '../../domain/product-repository';

export class InMemoryProductRepository implements ProductRepository {
  private readonly products = new Map<string, Product>();

  async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    for (const product of this.products.values()) {
      if (product.sku.equals(sku)) {
        return product;
      }
    }

    return null;
  }

  async list(query: PageQuery): Promise<Page<Product>> {
    const all = [...this.products.values()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const start = (query.page - 1) * query.limit;
    const items = all.slice(start, start + query.limit);

    return { items, total: all.length, page: query.page, limit: query.limit };
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }
}
