<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import { SearchIcon, XIcon } from "lucide-vue-next"

import developersData from "@/data/developers.json"
import type { Developer } from "@/types/developer"

const route = useRoute()
const router = useRouter()
const developers = developersData.developers as Developer[]
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref(stringQueryValue(route.query.q))
const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())
const filteredDevelopers = computed(() => {
  if (!normalizedSearchQuery.value) {
    return developers
  }
  return developers.filter((developer) =>
    [
      developer.name,
      developer.seoSummary,
      developer.bio,
      ...developer.tools,
      developer.location,
    ].some((value) => value?.toLowerCase().includes(normalizedSearchQuery.value))
  )
})
const resultCountLabel = computed(
  () =>
    `${filteredDevelopers.value.length} developer${filteredDevelopers.value.length === 1 ? "" : "s"}`
)
let measurementTimer: number | undefined

watch(
  () => route.query.q,
  (query) => {
    const routeSearchQuery = stringQueryValue(query)
    if (routeSearchQuery !== searchQuery.value) {
      searchQuery.value = routeSearchQuery
    }
  }
)

onMounted(() => {
  document.dispatchEvent(new Event("custom-render-trigger"))
})

onBeforeUnmount(() => {
  window.clearTimeout(measurementTimer)
})

function stringQueryValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value[0] || ""
  }
  return typeof value === "string" ? value : ""
}

function handleSearchInput(event: Event) {
  const query = (event.target as HTMLInputElement).value
  searchQuery.value = query
  updateSearchURL(query)
  scheduleSearchMeasurement(query, filteredDevelopers.value.length)
}

function updateSearchURL(query: string) {
  const updatedQuery = { ...route.query }
  const trimmedQuery = query.trim()
  if (trimmedQuery) {
    updatedQuery.q = trimmedQuery
  } else {
    delete updatedQuery.q
  }
  router.replace({ path: route.path, query: updatedQuery })
}

function clearSearch() {
  window.clearTimeout(measurementTimer)
  searchQuery.value = ""
  updateSearchURL("")
  searchInput.value?.focus()
}

function scheduleSearchMeasurement(query: string, resultCount: number) {
  window.clearTimeout(measurementTimer)
  if (!query.trim()) {
    return
  }
  measurementTimer = window.setTimeout(() => {
    window.clicky?.log(
      "#directory-search",
      resultCount > 0 ? "Directory search with matches" : "Directory search with no matches",
      "click"
    )
  }, 750)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Indie Developers Use</h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Discover the tools and technologies that indie developers and bootstrapped founders use to
        build their products. Profiles are self-submitted or owner-curated from public sources.
      </p>
    </div>

    <div class="mx-auto mb-8 max-w-xl">
      <label for="developer-search" class="sr-only">Search developers</label>
      <div class="relative">
        <SearchIcon
          aria-hidden="true"
          class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="developer-search"
          ref="searchInput"
          type="search"
          :value="searchQuery"
          placeholder="Search developers"
          autocomplete="off"
          class="h-11 w-full rounded-lg border bg-background py-2 pl-10 pr-11 text-base outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          @input="handleSearchInput"
        />
        <button
          v-if="searchQuery"
          type="button"
          aria-label="Clear search"
          class="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="clearSearch"
        >
          <XIcon aria-hidden="true" class="h-4 w-4" />
        </button>
      </div>
      <p class="mt-2 text-sm text-muted-foreground" aria-live="polite">
        {{ resultCountLabel }}
      </p>
    </div>

    <div
      v-if="filteredDevelopers.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <a
        v-for="developer in filteredDevelopers"
        :key="developer.id"
        :href="`/developer/${developer.id}`"
        class="bg-card rounded-lg border p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-primary/50 block no-underline"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-24 h-24 rounded-full overflow-hidden mb-4 bg-muted">
            <img
              :src="developer.avatar"
              :alt="`${developer.name}'s avatar`"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="font-semibold text-lg">{{ developer.name }}</h3>
          <div class="mt-2 text-xs rounded-full bg-muted px-2 py-1 text-muted-foreground">
            {{
              developer.provenance.sourceType === "owner-curated"
                ? "Owner-curated"
                : "Self-submitted"
            }}
          </div>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ developer.seoSummary || developer.tools.slice(0, 4).join(", ") }}
          </p>
        </div>
      </a>
    </div>
    <div v-else class="rounded-lg border border-dashed px-6 py-12 text-center">
      <p class="font-medium">No developers found.</p>
      <button
        type="button"
        class="mt-2 text-sm text-muted-foreground underline"
        @click="clearSearch"
      >
        Clear search
      </button>
    </div>

    <div class="text-center mt-12 text-muted-foreground">
      Make a
      <a href="/saas-tech-stack-generator" class="hover:text-primary underline">
        shareable indie SaaS stack card
      </a>
      , compare the
      <a href="/indie-developer-tech-stacks" class="hover:text-primary underline">
        common indie developer tech stacks
      </a>
      , add yourself with a
      <a
        href="https://github.com/hboon/indiedevuse.com/blob/main/README.md"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary underline"
      >
        GitHub Pull Request
      </a>
      , or ask for a correction/removal on any profile page
    </div>
  </div>
</template>

<style scoped>
input[type="search"]::-webkit-search-cancel-button {
  appearance: none;
}
</style>
