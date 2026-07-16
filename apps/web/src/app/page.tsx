'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Page, Product } from '@/lib/api';

const LIMIT = 10;

export default function ProductsPage() {
  const [data, setData] = useState<Page<Product> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.listProducts(targetPage, LIMIT);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  async function handleDelete(id: string) {
    if (!confirm('Remover este produto?')) return;
    try {
      await api.deleteProduct(id);
      await load(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;

  return (
    <div>
      <div className="header">
        <h1>Produtos</h1>
        <Link className="btn btn-primary" href="/products/new">
          Novo produto
        </Link>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card">
        {loading ? (
          <p className="muted">Carregando...</p>
        ) : !data || data.items.length === 0 ? (
          <p className="muted">Nenhum produto cadastrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>SKU</th>
                <th>Preco</th>
                <th>Estoque</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="actions">
                      <Link
                        className="btn"
                        href={`/products/${product.id}/edit`}
                      >
                        Editar
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button
            className="btn"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </button>
          <span className="muted">
            Pagina {page} de {totalPages}
          </span>
          <button
            className="btn"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Proxima
          </button>
        </div>
      </div>
    </div>
  );
}

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
