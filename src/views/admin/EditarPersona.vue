<template>
  <div class="editar-container" v-if="persona">

    <h2>Editar Perfil</h2>

    <form @submit.prevent="guardar">

      <input
        v-model="persona.nombre_completo"
        placeholder="Nombre completo"
      />

      <select v-model="persona.estado">
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>

      <button type="submit">Guardar Cambios</button>

    </form>

    <button class="btn-volver" @click="volver">
      Cancelar
    </button>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const persona = ref(null)

onMounted(async () => {
  const res = await fetch(`/api/personas/${route.params.id}`)
  if (res.ok) persona.value = await res.json()
})

const guardar = async () => {
  await fetch(`/api/personas/${route.params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(persona.value)
  })

  router.push('/admin/dashboard')
}

const volver = () => router.push('/admin/dashboard')
</script>

<style scoped>
.editar-container {
  padding: 40px;
  background: #141414;
  color: white;
  min-height: 100vh;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin-top: 20px;
}

input, select {
  padding: 10px;
  border-radius: 6px;
  border: none;
}

button {
  padding: 10px;
  border-radius: 6px;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
}

.btn-volver {
  margin-top: 15px;
  background: #444;
}
</style>