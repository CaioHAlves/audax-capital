import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateProduct } from '../application/create-product';
import { ListProducts } from '../application/list-products';
import { GetProduct } from '../application/get-product';
import { UpdateProduct } from '../application/update-product';
import { DeleteProduct } from '../application/delete-product';
import { PRODUCT_REPOSITORY } from '../domain/product-repository';
import { ID_GENERATOR } from '../domain/id-generator';
import { ProductController } from './http/product.controller';
import { UuidGenerator } from './uuid-generator';
import { InMemoryProductRepository } from './persistence/in-memory-product-repository';
import { ProductOrmEntity } from './persistence/typeorm/product.orm-entity';
import { TypeOrmProductRepository } from './persistence/typeorm/typeorm-product-repository';

export type RepositoryDriver = 'memory' | 'postgres';

const useCaseProviders: Provider[] = [
  {
    provide: CreateProduct,
    useFactory: (repository, idGenerator) =>
      new CreateProduct(repository, idGenerator),
    inject: [PRODUCT_REPOSITORY, ID_GENERATOR],
  },
  {
    provide: ListProducts,
    useFactory: (repository) => new ListProducts(repository),
    inject: [PRODUCT_REPOSITORY],
  },
  {
    provide: GetProduct,
    useFactory: (repository) => new GetProduct(repository),
    inject: [PRODUCT_REPOSITORY],
  },
  {
    provide: UpdateProduct,
    useFactory: (repository) => new UpdateProduct(repository),
    inject: [PRODUCT_REPOSITORY],
  },
  {
    provide: DeleteProduct,
    useFactory: (repository) => new DeleteProduct(repository),
    inject: [PRODUCT_REPOSITORY],
  },
];

@Module({})
export class ProductModule {
  static register(driver: RepositoryDriver): DynamicModule {
    const isPostgres = driver === 'postgres';

    const repositoryProvider: Provider = isPostgres
      ? {
          provide: PRODUCT_REPOSITORY,
          useFactory: (dataSource: DataSource) =>
            new TypeOrmProductRepository(
              dataSource.getRepository(ProductOrmEntity),
            ),
          inject: [DataSource],
        }
      : { provide: PRODUCT_REPOSITORY, useClass: InMemoryProductRepository };

    return {
      module: ProductModule,
      imports: isPostgres
        ? [TypeOrmModule.forFeature([ProductOrmEntity])]
        : [],
      controllers: [ProductController],
      providers: [
        { provide: ID_GENERATOR, useClass: UuidGenerator },
        repositoryProvider,
        ...useCaseProviders,
      ],
    };
  }
}
