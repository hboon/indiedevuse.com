<script setup lang="ts">
import { computed, onMounted } from "vue"
import { RouterLink } from "vue-router"

import developersData from "@/data/developers.json"
import type { Developer } from "@/types/developer"

const developers = developersData.developers as Developer[]

const topTools = computed(() => {
  const toolCounts = new Map<string, { name: string; count: number }>()
  for (const developer of developers) {
    for (const tool of developer.tools) {
      const key = tool.toLowerCase()
      const existingTool = toolCounts.get(key)
      toolCounts.set(key, {
        name: existingTool?.name || tool,
        count: (existingTool?.count || 0) + 1,
      })
    }
  }
  return [...toolCounts.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 12)
})

const profileGroups = computed(() => [
  {
    title: "Solo and bootstrapped web products",
    developers: developers.filter((developer) =>
      developer.tools.some((tool) =>
        ["next.js", "vue", "vue.js", "react", "tailwind css", "stripe", "postgresql"].includes(
          tool.toLowerCase()
        )
      )
    ),
  },
  {
    title: "Infrastructure-heavy builders",
    developers: developers.filter((developer) =>
      developer.tools.some((tool) =>
        ["docker", "kubernetes", "aws", "cloudflare", "hetzner", "gitlab ci/cd"].includes(
          tool.toLowerCase()
        )
      )
    ),
  },
  {
    title: "App and game builders",
    developers: developers.filter((developer) =>
      developer.tools.some((tool) =>
        ["flutter", "swift", "kotlin", "godot game engine", "gdscript"].includes(tool.toLowerCase())
      )
    ),
  },
])

onMounted(() => {
  document.dispatchEvent(new Event("custom-render-trigger"))
})
</script>

<template>
  <div class="container mx-auto px-4 py-10 max-w-6xl">
    <div class="max-w-3xl mb-10">
      <RouterLink to="/" class="text-sm text-muted-foreground hover:text-primary underline">
        Back to all indie developers
      </RouterLink>
      <h1 class="text-4xl font-bold mt-4 mb-4">Indie developer tech stacks</h1>
      <p class="text-lg text-muted-foreground leading-relaxed">
        People keep asking what stack indie developers use. The useful answer is not a perfect
        template. It is a set of real choices from people shipping their own products.
      </p>
      <p class="text-lg text-muted-foreground leading-relaxed mt-4">
        This page pulls from the public profiles on IndieDevUse. Some profiles are self-submitted;
        some are owner-curated from public sources and marked on the profile page.
      </p>
    </div>

    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Common tools in the current profiles</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div v-for="tool in topTools" :key="tool.name" class="border rounded-lg p-4 bg-card">
          <div class="font-semibold">{{ tool.name }}</div>
          <div class="text-sm text-muted-foreground mt-1">
            {{ tool.count }} {{ tool.count === 1 ? "profile" : "profiles" }}
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-10">
      <div v-for="group in profileGroups" :key="group.title">
        <h2 class="text-2xl font-bold mb-4">{{ group.title }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="developer in group.developers"
            :key="`${group.title}-${developer.id}`"
            :to="`/developer/${developer.id}`"
            class="border rounded-lg p-5 bg-card hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div class="font-semibold text-lg">{{ developer.name }}</div>
            <div class="text-xs text-muted-foreground mt-1">
              {{
                developer.provenance.sourceType === "owner-curated"
                  ? "Owner-curated"
                  : "Self-submitted"
              }}
            </div>
            <div class="text-sm text-muted-foreground mt-2">
              {{ developer.seoSummary || developer.tools.slice(0, 5).join(", ") }}
            </div>
            <div class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="tool in developer.tools.slice(0, 5)"
                :key="tool"
                class="text-xs rounded-full bg-muted px-2 py-1 text-muted-foreground"
              >
                {{ tool }}
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <div class="mt-12 border-t pt-8 text-muted-foreground">
      Building something with a different stack?
      <a
        href="https://github.com/hboon/indiedevuse.com/blob/main/README.md"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary underline"
      >
        Add your profile with a GitHub Pull Request
      </a>
      , or use the correction link on a profile page if something is wrong.
    </div>
  </div>
</template>
