import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar', { unique: true })
  sku!: string;

  @Column('int')
  priceInCents!: number;

  @Column('int')
  stock!: number;

  @Column('timestamptz')
  createdAt!: Date;

  @Column('timestamptz')
  updatedAt!: Date;
}
