export function MapSection() {
  return `
<section id="ubicacion" style="padding: 6rem 0; background: var(--crudo); border-top: 1px solid var(--crudo-2); position: relative; overflow: hidden;">
  
  <!-- Elementos flotantes 3D en el fondo blanco -->
  <div style="position: absolute; top: -50px; left: -50px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(236,20,103,0.05) 0%, transparent 70%); border-radius: 50%;"></div>
  <div style="position: absolute; bottom: -100px; right: -50px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(24,87,214,0.05) 0%, transparent 70%); border-radius: 50%;"></div>

  <div class="container reveal" style="position: relative; z-index: 2;">
    <div style="text-align: center; max-width: 600px; margin: 0 auto 4rem;">
      <h3 class="display" style="font-size: clamp(32px, 4vw, 42px); margin-bottom: 1rem; color: var(--navy);">Nuestra Planta</h3>
      <p style="color: var(--tinta-suave); font-size: 1.1rem; line-height: 1.6;">Ven y conoce nuestra planta de producción. La tecnología que imprime tu marca en tiempo récord, a puertas abiertas.</p>
    </div>
    
    <!-- Contenedor con efecto de cámara 3D -->
    <div id="mapa-3d-wrapper" style="width: 100%; max-width: 900px; margin: 0 auto; perspective: 1200px;">
      <div id="mapa-3d-inner" style="background: #fff; padding: 12px; border-radius: 24px; box-shadow: 0 40px 80px rgba(11,26,69,0.08), 0 10px 20px rgba(11,26,69,0.04); border: 1px solid rgba(11,26,69,0.05); transform-style: preserve-3d; transform: rotateX(40deg) scale(0.9); opacity: 0; transition: opacity 0.5s ease-out;">
        
        <!-- Pestaña flotante -->
        <div style="position: absolute; top: -20px; left: 40px; background: var(--crudo); padding: 8px 16px; border-radius: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.03); font-weight: bold; color: var(--navy); transform: translateZ(30px); font-size: 0.9rem; pointer-events: none;">
          📍 Visítanos
        </div>

        <div style="width: 100%; height: 450px; border-radius: 16px; overflow: hidden; transform: translateZ(1px);">
          <iframe 
            src="https://maps.google.com/maps?q=3.454225,-76.528412&hl=es&z=16&output=embed" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 4rem;">
      <a class="btn btn-magenta" href="https://maps.app.goo.gl/jjt6WACdPTttFNCy6" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(236, 20, 103, 0.15);">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        Abrir en la app de Google Maps
      </a>
    </div>
  </div>
</section>`;
}
