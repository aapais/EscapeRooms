# 🏚 Room 1 — The Archaeology Room
“Nobody knows what this code does anymore.”

## Challenge
Tens um serviço legacy grande, sem documentação e com testes a falhar.

## O que tens
- Um ficheiro grande (>500 linhas): `src/legacyService.js`
- Nenhuma documentação útil
- Testes a falhar: `test/legacyService.test.js`

## Tasks (faz com GitHub Copilot)
1. Pedir ao Copilot para explicar o ficheiro
2. Gerar documentação de alto nível (1 página)
3. Identificar dead code (funções/branches nunca usados)
4. Criar um README curto (no máximo 1 página) com:
   - propósito do serviço
   - inputs/outputs
   - como correr testes
   - limitações conhecidas

## Unlock condition
- Produzir uma visão geral do sistema (1 página) + testes verdes.

## Como correr
```bash
npm test
```
