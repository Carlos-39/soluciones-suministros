export function PricingSection() {
  return `
<section class="precios" id="precios">
  <div class="container">
    <div class="sec-head reveal">
      <h2>Calcula tu producción</h2>
      <p>Desliza la cinta para conocer nuestra tarifa. Entre mayor sea el metraje, mejor será tu costo. Transparencia total desde el primer metro.</p>
    </div>

    <div class="cinta-wrap reveal">
      <div class="cinta" id="cinta">
        <!-- Marcas de tramo sobre la cinta (posiciones en escala logarítmica, calculadas en JS) -->
        <div class="tier" data-m="1"><div class="m">1m</div><div class="tick"></div><div class="precio">$15.000/m</div></div>
        <div class="tier" data-m="10"><div class="m">10m</div><div class="tick"></div><div class="precio">$11.000/m</div></div>
        <div class="tier" data-m="50"><div class="m">50m</div><div class="tick"></div><div class="precio">$8.000/m</div></div>
        <div class="tier" data-m="100"><div class="m">100m+</div><div class="tick"></div><div class="precio">$7.000/m</div></div>
        <div class="cinta-fill" id="cintaFill"></div>
        <div class="cinta-track"></div>
        <input type="range" class="metros" id="sliderMetros" min="0" max="1000" value="380"
               aria-label="Metros a cotizar">
      </div>

      <div class="lectura">
        <div class="campo"><span>Metraje</span><b id="outMetros">25 m</b></div>
        <div class="campo"><span>Precio por metro</span><b id="outPorMetro">$11.000</b></div>
        <div class="campo total"><span>Total estimado</span><b id="outTotal">$275.000 COP</b></div>
        <a class="btn btn-magenta" href="https://wa.me/573046669893" target="_blank" rel="noopener">Cotizar este metraje</a>
      </div>
      <p class="nota-precio">* Precios de referencia por metro lineal de sublimación. DTF y acabados especiales se cotizan por WhatsApp. Prototipo con datos reales de tarifa.</p>
    </div>
  </div>
</section>`;
}
