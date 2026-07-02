<script setup lang="ts">
import { onMounted } from "vue"

onMounted(() => {
  document.dispatchEvent(new Event("custom-render-trigger"))
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">About Indie Developers Use</h1>
    <div class="prose max-w-none">
      <p class="mb-4">
        This website showcases the tools and stacks that indie developers use to build their
        websites and apps.
      </p>
      <p class="mb-4">
        Profiles can be self-submitted or owner-curated from public sources. Curated profiles need a
        public builder identity, clear product ownership, source links, and enough public stack
        evidence to be useful.
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
        Each profile page includes source links and a correction/removal link. If a profile is wrong
        or should not be listed, open a PR or contact me.
      </p>
      <p class="mb-4">
        For questions or feedback, buzz
        <a href="https://x.com/hboon" class="underline">@hboon on X</a> or
        <a href="https://bsky.app/profile/hboon.com" class="underline">@hboon.com on Bluesky</a>.
      </p>
    </div>
  </div>
</template>
