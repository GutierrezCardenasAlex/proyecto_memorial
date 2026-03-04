export async function buscarPersonas(texto) {
  const res = await fetch(`/api/personas?search=${encodeURIComponent(texto)}`);
  return res.json();
}

// export async function obtenerPerfilPorSlug(slug) {
//   const res = await fetch(`/api/personas/slug/${slug}`);
//   if (!res.ok) throw new Error("Persona no encontrada");
//   return res.json();
// }


export async function obtenerPerfilPorSlug(slug) {
  const res = await fetch(`/api/personas/slug/${slug}`);

  if (res.status === 404) {
    return null; // 👈 slug no existe
  }

  if (!res.ok) {
    throw new Error("Error del servidor");
  }

  return res.json();
}
