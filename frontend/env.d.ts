/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  clicky?: {
    log: (
      href: string,
      title: string,
      type?: "click" | "download" | "outbound" | "pageview"
    ) => void
  }
  clicky_custom?: {
    href?: string
  }
}
