/**
 * API Client Configuration
 *
 * Points the generated client at the backend. The tool runs locally with no sign-in, so there are no auth interceptors.
 * `blacksmith sync` regenerates client.gen.ts; this configuration is applied at startup, so it survives every sync.
 */

import { client } from './generated/client.gen'
import { API_URL } from '@/shared/utils/api-url'

client.setConfig({ baseUrl: API_URL })
