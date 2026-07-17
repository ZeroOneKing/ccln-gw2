/* CCLN-GW2 · contador de visitas global (Abacus, sin registro) · meta 1.000.000 */
(function(){
  const numEl = document.getElementById('visitNum');
  if (!numEl) return;
  const barEl  = document.getElementById('visitBar');
  const pctEl  = document.getElementById('visitPct');
  const goalEl = document.getElementById('visitGoal');
  const GOAL = 1000000;
  let current = null;

  const isEn = () => document.body.classList.contains('lang-en');
  const loc  = () => isEn() ? 'en-US' : 'es-ES';

  function paint(){
    if (current == null) return;
    numEl.textContent = current.toLocaleString(loc());        // exacto, con separador de miles
    if (goalEl) goalEl.textContent = GOAL.toLocaleString(loc());
    const pct = Math.min(100, current / GOAL * 100);
    if (barEl) barEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = (pct < 1 ? pct.toFixed(4) : pct.toFixed(2)) + '%';
  }
  window.updateVisitLang = paint;   // re-formatea al cambiar de idioma

  function animateTo(target){
    const start = performance.now(), dur = 1400;
    (function tick(t){
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      current = Math.round(target * eased);
      paint();
      if (p < 1 && current !== target) requestAnimationFrame(tick);
    })(start);
    // respaldo: si rAF está suspendido (pestaña oculta), fija el valor exacto igualmente
    setTimeout(() => { current = target; paint(); }, dur + 150);
  }

  // cada carga de la web cuenta una visita
  fetch('https://abacus.jasoncameron.dev/hit/ccln-gw2/visits')
    .then(r => r.json())
    .then(d => { if (d && typeof d.value === 'number') animateTo(d.value); })
    .catch(() => { numEl.textContent = '—'; if (pctEl) pctEl.textContent = ''; });
})();
