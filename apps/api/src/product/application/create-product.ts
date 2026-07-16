import { Product } from '../domain/product';
import { Sku } from '../domain/sku';
import { ProductRepository } from '../domain/product-repository';
import { IdGenerator } from '../domain/id-generator';
import { DuplicateSkuError } from '../domain/product.errors';
import { ProductDto, toProductDto } from './product-dto';

export interface CreateProductInput {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export class CreateProduct {
  constructor(
    private readonly repository: ProductRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreateProductInput): Promise<ProductDto> {
    const sku = Sku.create(input.sku);
    const existing = await this.repository.findBySku(sku);

    if (existing) {
      throw new DuplicateSkuError(sku.value);
    }

    const product = Product.create({
      id: this.idGenerator.generate(),
      name: input.name,
      sku: input.sku,
      price: input.price,
      stock: input.stock,
    });

    await this.repository.save(product);

    return toProductDto(product);
  }
}
