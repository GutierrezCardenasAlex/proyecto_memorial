<template>
  <Loader
    v-if="loaderVisible"
    :visible="loaderVisible"
    @completed="onLoaderCompleted"
  />

  <router-view v-show="appReady" />
</template>

<script setup>
import { ref } from "vue"
// Eliminamos useRoute de aquí, no lo necesitas en este nivel si solo es para la key
import Loader from "/src/vue/components/loaders/Loader.vue"

const loaderVisible = ref(true)
const appReady = ref(false)

function onLoaderCompleted() {
  loaderVisible.value = false
  appReady.value = true
}
</script>