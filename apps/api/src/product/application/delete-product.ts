import { ProductRepository } from '../domain/product-repository';
import { ProductNotFoundError } from '../domain/product.errors';

export class DeleteProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    await this.repository.delete(id);
  }
}
