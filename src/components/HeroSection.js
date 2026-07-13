export function HeroSection() {
  return `
<header class="hero" id="inicio">
  <canvas id="tela-canvas" aria-hidden="true"></canvas>
  <div class="hero-veil"></div>
  <div class="hero-inner">
    <h1 class="display">Tu diseño,<br>impreso en tela<br>en <span class="hito">24–48&nbsp;horas</span></h1>
    <p class="sub">Sublimación industrial y DTF con fidelidad de color absoluta.<br>Mientras el sector tarda 4 días hábiles, nosotros somos tu ventaja injusta: imprimes hoy, confeccionas mañana.</p>
    <div class="hero-ctas">
      <a class="btn btn-magenta" href="#cta">Lanza tu marca
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
      <a class="btn btn-outline" href="#cta">Cotización para empresas</a>
    </div>
    <div class="stat-row reveal">
      <div class="stat"><b>24–48h</b><span>entrega hábil</span></div>
      <div class="stat"><b>1m</b><span>sin mínimo</span></div>
      <div class="stat"><b>100%</b><span>fidelidad de color</span></div>
    </div>
  </div>
</header>`;
}
