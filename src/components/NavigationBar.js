export function NavigationBar() {
  return `
<nav>
  <div class="nav-inner">
    <a class="logo" href="#inicio" aria-label="Soluciones y Suministros — inicio">
      <!-- Marca: salpicadura de tinta con los 4 colores -->
      <svg class="logo-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="13" fill="#EC1467"/>
        <circle cx="31" cy="12" r="4.5" fill="#FFC72C"/>
        <circle cx="8" cy="27" r="3.6" fill="#22B8CF"/>
        <circle cx="30" cy="30" r="3" fill="#1857D6"/>
        <circle cx="12" cy="8" r="2.4" fill="#1857D6"/>
      </svg>
      <span class="logo-text">Soluciones y Suministros<small>Textil · Cali</small></span>
    </a>
    <ul class="nav-links">
      <li><a href="#ventajas">Ventajas</a></li>
      <li><a href="#precios">Precios</a></li>
      <li><a href="#proceso">Proceso</a></li>
      <li class="cta-li">
        <a class="btn btn-wa" href="https://wa.me/573046669893" target="_blank" rel="noopener">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.3.5.4.1.1.1.6-.1 1z"/></svg>
          WhatsApp
        </a>
      </li>
    </ul>
    <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" style="display:none;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
    </button>
  </div>
</nav>`;
}
