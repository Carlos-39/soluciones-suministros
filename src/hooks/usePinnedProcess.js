export function initPinnedProcess() {
  const wrap = document.getElementById('pinWrap');
  if (!wrap) return;
  const slides = Array.from(document.querySelectorAll('.paso-slide'));
  const vis    = Array.from(document.querySelectorAll('.vis-slide'));
  const marks  = Array.from(document.querySelectorAll('.rail-marks span'));
  const fill   = document.getElementById('railFill');
  let idx = 0;

  function onScroll(){
    const r = wrap.getBoundingClientRect();
    const total = wrap.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));   // progreso 0→1 dentro de la sección
    fill.style.width = (p * 100) + '%';
    const i = Math.min(3, Math.floor(p * 4));
    if (i !== idx){
      idx = i;
      slides.forEach((el, k)=> el.classList.toggle('activo', k === i));
      vis.forEach((el, k)=> el.classList.toggle('activo', k === i));
      marks.forEach((el, k)=> el.classList.toggle('activo', k === i));
    }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  onScroll();
}
