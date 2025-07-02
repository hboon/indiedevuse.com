<script setup lang="ts">
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/appStore"

const appStore = useAppStore()
</script>

<template>
  <div>
    <h2 class="text-3xl font-bold mb-4">About Indie Developers Use</h2>
    <div class="prose max-w-none">
      <p class="mb-4">
        This website showcases the tools and stacks that indie developers use to build their
        websites and apps.
      </p>
      <p class="mb-4">
        The source code for this site is available on
        <a href="https://github.com/hboon/indiedevuse.com" class="underline">GitHub</a>.
      </p>
      <p class="mb-4">
        Submit a
        <a href="https://github.com/hboon/indiedevuse.com/pulls" class="underline">GitHub PR</a> to
        add your tools and stack to the list.
      </p>
      <p class="mb-4">
        For questions or feedback, buzz
        <a href="https://x.com/hboon" class="underline">@hboon on X</a> or
        <a href="https://bsky.app/profile/hboon.com" class="underline">@hboon.com on Bluesky</a>.
      </p>
    </div>
  </div>
</template>
