<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"

import { Check, Copy, RotateCcw, Share2 } from "lucide-vue-next"

import developersData from "@/data/developers.json"
import type { Developer } from "@/types/developer"

type StackCategoryID = "framework" | "hosting" | "database" | "analytics" | "email" | "payments"

interface StackOption {
  id: string
  name: string
  categoryID: StackCategoryID
  monthlyCost: number
  note: string
  aliases: string[]
}

interface StackCategory {
  id: StackCategoryID
  label: string
  options: StackOption[]
}

const route = useRoute()
const router = useRouter()
const developers = developersData.developers as Developer[]
const founderName = ref("")
const productURL = ref("")
const copied = ref(false)
const selectedOptionIDs = ref<string[]>([])

const stackCategories: StackCategory[] = [
  {
    id: "framework",
    label: "Framework",
    options: [
      stackOption("nextjs", "Next.js", "framework", 0, "Common React choice", ["Next.js"]),
      stackOption("vue", "Vue", "framework", 0, "Simple product UI", ["Vue", "Vue.js"]),
      stackOption("react", "React", "framework", 0, "Flexible frontend", ["React"]),
      stackOption("laravel", "Laravel", "framework", 0, "Full-stack PHP", ["Laravel", "PHP"]),
    ],
  },
  {
    id: "hosting",
    label: "Hosting",
    options: [
      stackOption("vercel", "Vercel", "hosting", 20, "Fast frontend hosting", ["Vercel"]),
      stackOption("render", "Render", "hosting", 19, "Managed app hosting", ["Render"]),
      stackOption("cloudflare", "Cloudflare", "hosting", 5, "Edge and DNS", ["Cloudflare"]),
      stackOption("hetzner", "Hetzner", "hosting", 8, "Cheap VPS hosting", ["Hetzner"]),
    ],
  },
  {
    id: "database",
    label: "Database",
    options: [
      stackOption("postgresql", "PostgreSQL", "database", 15, "Default SaaS database", [
        "PostgreSQL",
      ]),
      stackOption("supabase", "Supabase", "database", 25, "Postgres plus auth", ["Supabase"]),
      stackOption("mysql", "MySQL", "database", 15, "Classic relational DB", ["MySQL"]),
      stackOption("firebase", "Firebase", "database", 25, "App backend bundle", ["Firebase"]),
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    options: [
      stackOption("posthog", "PostHog", "analytics", 0, "Product analytics", ["PostHog"]),
      stackOption("plausible", "Plausible", "analytics", 9, "Simple web analytics", ["Plausible"]),
      stackOption("sentry", "Sentry", "analytics", 0, "Errors first", ["Sentry"]),
    ],
  },
  {
    id: "email",
    label: "Email",
    options: [
      stackOption("resend", "Resend", "email", 20, "Product email", ["Resend"]),
      stackOption("mailgun", "Mailgun", "email", 15, "Transactional email", ["Mailgun"]),
      stackOption("loops", "Loops", "email", 49, "Lifecycle email", ["Loops"]),
    ],
  },
  {
    id: "payments",
    label: "Payments",
    options: [
      stackOption("stripe", "Stripe", "payments", 0, "Payments and billing", ["Stripe"]),
      stackOption("lemonsqueezy", "Lemon Squeezy", "payments", 0, "Merchant of record", [
        "Lemon Squeezy",
      ]),
      stackOption("paddle", "Paddle", "payments", 0, "Merchant of record", ["Paddle"]),
    ],
  },
]

const allOptions = computed(() => stackCategories.flatMap((category) => category.options))
const selectedOptions = computed(() =>
  allOptions.value.filter((option) => selectedOptionIDs.value.includes(option.id))
)
const selectedByCategory = computed(() => {
  const selected = new Map<StackCategoryID, StackOption[]>()
  for (const option of selectedOptions.value) {
    selected.set(option.categoryID, [...(selected.get(option.categoryID) || []), option])
  }
  return selected
})
const monthlyCost = computed(() =>
  selectedOptions.value.reduce((total, option) => total + option.monthlyCost, 0)
)
const stackHandle = computed(() => {
  const trimmedFounder = founderName.value.trim()
  if (trimmedFounder) {
    return trimmedFounder.startsWith("@") ? trimmedFounder : `@${trimmedFounder}`
  }
  const trimmedProductURL = productURL.value.trim()
  if (trimmedProductURL) {
    return urlHost(trimmedProductURL)
  }
  return "My indie SaaS stack"
})
const receiptLines = computed(() =>
  stackCategories.map((category) => ({
    label: category.label,
    tools: selectedByCategory.value.get(category.id)?.map((option) => option.name) || ["Not set"],
  }))
)
const matchingDevelopers = computed(() => {
  const selectedAliases = selectedOptions.value.flatMap((option) =>
    option.aliases.map((alias) => alias.toLowerCase())
  )
  if (!selectedAliases.length) {
    return developers.slice(0, 3)
  }
  return developers
    .map((developer) => ({
      developer,
      score: developer.tools.filter((tool) => selectedAliases.includes(tool.toLowerCase())).length,
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.developer.name.localeCompare(b.developer.name))
    .slice(0, 4)
    .map((match) => match.developer)
})
const shareURL = computed(() => {
  const params = new URLSearchParams()
  if (founderName.value.trim()) {
    params.set("founder", founderName.value.trim())
  }
  if (productURL.value.trim()) {
    params.set("product", productURL.value.trim())
  }
  if (selectedOptionIDs.value.length) {
    params.set("stack", selectedOptionIDs.value.join(","))
  }
  const query = params.toString()
  return `${window.location.origin}${route.path}${query ? `?${query}` : ""}`
})

watch([founderName, productURL, selectedOptionIDs], updateURL, { deep: true })

onMounted(() => {
  hydrateFromRoute()
  document.dispatchEvent(new Event("custom-render-trigger"))
})

function stackOption(
  id: string,
  name: string,
  categoryID: StackCategoryID,
  monthlyCost: number,
  note: string,
  aliases: string[]
): StackOption {
  return { id, name, categoryID, monthlyCost, note, aliases }
}

function hydrateFromRoute() {
  founderName.value = stringQueryValue(route.query.founder)
  productURL.value = stringQueryValue(route.query.product)
  const routeStack = stringQueryValue(route.query.stack)
  const validIDs = new Set(allOptions.value.map((option) => option.id))
  selectedOptionIDs.value = routeStack.split(",").filter((id) => validIDs.has(id))
}

function stringQueryValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value[0] || ""
  }
  return typeof value === "string" ? value : ""
}

function toggleOption(optionID: string) {
  selectedOptionIDs.value = selectedOptionIDs.value.includes(optionID)
    ? selectedOptionIDs.value.filter((id) => id !== optionID)
    : [...selectedOptionIDs.value, optionID]
}

function updateURL() {
  const params = new URLSearchParams()
  if (founderName.value.trim()) {
    params.set("founder", founderName.value.trim())
  }
  if (productURL.value.trim()) {
    params.set("product", productURL.value.trim())
  }
  if (selectedOptionIDs.value.length) {
    params.set("stack", selectedOptionIDs.value.join(","))
  }
  const query = Object.fromEntries(params.entries())
  router.replace({ path: route.path, query })
}

async function copyShareURL() {
  await navigator.clipboard.writeText(shareURL.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1800)
}

async function shareStack() {
  const text = `${stackHandle.value}: ${selectedOptions.value.map((option) => option.name).join(", ")}`
  if (navigator.share) {
    await navigator.share({ title: "My indie SaaS stack", text, url: shareURL.value })
  } else {
    await copyShareURL()
  }
}

function resetStack() {
  founderName.value = ""
  productURL.value = ""
  selectedOptionIDs.value = []
}

function urlHost(value: string): string {
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`)
    return url.hostname.replace(/^www\./, "")
  } catch {
    return value
  }
}
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-10">
    <div class="mb-8 max-w-3xl">
      <RouterLink to="/indie-developer-tech-stacks" class="text-sm text-muted-foreground underline">
        Back to real indie stacks
      </RouterLink>
      <h1 class="mt-4 text-4xl font-bold">SaaS tech stack generator for indie founders</h1>
      <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
        Pick the tools you use, get a shareable indie stack card, and compare it with real
        IndieDevUse profiles.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section class="space-y-5">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium">Founder handle</span>
            <input
              v-model="founderName"
              class="mt-2 w-full rounded-lg border bg-background px-3 py-2"
              placeholder="@yourhandle"
              type="text"
            />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Product URL</span>
            <input
              v-model="productURL"
              class="mt-2 w-full rounded-lg border bg-background px-3 py-2"
              placeholder="yourproduct.com"
              type="text"
            />
          </label>
        </div>

        <div
          v-for="category in stackCategories"
          :key="category.id"
          class="rounded-lg border bg-card p-5"
        >
          <h2 class="text-lg font-semibold">{{ category.label }}</h2>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              v-for="option in category.options"
              :key="option.id"
              type="button"
              class="flex min-h-20 items-start gap-3 rounded-lg border px-4 py-3 text-left transition hover:border-primary/50"
              :aria-pressed="selectedOptionIDs.includes(option.id)"
              :class="
                selectedOptionIDs.includes(option.id)
                  ? 'border-primary bg-primary/5'
                  : 'bg-background'
              "
              @click="toggleOption(option.id)"
            >
              <span
                class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border"
                :class="
                  selectedOptionIDs.includes(option.id)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border'
                "
              >
                <Check v-if="selectedOptionIDs.includes(option.id)" class="h-3.5 w-3.5" />
              </span>
              <span>
                <span class="block font-medium">{{ option.name }}</span>
                <span class="mt-1 block text-sm text-muted-foreground">
                  {{ option.note }} ·
                  {{ option.monthlyCost ? `$${option.monthlyCost}/mo` : "$0/mo" }}
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <aside class="lg:sticky lg:top-6 lg:self-start">
        <div class="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div class="border-b bg-muted/40 px-5 py-4">
            <div class="text-sm uppercase tracking-wide text-muted-foreground">
              Indie stack receipt
            </div>
            <div class="mt-1 text-2xl font-bold">{{ stackHandle }}</div>
          </div>
          <div class="space-y-4 p-5">
            <div v-for="line in receiptLines" :key="line.label" class="flex justify-between gap-4">
              <span class="text-muted-foreground">{{ line.label }}</span>
              <span class="text-right font-medium">{{ line.tools.join(", ") }}</span>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between gap-4 text-lg font-bold">
                <span>Estimated monthly cost</span>
                <span>${{ monthlyCost }}</span>
              </div>
              <p class="mt-2 text-sm text-muted-foreground">
                Rough public-entry-plan estimate. Payment processors still take transaction fees.
              </p>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                @click="copyShareURL()"
              >
                <Copy class="h-4 w-4" />
                {{ copied ? "Copied" : "Copy link" }}
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border px-3 py-2"
                aria-label="Share stack"
                @click="shareStack()"
              >
                <Share2 class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border px-3 py-2"
                aria-label="Reset stack"
                @click="resetStack()"
              >
                <RotateCcw class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-lg border bg-card p-5">
          <h2 class="text-lg font-semibold">Real IndieDevUse examples</h2>
          <div class="mt-4 space-y-3">
            <RouterLink
              v-for="developer in matchingDevelopers"
              :key="developer.id"
              :to="`/developer/${developer.id}`"
              class="block rounded-lg border bg-background p-3 hover:border-primary/50"
            >
              <span class="font-medium">{{ developer.name }}</span>
              <span class="mt-1 block text-sm text-muted-foreground">
                {{ developer.tools.slice(0, 6).join(", ") }}
              </span>
            </RouterLink>
          </div>
          <RouterLink
            to="/indie-developer-tech-stacks"
            class="mt-4 inline-block text-sm text-muted-foreground underline hover:text-primary"
          >
            Browse the tech stack comparison
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>
