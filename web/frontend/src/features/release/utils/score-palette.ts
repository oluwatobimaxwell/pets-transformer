/** Colour for a 0–1 score: red when broken or unanswerable, orange when rough, green when close or better. */
export function scorePalette(score: number | null) {
  return score === null || score < 0.5 ? 'red' : score < 0.8 ? 'orange' : 'green'
}
