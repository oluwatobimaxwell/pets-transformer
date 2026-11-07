# Demo video script, about 1 minute 57 seconds

Record the screen at 1080p in the web app (http://localhost:5174). Before recording, start the backend and frontend, and run
`HEALTH-S1` once so the needs cache is warm and the run takes under a minute.

| Time | On screen | Narration |
|---|---|---|
| 0:00–0:12 | Web app, step 1 | Hospitals want to share data with researchers. Removing names isn't enough: in this data, 98.9% of patients are the only person with their birth date, sex and postcode. |
| 0:12–0:24 | Pick the health sample, then the `HEALTH-S1` scenario | PETs Transformer is a release gate. We pick the data and the recipient: a university team studying emergency-room crowding and revisits. |
| 0:24–0:38 | Step 3, the columns table | Detect labels every column from its values and name, with its evidence. Anything it isn't sure about is flagged for a person. |
| 0:38–0:55 | Run the gate; the live progress log | Now the gate runs. Watch the first attempt: it's blocked, because 2.4% of visits still stand out. It blanks one clue, the age band, in just those visits and passes. |
| 0:55–1:10 | Run page: tiles and question scores | Privacy 1.00, usefulness 0.99, against 0.79 for the challenge baseline, and every row kept. Every question the researchers need still works. |
| 1:10–1:28 | Embedded dashboard: Usefulness, then Records with a `pt…` code clicked | Every question shows both answers: median stay at triage level A is 302 minutes in the original and 301 protected. Each patient has a keyed code, so revisits still link up. |
| 1:28–1:45 | Dashboard, Privacy risks: stronger attacker card | We also ran our own stronger attacker. The clues single out nobody, but someone who knows a diagnosis can single out 25% of visits. We report that instead of hiding it. |
| 1:45–1:57 | Scenario list: the `HEALTH-S2` badge | A public recipient gets noisy answers, never rows, with a stated privacy budget. Tell it who gets the data: it protects it, proves it's useful, or refuses. |
