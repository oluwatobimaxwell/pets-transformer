import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { client } from '@/api/generated/client.gen'
import { Provider } from '@/shared/components/ui/provider'
import { routes } from '../routes'

/** Synthetic API answers in the backend's schemas. */
const SAMPLES = [{ name: 'health', tables: ['visits'], size_mb: 1.2 }, { name: 'cyber', tables: ['logs'], size_mb: 3.4 }]
const DATASET = { id: 'ds1', name: 'health', source: 'sample', tables: [{ name: 'visits', columns: ['name', 'age', 'diagnosis'] }] }
const SCENARIOS = [{ id: 'HEALTH-S1', dataset: 'health', title: 'Research release', recipient: 'University research group', purpose: 'Study stays.',
  trust_level: 'controlled_research', k: 5, task_ids: ['H1', 'H2'], public_output: null }]
const COLUMNS = [
  { key: 'visits.name', table: 'visits', column: 'name', role: 'direct_identifier', subtype: 'person_name', confidence: 0.99, needs_review: false, reasons: [], best_guess_role: 'direct_identifier', best_guess_subtype: 'person_name' },
  { key: 'visits.age', table: 'visits', column: 'age', role: 'quasi_identifier', subtype: 'age', confidence: 0.6, needs_review: true, reasons: [], best_guess_role: 'quasi_identifier', best_guess_subtype: 'age' },
]

let requests: { method: string; path: string; body: string }[] = []

async function fakeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const request = input instanceof Request ? input : new Request(input, init)
  const path = new URL(request.url).pathname
  const body = request.method === 'GET' ? '' : await request.text()
  requests.push({ method: request.method, path, body })
  const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
  if (path === '/api/samples/') return json(SAMPLES)
  if (path === '/api/datasets/sample/') return json(DATASET, 201)
  if (path === '/api/scenarios/') return json(SCENARIOS)
  if (path === '/api/datasets/ds1/columns/') return json(COLUMNS)
  if (path === '/api/runs/') return json([])
  return json({ detail: 'Not found.' }, 404)
}

function renderAt(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } } })
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <Provider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>,
  )
  return { router, user: userEvent.setup() }
}

beforeEach(() => {
  requests = []
  sessionStorage.clear()
  client.setConfig({ baseUrl: 'http://localhost', fetch: fakeFetch as typeof fetch })
})

describe('the landing page', () => {
  it('says what the tool does and links into the studio', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /protect the data/i })).toBeInTheDocument()
    const sample = screen.getAllByRole('link', { name: /try the healthcare sample/i })[0]!
    expect(sample).toHaveAttribute('href', '/release/data?sample=health')
    expect(screen.getByRole('link', { name: /open the studio/i })).toHaveAttribute('href', '/release/data')
  })

  it('shows the 3D demo with a tab per stage', async () => {
    const { user } = renderAt('/')
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(['01Detect', '02Attack', '03Protect', '04Release'])
    await user.click(tabs[3]!)
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('HEALTH-S1: released and sealed')
    expect(screen.getByRole('img', { name: /released and sealed/i })).toBeInTheDocument()
  })

  it('lists the results with a coloured trust tag per recipient', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Protection set by who receives the data' })).toBeInTheDocument()
    expect(screen.getAllByText('Anyone (public release)').length).toBeGreaterThan(0)
  })
})

describe('the release studio', () => {
  it('sends a step that is not open yet back to the first open step', async () => {
    const { router } = renderAt('/release/columns')
    await waitFor(() => expect(router.state.location.pathname).toBe('/release/data'))
    expect(await screen.findByRole('heading', { level: 1, name: /protect a dataset/i })).toBeInTheDocument()
  })

  it('opens /release on the data step', async () => {
    const { router } = renderAt('/release')
    await waitFor(() => expect(router.state.location.pathname).toBe('/release/data'))
  })

  it('registers the sample named in the link, then opens the recipient page', async () => {
    const { router } = renderAt('/release/data?sample=health')
    await waitFor(() => expect(router.state.location.pathname).toBe('/release/recipient'), { timeout: 4000 })
    expect(requests).toContainEqual({ method: 'POST', path: '/api/datasets/sample/', body: JSON.stringify({ name: 'health' }) })
    expect(await screen.findByRole('heading', { level: 1, name: /who receives it/i })).toBeInTheDocument()
  })

  it('walks the steps page by page, keeping every choice', async () => {
    const { router, user } = renderAt('/release/data')
    await user.click(await screen.findByRole('button', { name: /use health, healthcare/i }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/release/recipient'))

    // Continue waits for a recipient, and says why
    console.log('DEBUG', JSON.stringify(screen.queryAllByRole('button', { hidden: true }).map((b) => b.textContent)), JSON.stringify(screen.queryAllByRole('heading', { hidden: true }).map((b) => b.textContent)))
    const next = screen.getByRole('button', { name: /continue to columns/i })
    expect(next).toBeDisabled()
    expect(screen.getByText(/name the recipient or choose a scenario/i)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /use a challenge scenario/i }))
    await user.click(await screen.findByRole('radio', { name: /HEALTH-S1/ }))
    expect(next).toBeEnabled()
    await user.click(next)
    await waitFor(() => expect(router.state.location.pathname).toBe('/release/columns'))
    expect(await screen.findByText(/1 unsure column/i)).toBeInTheDocument()

    // Back keeps the chosen scenario
    await user.click(screen.getByRole('button', { name: /^back$/i }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/release/recipient'))
    expect(await screen.findByRole('radio', { name: /HEALTH-S1/ })).toHaveAttribute('aria-checked', 'true')
  })

  it('shows the run history page', async () => {
    renderAt('/runs')
    expect(await screen.findByRole('heading', { level: 1, name: 'Runs and results' })).toBeInTheDocument()
    expect(await screen.findByText('No runs yet')).toBeInTheDocument()
  })

  it('answers an unknown address with the 404 page', () => {
    renderAt('/nowhere')
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})
