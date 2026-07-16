const removeTrailingSlash = (value) => value.replace(/\/+$/, '')

export const FRONTEND_URL = removeTrailingSlash(
  process.env.VUE_APP_FRONTEND_URL || window.location.origin
)

export const ROUTER_BASE_PATH = process.env.VUE_APP_ROUTER_BASE_PATH || '/'

const developmentApiUrl = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8000'
  : ''

export const API_BASE_URL = removeTrailingSlash(
  process.env.VUE_APP_API_BASE_URL || developmentApiUrl
)
