<template>
  <div :class="['memorial-layout', theme]">
    
    <Sidebar 
      :perfil="perfil" 
      :theme="theme" 
      :currentSection="section" 
      :navItems="navItems"
      @toggle-theme="toggleTheme"
      @navigate="go"
    />

    <main class="main-content no-scrollbar">
      <div v-if="loading" class="premium-loader">
        <div class="line-loader"></div>
        <p class="loading-text">Honrando una vida...</p>
      </div>

      <div v-else-if="perfil" class="content-view">
        <header class="editorial-header">
          <transition name="slide-up" mode="out-in">
            <div :key="section" class="header-inner">
              <span class="section-number">0{{ navItems.findIndex(n => n.id === section) + 1 }}</span>
              <h1 class="section-title">{{ sectionTitle }}</h1>
              <div class="header-decoration">
                <span class="line"></span>
                <span class="dot"></span>
              </div>
            </div>
          </transition>
        </header>

        <transition name="page-reveal" mode="out-in">
          <div :key="section" class="render-area">
            
            <div v-if="section === 'perfil'" class="bio-section">
              <div class="bio-quote-container">
                <span class="quote-mark">“</span>
                <p class="bio-text-premium">{{ perfil.biografia }}</p>
              </div>
              
              <div class="stats-grid">
                <div class="stat-card">
                  <span class="stat-label">Legado Temporal</span>
                  <span class="stat-value">{{ formatDate(perfil.dia_cumpleanos) }} — {{ formatDate(perfil.dia_fallecimiento) }}</span>
                </div>
                <div class="stat-card">
                  <span class="stat-label">Raíces</span>
                  <span class="stat-value">{{ perfil.province }}, {{ perfil.country }}</span>
                </div>
              </div>
            </div>

            <div v-else-if="section === 'galeria'" class="art-gallery">
              <div v-for="(img, idx) in perfil.galeria" :key="img.id" 
                   class="art-card" :style="{ '--delay': idx * 0.1 + 's' }">
                <div class="img-wrapper">
                  <img :src="img.ruta_imagen" loading="lazy" />
                  <div class="img-overlay">
                    <p class="img-title">{{ img.titulo }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="timeline-container">
              <div v-for="(item, i) in currentData" :key="i" 
                   class="timeline-item" :style="{ '--delay': i * 0.1 + 's' }">
                <div class="time-marker">
                  <span class="year">{{ item.fecha ? getYear(item.fecha) : getYear(item.date_start) }}</span>
                  <span class="line"></span>
                </div>
                <div class="timeline-card">
                  <div class="card-meta">
                    <span class="inst">{{ item.institution || item.institucion }}</span>
                    <span class="full-date">{{ item.fecha ? formatDate(item.fecha) : formatDate(item.date_start) }}</span>
                  </div>
                  <h3 class="card-title">{{ item.title || item.cargo || item.titulo }}</h3>
                  <p class="card-desc">{{ item.description || item.descripcion || item.biografia }}</p>
                </div>
              </div>
            </div>

          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import Sidebar from './Sidebar.vue'

const route = useRoute()
const router = useRouter()
const perfil = ref(null)
const loading = ref(true)
const theme = ref(localStorage.getItem("theme") || "light")
const BASE_URL = import.meta.env.VITE_API_URL

const navItems = [
  { id: 'perfil', label: 'Biografía', icon: '👤' },
  { id: 'educacion', label: 'Educación', icon: '🎓' },
  { id: 'trayectoria', label: 'Trayectoria', icon: '💼' },
  { id: 'logros', label: 'Logros', icon: '🏆' },
  { id: 'intereses', label: 'Intereses', icon: '✨' },
  { id: 'galeria', label: 'Galería', icon: '📸' },
]

const section = computed(() => route.params.section || "perfil")
const slug = computed(() => route.params.slug)
const sectionTitle = computed(() => navItems.find(n => n.id === section.value)?.label)
const currentData = computed(() => perfil.value ? perfil.value[section.value] || [] : [])

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem("theme", theme.value)
}

const imageUrl = (path) => path ? `${BASE_URL}/${path}` : ''
const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
const getYear = (d) => d ? new Date(d).getFullYear() : '—'
const go = (sec) => router.push(`/${slug.value}/${sec}`)

async function loadData() {
  loading.value = true
  try {
    const res = await fetch(`${BASE_URL}/api/personas/slug/${slug.value}`)
    perfil.value = await res.json()
  } catch (err) { console.error(err) } finally { loading.value = false }
}

onMounted(loadData)
watch(() => route.params.slug, loadData)
</script>

<style scoped>
/* ESTRUCTURA GLOBAL */
.memorial-layout { display: flex; height: 100vh; overflow: hidden; font-family: 'Inter', sans-serif; }
.light { background: #fdfdfd; color: #1a1a1a; }
.dark { background: #050505; color: #e5e5e5; }

.main-content { flex: 1; overflow-y: auto; scroll-behavior: smooth; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.content-view { max-width: 1000px; margin: 0 auto; padding: 80px 50px; }

/* HEADER EDITORIAL */
.editorial-header { margin-bottom: 80px; position: relative; }
.section-number { font-size: 0.9rem; font-weight: 800; color: #6366f1; letter-spacing: 2px; display: block; margin-bottom: 10px; }
.section-title { font-size: 4.5rem; font-weight: 900; margin: 0; line-height: 0.9; letter-spacing: -3px; }
.header-decoration { display: flex; align-items: center; gap: 15px; margin-top: 20px; }
.header-decoration .line { height: 2px; width: 100px; background: linear-gradient(to right, #6366f1, transparent); }
.header-decoration .dot { width: 6px; height: 6px; background: #6366f1; border-radius: 50%; }

/* BIO PREMIUM */
.bio-quote-container { position: relative; margin-bottom: 60px; }
.quote-mark { position: absolute; top: -40px; left: -20px; font-size: 8rem; opacity: 0.1; font-family: serif; }
.bio-text-premium { font-size: 1.5rem; line-height: 1.7; font-weight: 400; position: relative; z-index: 1; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
.stat-card { 
  padding: 30px; border-radius: 20px; 
  background: v-bind("theme === 'light' ? '#f8f9fa' : '#0f0f0f'"); 
  border: 1px solid rgba(128,128,128,0.1);
}
.stat-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.5; margin-bottom: 10px; }
.stat-value { font-size: 1.1rem; font-weight: 700; }

/* GALERÍA ARTÍSTICA */
.art-gallery { columns: 3; column-gap: 25px; }
.art-card { break-inside: avoid; margin-bottom: 25px; opacity: 0; animation: fadeInUp 0.6s forwards; animation-delay: var(--delay); }
.img-wrapper { 
  position: relative; border-radius: 15px; overflow: hidden; 
  transform: scale(1); transition: 0.5s cubic-bezier(0.2, 1, 0.3, 1);
}
.img-wrapper:hover { transform: translateY(-10px); }
.img-wrapper img { width: 100%; display: block; transition: 0.8s; }
.img-wrapper:hover img { transform: scale(1.1); }
.img-overlay { 
  position: absolute; inset: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); 
  display: flex; align-items: flex-end; padding: 20px; opacity: 0; transition: 0.3s;
}
.art-card:hover .img-overlay { opacity: 1; }
.img-title { color: white; font-size: 0.9rem; font-weight: 600; }

/* TIMELINE PREMIUM */
.timeline-container { position: relative; padding-left: 20px; }
.timeline-item { 
  display: flex; gap: 40px; margin-bottom: 50px; 
  opacity: 0; animation: fadeInUp 0.6s forwards; animation-delay: var(--delay);
}
.time-marker { display: flex; flex-direction: column; align-items: center; min-width: 60px; }
.year { font-weight: 900; font-size: 1.2rem; color: #6366f1; }
.time-marker .line { flex: 1; width: 2px; background: rgba(128,128,128,0.1); margin-top: 10px; }

.timeline-card { 
  flex: 1; padding: 35px; border-radius: 24px; 
  background: v-bind("theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(15,15,15,0.7)'");
  backdrop-filter: blur(10px); border: 1px solid rgba(128,128,128,0.1);
  transition: 0.3s;
}
.timeline-card:hover { border-color: #6366f1; transform: translateX(10px); }
.card-meta { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 0.8rem; }
.inst { font-weight: 700; text-transform: uppercase; color: #6366f1; }
.card-title { font-size: 1.8rem; margin: 0 0 10px 0; font-weight: 800; }
.card-desc { line-height: 1.6; opacity: 0.7; }

/* ANIMACIONES */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-reveal-enter-active { transition: all 0.5s ease-out; }
.page-reveal-enter-from { opacity: 0; transform: scale(0.98); filter: blur(10px); }

/* LOADER */
.premium-loader { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.line-loader { width: 150px; height: 3px; background: rgba(128,128,128,0.1); position: relative; overflow: hidden; }
.line-loader::after { 
  content: ''; position: absolute; left: -100%; width: 100%; height: 100%; 
  background: #6366f1; animation: loading 1.5s infinite; 
}
@keyframes loading { to { left: 100%; } }

/* RESPONSIVE */
@media (max-width: 768px) {
  .section-title { font-size: 2.8rem; }
  .content-view { padding: 40px 20px 120px; }
  .art-gallery { columns: 1; }
  .timeline-item { flex-direction: column; gap: 10px; }
  .time-marker { flex-direction: row; gap: 15px; min-width: auto; }
  .time-marker .line { height: 2px; width: 30px; }
}
</style>