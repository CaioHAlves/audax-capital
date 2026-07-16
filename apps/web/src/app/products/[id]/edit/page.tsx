'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductForm } from '@/components/ProductForm';
import { api } from '@/lib/api';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const { id } = use(params);
  const [values, setValues] = useState<{
    name: string;
    sku: string;
    price: string;
    stock: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getProduct(id)
      .then((product) => {
        if (!active) return;
        setValues({
          name: product.name,
          sku: product.sku,
          price: String(product.price),
          stock: String(product.stock),
        });
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao carregar'),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div>
      <div className="header">
        <h1>Editar produto</h1>
        <Link className="btn" href="/">
          Voltar
        </Link>
      </div>

      {loading && <p className="muted">Carregando...</p>}
      {error && <div className="alert">{error}</div>}
      {!loading && !error && values && (
        <ProductForm mode="edit" productId={id} initialValues={values} />
      )}
    </div>
  );
}
