import {
  Page,
  PageQuery,
  ProductRepository,
} from '../domain/product-repository';
import { ProductDto, toProductDto } from './product-dto';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export class ListProducts {
  constructor(private readonly repository: ProductRepository) {}

  async execute(query: Partial<PageQuery>): Promise<Page<ProductDto>> {
    const page = normalize(query.page, 1);
    const limit = Math.min(normalize(query.limit, DEFAULT_LIMIT), MAX_LIMIT);

    const result = await this.repository.list({ page, limit });

    return {
      items: result.items.map(toProductDto),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}

function normalize(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isInteger(value) || value < 1) {
    return fallback;
  }

  return value;
}
