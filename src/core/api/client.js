import { API_BASE_URL } from '@/core/config/env'

export const apiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers)
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(apiUrl(path), { ...options, headers })
  if (!response.ok) {
    const contentType = response.headers.get('content-type') || ''
    const errorBody = contentType.includes('application/json')
      ? await response.json()
      : await response.text()
    const message = typeof errorBody === 'string' ? errorBody : errorBody.detail
    throw new Error(message || `API 요청에 실패했습니다. (${response.status})`)
  }

  if (response.status === 204) return null
  return response.json()
}
