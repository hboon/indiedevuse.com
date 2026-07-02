<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"

import ThemeSwitcher from "@/components/ThemeSwitcher.vue"

import { useTheme } from "@/composables/useTheme"
import { env } from "@/env"

useTheme()
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <RouterLink to="/" class="text-2xl font-bold hover:underline"
            >Indie Developers Use</RouterLink
          >
          <div class="flex flex-wrap items-center gap-3 text-sm sm:text-base">
            <RouterLink to="/" class="hover:underline">Home</RouterLink>
            <RouterLink to="/saas-tech-stack-generator" class="hover:underline"
              >Stack generator</RouterLink
            >
            <RouterLink to="/about" class="hover:underline">About</RouterLink>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <p class="text-white dark:text-black">{{ env.VITE_RENDER_GIT_COMMIT }}</p>
  </div>
</template>
