<template>
  <div class="dashboard">

    <!-- NAVBAR -->
    <AdminNavbar
      @crear="irACrear"
      @logout="logout"
    />

    <div class="content">
      <h2 class="section-title">Perfiles Registrados</h2>

      <div class="row">

        <div
          v-for="persona in personas"
          :key="persona.id"
          class="card"
        >

          <!-- IMAGEN -->
          <img
            v-if="persona.ruta_imagen"
            :src="persona.ruta_imagen"
            class="card-img"
          />

          <!-- ESTADO ARRIBA -->
          <span
            class="estado"
            :class="persona.estado === 'activo'
              ? 'estado-activo'
              : 'estado-inactivo'"
          >
            {{ persona.estado }}
          </span>

          <!-- INFO HOVER -->
          <div class="card-info">

            <h3 class="nombre">
              {{ persona.nombre_completo }}
            </h3>

            <p class="fecha">
              {{ formatearFecha(persona.created_at) }}
            </p>

            <!-- BOTONES -->
            <div class="acciones">
              <button class="btn btn-ver" @click="verDetalle(persona.id)">
                Ver
              </button>

              <button class="btn btn-editar" @click="irAEditar(persona.id)">
                Editar
              </button>

              <button class="btn btn-eliminar" @click="eliminar(persona.id)">
                Eliminar
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminNavbar from './components/AdminNavbar.vue'

const router = useRouter()
const personas = ref([])

onMounted(async () => {
  const res = await fetch('/api/personas')
  if (res.ok) personas.value = await res.json()
})

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const irACrear = () => router.push('/admin/crear')
const irAEditar = (id) => router.push(`/admin/editar/${id}`)
const verDetalle = (id) => router.push(`/admin/ver/${id}`)

const eliminar = async (id) => {
  if (!confirm('¿Eliminar perfil?')) return
  await fetch(`/api/personas/${id}`, { method: 'DELETE' })
  personas.value = personas.value.filter(p => p.id !== id)
}

const logout = () => {
  localStorage.removeItem('adminToken')
  router.push('/admin/login')
}
</script>

<style scoped>
.dashboard {
  background: #141414;
  min-height: 100vh;
  color: white;
}

/* CONTENIDO */
.content {
  padding: 40px 60px;
}

.section-title {
  font-size: 26px;
  margin-bottom: 30px;
}

/* GRID */
.row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 30px;
}

/* CARD */
.card {
  position: relative;
  cursor: pointer;
  transition: transform 0.4s ease;
}

.card:hover {
  transform: scale(1.1);
  z-index: 10;
}

/* IMAGEN */
.card-img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 10px;
  transition: 0.4s;
}

/* ESTADO ARRIBA */
.estado {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.estado-activo {
  background: #00ff88;
  color: black;
}

.estado-inactivo {
  background: red;
  color: white;
}

/* INFO OCULTA */
.card-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0));
  opacity: 0;
  transition: 0.4s;
  border-radius: 10px;
}

.card:hover .card-info {
  opacity: 1;
}

/* NOMBRE GRANDE */
.nombre {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.fecha {
  font-size: 13px;
  opacity: 0.8;
  margin-bottom: 15px;
}

/* BOTONES */
.acciones {
  display: flex;
  gap: 8px;
}

.btn {
  border: none;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-ver {
  background: #444;
  color: white;
}

.btn-editar {
  background: #3b82f6;
  color: white;
}

.btn-eliminar {
  background: #e50914;
  color: white;
}

.btn:hover {
  transform: scale(1.05);
}
</style>