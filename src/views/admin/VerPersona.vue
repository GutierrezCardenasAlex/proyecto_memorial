<template>
  <div class="detalle-container" v-if="persona">

    <div class="detalle-wrapper">

      <!-- IMAGEN -->
      <div class="imagen-section">
        <img
          v-if="persona.ruta_imagen"
          :src="persona.ruta_imagen"
          class="detalle-img"
        />

        <span
          class="estado-badge"
          :class="persona.estado === 'activo' ? 'activo' : 'inactivo'"
        >
          {{ persona.estado }}
        </span>
      </div>

      <!-- INFORMACIÓN PRINCIPAL -->
      <div class="info-section">

        <h1 class="nombre">{{ persona.nombre_completo }}</h1>
        <h3 class="titulo-profesional">{{ persona.titulo }}</h3>

        <div class="biografia">
          {{ persona.biografia }}
        </div>

        <div class="grid-info">
          <div><strong>Provincia:</strong> {{ persona.province }}</div>
          <div><strong>País:</strong> {{ persona.country }}</div>
          <div><strong>Nacimiento:</strong> {{ formatearFecha(persona.dia_cumpleanos) }}</div>
          <div><strong>Fallecimiento:</strong> {{ formatearFecha(persona.dia_fallecimiento) }}</div>
          <div><strong>Año Nac.:</strong> {{ persona.anio_nacimiento }}</div>
          <div><strong>Año Fall.:</strong> {{ persona.anio_fallecimiento }}</div>
          <div><strong>Creado:</strong> {{ formatearFecha(persona.created_at) }}</div>
        </div>

        <!-- EDUCACIÓN -->
        <div v-if="persona.educacion?.length" class="section">
          <h2>Educación</h2>
          <div v-for="edu in persona.educacion" :key="edu.id" class="card-section">
            <h4>{{ edu.title }}</h4>
            <p>{{ edu.institution }} - {{ edu.province }}, {{ edu.country }}</p>
            <p>{{ formatearFecha(edu.date_start) }} - {{ formatearFecha(edu.date_end) }}</p>
            <p>{{ edu.description }}</p>
          </div>
        </div>

        <!-- INTERESES -->
        <div v-if="persona.intereses?.length" class="section">
          <h2>Intereses</h2>
          <div v-for="int in persona.intereses" :key="int.id" class="card-section">
            <h4>{{ int.title }}</h4>
            <p>{{ int.descripcion }}</p>
          </div>
        </div>

        <!-- TRAYECTORIA -->
        <div v-if="persona.trayectoria?.length" class="section">
          <h2>Trayectoria</h2>
          <div v-for="tra in persona.trayectoria" :key="tra.id" class="card-section">
            <h4>{{ tra.cargo }}</h4>
            <p>{{ tra.institucion }} ({{ tra.anio_inicio }} - {{ tra.anio_fin || 'Actualidad' }})</p>
          </div>
        </div>

        <!-- LOGROS -->
        <div v-if="persona.logros?.length" class="section">
          <h2>Logros</h2>
          <div v-for="log in persona.logros" :key="log.id" class="card-section">
            <h4>{{ log.titulo }}</h4>
            <p>{{ log.biografia }}</p>
            <p>{{ log.lugar }} - {{ formatearFecha(log.fecha) }}</p>
          </div>
        </div>

        <!-- GALERÍA -->
        <div v-if="persona.galeria?.length" class="section">
          <h2>Galería</h2>
          <div class="galeria-grid">
            <img
              v-for="img in persona.galeria"
              :key="img.id"
              :src="img.ruta_imagen"
              class="galeria-img"
            />
          </div>
        </div>

        <button class="btn-add" @click="agregarInfo">
          Agregar Información
        </button>

        <button class="btn-volver" @click="volver">
          Volver al Dashboard
        </button>

      </div>

      <!-- QR -->
      <div class="qr-section">

        <div class="placa" ref="placaRef">
          <div class="placa-header">MEMORIAL DIGITAL</div>
          <canvas ref="qrCanvas"></canvas>
          <div class="placa-nombre">{{ persona.nombre_completo }}</div>
          <div class="placa-slug">{{ persona.slug }}</div>
        </div>

        <button class="btn-descargar" @click="descargarPlaca">
          Descargar QR
        </button>

      </div>

    </div>
  </div>

  <div v-else class="loading">Cargando perfil...</div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const persona = ref(null)

const qrCanvas = ref(null)
const placaRef = ref(null)

const BASE_URL = import.meta.env.VITE_API_URL

const perfilPublicoURL = computed(() => {
  if (!persona.value) return ''
  return `${window.location.origin}/#/${persona.value.slug}`
})

onMounted(async () => {
  const res = await fetch(`/api/personas/${route.params.id}`)
  if (!res.ok) throw new Error("No encontrado")
  persona.value = await res.json()
  await nextTick()
  generarQR()
})

const generarQR = async () => {
  await QRCode.toCanvas(qrCanvas.value, perfilPublicoURL.value, {
    width: 200,
    margin: 2
  })
}

const descargarPlaca = async () => {
  const canvas = await html2canvas(placaRef.value)
  const link = document.createElement("a")
  link.download = `qr-${persona.value.slug}.png`
  link.href = canvas.toDataURL("image/png")
  link.click()
}

const agregarInfo = () => {
  router.push(`/admin/add-info/${persona.value.id}`)
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const volver = () => router.push('/admin/dashboard')
</script>

<style scoped>
.detalle-container {
  background: #0f0f0f;
  min-height: 100vh;
  color: #e5e5e5;
  padding: 50px;
}

.detalle-wrapper {
  display: flex;
  gap: 60px;
  max-width: 1400px;
  margin: auto;
  align-items: flex-start;
}

.detalle-img {
  width: 350px;
  height: 500px;
  object-fit: cover;
  border-radius: 15px;
}

.estado-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.activo { background: #00ff88; color: black; }
.inactivo { background: #e50914; color: white; }

.info-section { flex: 1; }

.nombre { font-size: 36px; margin-bottom: 10px; }
.titulo-profesional { color: #aaa; margin-bottom: 20px; }

.biografia {
  background: #1c1c1c;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 25px;
}

.grid-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.grid-info div {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
}

.section { margin-top: 40px; }

.card-section {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.galeria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.galeria-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.btn-add {
  margin-top: 30px;
  padding: 10px 15px;
  background: #3b82f6;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.btn-volver {
  margin-top: 15px;
  padding: 10px 20px;
  background: #333;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.qr-section {
  width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.placa {
  background: linear-gradient(145deg, #1c1c1c, #111);
  padding: 25px;
  border-radius: 20px;
  border: 2px solid #333;
  text-align: center;
}

.btn-descargar {
  margin-top: 20px;
  padding: 8px 14px;
  background: #333;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
</style>