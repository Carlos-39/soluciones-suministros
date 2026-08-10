// ---------------------------------------------------------------------------
//  Configuración de Supabase (backend gratuito del catálogo de diseños)
// ---------------------------------------------------------------------------
//  Estas dos variables se rellenan en el archivo .env.local (no se sube a git):
//    VITE_SUPABASE_URL=https://xxxxx.supabase.co
//    VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
//  La "anon key" es PÚBLICA por diseño: está protegida por las políticas (RLS)
//  del proyecto. Ver CATALOGO_SETUP.md para el paso a paso.
// ---------------------------------------------------------------------------

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const BUCKET = 'catalogo';

// Si no hay credenciales, la web funciona en "modo demo" con imágenes de ejemplo.
export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// --- Utilidades de nombre / título -----------------------------------------

export function slugify(str = '') {
  return str
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// El título del diseño va codificado en el nombre del archivo:
//   1699999999__camiseta-full-print-floral.jpg  ->  "Camiseta full print floral"
export function parseTitle(fileName = '') {
  const base = fileName.replace(/\.[^.]+$/, '');       // quita extensión
  const parts = base.split('__');
  const slug = parts.length > 1 ? parts.slice(1).join('__') : '';
  if (!slug) return '';
  const txt = slug.replace(/-/g, ' ').trim();
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

export function buildFileName(title, originalName, index = 0) {
  const ext = (originalName.split('.').pop() || 'jpg').toLowerCase();
  const stamp = Date.now() + (index ? `-${index}` : '');
  const slug = slugify(title);
  return slug ? `${stamp}__${slug}.${ext}` : `${stamp}.${ext}`;
}

export function publicUrl(name) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(name)}`;
}

// --- Lectura pública (galería del sitio) -----------------------------------

export async function listImages() {
  if (!isConfigured) return [];

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      prefix: '',
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    }),
  });

  if (!res.ok) throw new Error(`Supabase list ${res.status}`);
  const data = await res.json();

  return (Array.isArray(data) ? data : [])
    .filter((o) => o.name && o.name !== '.emptyFolderPlaceholder')
    .filter((o) => /\.(jpe?g|png|webp|gif|avif)$/i.test(o.name))
    .map((o) => ({
      name: o.name,
      title: parseTitle(o.name),
      url: publicUrl(o.name),
      created_at: o.created_at,
    }));
}

// --- Autenticación del panel de administración ------------------------------

export async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.msg || 'No se pudo iniciar sesión');
  }
  return data.access_token;
}

// --- Subida / borrado (requiere sesión) -------------------------------------

export async function uploadImage(file, token, fileName) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(fileName)}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true',
        'cache-control': '3600',
      },
      body: file,
    }
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`No se pudo subir (${res.status}): ${t}`);
  }
  return true;
}

export async function deleteImage(name, token) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(name)}`,
    {
      method: 'DELETE',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error(`No se pudo eliminar (${res.status})`);
  return true;
}

// --- Compresión en el navegador (fotos livianas = carga rápida en celular) --

export function compressImage(file, maxSize = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    // Solo comprimimos imágenes de mapa de bits; otros formatos pasan tal cual.
    if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) return resolve(file);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const scale = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob && blob.size < file.size ? blob : file),
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}
