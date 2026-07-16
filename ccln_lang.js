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
  }
  btn.addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    try { localStorage.setItem('ccln-lang', lang); } catch(e){}
    apply();
  });

  // botones del hero: saltar a una pestaña
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (!g) return;
    const tab = document.querySelector('#mainNav .tab[data-sec="' + g.dataset.go + '"]');
    if (tab) tab.click();
    window.scrollTo(0, 0);
  });

  apply();
})();
