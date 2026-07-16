import { ProductRepository } from '../domain/product-repository';
import { ProductNotFoundError } from '../domain/product.errors';
import { ProductDto, toProductDto } from './product-dto';

export class GetProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<ProductDto> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    return toProductDto(product);
  }
}
