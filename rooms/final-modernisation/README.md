# 🚀 Final Room — The Modernisation Chamber
“Turn this monolith into something deployable.”

## Challenge
Tens um módulo monolítico que hoje é basicamente um script/serviço local.
A missão é transformar em algo “cloud/deploy ready”.

## Tasks (com Copilot)
- Criar `Dockerfile`
- Criar pipeline CI (GitHub Actions) a correr testes
- Converter a lógica principal para uma REST API (ex: Express)
- Adicionar observabilidade básica (ex: endpoint `/health`, logs estruturados mínimos)

## Escape condition
- App corre em container
- Pipeline passa

## O que existe hoje
- `src/monolith.js` — um monólito com lógica misturada
- `test/monolith.test.js` — testes simples

## Como correr local
```bash
npm test
npm start
```
