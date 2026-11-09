import '../client'
import { client } from '../generated/client.gen'
import { parseApiError, shouldRetryRequest } from '@/shared/utils/api-error'

function answering(status: number, body: string, type = 'application/json') {
  return async () => new Response(body, { status, headers: { 'Content-Type': type } })
}

async function failure(fetch: typeof globalThis.fetch) {
  try {
    await client.get({ baseUrl: 'http://localhost', url: '/api/anything/', fetch, throwOnError: true })
  } catch (error) {
    return error
  }
  throw new Error('the request should have failed')
}

describe('API client errors', () => {
  it("shows the server's own message", async () => {
    const error = await failure(answering(400, JSON.stringify({ detail: "visits.csv isn't saved as UTF-8 text." })))

    expect(parseApiError(error)).toEqual({ status: 400, message: "visits.csv isn't saved as UTF-8 text.", fieldErrors: {} })
  })

  it('keeps field errors for forms', async () => {
    const error = await failure(answering(400, JSON.stringify({ recipient: ['This field is required.'] })))

    expect(parseApiError(error).fieldErrors).toEqual({ recipient: ['This field is required.'] })
  })

  it('knows a missing item from an outage, so only the outage is retried', async () => {
    expect(shouldRetryRequest(0, await failure(answering(404, JSON.stringify({ detail: 'No run with that id.' }))))).toBe(false)
    expect(shouldRetryRequest(0, await failure(answering(503, '')))).toBe(true)
  })

  it('reads a plain-text error', async () => {
    const error = await failure(answering(502, 'Bad gateway', 'text/plain'))

    expect(parseApiError(error)).toMatchObject({ status: 502, message: 'Bad gateway' })
  })
})
