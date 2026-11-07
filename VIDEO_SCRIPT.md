# Demo video script, about 1 minute 55 seconds

Record the screen at 1080p. Before recording, run the three scenarios so every dashboard is fresh, and close other windows.

| Time | On screen | Narration |
|---|---|---|
| 0:00–0:12 | Walkthrough page, step 1 | Hospitals want to share data with researchers. Removing names isn't enough: in this data, 98.9% of patients are the only person with their birth date, sex and postcode. |
| 0:12–0:30 | Terminal: `pets-engine run … --scenario HEALTH-S1` | PETs Transformer is a release gate. We tell it the recipient, a university research team, and it runs on its own. Watch the first attempt: the gate blocks it, because 2.4% of visits still stand out. It removes those and passes. |
| 0:30–0:50 | Dashboard, Fields, then "Removed" | Here's what it detected in every column, and the technique it chose for each. Forty columns are gone, because none of the researchers' questions need them. |
| 0:50–1:08 | Dashboard, Records: click a `pt…` code, then switch to the chat dashboard's turns | This is the protected data. Each patient has a keyed code, so revisits still link up. In customer chats, names, numbers and even spoken phone numbers become labels. |
| 1:08–1:28 | Dashboard, Usefulness: H-U2's before and after table | Is it still useful? Every question shows both answers. Median stay at triage level A is 302 minutes in the original and 301 protected. Usefulness is 0.97, against 0.79 for the challenge baseline. |
| 1:28–1:48 | Dashboard, Privacy risks: stronger attacker card | We also ran our own stronger attacker. The clues single out nobody, but someone who knows a diagnosis can single out 27% of visits. We report that instead of hiding it. |
| 1:48–1:55 | Dashboard header, verdict badge | PETs Transformer: tell it who gets the data, and it protects it, proves it's useful, or refuses. |

The walkthrough page's numbers come from the earlier hand-built test. Update it before recording, or use the dashboard for step 1 instead.
