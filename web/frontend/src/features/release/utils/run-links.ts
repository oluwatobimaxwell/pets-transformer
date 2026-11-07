import { API_URL } from '@/shared/utils/api-url'

/** Plain links the browser opens itself: the dashboard and the two allowed downloads. */
export function dashboardUrl(runId: string) {
  return `${API_URL}/api/runs/${runId}/dashboard/`
}

export function downloadUrl(runId: string, part: 'release' | 'evidence') {
  return `${API_URL}/api/runs/${runId}/download/${part}/`
}
