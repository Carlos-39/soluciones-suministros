import { fmt } from '../utils/formatting.js';

export function initPricingCalculator() {
  const slider   = document.getElementById('sliderMetros');
  const fill     = document.getElementById('cintaFill');
  const outM     = document.getElementById('outMetros');
  const outPM    = document.getElementById('outPorMetro');
  const outT     = document.getElementById('outTotal');
  const tiers    = Array.from(document.querySelectorAll('.tier'));

  const MIN = 1, MAX = 1000; // rango de metros en escala log

  // slider (0–1000) → metros (escala logarítmica)
  function sliderAMetros(v){
    const t = v / 1000;
    return Math.round(MIN * Math.pow(MAX / MIN, t));
  }
  // metros → posición % sobre la cinta
  function metrosAPct(m){
    return (Math.log(m / MIN) / Math.log(MAX / MIN)) * 100;
  }

  // Tarifas reales por tramo
  function tarifa(m){
    if (m >= 100) return 7000;
    if (m >= 50)  return 8000;
    if (m >= 10)  return 11000;
    return 15000;
  }

  // Posicionar las marcas de tramo sobre la cinta
  tiers.forEach(el=>{
    const m = parseFloat(el.dataset.m);
    el.style.setProperty('--tier-pos', metrosAPct(m) + '%');
    // Clic en una marca → saltar a ese metraje
    el.addEventListener('click', ()=>{
      const t = Math.log(m / MIN) / Math.log(MAX / MIN);
      slider.value = Math.round(t * 1000);
      actualizar();
    });
  });

  function actualizar(){
    const m  = sliderAMetros(+slider.value);
    const pm = tarifa(m);
    const pct = metrosAPct(m);
    outM.textContent  = m + ' m';
    outPM.textContent = '$' + fmt.format(pm);
    outT.textContent  = '$' + fmt.format(pm * m) + ' COP';
    fill.style.setProperty('--pct', pct + '%');
    // Resaltar el tramo activo
    tiers.forEach(el=>{
      const tm = parseFloat(el.dataset.m);
      el.classList.toggle('activo', tarifa(m) === tarifa(tm));
    });
  }
  slider.addEventListener('input', actualizar);
  actualizar();
}
