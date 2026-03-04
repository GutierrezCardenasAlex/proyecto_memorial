<template>
  <slot/>
</template>

<script setup>
import { inject, provide, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useConstants } from "/src/composables/constants.js"

const route = useRoute()
const router = useRouter()
const constants = useConstants()

const sections = inject("sections", ref([]))

const currentSection = ref(null)
const previousSection = ref(null)
const presentationMode = ref(constants.PresentationModes.NONE)
const shouldResetScroll = ref(false)

const isSpecialRoute = () => route.path.startsWith("/admin")

// 🔥 Reaccionar a cambio de ruta o secciones
watch([() => route.fullPath, sections], () => {
  if (isSpecialRoute()) return
  if (!sections.value?.length) return

  const sectionId = route.params.section
  let target = sections.value.find(s => s.urlHashId === sectionId)

  if (!target) {
    target = sections.value[0]
  }

  if (target && target !== currentSection.value) {
    previousSection.value = currentSection.value
    currentSection.value = target
  }

}, { immediate: true })

function navigateToSection(section) {
  if (!section || isSpecialRoute()) return

  const slug = route.params.slug || "profile"

  router.push({
    path: `/${slug}/${section.urlHashId}`
  })
}

function navigateToCategory(category) {
  if (!category?.sections?.length) return
  const target = category.lastVisitedSection || category.sections[0]
  navigateToSection(target)
  return target
}

function scrollToTopOfCurrentSection() {
  setTimeout(() => {
    shouldResetScroll.value = true
  }, 100)
}

provide("currentSection", currentSection)
provide("previousSection", previousSection)
provide("presentationMode", presentationMode)
provide("shouldResetScroll", shouldResetScroll)
provide("navigateToSection", navigateToSection)
provide("navigateToCategory", navigateToCategory)
provide("scrollToTopOfCurrentSection", scrollToTopOfCurrentSection)
</script>