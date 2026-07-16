import { Product } from './product';
import { Sku } from './sku';

export interface PageQuery {
  page: number;
  limit: number;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: Sku): Promise<Product | null>;
  list(query: PageQuery): Promise<Page<Product>>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol('ProductRepository');
