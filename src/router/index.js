import { createRouter, createWebHashHistory } from 'vue-router'

import LoginAdmin from '../views/admin/LoginAdmin.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import PerfilView from '../views/PerfilView.vue'
import PerfilNoDisponible from '../views/PerfilNoDisponible.vue'
import CreateView from '../views/admin/CreateView.vue'
import VerPersona from '../views/admin/VerPersona.vue'
import EditarPersona from '../views/admin/EditarPersona.vue'
import AddExtraInfo from '../views/admin/AddExtraInfo.vue'

const routes = [
  { path: '/admin/login', component: LoginAdmin },
  { path: '/admin/dashboard', component: Dashboard },
  { path: '/admin/crear', component: CreateView },

  {
    path: '/admin/ver/:id',
    component: VerPersona
  },
  {
    path: '/admin/editar/:id',
    component: EditarPersona
  },
  {
    path: '/admin/add-info/:id',
    component: AddExtraInfo
  },

  {
    path: '/perfil-no-disponible',
    name: 'perfil-no-disponible',
    component: PerfilNoDisponible
  },

  // 🚨 ESTA SIEMPRE AL FINAL
  {
    path: '/:slug/:section?',
    name: 'perfil',
    component: PerfilView
  },

  { path: '/', redirect: '/admin/login' }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router