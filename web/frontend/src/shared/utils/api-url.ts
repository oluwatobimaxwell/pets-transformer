/**
 * Base URL of the backend API. Empty means the page's own address, where the Vite dev server and the Docker image's nginx both pass
 * /api on to the backend. Override with VITE_API_URL in `.env`.
 */
export const API_URL = import.meta.env.VITE_API_URL ?? ''
