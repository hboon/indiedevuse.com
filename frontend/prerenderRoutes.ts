import { readFileSync } from "node:fs"
import { join } from "node:path"

export function getPrerenderRoutes(): string[] {
  const developersData = JSON.parse(
    readFileSync(join(__dirname, "src/data/developers.json"), "utf-8")
  )
  const developerRoutes = developersData.developers.map(
    (dev: { id: string }) => `/developer/${dev.id}`
  )
  return ["/", "/about", ...developerRoutes]
}
