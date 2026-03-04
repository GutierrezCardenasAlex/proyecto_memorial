<template>
    <p v-if="currentProfile?.biografia"
       class="eq-h6"
       v-html="currentProfile.biografia"/>
</template>

<script setup>
import { inject } from "vue"
const currentProfile = inject("currentProfile")
</script>
