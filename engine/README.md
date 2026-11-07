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

With Docker, run any command below as `docker compose run --rm engine <command>` from the repository root, as the main README shows.

## Commands

```bash
pets-engine scenarios                                              # list sharing scenarios
pets-engine detect $PETS_ROOT/data/unseen --out labels.csv         # label columns in any folder of CSV files
pets-engine run $PETS_ROOT/data/health --scenario HEALTH-S1 --out runs/health-s1
pets-engine init-scenario ./my_data --out scenario.yaml               # template listing every column Detect found
pets-engine run ./my_data --scenario-file scenario.yaml --out runs/mine
pets-engine run ./my_data --trust contractual --k 5 --keep orders.status --out runs/quick
pets-engine evaluate                                               # detector score on left-out datasets
pets-engine evaluate-text                                          # redaction score on held-out and never-tuned text
pets-engine submission --out pets_submission --run health=runs/health-s1
```

`run` exits with `0` when released, `2` when held for a person, and `3` when blocked.

## Your own data: write a scenario

A scenario file says who receives the data, how much they're trusted, the look-alike bar, and the questions they must still answer.
Only the columns those questions need are released, and each question is scored before and after. A full example is in
[examples/unseen_scenario.yaml](examples/unseen_scenario.yaml).

```yaml
id: PAY-RESEARCH
recipient: University labour-market research group
purpose: Study pay by occupation
trust_level: controlled_research   # internal, controlled_research, contractual or public
k: 5                               # every released row must look like at least 5 others
questions:
  - ask: What is the median monthly pay for each occupation?
    median: export.salary
    by: [export.occupation]
  - count: true                    # how rows spread across groups
    by: [export.workplace]
  - correlation: [export.hours, export.salary]
```

Question kinds: `median`, `mean`, `count` (with `by`), `correlation` (two columns) and `distribution` (one column).

A `public` recipient never gets rows. Give it a question list in the challenge toolkit's DP workload format, and the engine publishes
noisy answers with differential privacy. For package data, the dataset's own workload file is found automatically.

```yaml
trust_level: public
epsilon: 1                 # privacy budget for this release (default 1)
workload: workload.json    # {"table": "visits", "queries": [{"id": "Q1", "type": "count", "filters": {"area": "north"}}, ...]}
```

Each person adds at most 4 records, chosen at random. Questions with the same kind and filter fields form a family, and each family gets a
share of the budget by the square root of its size. Means need `bounds`, and their values are clipped to them.
Write columns as `table.column`, where the table is the CSV file's name. With no questions, every kept column gets a standard check
that its distribution keeps its shape, and nothing is coarsened beyond what `k` requires.

## What a run produces

| Folder | Contents | Share it? |
|---|---|---|
| `release/` | Protected tables, or `dp_answers.csv` for a public recipient. Only exists if the gate passed. | With the recipient |
| `staged/` | The output when a person must review it. | No |
| `evidence/` | `report.md`, `manifest.json`, `scorecard.html` | Yes |
| `private/` | Row maps for scoring | Never publish |

To review a held run, write a JSON file of decisions and run again with `--review decisions.json`:

```json
{"export_2025_q4.c13": {"role": "sensitive_attribute", "subtype": "SOCIAL_DATA", "reason": "Trade union code"}}
```

## How it works

1. **Detect** labels each column from its values and name. Unsure columns count as sensitive until a person checks them. An unkeyed hash
   of another column takes that column's label, because anyone can undo it.
2. **Select** starts from an allow-list. It re-runs the scenario's tasks with columns removed, and anything no task needs is dropped whatever its label. Readable rules in `data/rules.yaml` then choose a PET for what stays.
3. **Tune** searches settings against real task scores, and brings a safe column back if coarsening broke a task.
4. **Transform** applies the PETs. Keys differ per recipient, so two releases can't be joined.
5. **Verify** checks the output against the original data, runs the attacks, and returns release, review or block. A look-alike failure goes back for suppression.
6. **Report** writes the field-by-field record, scores and remaining risks.

Free text is redacted in layers: formats and cue words, spoken numbers, the person's own record, and names the data owner already holds. No LLM or external service sees the data.

## Limits

- Public scenarios get answers only, and only when there is a question list; otherwise they're blocked. The budget is per release, so
  releases about the same people add up, and NumPy's Laplace sampler isn't hardened against floating-point attacks.
- `pets-eval` scores are self-assessment against public attackers, not official judging.
- The name lexicon was written after reading the public catalogue, so detector scores are somewhat optimistic.
- Attack tests with the public attacker files need the challenge package. On other data, the engine's own checks and stronger attacker still run.
