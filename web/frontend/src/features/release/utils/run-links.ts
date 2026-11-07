import { API_URL } from '@/shared/utils/api-url'

/** A plain link the browser opens itself, for the two parts of a run that may leave the machine. */
export function downloadUrl(runId: string, part: 'release' | 'evidence') {
  return `${API_URL}/api/runs/${runId}/download/${part}/`
}
