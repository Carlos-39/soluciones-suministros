export function initMap3D() {
  const section = document.getElementById('ubicacion');
  const inner = document.getElementById('mapa-3d-inner');

  if (!section || !inner) return;

  // Let's use requestAnimationFrame for smooth scrolling effect
  let ticking = false;

  function updateCamera() {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate how far the section has scrolled into the viewport
    // When rect.top == viewportHeight, it's just entering (progress = 0)
    // When rect.top == viewportHeight / 2, it's in the middle (progress = 0.5)
    // When rect.top == 0, it's at the top (progress = 1)
    
    let progress = 1 - (rect.top / viewportHeight);
    
    // Clamp between 0 and 1
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // Apply the camera tilt:
    // Starts tilted back (rotateX = 40deg, scale = 0.85) when it just enters
    // Ends flat facing the user (rotateX = 0deg, scale = 1) when it hits the top half of the screen
    const tiltX = Math.max(0, 40 - (progress * 50)); // 40 down to 0
    const scale = 0.85 + (progress * 0.15); // 0.85 up to 1
    
    // Only show opacity when it actually enters the screen
    inner.style.opacity = progress > 0 ? 1 : 0;
    inner.style.transform = `rotateX(${tiltX}deg) scale(${scale})`;
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateCamera);
      ticking = true;
    }
  }, { passive: true });

  // Initial trigger
  updateCamera();
}
