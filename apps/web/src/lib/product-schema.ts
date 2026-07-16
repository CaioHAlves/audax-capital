import { z } from 'zod';

const price = z
  .string({ invalid_type_error: 'Preco deve ser um numero' })
  .trim()
  .transform((value) => value.replace(',', '.'))
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), {
    message: 'Preco deve ter no maximo duas casas decimais',
  })
  .transform(Number)
  .refine((value) => value > 0, 'Preco deve ser maior que zero');

const stock = z.coerce
  .number({ invalid_type_error: 'Estoque deve ser um numero' })
  .int('Estoque deve ser inteiro')
  .min(0, 'Estoque nao pode ser negativo');

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Nome e obrigatorio'),
  sku: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{3,32}$/, 'SKU deve ter de 3 a 32 caracteres validos'),
  price,
  stock,
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1, 'Nome e obrigatorio'),
  price,
  stock,
});

export type CreateProductForm = z.infer<typeof createProductSchema>;
export type UpdateProductForm = z.infer<typeof updateProductSchema>;
