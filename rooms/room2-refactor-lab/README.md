# 🧱 Room 2 — The Refactor Lab
“Technical debt is crushing velocity.”

## Challenge
Código “messy” com:
- god class (responsabilidades a mais)
- lógica duplicada
- magic values / configs hardcoded

## Objetivo
Usar Copilot para refactor e baixar a complexidade.

## Tasks
Pedir ao Copilot para ajudar a:
- extrair métodos
- aplicar SOLID (separar responsabilidades, reduzir acoplamento)
- substituir magic values por config
- introduzir interfaces (ou pelo menos boundaries) quando fizer sentido

## Unlock condition
Complexidade ciclomática por função <= 10 (check automático via ESLint rule `complexity`).

## Como medir “cyclomatic complexity” (o que é isto?)
É uma métrica que aproxima quantos caminhos independentes existem num bloco de código.
Na prática, `if/else`, `switch`, `catch`, `&&/||` etc aumentam caminhos. Mais caminhos = mais difícil testar/manter.

Aqui medimos com ESLint:
```bash
npm run complexity
```

## Como correr
```bash
npm test
```
