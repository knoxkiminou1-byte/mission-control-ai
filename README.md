# Mission Control AI

Mission Control AI helps nonprofits turn scattered program data into clear dashboards, weekly briefs, action queues, and board-ready reports.

## Mission

AI operations infrastructure for mission-driven teams.

## Demo

- Live system: https://knoxkiminou1-byte.github.io/mission-control-ai/
- GitHub: https://github.com/knoxkiminou1-byte/mission-control-ai

## Core Features

- **Intake intelligence:** Maps messy intake notes into structured program records.
- **Risk radar:** Flags overdue follow-ups, incomplete records, and urgent needs.
- **Weekly briefs:** Turns metrics and notes into staff-ready narrative summaries.
- **Board reports:** Generates leadership updates with human approval gates.

## Claude Architecture

This MVP is Claude-ready without requiring a public API key. Deterministic TypeScript handles facts, scores, scans, approval gates, and metrics. Claude is reserved for narrative explanation, coaching, report drafting, risk interpretation, and nontechnical translation.

## Human Review Workflow

Outputs that could affect real people are treated as drafts until reviewed. The UI, docs, and eval cases all reinforce human approval before export.

## Evaluation Strategy

Eval fixtures live in `evals/cases`. Unit tests cover deterministic logic in `src/lib`.

## Tech Stack

- React + Vite
- TypeScript
- Zod-ready architecture
- Vitest
- GitHub Pages

## Local Setup

```bash
npm install
npm run dev
```

## Verify

```bash
npm run test
npm run build
```

## Documentation

- [Product brief](docs/product-brief.md)
- [Architecture](docs/architecture.md)
- [Evaluation plan](docs/evaluation-plan.md)
- [Security](docs/security.md)
- [Runbook](docs/runbook.md)
- [Training guide](docs/training-guide.md)
- [Handoff checklist](docs/handoff-checklist.md)
- [Limitations](docs/limitations.md)

## What I Would Improve Next

Add authenticated workspaces, real Claude API execution behind server-side routes, persistent Postgres storage, and a browser-based eval runner that records regression history.
