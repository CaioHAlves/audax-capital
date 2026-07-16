import Link from 'next/link';
import { ProductForm } from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <div className="header">
        <h1>Novo produto</h1>
        <Link className="btn" href="/">
          Voltar
        </Link>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
