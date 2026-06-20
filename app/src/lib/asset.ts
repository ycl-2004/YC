// Resolves a public asset path against Vite's base URL so it works both
// locally and when served from a subpath (e.g. /YC/).
export const asset = (p: string): string =>
  `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
