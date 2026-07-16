import { Money } from './money';
import { Sku } from './sku';
import {
  InvalidProductNameError,
  NegativeStockError,
} from './product.errors';

export interface CreateProductProps {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  now?: Date;
}

export interface ProductSnapshot {
  id: string;
  name: string;
  sku: string;
  priceInCents: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private constructor(
    public readonly id: string,
    private _name: string,
    public readonly sku: Sku,
    private _price: Money,
    private _stock: number,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: CreateProductProps): Product {
    const now = props.now ?? new Date();

    return new Product(
      props.id,
      Product.normalizeName(props.name),
      Sku.create(props.sku),
      Money.fromNumber(props.price),
      Product.normalizeStock(props.stock),
      now,
      now,
    );
  }

  static reconstitute(snapshot: ProductSnapshot): Product {
    return new Product(
      snapshot.id,
      snapshot.name,
      Sku.create(snapshot.sku),
      Money.fromCents(snapshot.priceInCents),
      snapshot.stock,
      snapshot.createdAt,
      snapshot.updatedAt,
    );
  }

  get name(): string {
    return this._name;
  }

  get price(): Money {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(name: string): void {
    this._name = Product.normalizeName(name);
    this.touch();
  }

  changePrice(price: number): void {
    this._price = Money.fromNumber(price);
    this.touch();
  }

  changeStock(stock: number): void {
    this._stock = Product.normalizeStock(stock);
    this.touch();
  }

  toSnapshot(): ProductSnapshot {
    return {
      id: this.id,
      name: this._name,
      sku: this.sku.value,
      priceInCents: this._price.cents,
      stock: this._stock,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  private static normalizeName(name: string): string {
    const trimmed = name.trim();

    if (trimmed.length === 0) {
      throw new InvalidProductNameError('Nome do produto e obrigatorio');
    }

    return trimmed;
  }

  private static normalizeStock(stock: number): number {
    if (!Number.isInteger(stock) || stock < 0) {
      throw new NegativeStockError('Estoque deve ser um inteiro nao negativo');
    }

    return stock;
  }
}
