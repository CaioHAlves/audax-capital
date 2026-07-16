import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DomainExceptionFilter } from '../src/product/infrastructure/http/domain-exception.filter';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register()],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const server = () => app.getHttpServer();

  it('cria, busca, lista, atualiza e remove um produto', async () => {
    const created = await request(server())
      .post('/products')
      .send({ name: 'Teclado', sku: 'kbd-e2e', price: 199.9, stock: 5 })
      .expect(201);

    expect(created.body.sku).toBe('KBD-E2E');
    const id = created.body.id;

    await request(server()).get(`/products/${id}`).expect(200);

    const listed = await request(server())
      .get('/products?page=1&limit=10')
      .expect(200);
    expect(listed.body.total).toBeGreaterThanOrEqual(1);

    const updated = await request(server())
      .put(`/products/${id}`)
      .send({ price: 249.9, stock: 2 })
      .expect(200);
    expect(updated.body.price).toBe(249.9);
    expect(updated.body.stock).toBe(2);

    await request(server()).delete(`/products/${id}`).expect(204);
    await request(server()).get(`/products/${id}`).expect(404);
  });

  it('rejeita SKU duplicado com 409', async () => {
    await request(server())
      .post('/products')
      .send({ name: 'A', sku: 'dup-1', price: 10, stock: 1 })
      .expect(201);

    await request(server())
      .post('/products')
      .send({ name: 'B', sku: 'DUP-1', price: 10, stock: 1 })
      .expect(409);
  });

  it('rejeita payload invalido com 400', async () => {
    await request(server())
      .post('/products')
      .send({ name: '', sku: 'x', price: -1, stock: -2 })
      .expect(400);
  });
});
