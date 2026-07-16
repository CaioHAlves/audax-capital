# ADR 0007 — Endpoint de healthcheck

- Status: Aceito
- Data: 2026-07-16

## Contexto

Ao rodar a API em ambientes como Codespaces e em deploys, é útil um endpoint
simples para verificar se o processo está de pé (liveness), sem depender de
banco ou de autenticação.

## Decisão

- Expor `GET /health` retornando `{ status, uptime, timestamp }`.
- Implementar em um `HealthModule` isolado, fora do domínio de produtos —
  healthcheck é uma preocupação de infraestrutura/operação, não de negócio.
- Não adotar `@nestjs/terminus`: o objetivo é apenas liveness do processo, sem
  checagens de dependências, então uma dependência extra não se justifica.

## Justificativa

- Mantém o domínio limpo: nada de HTTP/ops vaza para `product`.
- Resposta trivial e sem I/O torna o endpoint confiável para probes e para
  confirmar rapidamente que a porta está respondendo.

## Consequências

- É um _liveness check_, não _readiness_: não valida conexão com o banco. Se no
  futuro for preciso checar dependências, evolui-se para `terminus`.
