/* CCLN-GW2 · modo global F2P / P2P */
(function(){
  const btn = document.getElementById('modeBtn');
  if (!btn) return;
  let mode = 'f2p';
  try { mode = localStorage.getItem('ccln-mode') || 'f2p'; } catch(e){}
  function apply(){
    document.body.classList.remove('f2p','p2p');
    document.body.classList.add(mode);
    btn.textContent = mode === 'f2p' ? '\u{1F193} F2P' : '\u{1F48E} P2P';
    btn.title = mode === 'f2p'
      ? 'Modo cuenta gratuita — pulsa para cambiar a expansiones'
      : 'Modo expansiones — pulsa para cambiar a cuenta gratuita';
    // sincroniza el filtro de Recursos si existe
    if (typeof RS !== 'undefined' && typeof renderRes === 'function'){
      RS.f = mode;
      renderRes();
    }
  }
  btn.addEventListener('click', () => {
    mode = mode === 'f2p' ? 'p2p' : 'f2p';
    try { localStorage.setItem('ccln-mode', mode); } catch(e){}
    apply();
  });
  apply();
})();
