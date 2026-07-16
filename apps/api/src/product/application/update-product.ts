import { ProductRepository } from '../domain/product-repository';
import { ProductNotFoundError } from '../domain/product.errors';
import { ProductDto, toProductDto } from './product-dto';

export interface UpdateProductInput {
  name?: string;
  price?: number;
  stock?: number;
}

export class UpdateProduct {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string, input: UpdateProductInput): Promise<ProductDto> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    if (input.name !== undefined) {
      product.rename(input.name);
    }

    if (input.price !== undefined) {
      product.changePrice(input.price);
    }

    if (input.stock !== undefined) {
      product.changeStock(input.stock);
    }

    await this.repository.save(product);

    return toProductDto(product);
  }
}
