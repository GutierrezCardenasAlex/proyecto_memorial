<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>Nuevo Perfil</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="guardar" class="modal-form">
        <div class="form-group full-width">
          <label>Fotografía (Obligatoria)</label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
          <img v-if="form.imagen_base64" :src="form.imagen_base64" class="preview-img" />
        </div>

        <div class="form-row">
          <input v-model="form.nombre_completo" @input="generarSlug" placeholder="Nombre Completo" required />
          <input v-model="form.slug" placeholder="Slug automático" required />
        </div>
        
        <input v-model="form.titulo" placeholder="Título Profesional" class="full-width" />
        <textarea v-model="form.biografia" rows="3" placeholder="Biografía..." class="full-width"></textarea>

        <div class="form-row">
          <input v-model="form.province" placeholder="Provincia" />
          <input v-model="form.country" placeholder="País" />
        </div>

        <div class="form-row">
          <div class="date-group">
            <label>Nacimiento (Año/Fecha)</label>
            <input type="number" v-model="form.anio_nacimiento" placeholder="Año" />
            <input type="date" v-model="form.dia_cumpleanos" />
          </div>
          <div class="date-group">
             <label>Fallecimiento (Opcional)</label>
            <input type="number" v-model="form.anio_fallecimiento" placeholder="Año" />
            <input type="date" v-model="form.dia_fallecimiento" />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-save">Crear Perfil</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['close', 'created']);
const API_URL = '/api/personas';

const form = reactive({
  nombre_completo: '',
  slug: '',
  titulo: '',
  biografia: '',
  province: '',
  country: '',
  anio_nacimiento: null,
  anio_fallecimiento: null,
  dia_cumpleanos: null,
  dia_fallecimiento: null,
  imagen_base64: ''
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => form.imagen_base64 = reader.result;
  reader.readAsDataURL(file);
};

const generarSlug = () => {
  form.slug = form.nombre_completo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

const guardar = async () => {
  if (!form.imagen_base64) return alert("Sube una imagen");
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      alert("Creado con éxito");
      emit('created'); // Avisa al padre que recargue la lista
      emit('close');   // Cierra el modal
    }
  } catch (e) {
    alert("Error al guardar");
  }
};
</script>

<style scoped>
/* Reutilizamos estilos comunes */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 200; }
.modal { background: #181818; width: 600px; padding: 30px; border-radius: 8px; color: white; border: 1px solid #333; max-height: 90vh; overflow-y: auto;}
.modal-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.form-row { display: flex; gap: 10px; margin-bottom: 10px; }
input, textarea { background: #333; border: 1px solid #444; color: white; padding: 10px; width: 100%; border-radius: 4px; }
.full-width { width: 100%; margin-bottom: 10px; }
.btn-save { background: #e50914; color: white; padding: 10px 20px; border: none; cursor: pointer; }
.btn-cancel { background: #333; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
.preview-img { width: 60px; height: 60px; object-fit: cover; margin-top: 5px; border: 1px solid #e50914; }
.date-group { display: flex; flex-direction: column; gap: 5px; flex: 1; border: 1px solid #333; padding: 5px; }
label { font-size: 12px; color: #ccc; }
</style>