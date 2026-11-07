/** Plain words for the settings Tune chose: which kind of clue, and how coarse it was made. */
const SUBTYPES: Record<string, string> = {
  BIRTH_DATE: 'Birth date', AGE: 'Age', MUNICIPALITY: 'Area', LOCATION_NAME: 'Place', TIMESTAMP: 'Times', DATE: 'Dates',
  POSTCODE: 'Postcode', CATEGORY: 'Categories', GPS_COORDINATE: 'Coordinates',
}

const LEVELS: Record<string, string> = {
  exact: 'exact values', minute: 'to the minute', hour_stamp: 'to the hour', day: 'to the day', week: 'to the week', month: 'to the month',
  year: 'to the year', hour_of_day: 'hour of day only', age_5: '5-year bands', age_10: '10-year bands', age_20: '20-year bands',
  area_all: 'every area kept', area_top_16: '16 largest areas', area_top_8: '8 largest areas', postcode_3: 'first 3 digits',
  postcode_2: 'first 2 digits', rare_kept: 'every category kept', rare_200: 'rare ones merged', rare_binary: 'largest versus the rest',
  round_3: '3 decimals', round_2: '2 decimals', round_tens: 'rounded to tens',
}

export function tuningWords(subtype: string, level: string) {
  return { subtype: SUBTYPES[subtype] ?? subtype.toLowerCase().replace(/_/g, ' '), level: LEVELS[level] ?? level.replace(/_/g, ' ') }
}
