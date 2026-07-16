export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidSkuError extends DomainError {}

export class InvalidMoneyError extends DomainError {}

export class InvalidProductNameError extends DomainError {}

export class NegativeStockError extends DomainError {}

export class DuplicateSkuError extends DomainError {
  constructor(sku: string) {
    super(`Ja existe um produto com o SKU ${sku}`);
  }
}

export class ProductNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Produto ${id} nao encontrado`);
  }
}
