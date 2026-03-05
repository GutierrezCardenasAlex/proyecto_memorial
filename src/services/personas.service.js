const API_BASE = 'http://localhost:3000/api' 
// 👆 usa el puerto REAL de tu backend

export async function validarSlug(slug) {
  try {
    const res = await fetch(`/api/personas/slug/${slug}`)

    if (res.status === 404) return false
    if (!res.ok) throw new Error('Error servidor')

    return true
  } catch (err) {
    console.error('Error validando slug:', err)
    return false
  }
}
