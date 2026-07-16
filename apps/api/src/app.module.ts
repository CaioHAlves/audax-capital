import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductModule,
  RepositoryDriver,
} from './product/infrastructure/product.module';
import { ProductOrmEntity } from './product/infrastructure/persistence/typeorm/product.orm-entity';
import { HealthModule } from './health/health.module';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    const driver = (process.env.DB_DRIVER ?? 'memory') as RepositoryDriver;
    const imports: DynamicModule['imports'] = [
      ConfigModule.forRoot({ isGlobal: true }),
      HealthModule,
    ];

    if (driver === 'postgres') {
      imports.push(
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [ProductOrmEntity],
          synchronize: process.env.DB_SYNCHRONIZE === 'true',
        }),
      );
    }

    imports.push(ProductModule.register(driver));

    return { module: AppModule, imports };
  }
}
