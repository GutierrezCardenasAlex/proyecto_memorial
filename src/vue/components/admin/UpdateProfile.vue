<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>Editar Perfil: {{ form.nombre_completo }}</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="actualizar" class="modal-form">
        <div class="form-group full-width">
          <label>Cambiar Fotografía (Opcional)</label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
          <img v-if="form.imagen_base64" :src="form.imagen_base64" class="preview-img" />
        </div>

        <div class="form-row">
          <input v-model="form.nombre_completo" placeholder="Nombre" required />
          <input v-model="form.slug" disabled title="El slug no se suele editar para no romper links" />
        </div>
        
        <input v-model="form.titulo" placeholder="Título" class="full-width" />
        <textarea v-model="form.biografia" rows="3" class="full-width"></textarea>

        <div class="form-row">
          <input v-model="form.province" placeholder="Provincia" />
          <input v-model="form.country" placeholder="País" />
        </div>
        
        <div class="form-row">
            <input type="date" v-model="formattedCumple" @change="e => form.dia_cumpleanos = e.target.value" />
         </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-save">Guardar Cambios</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue';

// Recibimos la persona a editar
const props = defineProps(['persona']);
const emit = defineEmits(['close', 'updated']);

const form = reactive({ ...props.persona }); // Clonamos los datos para no modificar la vista hasta guardar

// Formateo de fecha para input date (YYYY-MM-DD)
const formattedCumple = computed(() => {
    if(!form.dia_cumpleanos) return "";
    return new Date(form.dia_cumpleanos).toISOString().split('T')[0];
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => form.imagen_base64 = reader.result;
  reader.readAsDataURL(file);
};

const actualizar = async () => {
  try {
    const res = await fetch(`/api/personas/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Actualizado correctamente");
      emit('updated');
      emit('close');
    }
  } catch (e) {
    alert("Error al actualizar");
  }
};
</script>

<style scoped>
/* (Mismos estilos que CreateProfile) */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 200; }
.modal { background: #181818; width: 600px; padding: 30px; border-radius: 8px; color: white; border: 1px solid #333; }
.full-width { width: 100%; margin-bottom: 10px; }
input, textarea { background: #333; border: 1px solid #444; color: white; padding: 10px; width: 100%; margin-bottom: 5px;}
.form-row { display: flex; gap: 10px; }
.btn-save { background: #e50914; color: white; padding: 10px 20px; border: none; cursor: pointer; }
.btn-cancel { background: #333; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
.preview-img { width: 60px; height: 60px; object-fit: cover; border: 1px solid #e50914; }
</style>