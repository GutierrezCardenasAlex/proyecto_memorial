<template>
  <div class="funeral-bg">
    <div class="overlay">
      <div class="login-card">
        <div class="logo-section">
          <h1>Memorial Admin</h1>
          <p class="subtitle">Acceso privado</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <input 
              type="password" 
              v-model="password" 
              placeholder="Ingrese la contraseña" 
              required 
            />
          </div>

          <button type="submit" class="btn-dark">
            Ingresar
          </button>

          <p v-if="error" class="error-msg">{{ error }}</p>
        </form>

        <div class="footer-text">
          <small>Sistema Administrativo Interno</small>
        </div>
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
.funeral-bg {
  height: 100vh;
  background: linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.95)),
              url('https://images.unsplash.com/photo-1529070538774-1843cb3265df');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Georgia', serif;
}

.overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(6px);
  padding: 50px;
  border-radius: 6px;
  width: 100%;
  max-width: 420px;
  color: #e5e5e5;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
  text-align: center;
}

.logo-section h1 {
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 30px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.input-group input {
  width: 100%;
  background: #111;
  border: 1px solid #333;
  border-radius: 4px;
  color: #ddd;
  height: 48px;
  padding: 0 15px;
  margin-bottom: 20px;
  font-size: 15px;
  transition: 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #888;
  background: #181818;
}

.btn-dark {
  width: 100%;
  height: 46px;
  background: #2b2b2b;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-dark:hover {
  background: #3a3a3a;
  border-color: #666;
}

.error-msg {
  color: #c53030;
  margin-top: 10px;
  font-size: 14px;
}

.footer-text {
  margin-top: 25px;
  color: #666;
  font-size: 12px;
}
</style>