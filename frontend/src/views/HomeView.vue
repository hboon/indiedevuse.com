<script setup lang="ts">
import { onMounted, ref } from "vue"

import developersData from "@/data/developers.json"
import type { Developer } from "@/types/developer"

const developers = ref<Developer[]>(developersData.developers as Developer[])

onMounted(() => {
  document.dispatchEvent(new Event("custom-render-trigger"))
})
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

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <a
        v-for="developer in developers"
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
