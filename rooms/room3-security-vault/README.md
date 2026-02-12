# 🔐 Room 3 — Security Vault
“Compliance audit in 24 hours.”

## Challenge
Código com problemas comuns:
- SQL injection (simulado)
- auth fraca
- secrets hardcoded
- falta de validação de input

## Tasks
Usar Copilot para:
- detetar vulnerabilidades
- reescrever queries inseguras (evitar concatenação)
- mover secrets para env vars
- adicionar validação de input

## Unlock condition
Passar no “security scanner” do repo:
```bash
npm run scan
```

## Nota sobre o scanner
Para ser fácil no CODEFEST (sem ferramentas externas), o scanner aqui é um script que falha se encontrar padrões inseguros no código.
Numa stack real poderias usar Semgrep/Snyk/CodeQL, mas isto já dá um gate automatizado.

## Como correr
```bash
npm test
npm run scan
```
