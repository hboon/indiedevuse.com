<script setup lang="ts">
import { onMounted, ref } from "vue"

import developersData from "@/data/developers.json"
import type { Developer } from "@/types/developer"

const developers = ref<Developer[]>(developersData.developers)

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
        build their products. Learn from real developers about their tech stacks and workflows.
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
        </div>
      </a>
    </div>

    <div class="text-center mt-12 text-muted-foreground">
      Add yourself with a
      <a
        href="https://github.com/hboon/indiedevuse.com/blob/main/README.md"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary underline"
      >
        GitHub Pull Request
      </a>
    </div>
  </div>
</template>
