import { createRouter, createWebHistory } from "vue-router"

import { APP_NAME, APP_SITE } from "@/constants"
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
      meta: {
        title: `Developer Profile — ${APP_NAME}`,
        description:
          "Discover the tools and apps used by this indie developer to build their products.",
      },
    },
  ],
})

function dropTrailingSlash(path: string): string {
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path
}

router.beforeEach((to, from, next) => {
  if (to.meta) {
    const meta: Record<string, string> = to.meta as Record<string, string>
    const canonicalURL = `${APP_SITE}${dropTrailingSlash(to.path)}`

    if (meta.title) {
      document.title = meta.title
    }

    const metaTags = [
      { name: "description", content: meta.description },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:title", content: meta.title },
      { property: "og:description", content: meta.description },
      { property: "og:url", content: canonicalURL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${APP_SITE}/og.png` },
      { name: "twitter:title", content: meta.title },
      { name: "twitter:description", content: meta.description },
      { name: "twitter:image", content: meta.ogImage },
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
  }

  next()
})

export default router
