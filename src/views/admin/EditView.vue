<template>
  <div class="page-container">
    <div class="form-container">
      <h2>Editar Perfil</h2>
      
      <form @submit.prevent="actualizar">
        <div class="form-group">
           <label>Foto (Subir nueva para cambiar)</label>
           <input type="file" @change="handleFileUpload" accept="image/*" />
           <img v-if="form.imagen_base64" :src="form.imagen_base64" class="preview" />
        </div>

        <div class="form-row">
            <input v-model="form.nombre_completo" placeholder="Nombre" required />
            <input v-model="form.slug" disabled title="No editar slug" />
        </div>

        <input v-model="form.titulo" placeholder="Título" />
        <textarea v-model="form.biografia" rows="4"></textarea>
        
        <div class="form-row">
           <input v-model="form.province" placeholder="Provincia" />
           <input v-model="form.country" placeholder="País" />
        </div>

        <div class="actions">
           <button type="button" @click="$router.push('/admin/dashboard')" class="btn-cancel">Cancelar</button>
           <button type="submit" class="btn-save">Actualizar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const id = route.params.id; // Obtenemos el ID de la URL

const form = reactive({
  id: null, nombre_completo: '', slug: '', titulo: '', 
  biografia: '', province: '', country: '', imagen_base64: ''
});

onMounted(async () => {
    // 1. Cargar datos actuales de la persona
    // Nota: Como no tenemos una ruta "getById" en tu backend que me mostraste,
    // usaremos la lista o el slug si es necesario. 
    // Lo ideal es tener router.get('/:id') en backend.
    
    // Si no tienes getById, carga todos y filtra (temporalmente)
    const res = await fetch('http://localhost:3000/api/personas');
    const personas = await res.json();
    const personaEncontrada = personas.find(p => p.id == id);
    
    if(personaEncontrada) {
        Object.assign(form, personaEncontrada);
    }
});

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onloadend = () => form.imagen_base64 = reader.result;
  reader.readAsDataURL(file);
};

const actualizar = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/personas/${route.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if(res.ok) {
       router.push('/admin/dashboard');
    }
  } catch(e) { alert("Error al actualizar"); }
};
</script>

<style scoped>
/* Mismos estilos que CreateView */
.page-container { background: #141414; min-height: 100vh; display: flex; justify-content: center; padding-top: 50px; color: white; }
.form-container { background: #1f1f1f; padding: 40px; width: 600px; border-radius: 8px; }
h2 { margin-bottom: 20px; color: #e50914; }
input, textarea { width: 100%; background: #333; border: 1px solid #444; color: white; padding: 10px; margin-bottom: 15px; border-radius: 4px; }
.form-row { display: flex; gap: 10px; }
.preview { width: 100px; height: 100px; object-fit: cover; margin-top: 10px; border: 1px solid #e50914; }
.actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-save { background: #e50914; color: white; padding: 10px 20px; border: none; cursor: pointer; font-weight: bold; }
.btn-cancel { background: #333; color: white; padding: 10px 20px; border: none; cursor: pointer; }
</style>