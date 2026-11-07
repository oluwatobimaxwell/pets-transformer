/** Only CSV files become tables. */
export function isCsv(file: File) {
  return file.name.toLowerCase().endsWith('.csv')
}
