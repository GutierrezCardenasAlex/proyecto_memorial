<template>
  <!-- Loader -->
  <Loader
    :visible="loaderVisible"
    @completed="onLoaderCompleted"
  />

  <!-- App -->
  <router-view
    v-if="appReady"
    :key="$route.fullPath"
  />
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import Loader from "/src/vue/components/loaders/Loader.vue"

const route = useRoute()

const loaderVisible = ref(true)
const appReady = ref(false)

onMounted(() => {
  loaderVisible.value = true
})

function onLoaderCompleted() {
  loaderVisible.value = false
  appReady.value = true
}
</script>