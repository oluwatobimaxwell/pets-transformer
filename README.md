# PETs Transformer: a privacy release gate

Tell it who will receive a dataset. It protects the data, proves the data is still useful for that recipient, and blocks any release that fails.

Built at Since AI Hackathon 2026 for the TrustED PETs Transformer challenge. Every dataset used is synthetic and comes from the challenge package.
This project isn't produced or endorsed by the TrustED consortium or the EU.

## Results

Self-assessment with the challenge's `pets-eval` toolkit, against its public attackers. These are not official judging scores.

| Scenario | Recipient | Gate | Privacy | Usefulness | Rows kept |
|---|---|---|---|---|---|
| `HEALTH-S1` | University research group | Released on attempt 2 | 1.00 | 0.97 | 97.8% |
| `CS-S1` | AI vendor, contact-centre chats | Released | 1.00 | 0.97 | 100% |
| `CYBER-S1` | Managed security provider | Released | 0.32 | 0.99 | 100% |
| `HEALTH-S2` | Public dashboard | Blocked, by design | – | – | – |
| `unseen`, with a written scenario | Labour-market researchers | Released on attempt 2, after a person's review | – | 0.95 | 95.4% |

For comparison, the challenge's classic baseline (B2) reaches usefulness 0.79, 0.75 and 0.81 on the three challenge scenarios.
The `unseen` file has meaningless column names and no answers in the package. Its scenario and questions were written by us, in
[engine/examples/unseen_scenario.yaml](engine/examples/unseen_scenario.yaml), so it shows the engine on data it has never seen.

- **Detect:** macro-F1 0.85 and sensitive-column recall 0.90 on datasets the model never trained on. The name lexicon was written after reading the public catalogue, so treat this as optimistic. Values alone, as in the unnamed `unseen` file, reach macro-F1 0.65.
- **Text redaction:** 0.17% of identifying values survive in held-out chats, and 0.00–1.19% in three kinds of text the rules were never tuned on.

## Risks that remain

- **Our stronger attacker.** The organisers' hidden attackers weren't available, so the engine runs its own. On the health release, knowing a patient's clue columns singles out nobody. Adding the diagnosis singles out 27% of visits, and adding every kept fact singles out 98%.
- **Repeat visits.** 74% of patients with more than one visit have a unique pattern across them, which a row-level look-alike check can't see.
- **Cyber logs.** Privacy is 0.32 because detection rules need minute-level timestamps, and the scenario sets no look-alike bar.
- **Public scenarios** are blocked: the engine makes row-level releases and doesn't build aggregates yet.

## Quick start

The challenge package (`TRUSTED_PETS_PROVING_GROUND_2026`) sits next to this folder and isn't part of this repository. First create
`.env`, which says where the package is and holds the secret behind every pseudonym. It's excluded from git and must never be shared:

```bash
printf 'PETS_ROOT=../TRUSTED_PETS_PROVING_GROUND_2026\nPETS_ENGINE_KEY=%s\n' "$(openssl rand -hex 24)" > .env
```

### With Docker

Needs Docker with Compose 2.17 or newer, and nothing else: Python, Node and every library are inside the images.

```bash
docker compose up --build
```

Then open http://localhost:8080 for the web app. The command line runs in the same image, with this folder mounted at `/work` and
the challenge package at `/data/challenge`:

```bash
docker compose run --rm engine run /data/challenge/data/health --scenario HEALTH-S1 --out runs/health-s1
open runs/health-s1/evidence/dashboard.html
```

### Without Docker

Needs Python 3.10 to 3.12. The pinned library versions don't install on Python 3.13 or newer.

```bash
python3 -m venv .venv
.venv/bin/pip install -e ../TRUSTED_PETS_PROVING_GROUND_2026/toolkit -e engine
set -a; . ./.env; set +a
.venv/bin/pets-engine run $PETS_ROOT/data/health --scenario HEALTH-S1 --out runs/health-s1
open runs/health-s1/evidence/dashboard.html
```

### Your own data

Write a scenario file with the recipient, trust level, look-alike bar and the questions they need answered. With Docker, put the data
folder inside this one and use `docker compose run --rm engine` in place of `.venv/bin/pets-engine`:

```bash
.venv/bin/pets-engine init-scenario ./my_data --out scenario.yaml
.venv/bin/pets-engine run ./my_data --scenario-file scenario.yaml --out runs/mine
```

See [engine/README.md](engine/README.md) for every command, the scenario format, the review flow and the output folders.

## Web app

The same engine behind a local web app: upload data or pick a sample, describe the recipient and their questions, confirm the columns
Detect was unsure about, run the gate, and download the protected data and evidence. With Docker it starts with
`docker compose up --build`; steps for working on its code are in [web/README.md](web/README.md). Run from the web app and from the command line, `HEALTH-S1` gives identical results.

## How it works

1. **Detect** labels every column from its values and name, and every piece of personal data in free text.
2. **Select** keeps only what the recipient's required questions need, found by re-running those questions with columns removed. Readable rules in [rules.yaml](engine/src/pets_engine/data/rules.yaml) choose a technique for each kept column.
3. **Tune** searches settings such as age bands and time detail against the real question scores, and brings a safe column back if a question breaks.
4. **Transform** applies keyed pseudonyms, generalisation, code shortening and layered text redaction, then shuffles rows so their order reveals nothing.
5. **Verify** compares the output with the originals, runs the attacks, and returns release, review or block. A failed look-alike check goes back for suppression.
6. **Report** writes a dashboard, a field-by-field record and a plain-language summary.

No large language model or outside service sees the data.

## Built with

Engine: Python, pandas, NumPy, scikit-learn and PyYAML, with the challenge's `pets-eval` toolkit (MIT, © Since AI ry) for scoring.
Web app: FastAPI, React, TypeScript, Chakra UI and TanStack Query, scaffolded with blacksmith-cli.
Packaging: Docker Compose, with nginx serving the web app.
The challenge data is CC BY 4.0, © Since AI ry, with postcode centroids from GeoNames (CC BY 4.0).

## AI tools

The team built this with Claude Code (Anthropic) as an AI coding assistant. The team reviewed the design decisions and checked every result reported here. The tool itself uses no generative AI model or API.

## What was built at the event

Everything in this repository was written during Since AI Hackathon 2026, 6–8 November, except the web app's skeleton. That was generated
at the event with blacksmith-cli, a pre-existing open-source tool, then stripped and rebuilt (details in [web/README.md](web/README.md)).
The engine depends on the challenge's `pets-eval` toolkit, which isn't part of this repository.
