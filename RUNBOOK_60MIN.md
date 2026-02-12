# Runbook (60 min) — Legacy Escape Room (50 pessoas em grupos)

## Objetivo
- 50 pessoas → 15–25 equipas (2–4 pessoas)
- Zero atrito: avaliação automática, scoreboard rápido
- 60 min total (inclui setup e wrap‑up)

## Antes da sessão (15–30 min)
- Garantir que este repo está no GitHub como **template**
- Criar GitHub Classroom assignment com **Team assignment** (2–4)
- Confirmar que `.github/workflows/score.yml` está ativo (Actions enabled)
- Testar 1 repo de teste: abrir PR → ver comentário do autograde

## Timeline sugerida (60 min)

### 0–5 min — Kickoff
- Explicar o tema (escape room) e as regras
- Formar equipas (2–4)
- Partilhar link do GitHub Classroom

### 5–10 min — Setup rápido (equipas)
- Cada equipa abre o repo criado pelo Classroom
- Abre no VS Code
- Corre `npm install`
- Corre `npm run score` para ver o baseline

### 10–25 min — Room 1
- Objetivo: explicar e documentar + fazer testes verdes
- Gate: `npm run room1`

### 25–40 min — Room 2
- Objetivo: refactor incremental e baixar complexidade
- Gate: `npm run room2`

### 40–50 min — Room 3
- Objetivo: remover secrets hardcoded, evitar concat de SQL, melhorar auth/validação
- Gate: `npm -w @escape/room3 run scan`

### 50–60 min — Final + wrap‑up
- Pedir 1 melhoria “visível” no final (Dockerfile/CI/API/health)
- Recolher scores (ver secção Scoreboard)
- Anunciar top 3

## Scoreboard
Opção A (mais simples): usar o **Classroom Gradebook**.

Opção B (rápida com PRs):
- Cada equipa cria um PR `final-score`
- O workflow comenta o score no PR
- O facilitador ordena por TOTAL ao olhar a lista de PRs

Opção C (offline):
- Cada equipa envia `score-output/score.json`
- O facilitador junta em `scores/<equipa>/score-output/score.json`
- Corre `npm run leaderboard`
