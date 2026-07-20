/* CCLN-GW2 · toggle EN/ES (WebIA). EN por defecto. */
(function(){
  const btn = document.getElementById('langBtn');
  if (!btn) return;
  let lang = 'en';
  try { lang = localStorage.getItem('ccln-lang') || 'en'; } catch(e){}

  function apply(){
    document.body.classList.remove('lang-en','lang-es');
    document.body.classList.add('lang-' + lang);
    document.documentElement.lang = lang;
    btn.textContent = lang === 'en' ? '🌐 EN' : '🌐 ES';
    btn.title = lang === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés';
    // buscador
    if (typeof S !== 'undefined' && typeof render === 'function'){
      S.lang = lang; render();
    }
    // directorio de recursos
    if (typeof renderRes === 'function') renderRes();
    // cambio de gemas
    if (typeof window.updateGemLang === 'function') window.updateGemLang();
    // contador de visitas
    if (typeof window.updateVisitLang === 'function') window.updateVisitLang();
    // capa viva (jefes, bazar, cuenta) y mapa
    if (typeof window.updateLiveLang === 'function') window.updateLiveLang();
    if (typeof window.updateMapLang === 'function') window.updateMapLang();
    if (typeof window.updateXpacLang === 'function') window.updateXpacLang();
  }
  btn.addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    try { localStorage.setItem('ccln-lang', lang); } catch(e){}
    apply();
  });

  // botones del hero: saltar a una pestaña
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g){
      const tab = document.querySelector('#mainNav .tab[data-sec="' + g.dataset.go + '"]');
      if (tab) tab.click();
      window.scrollTo(0, 0);
      return;
    }
    // cerrar / reabrir el panel explicativo del buscador
    if (e.target.id === 'shopHelpX'){ shopHelp(false); try { localStorage.setItem('ccln-shophelp','0'); } catch(err){} }
    if (e.target.closest && e.target.closest('#shopReopen')){ shopHelp(true); try { localStorage.setItem('ccln-shophelp','1'); } catch(err){} }
  });
  function shopHelp(show){
    const h = document.getElementById('shopHelp'), r = document.getElementById('shopReopen');
    if (h) h.classList.toggle('hidden', !show);
    if (r) r.classList.toggle('hidden', show);
  }
  // estado inicial del panel explicativo (por defecto abierto)
  try { if (localStorage.getItem('ccln-shophelp') === '0') shopHelp(false); } catch(err){}

  apply();
})();
