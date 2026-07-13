import { WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, ShaderMaterial, Vector2, Color, DoubleSide, Mesh } from 'three';
import { debounce } from '../utils/performance.js';
import { ease } from '../utils/math.js';

export function initHeroCanvas() {
  const canvas = document.getElementById('tela-canvas');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Respaldo si WebGL no está disponible
  function fallback(){
    canvas.style.background = 'radial-gradient(circle at 68% 45%, rgba(236,20,103,.35), rgba(251,250,246,0) 55%), #FBFAF6';
  }

  let renderer;
  try { renderer = new WebGLRenderer({ canvas, antialias:true, alpha:true }); }
  catch(e){ fallback(); return; }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene  = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 7.6);

  // ---- La tela: plano grande, forma y ondas calculadas en el vertex shader ----
  const geo = new PlaneGeometry(10.5, 7.4, 150, 105);

  const uniforms = {
    uTime:    { value: reduceMotion ? 6.0 : 0.0 },
    uBloom:   { value: reduceMotion ? 1.0 : 0.0 },  // crecimiento de la mancha principal (0→1)
    uBloom2:  { value: reduceMotion ? 1.0 : 0.0 },  // mancha secundaria pequeña
    uFade:    { value: 1.0 },                       // 1 = tinta viva · 0 = seca/desvanecida
    uWash:    { value: 0.0 },                       // 0 a 1: onda de color de fondo al final
    uCenter:  { value: new Vector2(0.60, 0.50) },
    uCenter2: { value: new Vector2(0.44, 0.32) },
    uMagenta: { value: new Color('#EC1467') },
    uCian:    { value: new Color('#22B8CF') },
    uAmarillo:{ value: new Color('#FFC72C') },
    uNavy:    { value: new Color('#0B1A45') },
    uCrudo:   { value: new Color('#F6F3EA') },
  };

  const mat = new ShaderMaterial({
    uniforms,
    side: DoubleSide,
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying float vH;      // altura del pliegue → oclusión en los valles

      const float PI = 3.14159265;

      // Ondas sedosas + arrugas finas de tela real
      vec3 fabricPos(vec2 uvp){
        vec3 p = vec3((uvp.x - 0.5) * 10.5, (uvp.y - 0.5) * 7.4, 0.0);
        float libertad = 0.35 + 0.65 * smoothstep(1.0, 0.0, uvp.y);
        float w = sin(p.x * 0.85 + uTime * 0.55) * 0.34
                + sin(p.y * 1.30 + uTime * 0.40) * 0.20
                + sin((p.x + p.y) * 1.9 + uTime * 0.75) * 0.09
                + sin(p.x * 0.35 - uTime * 0.22) * 0.16;   // ola de respiración, muy lenta
        // Arrugas finas: la tela nunca es una superficie perfecta
        w += sin(p.x * 5.7 + uTime * 0.65) * sin(p.y * 4.3 - uTime * 0.5) * 0.035;
        w += sin(p.x * 9.1 - uTime * 0.4)  * sin(p.y * 7.6 + uTime * 0.35) * 0.014;
        p.z += w * libertad;
        return p;
      }

      void main(){
        vUv = uv;
        vec3 p  = fabricPos(uv);
        vH = p.z;
        // Normales por diferencias finitas → la luz modela cada pliegue y arruga
        vec3 pu = fabricPos(uv + vec2(0.0015, 0.0));
        vec3 pv = fabricPos(uv + vec2(0.0, 0.0015));
        vec3 n  = normalize(cross(pu - p, pv - p));
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vWorldPos = wp.xyz;
        vNormal   = normalize(mat3(modelMatrix) * n);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform float uTime, uBloom, uBloom2, uFade, uWash;
      uniform vec2 uCenter, uCenter2;
      uniform vec3 uMagenta, uCian, uAmarillo, uNavy, uCrudo;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying float vH;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
                   mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 3; i++){
          v += noise(p) * a;
          p = p * 2.1 + 17.3;
          a *= 0.5;
        }
        return v;
      }

      // ---- Tejido procedural: urdimbre y trama entrelazadas, con hilos irregulares ----
      // Devuelve la "altura" del tejido en este punto (para relieve y sombreado)
      float tejido(vec2 uvp){
        // Coordenadas de hilo, con grosor irregular (slub) como en tela real
        vec2 w = uvp * vec2(230.0, 165.0);
        w.x += (noise(vec2(uvp.y * 55.0, 3.7)) - 0.5) * 0.9;   // los hilos no son rectos perfectos
        w.y += (noise(vec2(uvp.x * 55.0, 9.2)) - 0.5) * 0.9;
        float hx = sin(fract(w.x) * 3.14159);                  // perfil redondo de cada hilo
        float hy = sin(fract(w.y) * 3.14159);
        // Entrelazado: en cada celda domina la urdimbre o la trama, alternando (tafetán)
        float sube = mod(floor(w.x) + floor(w.y), 2.0);
        float h = mix(hx * (0.6 + 0.4 * hy), hy * (0.6 + 0.4 * hx), sube);
        // Variación de grosor del hilo (slub)
        h *= 0.85 + 0.3 * noise(vec2(floor(w.x) * 0.31, floor(w.y) * 0.47));
        return h;
      }

      // Máscara de una mancha: radial + borde que sangra SIGUIENDO LOS HILOS de la tela
      float mancha(vec2 uvA, vec2 c, float radio){
        float d = distance(uvA, c);
        // Pluma anisotrópica: la tinta corre más a lo largo de la urdimbre y la trama
        float capilarX = fbm(vec2(uvA.x * 3.5,  uvA.y * 16.0) + c * 23.0);
        float capilarY = fbm(vec2(uvA.x * 16.0, uvA.y * 3.5)  + c * 31.0);
        float e = (max(capilarX, capilarY) - 0.5) * 0.5 * radio
                + (fbm(uvA * 7.0 + c * 11.0) - 0.5) * 0.22 * radio;
        return smoothstep(radio + 0.01, radio - 0.10, d + e);
      }

      void main(){
        vec2 uvA = vec2(vUv.x * 1.42, vUv.y);
        vec2 cA  = vec2(uCenter.x * 1.42, uCenter.y);
        vec2 cB  = vec2(uCenter2.x * 1.42, uCenter2.y);

        // ---- Tela cruda: tejido con relieve real ----
        float h  = tejido(vUv);
        // Color base del hilo crudo, con variación cálida hilo a hilo
        vec3 base = uCrudo * (0.94 + h * 0.10);
        base += (noise(vUv * vec2(230.0, 165.0) * 0.5) - 0.5) * 0.02;   // fibra suelta
        base *= vec3(1.0, 0.995, 0.975);                                 // calidez sutil del algodón/poli crudo

        // ---- Mancha secundaria: pequeña, azul-cian, muy discreta ----
        float r2 = uBloom2 * 0.20;
        float m2 = mancha(uvA, cB, r2) * uFade * 0.75;
        vec3 tinta2 = mix(uCian, uNavy, 0.35);
        vec3 aguada2 = mix(base, mix(tinta2, uCrudo, 0.45), m2 * 0.85);

        // ---- Mancha principal: magenta en acuarela ----
        float radio = uBloom * 0.52;
        float d = distance(uvA, cA);
        float m = mancha(uvA, cA, radio);

        float t = clamp(d / max(radio, 0.001), 0.0, 1.0);
        vec3 aguada = mix(uMagenta, uCrudo, 0.42);
        vec3 tinta  = mix(aguada, uMagenta, smoothstep(0.25, 0.95, t));

        // Explosiones de color (Cian y Amarillo) sobre el Magenta (ligeramente más protagonistas)
        float nCian = smoothstep(0.25, 0.65, fbm(uvA * 5.0 - vec2(uTime * 0.05)));
        float nAmarillo = smoothstep(0.3, 0.7, fbm(uvA * 6.5 + vec2(0.2, uTime * 0.07)));
        
        float maskColor = smoothstep(0.1, 0.9, t) * m;
        
        tinta = mix(tinta, uCian, clamp(nCian * maskColor * 1.15, 0.0, 0.95));
        tinta = mix(tinta, uAmarillo, clamp(nAmarillo * maskColor * 1.15, 0.0, 0.95));

        tinta = mix(tinta, uNavy, smoothstep(0.0, 0.35, 1.0 - t) * 0.16);
        tinta = mix(tinta, uMagenta, (fbm(uvA * 11.0) - 0.5) * 0.3);

        // La tinta moja el hilo: en los surcos del tejido se acumula más pigmento
        tinta *= 0.92 + h * 0.14;

        // Borde oscurecido donde la tinta se acumula al sangrar
        float bordeBanda = m * (1.0 - m) * 4.0;
        tinta = mix(tinta, uMagenta * 0.62, bordeBanda * 0.75);
        tinta = mix(tinta, uCian, bordeBanda * 0.12);
        // Hilillos capilares: pigmento que corre por hilos sueltos justo fuera del borde
        float hiloX = smoothstep(0.72, 1.0, noise(vec2(uvA.x * 6.0,  uvA.y * 90.0)));
        float hiloY = smoothstep(0.72, 1.0, noise(vec2(uvA.x * 90.0, uvA.y * 6.0)));
        float capilares = max(hiloX, hiloY) * bordeBanda * 0.5;
        vec3 conCapilares = mix(tinta, uMagenta * 0.75, capilares);

        float mf = m * uFade;
        vec3 color = mix(aguada2, conCapilares, mf);

        // Onda de color de fondo (wash) que emerge al final de la animación
        float washMask = smoothstep(0.0, 1.0, uWash) * (0.6 + 0.4 * noise(uvA * 2.0 - vec2(uTime * 0.08)));
        vec3 washColor = mix(uAmarillo, uCian, smoothstep(0.3, 0.7, fbm(uvA * 1.5 + vec2(0.5))));
        // Mezclar este fondo suavemente con la tela donde no hay mancha principal fuerte
        color = mix(color, washColor, washMask * 0.55 * uFade * (1.0 - mf * 0.75));

        // ---- Iluminación con RELIEVE del tejido (bump) ----
        vec3 N = normalize(vNormal);
        vec3 V = normalize(cameraPosition - vWorldPos);
        if (dot(N, V) < 0.0) N = -N;
        // Gradiente de altura del tejido → perturba la normal: la luz roza cada hilo
        float e1 = 0.0018;
        float dhx = tejido(vUv + vec2(e1, 0.0)) - h;
        float dhy = tejido(vUv + vec2(0.0, e1)) - h;
        vec3 T = normalize(cross(N, vec3(0.0, 1.0, 0.0)));
        vec3 B = normalize(cross(N, T));
        // El relieve se suaviza donde hay tinta (el pigmento asienta la fibra)
        float relieve = 0.55 * (1.0 - mf * 0.45);
        N = normalize(N + (T * dhx + B * dhy) * relieve * 60.0);

        vec3 L1 = normalize(vec3(-0.55, 0.85, 0.65));
        vec3 L2 = normalize(vec3(0.75, -0.25, 0.45));
        float d1 = max(dot(N, L1), 0.0);
        float d2 = max(dot(N, L2), 0.0);
        vec3 H = normalize(L1 + V);
        float spec = pow(max(dot(N, H), 0.0), 14.0);
        float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);

        // Oclusión suave en los valles de los pliegues
        float ao = 0.86 + 0.14 * smoothstep(-0.8, 0.8, vH);

        vec3 lit = color * (0.48 + 0.64 * d1 + 0.22 * d2) * ao;
        // La tinta fresca brilla húmeda; la tela cruda es mate y fibrosa
        lit += vec3(1.0, 0.97, 0.92) * spec * (0.07 + mf * 0.28);
        lit += fres * vec3(1.0, 0.94, 0.88) * 0.13;

        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });

  const tela = new Mesh(geo, mat);
  tela.rotation.set(-0.10, -0.32, 0.05);
  scene.add(tela);

  function componer(){
    const aspect = camera.aspect;
    const isMobile = aspect < 1;
    // En móviles centramos la malla (x = 0) y hacemos zoom in (1.5x)
    tela.position.set(isMobile ? 0.0 : 2.1, isMobile ? 0.0 : 0.1, 0);
    tela.scale.setScalar(isMobile ? 1.5 : 1);
  }

  function resize(){
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    componer();
    if (reduceMotion) renderer.render(scene, camera);
  }
  window.addEventListener('resize', debounce(resize, 150));

  // Mouse: paralaje sutil
  let mx = 0, my = 0;
  window.addEventListener('pointermove', (e)=>{
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ---- Ciclo de vida de la tinta: florece → respira → se seca → renace ----
  const CICLO = 22;               // segundos por ciclo completo
  let cicloPrevio = -1;

  function nuevosCentros(){
    const isMobile = window.innerWidth / window.innerHeight < 1;
    // En PC la mancha nace a la derecha (0.52 - 0.68). En celular nace justo en el centro (0.45 - 0.55).
    const cx = isMobile ? (0.45 + Math.random() * 0.1) : (0.52 + Math.random() * 0.16);
    // En PC nace al centro-abajo (0.4 - 0.62). En celular nace un poco más arriba para compensar la botonera móvil (0.60 - 0.75).
    const cy = isMobile ? (0.55 + Math.random() * 0.20) : (0.40 + Math.random() * 0.22);
    uniforms.uCenter.value.set(cx, cy);
    uniforms.uCenter2.value.set(cx - 0.14 - Math.random() * 0.08, cy - 0.16 + Math.random() * 0.1);
  }
  nuevosCentros();

  const start = performance.now();
  function frame(){
    const t = (performance.now() - start) / 1000;
    uniforms.uTime.value = t;

    const n = Math.floor(t / CICLO);
    const c = t - n * CICLO;
    if (n !== cicloPrevio){ cicloPrevio = n; if (n > 0) nuevosCentros(); }

    // Línea de tiempo del ciclo: 8s florece · 8s respira · 4s se seca · 2s en blanco
    let bloom, fade = 1;
    if (c < 8)       bloom = ease(c / 8);
    else if (c < 16) bloom = 1 + Math.sin((c - 8) * 0.8) * 0.012;  // micro-latido, casi imperceptible
    else if (c < 20){ bloom = 1; fade = 1 - ease((c - 16) / 4); }
    else            { bloom = 0; fade = 0; }
    uniforms.uBloom.value  = bloom;
    uniforms.uFade.value   = fade;
    // La secundaria nace 2.5s después, más tímida
    uniforms.uBloom2.value = c < 2.5 ? 0 : (c < 10.5 ? ease((c - 2.5) / 8) : uniforms.uBloom2.value);
    if (c >= 20) uniforms.uBloom2.value = 0;

    let wash = 0;
    if (c > 10 && c < 20) {
      wash = Math.sin(((c - 10) / 10) * Math.PI); // Sube suave a 1 y baja a 0
    }
    uniforms.uWash.value = wash;

    // Paralaje suave con el mouse
    tela.rotation.y += ((-0.32 + mx * 0.09) - tela.rotation.y) * 0.04;
    tela.rotation.x += ((-0.10 - my * 0.06) - tela.rotation.x) * 0.04;

    renderer.render(scene, camera);
    if (isVisible) {
      frameId = requestAnimationFrame(frame);
    }
  }

  let isVisible = false;
  let frameId = null;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible = true;
      if (!reduceMotion && !frameId) {
        frame();
      } else if (reduceMotion) {
        renderer.render(scene, camera);
      }
    } else {
      isVisible = false;
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }
  }, { rootMargin: '100px' });
  
  const heroNode = document.querySelector('.hero');
  if (heroNode) observer.observe(heroNode);

  resize();
  if (reduceMotion){
    renderer.render(scene, camera);   // un cuadro estático: tela con la mancha ya florecida
  } else {
    // Note: frame() will be triggered by the IntersectionObserver when visible.
  }
}
