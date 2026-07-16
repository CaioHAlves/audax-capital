# ADR 0008 — Entrada de preço no formulário

- Status: Aceito
- Data: 2026-07-16

## Contexto

No Brasil o separador decimal usual é a vírgula, mas usuários também digitam com
ponto. O formulário precisa aceitar `20,13` e `21.13` e limitar a duas casas
decimais, sem quebrar o contrato numérico da API.

## Decisão

- Normalizar a entrada no schema de validação do frontend (Zod):
  - `trim`, troca de vírgula por ponto;
  - validação de formato com no máximo duas casas decimais
    (`^\d+(\.\d{1,2})?$`);
  - conversão para `number` e checagem de valor positivo antes do envio.
- O backend continua recebendo `number` e representando dinheiro em centavos
  (ADR 0005); a normalização de digitação é responsabilidade da borda (UI).

## Justificativa

- O tratamento de separador decimal é um detalhe de _input_ do usuário, então
  vive no frontend, perto de onde o texto é digitado.
- O domínio permanece agnóstico de formatação: recebe um número já válido.

## Consequências

- Regras de preço aparecem em dois pontos com propósitos distintos: formato de
  digitação (front) e invariante de valor positivo em centavos (domínio).
- Coberto por testes do schema no frontend (aceita vírgula/ponto, rejeita mais
  de duas casas e valor não positivo).
