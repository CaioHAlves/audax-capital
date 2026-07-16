'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { createProductSchema, updateProductSchema } from '@/lib/product-schema';
import { api } from '@/lib/api';

type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  productId?: string;
  initialValues?: {
    name: string;
    sku: string;
    price: string;
    stock: string;
  };
}

const emptyValues = { name: '', sku: '', price: '', stock: '' };

export function ProductForm({ mode, productId, initialValues }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isCreate = mode === 'create';

  function update(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    const schema = isCreate ? createProductSchema : updateProductSchema;
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      if (isCreate) {
        const data = parsed.data as z.infer<typeof createProductSchema>;
        await api.createProduct(data);
      } else if (productId) {
        const data = parsed.data as z.infer<typeof updateProductSchema>;
        await api.updateProduct(productId, data);
      }
      router.push('/');
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Erro ao salvar produto',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      {submitError && <div className="alert">{submitError}</div>}

      <div className="field">
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      {isCreate && (
        <div className="field">
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            value={values.sku}
            onChange={(e) => update('sku', e.target.value)}
          />
          {errors.sku && <span className="error">{errors.sku}</span>}
        </div>
      )}

      <div className="field">
        <label htmlFor="price">Preco</label>
        <input
          id="price"
          inputMode="decimal"
          value={values.price}
          onChange={(e) => update('price', e.target.value)}
        />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>

      <div className="field">
        <label htmlFor="stock">Estoque</label>
        <input
          id="stock"
          inputMode="numeric"
          value={values.stock}
          onChange={(e) => update('stock', e.target.value)}
        />
        {errors.stock && <span className="error">{errors.stock}</span>}
      </div>

      <div className="actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
        <Link className="btn" href="/">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !result[key]) {
      result[key] = issue.message;
    }
  }
  return result;
}
