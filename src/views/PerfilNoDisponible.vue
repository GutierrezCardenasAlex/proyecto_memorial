<template>
  <div class="not-found">
    <h1>Perfil no disponible</h1>

    <p class="subtitle">
      El perfil que intentas visualizar no se encuentra disponible,
      fue deshabilitado o la dirección ingresada no es correcta.
    </p>

    <p class="info">
      Si consideras que se trata de un error, por favor comunícate con el
      <strong>administrador del sistema</strong> o con el
      <strong>personal responsable</strong>, quienes podrán ayudarte
      a resolver esta situación.
    </p>

    <div class="actions">
      <!-- WhatsApp -->
      <a
        class="btn whatsapp"
        href="https://wa.me/591XXXXXXXX"
        target="_blank"
        rel="noopener"
      >
        Contactar por WhatsApp
      </a>

      <!-- Google / Correo -->
      <a
        class="btn google"
        href="mailto:admin@tudominio.com"
      >
        Contactar por Google
      </a>
    </div>

    <p class="footer">
      Gracias por tu comprensión.
    </p>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  background: #f8f9fb;
  color: #333;
}

.not-found h1 {
  font-size: 2.3rem;
  margin-bottom: 16px;
  color: #2c3e50;
}

.subtitle {
  font-size: 1.1rem;
  margin-bottom: 12px;
  max-width: 600px;
}

.info {
  font-size: 1rem;
  max-width: 620px;
  margin-bottom: 32px;
  color: #555;
}

.actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  padding: 12px 20px;
  font-size: 0.95rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

/* WhatsApp */
.whatsapp {
  background-color: #25d366;
  color: #ffffff;
}

.whatsapp:hover {
  background-color: #1ebe5d;
}

/* Google */
.google {
  background-color: #ffffff;
  color: #444;
  border: 1px solid #ddd;
}

.google:hover {
  background-color: #f1f1f1;
}

.footer {
  font-size: 0.9rem;
  color: #777;
}
</style>
