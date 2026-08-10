import { isConfigured, listImages } from '../config/supabase.js';

// --- Imágenes de ejemplo (modo demo, mientras no haya Supabase configurado) --
// Son mosaicos con los colores de marca, generados en el navegador (sin archivos
// externos), para que la sección se vea completa desde el primer momento.
function demoTile(c1, c2, label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='600'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='480' height='600' fill='url(#g)'/>
    <text x='50%' y='52%' fill='rgba(255,255,255,.9)' font-family='Archivo,sans-serif'
      font-size='30' font-weight='800' text-anchor='middle'>${label}</text>
    <text x='50%' y='60%' fill='rgba(255,255,255,.65)' font-family='monospace'
      font-size='14' text-anchor='middle'>EJEMPLO</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const DEMO = [
  { title: 'Full print floral',   url: demoTile('#EC1467', '#ff8ab6', 'Full print floral') },
  { title: 'Patrón geométrico',   url: demoTile('#1857D6', '#22B8CF', 'Geométrico') },
  { title: 'Tie-dye',             url: demoTile('#22B8CF', '#FFC72C', 'Tie-dye') },
  { title: 'Estampado tropical',  url: demoTile('#0B1A45', '#1857D6', 'Tropical') },
  { title: 'Camuflado urbano',    url: demoTile('#5a8bf0', '#EC1467', 'Camuflado') },
  { title: 'Acuarela abstracta',  url: demoTile('#FFC72C', '#EC1467', 'Acuarela') },
];

export function initCatalog() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;

  const hint = document.getElementById('catSwipeHint');
  const lb = document.getElementById('catLightbox');
  const lbImg = document.getElementById('catLbImg');
  const lbCap = document.getElementById('catLbCaption');
  const btnClose = document.getElementById('catLbClose');
  const btnPrev = document.getElementById('catLbPrev');
  const btnNext = document.getElementById('catLbNext');

  let items = [];
  let current = 0;

  function cardMarkup(item, index) {
    const cap = item.title
      ? `<span class="cat-cap"><span class="ref">Diseño</span>${item.title}</span>`
      : '';
    return `
      <button class="cat-card" data-index="${index}" aria-label="Ver diseño${item.title ? ': ' + item.title : ''}">
        <span class="cat-zoom" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        </span>
        <img class="cat-thumb" src="${item.url}" alt="${item.title || 'Diseño de estampado'}" loading="lazy">
        ${cap}
      </button>`;
  }

  function render() {
    if (!items.length) {
      grid.innerHTML = `
        <div class="cat-empty">
          <b>Pronto verás nuestros diseños aquí</b>
          Estamos cargando el catálogo. Mientras tanto, escríbenos y con gusto te mostramos ideas.
        </div>`;
      if (hint) hint.hidden = true;
      return;
    }
    grid.innerHTML = items.map(cardMarkup).join('');
    if (hint) hint.hidden = items.length <= 1;
  }

  // --- Lightbox -------------------------------------------------------------
  function openAt(i) {
    current = (i + items.length) % items.length;
    const it = items[current];
    lbImg.src = it.url;
    lbImg.alt = it.title || 'Diseño de estampado';
    lbCap.textContent = it.title || '';
    lbCap.style.display = it.title ? '' : 'none';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }
  function close() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
  }
  const next = () => openAt(current + 1);
  const prev = () => openAt(current - 1);

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.cat-card');
    if (!card) return;
    openAt(Number(card.dataset.index));
  });

  btnClose.addEventListener('click', close);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // Deslizar en el visor (celular)
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchX = null;
  }, { passive: true });

  // --- Carga de datos -------------------------------------------------------
  async function load() {
    if (!isConfigured) {
      items = DEMO;
      render();
      return;
    }
    try {
      const imgs = await listImages();
      items = imgs.length ? imgs : DEMO;   // si el bucket está vacío, muestra ejemplos
    } catch (err) {
      console.error('[catálogo] error cargando imágenes:', err);
      items = DEMO;
    }
    render();
  }

  load();
}
