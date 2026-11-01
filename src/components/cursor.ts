/** A mouse-only cursor with a soft halo driven by pointer velocity. */
export function initCursor() {
  const enabled = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const dot = document.createElement('div');
  dot.className = 'glow-cursor';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);
  let previous: { x:number; y:number; time:number } | undefined;
  let intensity = 0;
  let frame = 0;
  let lastFrame = 0;

  function animate(time:number) {
    const elapsed = Math.min(time - lastFrame, 64);
    lastFrame = time;
    intensity *= Math.exp(-elapsed / 180);
    dot.style.setProperty('--glow', intensity.toFixed(3));
    if (intensity > .005) frame = requestAnimationFrame(animate);
    else { intensity = 0; frame = 0; dot.style.setProperty('--glow', '0'); }
  }
  function hide() {
    document.documentElement.classList.remove('custom-cursor');
    dot.classList.remove('is-visible');
    previous = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    intensity = 0;
    dot.style.setProperty('--glow', '0');
  }
  document.addEventListener('pointermove', event => {
    if (!enabled.matches || event.pointerType !== 'mouse') { hide(); return; }
    const time = performance.now();
    if (previous && !reducedMotion.matches) {
      const speed = Math.hypot(event.clientX - previous.x, event.clientY - previous.y) / Math.max(time - previous.time, 8);
      intensity = Math.max(intensity, Math.min(speed / 2.5, 1));
    }
    previous = { x:event.clientX, y:event.clientY, time };
    dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    dot.style.setProperty('--glow', intensity.toFixed(3));
    dot.classList.add('is-visible');
    document.documentElement.classList.add('custom-cursor');
    if (!frame && intensity > 0) { lastFrame = time; frame = requestAnimationFrame(animate); }
  }, { passive:true });
  document.documentElement.addEventListener('pointerleave', hide);
  document.addEventListener('pointercancel', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  document.addEventListener('keydown', hide);
  enabled.addEventListener('change', hide);
  reducedMotion.addEventListener('change', hide);
}
