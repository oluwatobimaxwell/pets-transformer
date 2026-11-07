# Submission text for sinceai.app

Check every field against the live form before pasting.

## Project name (80 characters max)
PETs Transformer: a privacy release gate

## Tagline (140 characters max)
Tell it who gets the data. It protects it, proves it's still useful, and blocks any release that fails.

## Built with (first five show on the vote card)
Python, pandas, scikit-learn, FastAPI, React, pets-eval, TypeScript, Chakra UI, Docker

## About the project (5,000 characters max)
The problem
Organisations need to share data with researchers, vendors and partners, but removing names isn't enough. In the challenge's synthetic hospital data, 98.9% of patients are the only person with their birth date, sex and postcode. Protecting too much destroys what the recipient needs. Every team has to balance the two, usually by hand.

What we built
PETs Transformer is a privacy release gate. You give it a dataset and a sharing scenario: who receives the data, why, how much they're trusted, and which questions they must still be able to answer. A scenario is either one of the challenge's 27 or a short file anyone can write. It then runs six steps.
1. Detect labels every column from its values and name, including files with meaningless headers, and finds personal data inside free text.
2. Select starts from an allow-list. It re-runs the recipient's own questions with each column removed, so anything no question needs is dropped whatever it contains. Readable rules then choose a technique for each kept column: keyed pseudonyms, generalisation, shorter codes or text redaction.
3. Tune searches settings such as age bands, merged areas and time detail against the real question scores. If coarsening breaks a question, it brings back a safe column and searches again.
4. Transform applies the techniques, uses a different key for every recipient, and shuffles rows so their order reveals nothing.
5. Verify checks the output against the originals and the challenge's attacks, then releases, holds for review or blocks. Rows that still stand out are removed, along with their linked rows in other tables.
6. Report writes a dashboard: every field and why it was treated that way, each question with its original and protected answers, the risks that remain, and a browser for the protected records.
A local web app puts this behind four steps: upload or pick data, describe the recipient, confirm unsure columns, run. It shows the gate working live and offers only the protected data and its evidence for download.

Results (self-assessment with pets-eval, public attackers)
Hospital research release (HEALTH-S1): privacy 1.00, usefulness 0.97, 97.8% of rows kept. The challenge's classic baseline reaches 0.79 usefulness.
Contact-centre chats for an AI vendor (CS-S1): privacy 1.00, usefulness 0.97. 0.17% of identifying values survive in held-out chats.
Security logs for a monitoring provider (CYBER-S1): usefulness 0.99, all ten detection questions still work.
A public dashboard scenario is blocked, because the engine makes row-level releases only.
The surprise HR file, with meaningless column names: we wrote a scenario for pay researchers with four questions. After a person confirmed three unsure columns, it released with usefulness 0.95 and every row matching at least five others.

How we built it
Python and pandas, with scikit-learn for the column detector and the challenge's pets-eval toolkit for scoring. The web app is FastAPI and React, scaffolded with blacksmith-cli, a team member's open-source tool. We trained the detector on the public field catalogue and measured it on datasets it never saw, reaching macro-F1 0.85. Text redaction uses layers instead of a large model: formats and cue words in Finnish, Swedish and English, spoken numbers, the person's own record, and names the data owner already holds. We checked it on three kinds of text we never tuned on. No outside service sees the data. We used Claude Code as an AI coding assistant.

Challenges
The gate caught our own mistakes. It blocked a release where a revisit question had silently broken, which led to the repair step. It caught a join key left raw in one table and pseudonymised in another. Inspecting the output by hand, we found that rows kept in arrival order revealed each visit's date even with the date removed. Shuffling and a new gate check fixed it. We also found that the scorer's look-alike check ignores derived columns such as age band, so the engine runs its own stricter check.

What still isn't solved
The organisers' hidden attackers weren't available, so we built a stronger attacker of our own. On the hospital release, the clue columns single out nobody, but someone who already knows a patient's diagnosis can single out 27% of visits. 74% of patients with repeat visits have a unique visit pattern. Security logs keep minute-level timestamps because detection needs them, so their privacy score is 0.32. We report these numbers instead of hiding them.

Next steps
Differentially private aggregates so public releases aren't blocked, protection across a person's repeat records, and sign-in so the web app can serve a team.

## MLH questions
- GenAI tools used: Claude Code (Anthropic).
- Did you implement a generative AI model or API in the project? No.

## Links to fill in
- Repository:
- Demo video (YouTube, unlisted):
- Source ZIP: under 100 MB, without `.venv`, `runs`, `.env` or challenge data.
