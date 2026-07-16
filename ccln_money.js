/* CCLN-GW2 · Dinero real: cambio oro-gemas en vivo (API oficial, CORS ok) · bilingüe */
(function(){
  const el = document.getElementById('gemLive');
  if (!el) return;
  let data = null, failed = false;

  const isEn = () => document.body.classList.contains('lang-en');

  function paint(){
    if (failed || !data){
      el.innerHTML = isEn()
        ? '<b>💱 Gold⇄gems exchange</b><br><span style="color:var(--dim)">No API connection — open it in-game (gem icon) or at gw2bltc.com/en/gem</span>'
        : '<b>💱 Cambio oro⇄gemas</b><br><span style="color:var(--dim)">Sin conexión con la API — ábrelo en el juego (icono de gema) o en gw2bltc.com/en/gem</span>';
      return;
    }
    const { gemsPor100, costeOro } = data;
    if (isEn()){
      el.innerHTML = `<b>💱 Exchange NOW (official API)</b><br>` +
        `100 gold → <b>${gemsPor100} gems</b> · buy with gold: ` +
        `400💎 ≈ <b>${costeOro(400)}g</b> · 600💎 ≈ <b>${costeOro(600)}g</b> · 800💎 ≈ <b>${costeOro(800)}g</b>` +
        `<br><span style="color:var(--dim)">(the rate shifts every hour)</span>`;
    } else {
      el.innerHTML = `<b>💱 Cambio AHORA (API oficial)</b><br>` +
        `100 oro → <b>${gemsPor100} gemas</b> · comprar con oro: ` +
        `400💎 ≈ <b>${costeOro(400)} oro</b> · 600💎 ≈ <b>${costeOro(600)} oro</b> · 800💎 ≈ <b>${costeOro(800)} oro</b>` +
        `<br><span style="color:var(--dim)">(el cambio varía cada hora)</span>`;
    }
  }
  window.updateGemLang = paint;

  fetch('https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=1000000')
    .then(r => r.json())
    .then(c2g => {
      const gemsPor100 = c2g.quantity;
      const costeOro = g => Math.round(1000000 / gemsPor100 * g / 10000);
      data = { gemsPor100, costeOro };
      paint();
    })
    .catch(() => { failed = true; paint(); });
})();
