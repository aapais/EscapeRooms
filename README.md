# 🧩 The Legacy Escape Room

Missão: Estás preso dentro de um sistema legacy frágil. Cada sala só abre quando resolves problemas reais de engenharia — usando GitHub Copilot como teammate.

Este repositório contém 4 salas (rooms). Cada sala é um mini-projeto com:
- código propositadamente “problemático”
- testes/checks que começam a falhar
- um objetivo de unlock/escape

## Pré‑requisitos
- Node.js 18+ (recomendado)
- npm 9+

## Como correr
Na raiz:

```bash
npm install
```

Depois, corre uma sala de cada vez:

```bash
npm run room1
npm run room2
npm run room3
npm run final
```

> Dica para facilitadores: cada sala tem um `README.md` com instruções, critérios de unlock e sugestões de como usar o Copilot.

Para preparar e pontuar o concurso, ver `FACILITATOR.md`.

## Estrutura
- `rooms/room1-archaeology` — explicação/sumarização/documentação + dead code
- `rooms/room2-refactor-lab` — refactor + reduzir complexidade
- `rooms/room3-security-vault` — corrigir vulnerabilidades + passar scanner
- `rooms/final-modernisation` — docker + CI + REST API + observabilidade

## Regras sugeridas do concurso
- Equipas de 2–4 pessoas
- 20–30 min por sala (ou 60–90 min total)
- Pontos por: desbloquear sala, qualidade do README, qualidade do design, diffs pequenos e testes verdes

## Notas
- O código é intencionalmente imperfeito.
- O objetivo é praticar: leitura de código, refactor assistido, segurança, e modernização.
