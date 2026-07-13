export function ProcessSection() {
  return `
<section id="proceso" class="proceso-pin">
  <div class="pin-wrap" id="pinWrap">
    <div class="pin-stage">
      <div class="container pin-inner">
        <div class="sec-head">
          <h2>De tu archivo a la tela terminada</h2>
        </div>
        <div class="pin-grid">
          <div class="pin-copy">
            <div class="paso-slide activo">
              <span class="num">PASO 01 / 04</span>
              <h3>Envías tu diseño</h3>
              <p>Si necesitas ayuda preparándolo para impresión, nuestro equipo te asesora paso a paso.</p>
            </div>
            <div class="paso-slide">
              <span class="num">PASO 02 / 04</span>
              <h3>Confirmamos tu pedido</h3>
              <p>Respuesta inmediata con precio exacto y fecha de entrega inamovible.</p>
            </div>
            <div class="paso-slide">
              <span class="num">PASO 03 / 04</span>
              <h3>Producimos en tiempo récord</h3>
              <p>Impresión industrial garantizada en nuestra planta de San Nicolás.</p>
              <span class="tag-tiempo">⏱ 8–48 horas hábiles</span>
            </div>
            <div class="paso-slide">
              <span class="num">PASO 04 / 04</span>
              <h3>Listo para confeccionar</h3>
              <p>Recoge en nuestra planta o coordinamos el envío directo a tu taller.</p>
            </div>
          </div>
          <div class="pin-visual" aria-hidden="true">
            <!-- 01: el archivo de diseño, como ventana de app con su estampado -->
            <div class="vis-slide activo">
              <svg viewBox="0 0 320 260" fill="none">
                <defs>
                  <linearGradient id="il1-est" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#EC1467"/><stop offset=".65" stop-color="#B90F52"/><stop offset="1" stop-color="#1857D6"/>
                  </linearGradient>
                </defs>
                <ellipse cx="160" cy="236" rx="98" ry="11" fill="#0B1A45" opacity=".08"/>
                <rect x="66" y="34" width="188" height="192" rx="14" fill="#fff" stroke="rgba(11,26,69,.16)" stroke-width="1.5"/>
                <path d="M66 48 a14 14 0 0 1 14-14 h160 a14 14 0 0 1 14 14 v18 H66 z" fill="#F2EFE7"/>
                <circle cx="84" cy="50" r="3.5" fill="#EC1467"/><circle cx="97" cy="50" r="3.5" fill="#FFC72C"/><circle cx="110" cy="50" r="3.5" fill="#22B8CF"/>
                <rect x="82" y="80" width="156" height="96" rx="8" fill="url(#il1-est)"/>
                <path d="M82 130 c 20 -14 38 12 60 -2 c 22 -14 42 10 64 -4 c 12 -8 22 -4 32 2 v 42 a8 8 0 0 1 -8 8 H90 a8 8 0 0 1 -8 -8 z" fill="#FFC72C" opacity=".85"/>
                <path d="M82 148 c 24 -10 44 10 70 0 c 24 -9 44 8 66 0 c 8 -3 14 -2 20 1 v 19 a8 8 0 0 1 -8 8 H90 a8 8 0 0 1 -8 -8 z" fill="#22B8CF" opacity=".8"/>
                <circle cx="118" cy="104" r="9" fill="#FBFAF6" opacity=".9"/>
                <rect x="82" y="188" width="128" height="20" rx="10" fill="#F2EFE7"/>
                <text x="94" y="202" font-family="Space Mono, monospace" font-size="10.5" fill="rgba(11,26,69,.72)">estampado_v2.png</text>
                <path d="M226 178 l 6 22 l 6 -8 l 9 3 z" fill="#fff" stroke="#0B1A45" stroke-width="1.8" stroke-linejoin="round"/>
              </svg>
            </div>
            <!-- 02: la cotización por WhatsApp, con ticks de leído -->
            <div class="vis-slide">
              <svg viewBox="0 0 320 260" fill="none">
                <ellipse cx="160" cy="238" rx="102" ry="10" fill="#0B1A45" opacity=".07"/>
                <path d="M38 58 a15 15 0 0 1 15-15 h148 a15 15 0 0 1 15 15 v42 a15 15 0 0 1-15 15 H88 l-24 22 v-22 h-11 a15 15 0 0 1-15-15 z" fill="#fff" stroke="rgba(11,26,69,.16)" stroke-width="1.5"/>
                <text x="60" y="82" font-family="Archivo, sans-serif" font-weight="600" font-size="16" fill="#0B1A45">Hola! ¿precio para</text>
                <text x="60" y="102" font-family="Archivo, sans-serif" font-weight="600" font-size="16" fill="#0B1A45">25 metros?</text>
                <text x="186" y="108" font-family="Space Mono, monospace" font-size="9" fill="rgba(11,26,69,.4)">10:32</text>
                <path d="M282 152 a15 15 0 0 0-15-15 H119 a15 15 0 0 0-15 15 v52 a15 15 0 0 0 15 15 h113 l24 22 v-22 h11 a15 15 0 0 0 15-15 z" fill="#EC1467"/>
                <path d="M282 152 a15 15 0 0 0-15-15 H119 a15 15 0 0 0-15 15 v10 c 60 8 120 8 178 0 z" fill="#fff" opacity=".08"/>
                <text x="122" y="163" font-family="Archivo, sans-serif" font-weight="600" font-size="16" fill="#fff">Claro: $11.000/m,</text>
                <text x="122" y="183" font-family="Archivo, sans-serif" font-weight="600" font-size="16" fill="#fff">entrega en 8–48h</text>
                <text x="212" y="209" font-family="Space Mono, monospace" font-size="9" fill="rgba(255,255,255,.75)">10:33</text>
                <path d="M246 202 l4 5 l8 -9 M256 202 l4 5 l8 -9" stroke="#8AE4F1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="290" cy="132" r="15" fill="#0B1A45"/>
                <text x="290" y="136.5" font-family="Archivo, sans-serif" font-weight="800" font-size="10" fill="#fff" text-anchor="middle">S&amp;S</text>
              </svg>
            </div>
            <!-- 03: la tela colgada imprimiéndose — el hero en miniatura -->
            <div class="vis-slide">
              <svg viewBox="0 0 320 260" fill="none">
                <defs>
                  <linearGradient id="il3-tinta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#EC1467"/><stop offset="1" stop-color="#C11157"/>
                  </linearGradient>
                  <filter id="il3-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>
                </defs>
                <ellipse cx="160" cy="240" rx="96" ry="10" fill="#0B1A45" opacity=".07"/>
                <path d="M42 44 H278" stroke="#0B1A45" stroke-width="3" stroke-linecap="round" opacity=".55"/>
                <rect x="84" y="38" width="7" height="16" rx="2.5" fill="#0B1A45" opacity=".6"/>
                <rect x="229" y="38" width="7" height="16" rx="2.5" fill="#0B1A45" opacity=".6"/>
                <path d="M70 52 C 74 120, 66 180, 74 224 C 96 234, 116 222, 138 230 C 162 238, 184 224, 206 232 C 226 238, 240 228, 250 224 C 256 176, 248 116, 252 52 Z" fill="#F6F3EA"/>
                <path d="M104 56 C 100 116, 106 176, 100 222" stroke="#0B1A45" stroke-width="9" stroke-linecap="round" opacity=".045"/>
                <path d="M158 56 C 162 116, 154 176, 160 226" stroke="#0B1A45" stroke-width="11" stroke-linecap="round" opacity=".05"/>
                <path d="M212 56 C 208 116, 216 176, 210 224" stroke="#0B1A45" stroke-width="9" stroke-linecap="round" opacity=".045"/>
                <path d="M70 52 C 74 96, 72 118, 74 132 C 92 142, 108 126, 128 136 C 150 147, 172 128, 194 138 C 214 147, 236 132, 250 138 C 252 112, 250 82, 252 52 Z" fill="url(#il3-tinta)"/>
                <path d="M74 132 C 92 142, 108 126, 128 136 C 150 147, 172 128, 194 138 C 214 147, 236 132, 250 138" stroke="#9E0B45" stroke-width="3" fill="none" opacity=".55"/>
                <path d="M74 132 C 92 142, 108 126, 128 136 C 150 147, 172 128, 194 138 C 214 147, 236 132, 250 138" stroke="#FFC72C" stroke-width="5" fill="none" opacity=".8" filter="url(#il3-blur)"/>
                <path d="M118 142 c 0 8 -2 12 -2 16 a 3.4 3.4 0 0 0 6.8 0 c 0 -5 -2 -9 -4.8 -16 z" fill="#C11157"/>
                <path d="M206 146 c 0 6 -1.6 9 -1.6 12 a 2.8 2.8 0 0 0 5.6 0 c 0 -4 -1.6 -7 -4 -12 z" fill="#C11157" opacity=".8"/>
                <circle cx="96" cy="92" r="7" fill="#FBFAF6" opacity=".28"/>
                <circle cx="226" cy="76" r="10" fill="#FBFAF6" opacity=".18"/>
              </svg>
            </div>
            <!-- 04: el paquete listo, en isométrico con su sello -->
            <div class="vis-slide">
              <svg viewBox="0 0 320 260" fill="none">
                <ellipse cx="160" cy="222" rx="104" ry="14" fill="#0B1A45" opacity=".1"/>
                <path d="M160 66 L 254 104 L 160 142 L 66 104 Z" fill="#EFE5CC"/>
                <path d="M66 104 L 160 142 V 216 L 66 178 Z" fill="#DCCFAB"/>
                <path d="M254 104 L 160 142 V 216 L 254 178 Z" fill="#CBBB92"/>
                <path d="M160 66 L 254 104 L 160 142 L 66 104 Z M66 104 L 160 142 V 216 M254 104 L 160 142" stroke="rgba(11,26,69,.22)" stroke-width="1.6" fill="none"/>
                <path d="M150 70 L 244 108 L 244 120 L 150 82 Z" fill="#C9B98C" opacity=".5"/>
                <path d="M160 142 V 216" stroke="rgba(11,26,69,.16)" stroke-width="6"/>
                <g transform="rotate(-8 210 168)">
                  <circle cx="210" cy="168" r="24" fill="#FBFAF6" stroke="rgba(11,26,69,.15)"/>
                  <circle cx="210" cy="166" r="10" fill="#EC1467"/>
                  <circle cx="221" cy="158" r="3.4" fill="#FFC72C"/>
                  <circle cx="200" cy="176" r="2.8" fill="#22B8CF"/>
                  <circle cx="220" cy="177" r="2.2" fill="#1857D6"/>
                </g>
                <path d="M104 148 c -10 6 -16 16 -14 26" stroke="rgba(11,26,69,.4)" stroke-width="1.6" fill="none"/>
                <g transform="rotate(6 86 186)">
                  <rect x="62" y="174" width="52" height="24" rx="6" fill="#fff" stroke="rgba(11,26,69,.2)"/>
                  <text x="70" y="190" font-family="Space Mono, monospace" font-size="10.5" font-weight="700" fill="#EC1467">8–48h ✓</text>
                </g>
              </svg>
            </div>
          </div>
        <div class="pin-rail">
          <div class="rail-track"><div class="rail-fill" id="railFill"></div></div>
          <div class="rail-marks">
            <span class="activo">01 Envías</span>
            <span>02 Cotizamos</span>
            <span>03 Producimos</span>
            <span>04 Recibes</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}
