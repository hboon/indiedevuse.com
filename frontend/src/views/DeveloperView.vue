<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

import { Button } from "@/components/ui/button"

import developersData from "@/data/developers.json"

const route = useRoute()
const router = useRouter()

const developerId = computed(() => route.params.id as string)
const developer = computed(() =>
  developersData.developers.find((dev) => dev.id === developerId.value)
)

function goBack() {
  router.push("/")
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b dark:from-background dark:to-muted/20 from-background to-background"
  >
    <div class="container mx-auto px-4 py-12 max-w-5xl">
      <Button
        @click="goBack()"
        variant="ghost"
        class="mb-2 hover:bg-muted/50 transition-all duration-200"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to all indie developers
      </Button>

      <div v-if="developer" class="space-y-8">
        <div
          class="bg-card dark:bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 dark:shadow-xl shadow-none overflow-hidden"
        >
          <div
            class="bg-gradient-to-r dark:from-primary/5 dark:via-primary/3 dark:to-transparent from-transparent via-transparent to-transparent p-8 md:p-12"
          >
            <div class="flex flex-col md:flex-row items-start gap-8">
              <div class="relative group">
                <div
                  class="absolute inset-0 bg-gradient-to-r dark:from-primary/20 dark:to-primary/10 from-transparent to-transparent rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"
                ></div>
                <div
                  class="relative w-40 h-40 rounded-full overflow-hidden ring-4 ring-background dark:shadow-2xl shadow-none transform group-hover:scale-105 transition-transform duration-300"
                >
                  <img
                    :src="developer.avatar"
                    :alt="`${developer.name}'s avatar`"
                    class="w-full h-full object-cover"
                    @error="
                      (e) =>
                        ((e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(developer?.name || '')}&size=160&background=random`)
                    "
                  />
                </div>
              </div>

              <div class="flex-1 space-y-6">
                <div>
                  <h1
                    class="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                  >
                    {{ developer.name }}
                  </h1>
                  <p class="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    {{ developer.bio }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-3">
                  <a
                    :href="developer.link.url"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-200 font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {{ developer.link.text }}
                  </a>

                  <a
                    v-if="developer.socialMediaLink"
                    :href="developer.socialMediaLink"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-all duration-200 font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Social
                  </a>

                  <span
                    v-if="developer.location"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {{ developer.location }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-card dark:bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 dark:shadow-xl shadow-none p-8 md:p-10"
        >
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
            <span class="w-1 h-8 bg-primary rounded-full"></span>
            Tools & Technologies
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="tool in developer.tools"
              :key="tool"
              class="group relative bg-muted/30 hover:bg-muted/50 rounded-lg px-4 py-3 transition-all duration-200 border border-transparent hover:border-border/50"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform duration-200"
                ></div>
                <span
                  class="font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-200"
                >
                  {{ tool }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div
          class="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-12 max-w-md mx-auto"
        >
          <svg
            class="w-16 h-16 mx-auto mb-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-xl font-medium text-muted-foreground mb-6">Developer not found</p>
          <Button @click="goBack()" variant="default"> Return to home </Button>
        </div>
      </div>
    </div>
  </div>
</template>
