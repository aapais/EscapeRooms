# Facilitator Guide — The Legacy Escape Room

## Setup (10 min antes)
- Confirmar Node.js 18+ instalado nas máquinas
- Abrir este repo no VS Code
- Na raiz: `npm install`

Material pronto a usar:
- `RUNBOOK_60MIN.md` (timeline para 1h)
- `TEAM-SETUP.md` (quick start para partilhar com equipas)
- `ANNOUNCEMENTS.md` (mensagens copy‑paste)

## Operação para ~50 pessoas (em grupos)
Objetivo: minimizar atrito e automatizar avaliação em ~1h.

### Recomendado: GitHub Classroom (teams)
1. Criar um **GitHub Classroom assignment** a partir deste repo (template).
2. Ativar **Team assignment** com tamanho 2–4.
3. Garantir que o workflow de autograde está ativo: `.github/workflows/score.yml`.
4. No início da sessão, partilhar o link do assignment.
   - Cada participante entra no Classroom
   - Forma/junta-se a uma equipa (team)
   - O Classroom cria 1 repo por equipa automaticamente

### Durante o jogo (dinâmico, sem "correções" manuais)
- Cada equipa trabalha no seu repo.
- Sempre que fizer `git push`, o GitHub Actions corre o autograde.
- O resultado aparece em:
  - **Actions → workflow "Escape Room Autograde"** (Job Summary)
  - Artefacto `score` com `score-output/score.json` e `score-output/score.txt`
  - Em PRs, um comentário automático com o total (opcional)

### Scoreboard (sem atrito)
Escolhe **1** destas opções (da mais automática para a mais simples):

1) GitHub Classroom Gradebook (preferível)
- O Classroom agrega resultados por repo/equipa no Gradebook.
- Tipicamente é o caminho com menos fricção para turmas grandes.

2) Scoreboard “semi-automático” (1 repo central)
- Cada equipa abre um PR chamado `final-score` no seu repo.
- O autograde comenta o score no PR.
- O facilitador usa uma pesquisa no GitHub (ou lista de PRs) para ver scores rapidamente.

3) Fallback offline (100% determinístico)
- No fim, cada equipa envia `score-output/score.json`.
- O facilitador coloca os ficheiros em `scores/<equipa>/score-output/score.json`.
- Na raiz corre:
  - `npm run leaderboard`

### Avaliação rápida
- O autograde é **determinístico**: gates (tests/lint/scan) + presença de artefactos no final.
- Para uma plateia grande, isto evita discussões e inconsistências.

### LLM-as-judge (quando usar)
Útil apenas como **desempate** ou “bónus de qualidade” (ex: clareza do overview/README), porque:
- não é 100% reprodutível
- pode ser mais lento/caro
- pode variar com prompts/modelo

Se quiseres mesmo LLM-as-judge: usa-o só para dar +0 a +5 pts por qualidade do texto, com rubric fixo.

## Formato sugerido
- Equipas: 2–4 devs
- Duração total: 60–90 min
  - Room 1: 20 min
  - Room 2: 20 min
  - Room 3: 20 min
  - Final: 20–30 min

## Como “ganham”
A prova é objetiva: cada sala tem um gate automático (tests/lint/scan). Para desempates, usar qualidade do output.

### Pontuação sugerida
- Room 1: 25 pts
  - 10 pts: testes verdes
  - 10 pts: overview 1 página (clareza + inputs/outputs + componentes)
  - 5 pts: dead code identificado (lista curta + evidência)

- Room 2: 25 pts
  - 15 pts: `npm test` passa (inclui ESLint complexity)
  - 10 pts: refactor limpo (dif pequeno, funções extraídas, config sem magic values)

- Room 3: 25 pts
  - 15 pts: `npm run scan` passa
  - 10 pts: mitigação clara (env vars, validação, queries seguras)

- Final: 25 pts
  - 10 pts: Dockerfile builda e corre
  - 10 pts: CI pipeline corre testes
  - 5 pts: API + health/logs mínimos

## Notas de avaliação rápida
- Cyclomatic complexity (Room 2): aqui é medido automaticamente pelo ESLint rule `complexity`.
- Security scanner (Room 3): aqui é um script (`npm run scan`) que procura padrões inseguros.
- Final: não há pipeline por defeito — a equipa cria.

## Scoring local (fallback sem internet/Classroom)
Se estiverem a trabalhar offline ou sem GitHub Classroom:
- Distribuir o zip do repo e pedir a cada equipa para correr `npm run score`.
- Cada equipa envia o ficheiro `score-output/score.json` (Teams/SharePoint).
- O facilitador ordena por `total` (é determinístico).

## Recomendação: script vs LLM-as-judge
- **Script/CI (este repo)**: melhor para 50 pessoas em 1h — rápido, previsível, auditável.
- **LLM-as-judge**: usar só para bónus/desempate de texto (overview/README), com rubric fixo.

## Dicas para o Copilot
- Pedir resumos por “módulos” (ex: responsabilidades, data flow, principais invariantes)
- Pedir sugestões de refactor incremental (passo-a-passo)
- Pedir um checklist de segurança: auth, secrets, validação, query building
