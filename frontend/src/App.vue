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
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Indie Developers Use</h1>
          <div class="flex items-center gap-4">
            <RouterLink to="/" class="hover:underline">Home</RouterLink>
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
