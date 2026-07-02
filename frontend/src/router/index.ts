import { createRouter, createWebHistory } from "vue-router"

import { APP_NAME, APP_SITE } from "@/constants"
import developersData from "@/data/developers.json"
import { updateMetaTags } from "@/lib/meta"
import type { Developer } from "@/types/developer"
import AboutView from "@/views/AboutView.vue"
import DeveloperView from "@/views/DeveloperView.vue"
import HomeView from "@/views/HomeView.vue"
import StackGeneratorView from "@/views/StackGeneratorView.vue"
import TechStacksView from "@/views/TechStacksView.vue"

const developers = developersData.developers as Developer[]

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
          "Explore the apps, tools, and workflows indie developers use to build products. Learn from real tech stacks and productivity setups.",
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
      path: "/indie-developer-tech-stacks",
      name: "tech-stacks",
      component: TechStacksView,
      meta: {
        title: `Indie Developer Tech Stacks — ${APP_NAME}`,
        description:
          "Compare real indie developer tech stacks from public IndieDevUse profiles, including tools for web apps, infrastructure, mobile apps, and games.",
      },
    },
    {
      path: "/saas-tech-stack-generator",
      name: "stack-generator",
      component: StackGeneratorView,
      meta: {
        title: `SaaS Tech Stack Generator for Indie Founders — ${APP_NAME}`,
        description:
          "Build a shareable indie SaaS tech stack card with framework, hosting, database, analytics, email, payments, estimated monthly cost, and real IndieDevUse examples.",
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
  let developer: Developer | undefined

  if (to.name === "developer" && to.params.id) {
    const developerID = to.params.id as string
    developer = developers.find((dev) => dev.id === developerID)
    const developerName = developer?.name || developerID
    title = developer
      ? developerTitle(developer)
      : `${developerName}'s Indie Developer Stack — ${APP_NAME}`
    description = developer
      ? developerMetaDescription(developer)
      : `${developerName}'s indie developer stack on ${APP_NAME}. Explore their apps, tools, services, and workflow.`
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
  updateStructuredData(developer, canonicalURL)
  const robotsContent = shouldIndexRoute(to.name, developer) ? "index, follow" : "noindex, follow"

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
  if (existingRobots) {
    existingRobots.setAttribute("content", robotsContent)
  } else {
    const robotsTag = document.createElement("meta")
    robotsTag.setAttribute("name", "robots")
    robotsTag.setAttribute("content", robotsContent)
    document.head.appendChild(robotsTag)
  }

  next()
})

export default router

function developerTitle(developer: Developer): string {
  return `${developer.name} Indie Developer Stack — ${APP_NAME}`
}

function developerMetaDescription(developer: Developer): string {
  if (developer.seoSummary) {
    return fitMetaDescription(developer.seoSummary)
  }
  const prefix = `${developer.name}'s indie developer stack`
  const suffix = ". See apps, frameworks, services, and workflow."
  const visibleTools: string[] = []
  for (const tool of developer.tools) {
    const nextTools = [...visibleTools, tool]
    const nextDescription = `${prefix}: ${nextTools.join(", ")}${suffix}`
    if (nextDescription.length > 155) {
      break
    }
    visibleTools.push(tool)
  }
  const toolsText = visibleTools.length ? `: ${visibleTools.join(", ")}` : ""
  const description = `${prefix}${toolsText}${suffix}`
  if (description.length >= 120) {
    return description
  }
  const expandedDescription = `${description} Explore how they build and ship products.`
  if (expandedDescription.length <= 155) {
    return expandedDescription
  }
  return description
}

function fitMetaDescription(description: string): string {
  if (description.length <= 155) {
    return description
  }
  return `${description.substring(0, 152).trim()}...`
}

function shouldIndexRoute(
  routeName: string | symbol | null | undefined,
  developer: Developer | undefined
): boolean {
  if (routeName === "developer") {
    return developer !== undefined
  }
  return (
    routeName === "home" ||
    routeName === "about" ||
    routeName === "tech-stacks" ||
    routeName === "stack-generator"
  )
}

function updateStructuredData(developer: Developer | undefined, canonicalURL: string) {
  const existingScript = document.querySelector(
    'script[type="application/ld+json"][data-seo="profile"]'
  )
  if (!developer) {
    existingScript?.remove()
    return
  }
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: developer.name,
      description: developer.seoSummary || developer.bio,
      url: canonicalURL,
      image: `${APP_SITE}${developer.avatar}`,
      sameAs: [developer.link.url, developer.socialMediaLink].filter(Boolean),
      knowsAbout: developer.tools,
      homeLocation: developer.location ? { "@type": "Place", name: developer.location } : undefined,
    },
  }
  const script = existingScript || document.createElement("script")
  script.setAttribute("type", "application/ld+json")
  script.setAttribute("data-seo", "profile")
  script.textContent = JSON.stringify(structuredData)
  if (!existingScript) {
    document.head.appendChild(script)
  }
}
