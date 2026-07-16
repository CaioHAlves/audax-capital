import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Catalogo de Produtos',
  description: 'CRUD de produtos com NestJS e Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
