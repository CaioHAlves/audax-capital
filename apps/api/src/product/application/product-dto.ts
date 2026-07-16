import { Product } from '../domain/product';

export interface ProductDto {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export function toProductDto(product: Product): ProductDto {
  const snapshot = product.toSnapshot();

  return {
    id: snapshot.id,
    name: snapshot.name,
    sku: snapshot.sku,
    price: product.price.toNumber(),
    stock: snapshot.stock,
    createdAt: snapshot.createdAt.toISOString(),
    updatedAt: snapshot.updatedAt.toISOString(),
  };
}
