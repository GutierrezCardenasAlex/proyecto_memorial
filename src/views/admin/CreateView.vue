<template>
  <div class="create-page">

    <AdminNavbar />

    <div class="form-container">
      <h2 class="title">Crear Nuevo Perfil</h2>

      <form @submit.prevent="guardar">

        <!-- IMAGEN -->
        <div class="image-section">

          <label class="section-label">Foto de Perfil</label>

          <label class="upload-area">
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              hidden
            />

            <div class="upload-content">
              <span class="icon">📷</span>
              <p v-if="!imagen">Haz clic para seleccionar imagen</p>
              <p v-else class="file-name">✔ {{ imagen.name }}</p>
              <small>Se guardará dentro de la carpeta del slug</small>
            </div>
          </label>

          <!-- PREVIEW -->
          <transition name="fade">
            <div v-if="preview" class="preview-section">
              <h4>Vista previa:</h4>

              <img :src="preview" class="preview-image" />

              <button
                type="button"
                class="remove-btn"
                @click="eliminarImagen"
              >
                ✖ Quitar Imagen
              </button>
            </div>
          </transition>

        </div>

        <!-- DATOS -->
        <div class="grid">

          <div class="field">
            <label>Nombre Completo</label>
            <input v-model="form.nombre_completo"
                   @input="generarSlug"
                   required />
          </div>

          <div class="field">
            <label>Slug</label>
            <input v-model="form.slug" required />
          </div>

          <div class="field">
            <label>Título Profesional</label>
            <input v-model="form.titulo" />
          </div>

          <div class="field">
            <label>Provincia</label>
            <input v-model="form.province" />
          </div>

          <div class="field">
            <label>País</label>
            <input v-model="form.country" />
          </div>

          <div class="field">
            <label>Año Nacimiento</label>
            <input type="number" v-model="form.anio_nacimiento" />
          </div>

          <div class="field">
            <label>Año Fallecimiento</label>
            <input type="number" v-model="form.anio_fallecimiento" />
          </div>

          <div class="field">
            <label>Día Cumpleaños</label>
            <input type="date" v-model="form.dia_cumpleanos" />
          </div>

          <div class="field">
            <label>Día Fallecimiento</label>
            <input type="date" v-model="form.dia_fallecimiento" />
          </div>

        </div>

        <div class="field">
          <label>Biografía</label>
          <textarea v-model="form.biografia" rows="4"></textarea>
        </div>

        <div class="field">
          <label>Estado</label>
          <select v-model="form.estado">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <!-- BOTONES -->
        <div class="actions">
          <button type="button"
                  class="btn-cancel"
                  @click="router.push('/admin/dashboard')">
            Cancelar
          </button>

          <button type="submit" class="btn-save">
            Guardar Perfil
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import AdminNavbar from "./components/AdminNavbar.vue"

const router = useRouter()

const form = reactive({
  nombre_completo: "",
  titulo: "",
  biografia: "",
  slug: "",
  province: "",
  country: "",
  anio_nacimiento: "",
  anio_fallecimiento: "",
  dia_cumpleanos: "",
  dia_fallecimiento: "",
  estado: "activo"
})

const imagen = ref(null)
const preview = ref(null)

const handleFileUpload = (e) => {
  const file = e.target.files[0]

  if (!file) return

  imagen.value = file
  preview.value = URL.createObjectURL(file)
}

const eliminarImagen = () => {
  imagen.value = null
  preview.value = null
}

const generarSlug = () => {
  form.slug = form.nombre_completo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const guardar = async () => {

  const formData = new FormData()

  Object.keys(form).forEach(key => {
    formData.append(key, form[key])
  })

  if (imagen.value) {
    formData.append("imagen", imagen.value)
  }

  try {
    const res = await fetch("http://localhost:3000/api/personas", {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      router.push("/admin/dashboard")
    } else {
      alert("Error al guardar")
    }

  } catch (err) {
    alert("Error del servidor")
  }
}
</script>

<style scoped>
.create-page {
  background: #141414;
  min-height: 100vh;
  color: white;
}

.form-container {
  max-width: 1000px;
  margin: 50px auto;
  background: #1f1f1f;
  padding: 50px;
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(0,0,0,0.6);
}

.title {
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: bold;
  color: #e50914;
}

.section-label {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  display: block;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.field label {
  font-size: 13px;
  opacity: 0.8;
  margin-bottom: 5px;
  display: block;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px;
  background: #2b2b2b;
  border: 1px solid #444;
  color: white;
  border-radius: 8px;
  transition: 0.3s;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #e50914;
  outline: none;
}

.upload-area {
  display: block;
  border: 2px dashed #444;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  background: #1a1a1a;
}

.upload-area:hover {
  border-color: #e50914;
  background: #222;
}

.upload-content .icon {
  font-size: 40px;
  display: block;
  margin-bottom: 10px;
}

.file-name {
  color: #00ff88;
  font-weight: bold;
}

.preview-section {
  margin-top: 25px;
  text-align: center;
}

.preview-section h4 {
  margin-bottom: 10px;
  color: #e50914;
}

.preview-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  border: 4px solid #e50914;
  box-shadow: 0 0 25px rgba(229,9,20,0.6);
}

.remove-btn {
  margin-top: 15px;
  background: #b20710;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.remove-btn:hover {
  background: #800000;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn-save {
  background: #e50914;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.btn-save:hover {
  background: #b20710;
}

.btn-cancel {
  background: #444;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.fade-enter-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>