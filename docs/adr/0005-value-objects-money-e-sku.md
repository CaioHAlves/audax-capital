# ADR 0005 — Value Objects: Money e Sku

- Status: Aceito
- Data: 2026-07-16

## Contexto

Preço e SKU carregam regras que não pertencem à entidade nem aos controllers.
Precisamos de um lugar único para validá-los e garantir consistência.

## Decisão

Modelar `Money` e `Sku` como _value objects_ imutáveis no domínio.

- **Money**
  - Armazena o valor em **centavos** (inteiro) para evitar erros de ponto
    flutuante.
  - Fábrica `Money.fromNumber(19.90)` converte para centavos com arredondamento.
  - Rejeita valores não positivos.
  - Igualdade por valor; expõe `toNumber()` para a fronteira.
- **Sku**
  - Normaliza para maiúsculas e valida `^[A-Z0-9-]{3,32}$`.
  - Igualdade por valor.
  - Imutável — coerente com a regra de negócio de SKU imutável (ADR 0002 e
    CONTEXT.md).

## Justificativa

- _Value objects_ concentram a validação e tornam estados inválidos
  irrepresentáveis: se você tem um `Money`, ele é positivo; se tem um `Sku`, ele
  é válido.
- Centavos como inteiro é a forma padrão e segura de representar dinheiro.

## Consequências

- Conversões explícitas na fronteira (número decimal ↔ centavos).
- Testes de domínio focam o comportamento dos VOs (rejeições e igualdade).
