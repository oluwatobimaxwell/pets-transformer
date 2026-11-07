/** What each step of the wizard is for, and the few facts that make it easy to answer, in step order. */
export const WIZARD_HELP: { why: string; tips: string[] }[] = [
  {
    why: 'The gate works on a copy of your data on this machine. Each CSV file becomes one table, and files that share a column, such as a customer ID, are treated as linked.',
    tips: [
      'Nothing is sent anywhere else: the API runs on this machine and no outside service sees the data.',
      'New here? Start with a challenge dataset. They are synthetic and come with ready-made recipients.',
      'Large files take a little longer to read in step 3.',
    ],
  },
  {
    why: 'Protection depends on who gets the data. A trusted research group can receive rows with coarser clues; the public only ever gets noisy answers.',
    tips: [
      'The questions you list decide what is released: a column no question needs is removed, whatever it contains.',
      'Look-alikes per row: every released row must match at least this many others, so nobody stands out.',
      'Challenge scenarios come with their own questions and limits already set.',
    ],
  },
  {
    why: "Detect labelled every column from its values and its name. A column's label decides how it is protected, so check the ones Detect was unsure about.",
    tips: [
      'Identifies alone, such as names and ID numbers: pseudonymised with a secret key, or removed.',
      'Clues, such as age, area and time: coarsened until every row has look-alikes.',
      'Your decision always overrides Detect, and unsure columns count as private until you decide.',
    ],
  },
  {
    why: 'The gate now protects the data, then attacks it the way an adversary would and asks the recipient\'s questions of it. Nothing is released unless every check passes.',
    tips: [
      'Released: the protected data is ready to share with this recipient.',
      'Held for review: one thing needs a person\'s decision first.',
      'Blocked: a check failed, and the evidence says which one.',
    ],
  },
]
