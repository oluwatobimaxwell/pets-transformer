/** The records list techniques in words, such as "keyed pseudonym"; the technique vocabulary is keyed by "keyed_pseudonym". */
export function techniqueKey(words: string) {
  return words.trim().replace(/ /g, '_')
}
