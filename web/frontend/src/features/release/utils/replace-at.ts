/** A copy of the list with one item swapped. */
export function replaceAt(list: string[], index: number, value: string) {
  return list.map((item, i) => (i === index ? value : item))
}
