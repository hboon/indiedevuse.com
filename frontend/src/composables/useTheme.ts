import { computed, onMounted, onUnmounted, ref } from "vue"

export type Theme = "system" | "light" | "dark"

const THEME_KEY = "theme-preference"

export function useTheme() {
  const theme = ref<Theme>("system")
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

  const isDark = computed(() => {
    if (theme.value === "light") return false
    if (theme.value === "dark") return true
    return mediaQuery.matches
  })

  function applyTheme() {
    document.documentElement.classList.toggle("dark", isDark.value)
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem(THEME_KEY, newTheme)
    applyTheme()
  }

  function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null
    if (saved && ["system", "light", "dark"].includes(saved)) {
      theme.value = saved
    }
    applyTheme()
  }

  function handleSystemThemeChange() {
    if (theme.value === "system") {
      applyTheme()
    }
  }

  onMounted(() => {
    loadTheme()
    mediaQuery.addEventListener("change", handleSystemThemeChange)

    onUnmounted(() => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    })
  })

  return {
    theme,
    setTheme,
    isDark,
  }
}
