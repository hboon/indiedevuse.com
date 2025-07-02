import { createApp } from "vue"

import { createPinia } from "pinia"

import { env } from "@/env"

import App from "./App.vue"
import router from "./router"

import "./assets/main.css"

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount("#app")

if (env.PROD) {
  const script = document.createElement("script")
  script.async = true
  script.setAttribute("data-id", "101487869")
  script.src = "//static.getclicky.com/js"
  document.head.appendChild(script)
}
