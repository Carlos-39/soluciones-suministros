export function SplitCtaSection() {
  return `
<section id="cta" class="pinceladas">
  <!-- Lienzo de tela: los splashes de pintura golpean aquí (el gesto del logo, en grande) -->
  <canvas id="lienzo-brochazos" aria-hidden="true"></canvas>
  <div class="tela-overlay" aria-hidden="true"></div>
  <div class="container">
    <div class="split">
      <!-- Emprendedores: tono cercano, aspiracional -->
      <div class="split-card card-emprende reveal">
        <div class="mancha"></div>
        <h3 class="display">Tu marca empieza<br>con un metro</h3>
        <p>No necesitas bodegas llenas para lanzar tu línea. Imprime tu primera colección pequeña hoy, pruébala en el mercado este fin de semana y repite lo que se venda. Nosotros ponemos la velocidad industrial; tú pones la idea.</p>
        <a class="btn" href="https://wa.me/573046669893" target="_blank" rel="noopener">Lanza tu marca por WhatsApp
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
      <!-- Empresas: tono directo, basado en datos -->
      <div class="split-card card-empresa reveal">
        <h3 class="display">Capacidad extra,<br>cuando la necesitas</h3>
        <p>El aliado de producción para picos de demanda y reposiciones urgentes. Ejecución impecable, discreción total y consistencia de calidad en altos volúmenes.</p>
        <ul>
          <li>Entrega hábil <b>24–48 horas</b></li>
          <li>Tarifa 100m+ <b>$7.000 / metro</b></li>
          <li>Fidelidad de color entre tirajes <b>garantizada</b></li>
          <li>Reposición programada <b>disponible</b></li>
        </ul>
        <a class="btn" href="https://wa.me/573046669893" target="_blank" rel="noopener">Solicitar cotización empresarial</a>
      </div>
    </div>
  </div>
</section>`;
}
