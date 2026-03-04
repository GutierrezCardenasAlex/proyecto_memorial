<template>
  <aside :class="['sidebar-premium', { collapsed }, theme]">
    <div class="sidebar-bg-glow"></div>

    <div class="sidebar-header">
      <div class="control-group">
        <button class="action-btn" @click="$emit('toggle-theme')" title="Apariencia">
          <span class="icon-anim">{{ theme === 'light' ? '🌙' : '☀️' }}</span>
        </button>
        <button class="action-btn collapse-trigger" @click="collapsed = !collapsed">
          <span class="icon-anim">{{ collapsed ? '→' : '✕' }}</span>
        </button>
      </div>
    </div>

    <div class="sidebar-brand" v-if="perfil">
      <div class="avatar-wrapper">
        <div class="avatar-border"></div>
        <img :src="perfil.ruta_imagen" class="avatar-img" />
      </div>
      <transition name="fade-slide">
        <div class="brand-info" v-if="!collapsed">
          <h2 class="perfil-name">{{ perfil.nombre_completo }}</h2>
          <div class="premium-badge">
            <span class="dot"></span>
            <span class="badge-text">Memorial Digital</span>
          </div>
        </div>
      </transition>
    </div>

    <div class="nav-divider"></div>

    <nav class="sidebar-nav no-scrollbar">
      <button 
        v-for="item in navItems" 
        :key="item.id"
        :class="['nav-link', { active: currentSection === item.id }]"
        @click="$emit('navigate', item.id)"
      >
        <div class="active-indicator"></div>
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text" v-if="!collapsed">{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar-footer" v-if="!collapsed">
      <div class="footer-line"></div>
      <p class="quote">"In Perpetuum"</p>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['perfil', 'theme', 'currentSection', 'navItems'])
defineEmits(['toggle-theme', 'navigate'])

const collapsed = ref(false)
const BASE_URL = "http://localhost:3000"
const imageUrl = (path) => path ? (path.startsWith('http') ? path : `${BASE_URL}/${path}`) : ''
</script>

<style scoped>
.sidebar-premium {
  width: 280px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(128, 128, 128, 0.1);
  overflow: hidden;
}

/* COLORES BASE */
.light { background: #ffffff; color: #1a1a1a; }
.dark { background: #0a0a0b; color: #efefef; }

.sidebar-premium.collapsed { width: 85px; }

/* EFECTO DE RESPLANDOR FONDO */
.sidebar-bg-glow {
  position: absolute;
  top: -10%; left: -10%;
  width: 120%; height: 40%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

/* HEADER Y BOTONES */
.sidebar-header { padding: 30px 20px; display: flex; justify-content: center; }
.control-group { display: flex; gap: 12px; }

.action-btn {
  width: 38px; height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(128, 128, 128, 0.15);
  background: rgba(128, 128, 128, 0.05);
  backdrop-filter: blur(8px);
  color: inherit;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
}
.action-btn:hover {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
}

/* AVATAR (Tamaño optimizado) */
.sidebar-brand { padding: 0 20px 30px; text-align: center; }
.avatar-wrapper {
  position: relative;
  margin: 0 auto 15px;
  /* Imagen más pequeña como pediste */
  width: v-bind("collapsed ? '45px' : '90px'");
  height: v-bind("collapsed ? '45px' : '90px'");
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.avatar-img {
  width: 100%; height: 100%;
  border-radius: 24px; /* Estilo redondeado moderno */
  object-fit: cover;
  position: relative;
  z-index: 2;
  border: 2px solid rgba(128, 128, 128, 0.1);
}
.avatar-border {
  position: absolute;
  inset: -4px;
  border: 1px solid #6366f1;
  border-radius: 28px;
  opacity: 0.2;
  transition: 0.3s;
}

.perfil-name { 
  font-size: 1rem; 
  font-weight: 800; 
  margin: 0; 
  letter-spacing: -0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.premium-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(99, 102, 241, 0.08);
  padding: 4px 10px; border-radius: 20px; margin-top: 6px;
}
.premium-badge .dot { width: 5px; height: 5px; background: #6366f1; border-radius: 50%; }
.badge-text { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; }

.nav-divider { height: 1px; background: linear-gradient(to right, transparent, rgba(128,128,128,0.1), transparent); margin: 0 30px 20px; }

/* NAVEGACIÓN */
.sidebar-nav { flex: 1; padding: 0 15px; overflow-y: auto; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }

.nav-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 18px;
  margin-bottom: 8px;
  border: none;
  background: transparent;
  color: inherit;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link:hover { background: rgba(128, 128, 128, 0.05); }

.active-indicator {
  position: absolute;
  left: 0; top: 20%; height: 60%; width: 4px;
  background: #6366f1;
  border-radius: 0 4px 4px 0;
  opacity: 0;
  transition: 0.3s;
}

.nav-link.active { color: #6366f1; font-weight: 700; background: rgba(99, 102, 241, 0.05); }
.nav-link.active .active-indicator { opacity: 1; }
.nav-icon { font-size: 1.2rem; }
.nav-text { font-size: 0.9rem; letter-spacing: 0.2px; }

/* FOOTER */
.sidebar-footer { padding: 30px 20px; text-align: center; margin-top: auto; }
.footer-line { height: 1px; width: 30px; background: #6366f1; margin: 0 auto 10px; opacity: 0.3; }
.quote { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; opacity: 0.4; }

/* ANIMACIONES */
.fade-slide-enter-active, .fade-slide-leave-active { transition: 0.4s; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }

/* RESPONSIVO */
@media (max-width: 768px) {
  .sidebar-premium {
    width: 100% !important; height: 70px;
    flex-direction: row; position: fixed; bottom: 0; top: auto;
    border-right: none; border-top: 1px solid rgba(128,128,128,0.1);
    background: v-bind("theme === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(10,10,11,0.85)'");
    backdrop-filter: blur(20px);
  }
  .sidebar-header, .sidebar-brand, .nav-divider, .sidebar-footer, .nav-text, .active-indicator { display: none; }
  .sidebar-nav { display: flex; width: 100%; justify-content: space-around; padding: 0; margin: 0; align-items: center; }
  .nav-link { width: auto; margin: 0; padding: 10px; }
  .nav-link.active { background: transparent; }
}
</style>