import { Product } from '../../../domain/product';
import { ProductOrmEntity } from './product.orm-entity';

export function toOrmEntity(product: Product): ProductOrmEntity {
  const snapshot = product.toSnapshot();
  const entity = new ProductOrmEntity();

  entity.id = snapshot.id;
  entity.name = snapshot.name;
  entity.sku = snapshot.sku;
  entity.priceInCents = snapshot.priceInCents;
  entity.stock = snapshot.stock;
  entity.createdAt = snapshot.createdAt;
  entity.updatedAt = snapshot.updatedAt;

  return entity;
}

export function toDomain(entity: ProductOrmEntity): Product {
  return Product.reconstitute({
    id: entity.id,
    name: entity.name,
    sku: entity.sku,
    priceInCents: entity.priceInCents,
    stock: entity.stock,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  });
}
