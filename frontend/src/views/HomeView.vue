<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

import developersData from "@/data/developers.json"
import type { Developer } from "@/types/developer"

const router = useRouter()

const developers = ref<Developer[]>(developersData.developers)

function navigateToDeveloper(developerId: string) {
  router.push(`/developer/${developerId}`)
}
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
      <div
        v-for="developer in developers"
        :key="developer.id"
        @click="navigateToDeveloper(developer.id)"
        class="bg-card rounded-lg border p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 hover:border-primary/50"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-24 h-24 rounded-full overflow-hidden mb-4 bg-muted">
            <img
              :src="developer.avatar"
              :alt="`${developer.name}'s avatar`"
              class="w-full h-full object-cover"
              @error="
                (e) =>
                  ((e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name)}&size=96&background=random`)
              "
            />
          </div>
          <h3 class="font-semibold text-lg">{{ developer.name }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>
