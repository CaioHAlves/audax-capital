import { ILike, Repository } from 'typeorm';
import { Product } from '../../../domain/product';
import { Sku } from '../../../domain/sku';
import {
  Page,
  PageQuery,
  ProductRepository,
} from '../../../domain/product-repository';
import { ProductOrmEntity } from './product.orm-entity';
import { toDomain, toOrmEntity } from './product.mapper';

export class TypeOrmProductRepository implements ProductRepository {
  constructor(private readonly repository: Repository<ProductOrmEntity>) {}

  async save(product: Product): Promise<void> {
    await this.repository.save(toOrmEntity(product));
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? toDomain(entity) : null;
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const entity = await this.repository.findOne({
      where: { sku: sku.value },
    });
    return entity ? toDomain(entity) : null;
  }

  async list(query: PageQuery): Promise<Page<Product>> {
    const where = query.search
      ? [
          { name: ILike(`%${query.search}%`) },
          { sku: ILike(`%${query.search}%`) },
        ]
      : undefined;

    const [entities, total] = await this.repository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return {
      items: entities.map(toDomain),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
