export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export type UpdateProductPayload = Omit<CreateProductPayload, 'sku'>;

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(body?.message ?? 'Erro ao comunicar com a API');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  listProducts(page = 1, limit = 10, search = ''): Promise<Page<Product>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search.trim()) {
      params.set('search', search.trim());
    }

    return fetch(`${BASE_URL}/products?${params.toString()}`, {
      cache: 'no-store',
    }).then((res) => parse<Page<Product>>(res));
  },

  getProduct(id: string): Promise<Product> {
    return fetch(`${BASE_URL}/products/${id}`, { cache: 'no-store' }).then(
      (res) => parse<Product>(res),
    );
  },

  createProduct(payload: CreateProductPayload): Promise<Product> {
    return fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => parse<Product>(res));
  },

  updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
    return fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => parse<Product>(res));
  },

  deleteProduct(id: string): Promise<void> {
    return fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' }).then(
      (res) => parse<void>(res),
    );
  },
};
