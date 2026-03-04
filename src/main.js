import "./scss/style.scss"
import { createApp } from "vue"
import App from "/src/vue/stack/App.vue"
import router from "./router"

async function start() {
    const app = createApp(App)
    app.use(router)

    try {
        const response = await fetch('/api/personas')
        const data = await response.json()
        window.dbData = data
    } catch (error) {
        console.error("No se pudo cargar la base de datos:", error)
    }

    // 👇 SIEMPRE montamos la app
    app.mount("#app")
}

start()