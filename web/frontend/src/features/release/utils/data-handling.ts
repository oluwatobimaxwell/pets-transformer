/** How the tool treats data, for the data-handling drawer. */
export const DATA_HANDLING = [
  { term: 'Where it runs', text: 'On this machine, with no sign-in. Never expose the app to a network.' },
  { term: 'What stays here', text: 'Uploaded data, keys and row maps stay in the workspace folder, which git ignores.' },
  { term: 'What the API serves', text: 'Only the protected release and its evidence, with a sample of the released rows. Never the original data or the row maps.' },
  { term: 'Pseudonyms', text: "Keyed with the secret in your .env file. Anyone with that key can link pseudonyms back, so it's never shared." },
  { term: 'No outside service', text: 'No large language model or outside service sees the data.' },
  { term: 'In this browser', text: 'Your choices and column names (never data values) stay in this tab until a run starts. The theme choice is remembered on this device.' },
]
