import { ref } from "vue"

import { defineStore } from "pinia"

export const useAppStore = defineStore("app", () => {
  const user = ref<{ name: string; email: string } | null>(null)
  const isLoading = ref(false)

  function setUser(userData: { name: string; email: string }) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  return { user, isLoading, setUser, clearUser }
})
