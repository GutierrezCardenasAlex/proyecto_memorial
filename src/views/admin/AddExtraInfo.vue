<template>
  <div class="layout">

    <!-- SIDEBAR -->
    <div class="sidebar">
      <h3 class="sidebar-title">Agregar Datos</h3>

      <div
        v-for="item in secciones"
        :key="item.key"
        class="menu-item"
        :class="{ activo: activa === item.key }"
        @click="activa = item.key"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content">

      <transition name="slide" mode="out-in">
        <div :key="activa">

          <!-- EDUCACIÓN -->
          <div v-if="activa === 'educacion'">
            <h2>Educación</h2>

            <input v-model="formEducacion.title" placeholder="Título" />
            <input v-model="formEducacion.institution" placeholder="Institución" />
            <input v-model="formEducacion.province" placeholder="Provincia" />
            <input v-model="formEducacion.country" placeholder="País" />
            <input type="date" v-model="formEducacion.date_start" />
            <input type="date" v-model="formEducacion.date_end" />
            <textarea v-model="formEducacion.description" placeholder="Descripción"></textarea>

            <button @click="guardarEducacion">Agregar Educación</button>

            <div v-if="educaciones.length" class="lista">
              <div v-for="edu in educaciones" :key="edu.id" class="item">
                <strong>{{ edu.title }}</strong>
                <p>{{ edu.institution }}</p>
              </div>
            </div>
          </div>

          <!-- INTERESES -->
          <div v-if="activa === 'intereses'">
            <h2>Intereses</h2>

            <input v-model="formInteres.title" placeholder="Título" />
            <textarea v-model="formInteres.descripcion" placeholder="Descripción"></textarea>

            <button @click="guardarInteres">Agregar Interés</button>

            <div v-if="intereses.length" class="lista">
              <div v-for="int in intereses" :key="int.id" class="item">
                {{ int.title }}
              </div>
            </div>
          </div>

          <!-- TRAYECTORIA -->
          <div v-if="activa === 'trayectoria'">
            <h2>Trayectoria</h2>

            <input v-model="formTrayectoria.cargo" placeholder="Cargo" />
            <input v-model="formTrayectoria.institucion" placeholder="Institución" />
            <input type="number" v-model="formTrayectoria.anio_inicio" placeholder="Año Inicio" />
            <input type="number" v-model="formTrayectoria.anio_fin" placeholder="Año Fin" />
            <textarea v-model="formTrayectoria.descripcion" placeholder="Descripción"></textarea>

            <button @click="guardarTrayectoria">Agregar Trayectoria</button>

            <div v-if="trayectorias.length" class="lista">
              <div v-for="tra in trayectorias" :key="tra.id" class="item">
                {{ tra.cargo }}
              </div>
            </div>
          </div>

          <!-- LOGROS -->
          <div v-if="activa === 'logros'">
            <h2>Logros</h2>

            <input v-model="formLogro.titulo" placeholder="Título" />
            <input v-model="formLogro.lugar" placeholder="Lugar" />
            <input type="date" v-model="formLogro.fecha" />
            <textarea v-model="formLogro.biografia" placeholder="Descripción"></textarea>

            <button @click="guardarLogro">Agregar Logro</button>

            <div v-if="logros.length" class="lista">
              <div v-for="log in logros" :key="log.id" class="item">
                {{ log.titulo }}
              </div>
            </div>
          </div>

          <!-- GALERÍA -->
          <div v-if="activa === 'galeria'">
            <h2>Galería</h2>

            <input v-model="formGaleria.titulo" placeholder="Título" />
            <input type="file" @change="handleFile" />

            <button @click="guardarGaleria">Agregar Imagen</button>

            <div v-if="galeria.length" class="lista">
              <div v-for="img in galeria" :key="img.id" class="item">
                {{ img.titulo }}
              </div>
            </div>
          </div>

        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const BASE_URL = import.meta.env.VITE_API_URL
const persona_id = route.params.id

const activa = ref("educacion")

const secciones = [
  { key: "educacion", label: "Educación" },
  { key: "intereses", label: "Intereses" },
  { key: "trayectoria", label: "Trayectoria" },
  { key: "logros", label: "Logros" },
  { key: "galeria", label: "Galería" }
]

const educaciones = ref([])
const intereses = ref([])
const trayectorias = ref([])
const logros = ref([])
const galeria = ref([])

const formEducacion = ref({})
const formInteres = ref({})
const formTrayectoria = ref({})
const formLogro = ref({})
const formGaleria = ref({})
const imagenFile = ref(null)

// EDUCACIÓN
const guardarEducacion = async () => {
  const res = await fetch(`/api/personas/educacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formEducacion.value, persona_id })
  })
  const data = await res.json()
  educaciones.value.push(data)
  formEducacion.value = {}
}

// INTERESES
const guardarInteres = async () => {
  const res = await fetch(`/api/personas/intereses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formInteres.value, persona_id })
  })
  const data = await res.json()
  intereses.value.push(data)
  formInteres.value = {}
}

// TRAYECTORIA
const guardarTrayectoria = async () => {
  const res = await fetch(`/api/personas/trayectoria`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formTrayectoria.value, persona_id })
  })
  const data = await res.json()
  trayectorias.value.push(data)
  formTrayectoria.value = {}
}

// LOGROS
const guardarLogro = async () => {
  const res = await fetch(`/api/personas/logros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formLogro.value, persona_id })
  })
  const data = await res.json()
  logros.value.push(data)
  formLogro.value = {}
}

// GALERÍA
const handleFile = (e) => {
  imagenFile.value = e.target.files[0]
}

const guardarGaleria = async () => {
  const formData = new FormData()
  formData.append("persona_id", persona_id)
  formData.append("titulo", formGaleria.value.titulo)
  formData.append("imagen", imagenFile.value)

  const res = await fetch(`${BASE_URL}/api/personas/galeria`, {
    method: "POST",
    body: formData
  })

  const data = await res.json()
  galeria.value.push(data)

  formGaleria.value = {}
  imagenFile.value = null
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #0f0f0f;
  color: white;
}

.sidebar {
  width: 260px;
  background: #151515;
  padding: 30px 20px;
  border-right: 1px solid #222;
}

.sidebar-title {
  margin-bottom: 20px;
}

.menu-item {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.menu-item:hover {
  background: #222;
}

.menu-item.activo {
  background: #3b82f6;
}

.content {
  flex: 1;
  padding: 50px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

input, textarea {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background: #1f1f1f;
  color: white;
}

button {
  padding: 8px 15px;
  background: #3b82f6;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.lista {
  margin-top: 20px;
}

.item {
  background: #1a1a1a;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 6px;
}
</style>