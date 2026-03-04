<!-- <template>
    <ul class="inline-list eq-h6">
        <li v-for="item in items" class="inline-list-item">
            <a :class="item.href ? `link-darkened` : `link-disabled`" :href="item.href">
                <i v-if="item.faIcon" :class="item.faIcon"/>
                <span v-html="item.getValue(localize, true)"/>
            </a>
        </li>
    </ul>
</template> -->
<template>
    <ul v-if="currentProfile" class="inline-list eq-h6">
        <!-- Lugar -->
        <li v-if="location" class="inline-list-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>{{ location }}</span>
        </li>

        <!-- Años -->
        <li v-if="years" class="inline-list-item">
            <i class="fa-solid fa-calendar"></i>
            <span>{{ years }}</span>
        </li>

        <!-- Cumpleaños -->
        <li v-if="birthday" class="inline-list-item">
            <i class="fa-solid fa-cake-candles"></i>
            <span>{{ birthday }}</span>
        </li>
    </ul>
</template>

<script setup>
import {inject, computed} from "vue"

const props = defineProps({
    items: Array,
})

/** @type {Function} */
const localize = inject("localize")


const currentProfile = inject("currentProfile")

const location = computed(() => {
  if (!currentProfile?.value) return null
  const { province, country } = currentProfile.value
  if (!province && !country) return null
  return [province, country].filter(Boolean).join(" – ")
})

const years = computed(() => {
  if (!currentProfile?.value) return null
  const { anio_nacimiento, anio_fallecimiento } = currentProfile.value
  if (!anio_nacimiento) return null
  return anio_fallecimiento
    ? `${anio_nacimiento} – ${anio_fallecimiento}`
    : `${anio_nacimiento}`
})

const birthday = computed(() => {
  if (!currentProfile?.value?.dia_cumpleanos) return null
  const date = new Date(currentProfile.value.dia_cumpleanos)

  return date.toLocaleDateString("es-BO", {
    day: "numeric",
    month: "long"
  })
})

</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

$spacing-between-items:15px;

ul.inline-list {
    list-style: none;
    padding: 0;
    display: flex;

    @include media-breakpoint-down(xl) {
        flex-direction: column;
    }
}

li.inline-list-item {
    margin-right: $spacing-between-items;
    &:not(:last-child)::after {
        content: "𐄁";
        opacity: 0.4;
        margin-left: $spacing-between-items;
    }

    i {
        margin-right: 10px;
        opacity: 1;
    }
}

li.inline-list-item {
    @include media-breakpoint-down(xl) {
        i {
            min-width: 20px;
            text-align: center;
        }

        &:not(:last-child) {
            margin-bottom: 5px;
        }

        &::after {
            display: none!important;
        }
    }
}
</style>