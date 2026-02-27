import { createRouter, createWebHistory } from "vue-router"

import { APP_NAME, APP_SITE } from "@/constants"
import developersData from "@/data/developers.json"
import { updateMetaTags } from "@/lib/meta"
import AboutView from "@/views/AboutView.vue"
import DeveloperView from "@/views/DeveloperView.vue"
import HomeView from "@/views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: `${APP_NAME} — Discover What Apps and Tools Indie Developers Use`,
        description:
          "Explore the tools, apps, and workflows that successful indie developers use to build their products. Learn from real developers' tech stacks and productivity setups.",
      },
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: {
        title: `About — ${APP_NAME}`,
        description:
          "Learn more about IndieDevUse and our mission to help developers discover the best tools for their workflow.",
      },
    },
    {
      path: "/developer/:id",
      name: "developer",
      component: DeveloperView,
    },
  ],
})

function dropTrailingSlash(path: string): string {
  if (path.endsWith("/")) {
    return path.substring(0, path.length - 1)
  } else {
    return path
  }
}

router.beforeEach((to, from, next) => {
  let title = ""
  let description = ""

  if (to.name === "developer" && to.params.id) {
    const developerID = to.params.id as string
    const developer = developersData.developers.find((dev) => dev.id === developerID)
    const developerName = developer?.name || developerID
    title = `${developerName} (${developerID}) Developer Stack — ${APP_NAME}`
    const toolsSuffix = developer?.tools?.length ? `: ${developer.tools.join(", ")}` : ""
    description = `${developerName} uses this stack${toolsSuffix}`
  } else if (to.meta) {
    const meta: Record<string, string> = to.meta as Record<string, string>
    title = meta.title || ""
    description = meta.description || ""
  }

  const canonicalURL = `${APP_SITE}${dropTrailingSlash(to.path)}`
  const ogImage =
    to.name === "developer"
      ? `https://api.myog.social/og?url=${encodeURIComponent(canonicalURL)}`
      : `${APP_SITE}/og.png`

  if (title) {
    document.title = title
  }

  const metaTags = [
    { name: "description", content: description },
    { property: "og:site_name", content: APP_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalURL },
    { property: "og:type", content: "website" },
    { property: "og:image", content: ogImage },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: (to.meta?.ogImage as string) || ogImage },
    { name: "twitter:image:alt", content: APP_NAME },
    { name: "twitter:card", content: "summary_large_image" },
  ]

  updateMetaTags(metaTags)

  const existingCanonical = document.querySelector('link[rel="canonical"]')
  if (existingCanonical) {
    existingCanonical.setAttribute("href", canonicalURL)
  } else {
    const canonicalTag = document.createElement("link")
    canonicalTag.setAttribute("rel", "canonical")
    canonicalTag.setAttribute("href", canonicalURL)
    document.head.appendChild(canonicalTag)
  }

  const existingRobots = document.querySelector('meta[name="robots"]')
  if (!existingRobots) {
    const robotsTag = document.createElement("meta")
    robotsTag.setAttribute("name", "robots")
    robotsTag.setAttribute("content", "index, follow")
    document.head.appendChild(robotsTag)
  }

  next()
})

export default router
