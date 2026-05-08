/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_WS_BASIC_URL: string | undefined
  VITE_WS_DETAILS_URL: string | undefined
  VITE_WS_RECONNECT_INITIAL_DELAY: string | undefined
  VITE_WS_RECONNECT_MAX_DELAY: string | undefined
  VITE_WS_RECONNECT_MAX_ATTEMPTS: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
