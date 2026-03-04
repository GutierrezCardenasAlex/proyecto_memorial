<template>
  <div v-if="isLoading" class="loading-container">
    <div class="spinner"></div>
    <p>Cargando información...</p>
  </div>

  <div v-else-if="!isProfileValid && !isSpecialRoute()" class="not-found">
    <div class="error-box">
        <h1>Perfil no encontrado</h1>
        <p>El enlace es incorrecto o el perfil ha sido eliminado.</p>
        <a href="#/admin/login" class="admin-link">Ir al Login</a>
    </div>
  </div>

  <div v-else-if="didLoadAllJsonFiles && !isSpecialRoute()" id="resume">
    <NavigationWrapper>
      <Section
        v-for="section in sections"
        :key="section.id"
        :model="section"
        :active="_isSectionActive(section)"
      />
    </NavigationWrapper>
  </div>

  <div v-else-if="isSpecialRoute()">
     </div>
</template>

<script setup>
import { inject, onMounted } from "vue"
import Section from "/src/vue/components/sections/Section.vue"
import NavigationWrapper from "/src/vue/components/navigation/NavigationWrapper.vue"
import { useUtils } from "/src/composables/utils.js"

const utils = useUtils()

// --- INYECCIONES ---
const sections = inject("sections")
const currentSection = inject("currentSection")
const didLoadAllJsonFiles = inject("didLoadAllJsonFiles")
const isProfileValid = inject('isProfileValid')
const isLoading = inject('isLoading')

// Helper para detectar rutas administrativas
const isSpecialRoute = () => {
    const hash = window.location.hash.toLowerCase()
    return hash.includes('/admin') || hash.includes('/login')
}

onMounted(() => {
    // Solo ejecutamos analytics si NO es admin
    if (!isSpecialRoute()) {
        _trackAnalytics()
    }
})

const _trackAnalytics = () => {
    try {
        fetch("https://ryanbalieiro.com/api/analytics/mock", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                params: {
                    url: utils.getRootLocation(),
                    template_id: "vue-resume"
                }
            })
        }).catch(() => {})
    } catch (e) {}
}

const _isSectionActive = (section) => {
    if(!currentSection || !currentSection.value) return false
    return currentSection.value.id === section.id
}
</script>