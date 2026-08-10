export function CatalogSection() {
  return `
<section class="catalogo" id="catalogo">
  <div class="container">
    <div class="sec-head reveal">
      <span class="eyebrow">Catálogo · Ideas</span>
      <h2>Ideas para tu próximo diseño</h2>
      <p>Explora estampados que hemos hecho. ¿Te gusta alguno o traes tu propia idea? Nosotros lo hacemos realidad en tela. Toca una imagen para verla en grande.</p>
    </div>

    <!-- La galería se llena sola desde el panel de administración -->
    <div class="cat-grid" id="catGrid" aria-live="polite">
      <div class="cat-skel"></div>
      <div class="cat-skel"></div>
      <div class="cat-skel"></div>
      <div class="cat-skel"></div>
    </div>

    <p class="cat-swipe-hint" id="catSwipeHint" hidden>Desliza para ver más →</p>

    <div class="cat-cta reveal">
      <p>¿Ya sabes qué quieres? Cuéntanos y lo cotizamos al instante.</p>
      <a class="btn btn-magenta" href="https://wa.me/573046669893" target="_blank" rel="noopener">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.3.5.4.1.1.1.6-.1 1z"/></svg>
        Pedir mi diseño
      </a>
    </div>
  </div>

  <!-- Visor a pantalla completa (lightbox) -->
  <div class="cat-lightbox" id="catLightbox" hidden role="dialog" aria-modal="true" aria-label="Visor de diseño">
    <button class="cat-lb-close" id="catLbClose" aria-label="Cerrar">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <button class="cat-lb-nav cat-lb-prev" id="catLbPrev" aria-label="Anterior">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <figure class="cat-lb-figure">
      <img id="catLbImg" src="" alt="">
      <figcaption id="catLbCaption"></figcaption>
    </figure>
    <button class="cat-lb-nav cat-lb-next" id="catLbNext" aria-label="Siguiente">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  </div>
</section>`;
}
