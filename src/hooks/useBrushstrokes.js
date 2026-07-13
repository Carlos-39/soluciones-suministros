import { easeOut, impacto } from '../utils/math.js';
import { debounce } from '../utils/performance.js';

export function initBrushstrokes() {
  const seccion = document.querySelector('.pinceladas');
  const canvas  = document.getElementById('lienzo-brochazos');
  if (!seccion || !canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Aleatorio con semilla: cada splash es reproducible (clave para redimensionar)
  let seed = 7;
  function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  // ---- Los splashes: posición (fracciones del lienzo), radio, colores y tiempos ----
  // Amarillo y cian mandan; azul apoya. Magenta y navy son de las cards: aquí no se usan.
  const SPLASHES = [
    { fx:.885, fy:.16, fr:.115, delay:0.00, dur:0.95, sem:11, c:'#FFC72C', cOsc:'#D9A200', cCla:'#FFE08A' },
    { fx:.095, fy:.83, fr:.105, delay:0.38, dur:0.95, sem:23, c:'#22B8CF', cOsc:'#0F8DA1', cCla:'#8AE4F1' },
    { fx:.055, fy:.28, fr:.052, delay:0.80, dur:0.75, sem:37, c:'#1857D6', cOsc:'#0F3C9C', cCla:'#6E97EC' },
    { fx:.945, fy:.74, fr:.048, delay:0.95, dur:0.75, sem:51, c:'#22B8CF', cOsc:'#0F8DA1', cCla:'#8AE4F1' },
    { fx:.62,  fy:.06, fr:.036, delay:1.15, dur:0.65, sem:67, c:'#FFC72C', cOsc:'#D9A200', cCla:'#FFE08A' },
  ];

  // Anatomía determinista de cada splash: charco irregular, tentáculos y gotas
  SPLASHES.forEach(s => {
    seed = s.sem;
    // Charco: radio irregular en 26 direcciones (forma orgánica del impacto)
    s.forma = [];
    for (let i = 0; i < 26; i++) s.forma.push(0.62 + rnd() * 0.38 + (rnd() < .18 ? rnd() * 0.3 : 0));
    // Moteado interior: la pintura no cae pareja
    s.motas = [];
    for (let i = 0; i < 7; i++) s.motas.push({ a: rnd() * 6.2832, d: rnd() * 0.55, r: 0.10 + rnd() * 0.16 });
    // Tentáculos: chorros que se estiran desde el borde
    s.tent = [];
    const nT = 9;
    for (let i = 0; i < nT; i++){
      s.tent.push({
        a: (i / nT) * 6.2832 + rnd() * 0.5,
        l: 0.45 + rnd() * 1.0,            // largo en radios
        w: 0.10 + rnd() * 0.12,           // grosor en radios
        curva: (rnd() - .5) * 0.5,        // los chorros no salen rectos
      });
    }
    // Gotas: vuelan desde el centro y aterrizan lejos
    s.gotas = [];
    for (let i = 0; i < 13; i++){
      s.gotas.push({
        a: rnd() * 6.2832,
        d: 1.5 + rnd() * 2.3,             // distancia final en radios
        r: 0.045 + rnd() * 0.085,         // tamaño en radios
        t: 0.10 + rnd() * 0.30,           // momento en que sale disparada
        mini: rnd() < .3,                 // algunas son apenas un puntito de niebla
      });
    }
  });

  let W = 0, H = 0, ESC = 1;
  function medir(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = seccion.clientWidth; H = seccion.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ESC = Math.min(W, 1250) * Math.min(1, H / 620);   // los splashes escalan con la sección
  }

  // ---- Dibuja un splash completo a un progreso q (0→1) ----
  function dibujarSplash(s, q){
    if (q <= 0) return;
    const R  = s.fr * ESC;
    const cx = s.fx * W, cy = s.fy * H;
    const esc = impacto(Math.min(1, q));                 // escala del charco con rebote

    // --- Tentáculos primero (quedan debajo del charco) ---
    const qT = easeOut(Math.min(1, Math.max(0, (q - 0.12) / 0.88)));
    ctx.fillStyle = s.c;
    for (const t of s.tent){
      const base = R * 0.72 * esc;
      const tip  = base + R * t.l * qT;
      const aFin = t.a + t.curva * qT;
      const bx = cx + Math.cos(t.a) * base,  by = cy + Math.sin(t.a) * base;
      const tx = cx + Math.cos(aFin) * tip,  ty = cy + Math.sin(aFin) * tip;
      const mx = (bx + tx) / 2 + Math.cos(t.a + 1.5708) * R * t.curva * 0.4;
      const my = (by + ty) / 2 + Math.sin(t.a + 1.5708) * R * t.curva * 0.4;
      const w = R * t.w * (0.6 + 0.4 * qT);
      const px = Math.cos(t.a + 1.5708) * w, py = Math.sin(t.a + 1.5708) * w;
      ctx.globalAlpha = 0.96;
      ctx.beginPath();
      ctx.moveTo(bx + px, by + py);
      ctx.quadraticCurveTo(mx + px * 0.4, my + py * 0.4, tx, ty);   // hacia la punta, afinándose
      ctx.quadraticCurveTo(mx - px * 0.4, my - py * 0.4, bx - px, by - py);
      ctx.closePath();
      ctx.fill();
      // Gotita colgando de la punta de algunos tentáculos
      if (t.l > 1.0 && qT > 0.85){
        ctx.beginPath(); ctx.arc(tx + Math.cos(aFin) * w * 1.6, ty + Math.sin(aFin) * w * 1.6, w * 0.75, 0, 6.2832); ctx.fill();
      }
    }

    // --- Charco central: contorno orgánico suavizado ---
    const n = s.forma.length;
    const pts = [];
    for (let i = 0; i < n; i++){
      const a = (i / n) * 6.2832;
      const r = R * s.forma[i] * esc;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo((pts[0][0] + pts[n-1][0]) / 2, (pts[0][1] + pts[n-1][1]) / 2);
    for (let i = 0; i < n; i++){
      const p = pts[i], p2 = pts[(i + 1) % n];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + p2[0]) / 2, (p[1] + p2[1]) / 2);
    }
    ctx.closePath();
    ctx.fillStyle = s.c;
    ctx.fill();
    // Borde con pigmento acumulado (la firma de la pintura real, como en el hero)
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = s.cOsc;
    ctx.lineWidth = Math.max(1.5, R * 0.045);
    ctx.stroke();
    // Brillo húmedo descentrado hacia la luz
    ctx.globalAlpha = 0.30;
    ctx.fillStyle = s.cCla;
    ctx.beginPath(); ctx.arc(cx - R * 0.22 * esc, cy - R * 0.26 * esc, R * 0.42 * esc, 0, 6.2832); ctx.fill();
    // Moteado: la pintura no cae pareja
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = s.cOsc;
    for (const m of s.motas){
      ctx.beginPath();
      ctx.arc(cx + Math.cos(m.a) * R * m.d * esc, cy + Math.sin(m.a) * R * m.d * esc, R * m.r, 0, 6.2832);
      ctx.fill();
    }

    // --- Gotas: vuelan desde el centro, alargadas en el aire, redondas al caer ---
    for (const g of s.gotas){
      if (q < g.t) continue;
      const vuelo = easeOut(Math.min(1, (q - g.t) / Math.max(0.001, 1 - g.t)));
      const dist = R * (0.8 + (g.d - 0.8) * vuelo);
      const gx = cx + Math.cos(g.a) * dist;
      const gy = cy + Math.sin(g.a) * dist;
      const gr = R * g.r * (g.mini ? 0.55 : 1);
      const estira = 1 + (1 - vuelo) * 1.6;              // en vuelo va alargada
      ctx.globalAlpha = g.mini ? 0.55 : 0.92;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.ellipse(gx, gy, gr * estira, gr / Math.sqrt(estira), g.a, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Redibuja la escena completa a los progresos dados
  function dibujarTodo(progresos){
    ctx.clearRect(0, 0, W, H);
    SPLASHES.forEach((s, i) => dibujarSplash(s, progresos[i]));
  }

  let iniciado = false, t0 = 0;
  let progresoFinal = SPLASHES.map(() => 0);

  function cuadro(){
    const e = (performance.now() - t0) / 1000;
    let vivos = false;
    progresoFinal = SPLASHES.map(s => {
      const q = Math.min(1, Math.max(0, (e - s.delay) / s.dur));
      if (q < 1) vivos = true;
      return q;
    });
    dibujarTodo(progresoFinal);
    if (vivos) requestAnimationFrame(cuadro);
  }

  window.addEventListener('resize', debounce(()=>{ medir(); if (iniciado) dibujarTodo(progresoFinal); }, 150));
  medir();

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if (en.isIntersecting && !iniciado){
        iniciado = true;
        obs.disconnect();
        if (reduceMotion){
          progresoFinal = SPLASHES.map(() => 1);
          dibujarTodo(progresoFinal);
        } else {
          t0 = performance.now();
          requestAnimationFrame(cuadro);
        }
      }
    });
  }, { threshold: 0.22 });
  obs.observe(seccion);
}
