import "./scss/style.scss"
import { createApp } from "vue"
import App from "/src/vue/stack/App.vue"
import router from "./router"

const app = createApp(App)
app.use(router)

// Función para cargar datos de forma asíncrona sin bloquear el inicio de Vue
async function loadInitialData() {
    try {
        const response = await fetch('/api/personas')
        if (!response.ok) throw new Error('Error en el servidor')
        const data = await response.json()
        window.dbData = data
        console.log("Datos cargados correctamente")
    } catch (error) {
        console.error("No se pudo cargar la base de datos:", error)
        window.dbData = [] // Evita que la app rompa si falla el fetch
    }
}

// 1. Iniciamos la carga de datos (sin await aquí para no bloquear)
loadInitialData()

// 2. Montamos la app de inmediato
// El router se inyectará correctamente ahora
app.mount("#app")