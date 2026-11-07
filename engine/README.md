# PETs Transformer engine

A privacy release gate. Tell it who will receive a dataset, and it protects the data, proves it's still useful, and blocks any release that fails.

Built for the TrustED PETs Transformer challenge at Since AI Hackathon 2026. All data used is synthetic.
This project isn't produced or endorsed by the TrustED consortium or the EU.

## Setup

```bash
python3 -m venv .venv
.venv/bin/pip install -e ../TRUSTED_PETS_PROVING_GROUND_2026/toolkit -e engine
export PETS_ROOT=../TRUSTED_PETS_PROVING_GROUND_2026
export PETS_ENGINE_KEY="$(python3 -c 'import secrets; print(secrets.token_hex(24))')"
```

`PETS_ENGINE_KEY` is the secret behind every pseudonym. The engine refuses to run without it and never writes it to disk. Keep it out of the repository.

## Commands

```bash
pets-engine scenarios                                              # list sharing scenarios
pets-engine detect $PETS_ROOT/data/unseen --out labels.csv         # label columns in any folder of CSV files
pets-engine run $PETS_ROOT/data/health --scenario HEALTH-S1 --out runs/health-s1
pets-engine run ./my_data --trust contractual --keep orders.status --out runs/mine
pets-engine evaluate                                               # detector score on left-out datasets
pets-engine evaluate-text                                          # redaction score on held-out and never-tuned text
pets-engine submission --out pets_submission --run health=runs/health-s1
```

`run` exits with `0` when released, `2` when held for a person, and `3` when blocked.

## What a run produces

| Folder | Contents | Share it? |
|---|---|---|
| `release/` | Protected tables. Only exists if the gate passed. | With the recipient |
| `staged/` | The output when a person must review it. | No |
| `evidence/` | `report.md`, `manifest.json`, `scorecard.html` | Yes |
| `private/` | Row maps for scoring | Never publish |

To review a held run, write a JSON file of decisions and run again with `--review decisions.json`:

```json
{"export_2025_q4.c13": {"role": "sensitive_attribute", "subtype": "SOCIAL_DATA", "reason": "Trade union code"}}
```

## How it works

1. **Detect** labels each column from its values and name. Unsure columns count as sensitive until a person checks them.
2. **Select** starts from an allow-list. It re-runs the scenario's tasks with columns removed, and anything no task needs is dropped whatever its label. Readable rules in `data/rules.yaml` then choose a PET for what stays.
3. **Tune** searches settings against real task scores, and brings a safe column back if coarsening broke a task.
4. **Transform** applies the PETs. Keys differ per recipient, so two releases can't be joined.
5. **Verify** checks the output against the original data, runs the attacks, and returns release, review or block. A look-alike failure goes back for suppression.
6. **Report** writes the field-by-field record, scores and remaining risks.

Free text is redacted in layers: formats and cue words, spoken numbers, the person's own record, and names the data owner already holds. No LLM or external service sees the data.

## Limits

- Public scenarios are blocked, because the engine makes row-level releases and doesn't build aggregates yet.
- `pets-eval` scores are self-assessment against public attackers, not official judging.
- The name lexicon was written after reading the public catalogue, so detector scores are somewhat optimistic.
- Task-based column selection needs the package's tasks. For other data, use `--trust` with `--keep`.
