<template>
    <Article class="article-thread"
             :model="model">
        <ul class="thread">
            <!-- Items -->
            <ArticleThreadItem
  v-for="item in skillItems"
  :key="item.id"
  :item="item"
/>

<!-- trailing
<ArticleThreadItem /> -->

        </ul>
    </Article>
</template>

<script setup>
import Article from "/src/vue/components/articles/base/Article.vue"
import ArticleThreadItem from "/src/vue/components/articles/thread/ArticleThreadItem.vue"
import { inject, computed } from "vue"

const currentProfile = inject("currentProfile")

const logroItems = computed(() => {
  return currentProfile.value.logros || []
})


const skillItems = computed(() => {
  if (!currentProfile.value?.logros) return []

  return currentProfile.value.logros.map(logros => ({
    // 👉 lo que el componente YA espera
    titulo: logros.titulo,
    biografia: logros.biografia,
    fecha: logros.fecha,
    lugar: logros.lugar,

    // opcional / visual
    percentage: null,
    dateStart: null,
    links: [],

    // iconos (puedes ajustar)
    img: null,
    fallbackFaIcon: "fa-solid fa-code",
    fallbackFaIconColor: "#4f46e5",

    // flags internos
    hasPercentage: false,
    locales: null
  }))
})

console.log(skillItems.value)

const props = defineProps({
    /** @type {Article} **/
    model: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

ul.thread {
    position: relative;
    padding: 0;
    margin: 0;
    list-style: none;
}

ul.thread:before {
    position: absolute;
    top: 0;
    bottom: 0;
    content: "";
    background-color: $article-thread-line-color;
    z-index: 1;

    @each $breakpoint, $multiplier in $article-thread-scale-multipliers {
        @include media-breakpoint-down($breakpoint) {
            width: calc(4px * $multiplier);
            margin-left: calc(($article-thread-circle-base-size/2 - 2px) * $multiplier);
            height: calc(100%);
        }
    }
}
</style>