# CONTEXT — Catálogo de Produtos

Documento de contexto do domínio, produzido na fase de design (antes da
implementação). Serve como fonte da linguagem ubíqua e das regras de negócio
que guiam o código e os testes.

## Problema

Precisamos gerenciar o catálogo de **Produtos** de uma operação de varejo:
cadastrar, consultar, atualizar e remover produtos, garantindo que o catálogo
permaneça consistente. O foco do teste não é persistência — é o modelo de
domínio e suas regras.

## Linguagem ubíqua

| Termo | Significado |
| --- | --- |
| **Produto** | Item comercializável do catálogo. Agregado raiz. |
| **SKU** (_Stock Keeping Unit_) | Código único e imutável que identifica o produto no catálogo. |
| **Preço** | Valor monetário de venda do produto. Sempre positivo. |
| **Estoque** | Quantidade disponível em unidades inteiras. Nunca negativo. |
| **Catálogo** | Conjunto de todos os produtos. É onde a unicidade de SKU é garantida. |

## Agregado: Produto

Campos:

- `id` — identidade técnica (UUID), gerada na criação.
- `name` — nome de exibição, texto não vazio.
- `sku` — _value object_ `Sku`, imutável após a criação.
- `price` — _value object_ `Money`, positivo.
- `stock` — inteiro maior ou igual a zero.
- `createdAt` / `updatedAt` — carimbos de tempo.

## Regras de negócio (invariantes)

1. **SKU único no catálogo.** Não podem existir dois produtos com o mesmo SKU.
   A unicidade é uma regra do catálogo, verificada no caso de uso de criação
   consultando a porta de repositório — não é uma restrição só de banco.
2. **SKU imutável.** Depois de criado, o SKU de um produto não muda. Corrigir
   um SKU significa remover e recriar o produto. Isso mantém a identidade de
   negócio estável e simplifica a integração com sistemas externos.
3. **Formato de SKU.** Alfanumérico em maiúsculas, com hífens, entre 3 e 32
   caracteres (`^[A-Z0-9-]{3,32}$`). Normalizado para maiúsculas.
4. **Preço positivo.** O preço precisa ser maior que zero. Representado em
   centavos (inteiro) internamente para evitar erros de ponto flutuante.
5. **Estoque não negativo.** O estoque é um inteiro `>= 0`. Reduções que
   levariam o estoque abaixo de zero são rejeitadas.
6. **Nome obrigatório.** O nome não pode ser vazio nem apenas espaços.

## Casos de uso

- **Criar produto** — valida invariantes, garante SKU único, persiste.
- **Listar produtos** — paginado (`page`, `limit`), retorna itens e total.
- **Buscar produto por id** — retorna o produto ou erro de não encontrado.
- **Atualizar produto** — altera `name`, `price` e `stock`. O SKU não muda.
- **Remover produto** — remove do catálogo.

## Fronteiras e decisões de modelagem

- O **domínio** (entidade, _value objects_, regras, porta de repositório) não
  conhece NestJS, ORM nem HTTP. As dependências apontam para dentro.
- A **aplicação** (casos de uso) orquestra o domínio e depende apenas da porta
  `ProductRepository`, nunca de uma implementação concreta.
- A **infraestrutura** implementa a porta (in-memory e Postgres/TypeORM) e
  expõe o domínio via controllers HTTP do NestJS.
- Trocar o repositório (in-memory → Postgres) é uma troca de _adapter_,
  configurada por variável de ambiente, sem tocar em domínio ou aplicação.

As decisões arquiteturais estão registradas em `docs/adr/`.
