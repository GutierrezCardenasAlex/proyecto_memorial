<template>
  <div
    v-if="visible"
    class="resume-loader"
    :class="{ 'resume-loader-leaving': leaving }"
  >
    <div class="light-rays"></div>

    <div class="resume-loader-content">

      <img
        src="/images/icons/resume.ico"
        alt="Logo"
        class="logo"
      />

      <div class="progress-wrapper">
        <p>{{ percentage }}%</p>

        <div class="progress">
          <div
            class="progress-bar"
            :style="{ width: percentage + '%' }"
          ></div>
        </div>
      </div>

    </div>

    <!-- 🕊️ PALOMA IZQUIERDA -->
    <div v-if="showDoves" class="dove dove-left">
      🕊️
    </div>

    <!-- 🕊️ PALOMA DERECHA -->
    <div v-if="showDoves" class="dove dove-right">
      🕊️
    </div>

    <!-- ✨ PARTÍCULAS -->
    <div v-if="showDoves" class="sparkles">
      ✨ ✨ ✨ ✨ ✨
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(["completed"])

const percentage = ref(0)
const leaving = ref(false)
const showDoves = ref(false)

onMounted(() => {
  startLoader()
})

function startLoader() {
  const duration = 1700
  const start = Date.now()

  const interval = setInterval(() => {
    const elapsed = Date.now() - start
    const progress = Math.min((elapsed / duration) * 100, 100)

    percentage.value = Math.floor(progress)

    if (percentage.value >= 100) {
      clearInterval(interval)
      finishLoader()
    }
  }, 16)
}

function finishLoader() {
  showDoves.value = true

  setTimeout(() => {
    leaving.value = true
  }, 1800)

  setTimeout(() => {
    emit("completed")
  }, 2600)
}
</script>

<style scoped>
.resume-loader {
  position: fixed;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #312e81, #0f172a, #000);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transition: transform 1s ease, opacity 0.8s ease;
}

.resume-loader-leaving {
  transform: translateY(-120%);
  opacity: 0;
}

/* 🌟 RAYOS DE LUZ */
.light-rays {
  position: absolute;
  width: 300%;
  height: 300%;
  background: radial-gradient(circle, rgba(255,215,0,0.15), transparent 60%);
  animation: pulseLight 4s infinite ease-in-out;
}

@keyframes pulseLight {
  0%,100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* CONTENIDO */
.resume-loader-content {
  text-align: center;
  color: white;
  z-index: 2;
}

.logo {
  width: 90px;
  margin-bottom: 25px;
  animation: divineGlow 2s infinite alternate;
  filter: hue-rotate(30deg) saturate(1.5);
}

@keyframes divineGlow {
  from { filter: drop-shadow(0 0 10px gold); }
  to { filter: drop-shadow(0 0 35px #facc15); }
}

.progress-wrapper p {
  margin-bottom: 6px;
  font-size: 16px;
  color: #facc15;
}

.progress {
  width: 100px;
  height: 6px;
  background: rgba(255,255,255,0.2);
  margin: 0 auto;
  border-radius: 3px;
}

.progress-bar {
  height: 6px;
  background: linear-gradient(90deg, gold, #facc15, #fde68a);
  border-radius: 3px;
  transition: width 0.2s ease;
}

/* 🕊️ PALOMAS */
.dove {
  position: absolute;
  font-size: 80px; /* MÁS GRANDE */
  filter: drop-shadow(0 0 10px white);
}

.dove-left {
  left: -100px;
  bottom: 35%;
  animation: flyLeft 2.2s ease-in-out forwards;
}

.dove-right {
  right: -100px;
  bottom: 45%;
  animation: flyRight 2.2s ease-in-out forwards;
}

@keyframes flyLeft {
  0% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
  50% { transform: translateX(50vw) translateY(-100px) scale(1.3); }
  100% { transform: translateX(110vw) translateY(-200px) scale(1.6); opacity: 0; }
}

@keyframes flyRight {
  0% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
  50% { transform: translateX(-50vw) translateY(-80px) scale(1.3); }
  100% { transform: translateX(-110vw) translateY(-180px) scale(1.6); opacity: 0; }
}

/* ✨ DESTELLOS */
.sparkles {
  position: absolute;
  bottom: 40%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  animation: sparkleFade 2s ease-out forwards;
}

@keyframes sparkleFade {
  0% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-40px); }
}
</style>