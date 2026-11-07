import { API_URL } from '@/shared/utils/api-url'

/** Plain links the browser opens itself: the dashboard and the two allowed downloads. A theme makes the dashboard match the app. */
export function dashboardUrl(runId: string, theme?: 'light' | 'dark') {
  return `${API_URL}/api/runs/${runId}/dashboard/${theme ? `?theme=${theme}` : ''}`
}

export function downloadUrl(runId: string, part: 'release' | 'evidence') {
  return `${API_URL}/api/runs/${runId}/download/${part}/`
}
