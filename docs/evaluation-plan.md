# Mission Control AI Evaluation Plan

## Evaluation Goals

The eval suite checks metric correctness, missing-data detection, prohibited claims, action relevance, report quality, and export approval gates.

## Current Eval Surface

- Fixture cases live in `evals/cases`.
- Unit tests live next to deterministic logic in `src/lib`.
- AI-generated copy is treated as review-mode output and should be checked against required/prohibited claims.

## Pass Criteria

- Required claims are present.
- Prohibited claims are absent.
- Missing or uncertain data is called out instead of guessed.
- Human approval gates block final exports when required.
- Output is useful to the target nontechnical user.

## Next Improvement

Add a real Claude API-backed eval runner that compares generated output to the JSON cases and records regression history.
