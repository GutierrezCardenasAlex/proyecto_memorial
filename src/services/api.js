export async function buscarPersona(nombre) {
  const res = await fetch(`/api/personas?search=${nombre}`);
  return res.json();
}
