/**
 * API Client Configuration
 *
 * Points the generated client at the backend. The tool runs locally with no sign-in, so there are no auth interceptors.
 * `blacksmith sync` regenerates client.gen.ts; this configuration is applied at startup, so it survives every sync.
 */

import { client } from './generated/client.gen'
import { API_URL } from '@/shared/utils/api-url'

client.setConfig({ baseUrl: API_URL })

// The generated client throws a failed response's body on its own, without its status. Keep the two together, in
// the shape parseApiError reads, so the server's own message reaches the person instead of "An unexpected error
// occurred.", and a 404 isn't retried like an outage. A network failure has no response and passes through as it is.
client.interceptors.error.use((error, response) => (response ? { status: response.status, error } : error))
