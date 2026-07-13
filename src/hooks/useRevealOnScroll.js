export function initRevealOnScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if (en.isIntersecting){ en.target.classList.add('visible'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}
