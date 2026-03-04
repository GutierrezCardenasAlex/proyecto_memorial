<template>
  <div class="netflix-bg">
    <div class="login-layer">
      <div class="login-box">
        <h1>Inicia sesión</h1>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <input type="password" v-model="password" placeholder="Contraseña de acceso" required />
          </div>
          <button type="submit" class="btn-netflix">Entrar</button>
          
          <p v-if="error" class="error-msg">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = () => {
  // Clave maestra simple (en producción usa JWT real)
  if (password.value === 'admin123') {
    localStorage.setItem('adminToken', 'true');
    router.push('/admin/dashboard');
  } else {
    error.value = 'Contraseña incorrecta.';
  }
};
</script>

<style scoped>
.netflix-bg {
  height: 100vh;
  background-image: url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg');
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-layer {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box {
  background: rgba(0, 0, 0, 0.75);
  padding: 60px;
  border-radius: 4px;
  width: 100%;
  max-width: 450px;
  color: white;
}
h1 { margin-bottom: 28px; font-weight: 700; }
.input-group input {
  width: 100%;
  background: #333;
  border: none;
  border-radius: 4px;
  color: white;
  height: 50px;
  padding: 0 20px;
  margin-bottom: 16px;
  font-size: 16px;
}
.btn-netflix {
  width: 100%;
  height: 48px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 24px;
}
.btn-netflix:hover { background-color: #f40612; }
.error-msg { color: #e87c03; margin-top: 10px; font-size: 14px; }
</style>