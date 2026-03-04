<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irDashboard = () => {
  router.push('/admin/dashboard')
}

const irCrear = () => {
  router.push('/admin/crear')
}

const logout = () => {
  localStorage.removeItem('adminToken')
  router.push('/admin/login')
}
</script>

<template>
  <header class="navbar">
    
    <div class="left">
      <h1 class="logo" @click="irDashboard">
        MEMORIAL<span>FLIX</span>
      </h1>

      <nav class="menu">
        <button @click="irDashboard">Dashboard</button>
        <button @click="irCrear">Nuevo Perfil</button>
      </nav>
    </div>

    <div class="right">
      <button class="logout" @click="logout">
        Salir
      </button>
    </div>

  </header>
</template>

<style scoped>
/* NAVBAR BASE */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 70px;
  padding: 0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.6), transparent);
  backdrop-filter: blur(6px);
}

/* IZQUIERDA */
.left {
  display: flex;
  align-items: center;
  gap: 40px;
}

/* LOGO */
.logo {
  font-size: 26px;
  font-weight: bold;
  color: #e50914;
  cursor: pointer;
  letter-spacing: 1px;
}

.logo span {
  color: white;
}

/* MENÚ */
.menu button {
  background: transparent;
  border: none;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
}

.menu button:hover {
  color: #e50914;
}

.menu button::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 0%;
  height: 2px;
  background: #e50914;
  transition: 0.3s;
}

.menu button:hover::after {
  width: 100%;
}

/* DERECHA */
.right {
  display: flex;
  align-items: center;
}

.logout {
  background: #e50914;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.logout:hover {
  background: #b20710;
}
</style>