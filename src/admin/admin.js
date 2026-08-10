import {
  isConfigured,
  signIn,
  listImages,
  uploadImage,
  deleteImage,
  compressImage,
  buildFileName,
} from '../config/supabase.js';

const $ = (id) => document.getElementById(id);

const loginView = $('loginView');
const panelView = $('panelView');
const logoutBtn = $('logoutBtn');

const loginForm = $('loginForm');
const loginBtn = $('loginBtn');
const loginMsg = $('loginMsg');

const drop = $('drop');
const fileInput = $('fileInput');
const titleInput = $('titleInput');
const uploadMsg = $('uploadMsg');
const gallery = $('gallery');
const galCount = $('galCount');

const SESSION_KEY = 'ss_admin_token';
let token = sessionStorage.getItem(SESSION_KEY) || null;

// --- Helpers de UI ----------------------------------------------------------
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function msg(el, text, kind) {
  el.textContent = text;
  el.className = `msg show ${kind}`;
}
function clearMsg(el) { el.className = 'msg'; el.textContent = ''; }

function enterPanel() {
  hide(loginView);
  show(panelView);
  show(logoutBtn);
  loadGallery();
}
function exitPanel() {
  token = null;
  sessionStorage.removeItem(SESSION_KEY);
  hide(panelView);
  hide(logoutBtn);
  show(loginView);
}

// --- Guardia de configuración ----------------------------------------------
if (!isConfigured) {
  msg(loginMsg, 'Falta configurar Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local). Revisa CATALOGO_SETUP.md.', 'err');
  loginBtn.disabled = true;
}

// --- Login ------------------------------------------------------------------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMsg(loginMsg);
  loginBtn.disabled = true;
  loginBtn.textContent = 'Entrando…';
  try {
    token = await signIn($('email').value.trim(), $('password').value);
    sessionStorage.setItem(SESSION_KEY, token);
    enterPanel();
  } catch (err) {
    msg(loginMsg, 'Correo o contraseña incorrectos. Intenta de nuevo.', 'err');
    console.error(err);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Entrar';
  }
});

logoutBtn.addEventListener('click', exitPanel);

// --- Galería (listar + borrar) ---------------------------------------------
async function loadGallery() {
  galCount.textContent = 'Cargando…';
  gallery.innerHTML = '';
  try {
    const imgs = await listImages();
    galCount.textContent = imgs.length
      ? `${imgs.length} foto${imgs.length === 1 ? '' : 's'} publicada${imgs.length === 1 ? '' : 's'}`
      : 'Aún no hay fotos. ¡Sube la primera!';
    gallery.innerHTML = imgs
      .map(
        (it) => `
      <div class="gitem" data-name="${encodeURIComponent(it.name)}">
        <img src="${it.url}" alt="${it.title || 'Diseño'}" loading="lazy">
        ${it.title ? `<div class="cap">${it.title}</div>` : ''}
        <button class="del" title="Eliminar" aria-label="Eliminar foto">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H7a1 1 0 01-1-1V6"/></svg>
        </button>
      </div>`
      )
      .join('');
  } catch (err) {
    galCount.textContent = 'No se pudo cargar la galería.';
    console.error(err);
  }
}

gallery.addEventListener('click', async (e) => {
  const btn = e.target.closest('.del');
  if (!btn) return;
  const item = btn.closest('.gitem');
  const name = decodeURIComponent(item.dataset.name);
  if (!confirm('¿Eliminar esta foto del catálogo?')) return;
  btn.disabled = true;
  try {
    await deleteImage(name, token);
    item.remove();
    msg(uploadMsg, 'Foto eliminada.', 'info');
    loadGallery();
  } catch (err) {
    msg(uploadMsg, 'No se pudo eliminar. ¿Sesión vencida? Vuelve a entrar.', 'err');
    console.error(err);
  }
});

// --- Subida -----------------------------------------------------------------
drop.addEventListener('click', () => fileInput.click());
drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', (e) => {
  e.preventDefault();
  drop.classList.remove('over');
  if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) handleFiles(fileInput.files);
});

async function handleFiles(fileList) {
  const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
  if (!files.length) {
    msg(uploadMsg, 'Elige archivos de imagen (JPG o PNG).', 'err');
    return;
  }
  const title = titleInput.value.trim();
  let done = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    msg(uploadMsg, `Subiendo ${i + 1} de ${files.length}…`, 'info');
    try {
      const blob = await compressImage(files[i]);
      const ext = blob.type && blob.type.includes('png') ? 'png'
        : blob.type && blob.type.includes('webp') ? 'webp' : 'jpg';
      const name = buildFileName(title, `foto.${ext}`, i);
      await uploadImage(blob, token, name);
      done++;
    } catch (err) {
      failed++;
      console.error('Error subiendo', files[i].name, err);
    }
  }

  fileInput.value = '';
  titleInput.value = '';
  if (failed && !done) {
    msg(uploadMsg, 'No se pudieron subir las fotos. ¿Sesión vencida? Vuelve a entrar.', 'err');
  } else if (failed) {
    msg(uploadMsg, `Se subieron ${done}, fallaron ${failed}.`, 'err');
  } else {
    msg(uploadMsg, `¡Listo! Se ${done === 1 ? 'subió 1 foto' : `subieron ${done} fotos`}. Ya se ven en la página.`, 'ok');
  }
  loadGallery();
}

// --- Sesión persistida ------------------------------------------------------
if (token) enterPanel();
