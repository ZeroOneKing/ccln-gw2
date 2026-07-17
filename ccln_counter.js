/* CCLN-GW2 · contador de VISITANTES únicos (1 por navegador, como Vercel) · meta 1.000.000
   Clave nueva ccln-gw2/visitors: empieza de cero con la semántica de únicos. */
(function(){
  const numEl = document.getElementById('visitNum');
  if (!numEl) return;
  const barEl  = document.getElementById('visitBar');
  const pctEl  = document.getElementById('visitPct');
  const goalEl = document.getElementById('visitGoal');
  const GOAL = 1000000;
  const NS = 'https://abacus.jasoncameron.dev';
  const KEY = 'ccln-gw2/visitors';
  let current = null;

  const isEn = () => document.body.classList.contains('lang-en');
  const loc  = () => isEn() ? 'en-US' : 'es-ES';

  function paint(){
    if (current == null) return;
    numEl.textContent = current.toLocaleString(loc());        // exacto, sin redondear
    if (goalEl) goalEl.textContent = GOAL.toLocaleString(loc());
    const pct = Math.min(100, current / GOAL * 100);
    if (barEl) barEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = (pct < 1 ? pct.toFixed(4) : pct.toFixed(2)) + '%';
  }
  window.updateVisitLang = paint;

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

  // dedupe por navegador: solo la PRIMERA visita incrementa; las demás solo leen
  let seen = false;
  try { seen = localStorage.getItem('ccln-visited') === '1'; } catch(e){}
  const url = NS + (seen ? '/get/' : '/hit/') + KEY;

  fetch(url)
    .then(r => r.json())
    .then(d => {
      if (d && typeof d.value === 'number'){
        if (!seen){ try { localStorage.setItem('ccln-visited', '1'); } catch(e){} }
        animateTo(d.value);
      }
    })
    .catch(() => { numEl.textContent = '—'; if (pctEl) pctEl.textContent = ''; });
})();
