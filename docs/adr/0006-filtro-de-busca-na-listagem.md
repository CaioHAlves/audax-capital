# ADR 0006 — Filtro de busca na listagem

- Status: Aceito
- Data: 2026-07-16

## Contexto

A listagem precisa permitir filtrar produtos por **nome** e por **código
(SKU)**, tanto na API quanto no frontend. O filtro é uma preocupação de
consulta (leitura), não uma regra de negócio do agregado.

## Decisão

- Um único parâmetro `search` que casa com **nome OU SKU**, _case-insensitive_.
- O contrato fica na porta: `PageQuery` ganha `search?` opcional no domínio.
- O caso de uso `ListProducts` faz `trim` e ignora busca vazia (só espaços),
  preservando a paginação existente.
- Cada adapter implementa o filtro na sua tecnologia, sem vazar detalhe para o
  domínio:
  - **in-memory:** `includes()` sobre `name` e `sku.value` em minúsculas.
  - **TypeORM/Postgres:** `where` com `ILike('%termo%')` em `name` OR `sku`.

## Justificativa

- Um campo único ("nome ou código") é a UX mais simples e cobre o pedido sem
  multiplicar parâmetros.
- Manter `search` na porta e a implementação nos adapters preserva a regra de
  dependências apontando para dentro (ADR 0002): trocar o repositório não muda
  o caso de uso.
- `ILike` resolve a busca case-insensitive no Postgres sem full-text; suficiente
  para o volume do teste.

## Consequências

- Busca por substring (não por prefixo nem _full-text_); adequada ao escopo.
- Os testes de caso de uso cobrem filtro por nome, por SKU (ignorando
  maiúsculas) e o descarte de termos em branco, sem depender de banco.
