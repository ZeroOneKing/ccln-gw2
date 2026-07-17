/* CCLN-GW2 · directorio de recursos F2P / P2P · bilingüe (de = English desc) */
const RES = [
 {n:'GW2 Wiki oficial', u:'https://wiki.guildwars2.com', d:'La base de todo: items, corazones, eventos', de:'The base of everything: items, hearts, events', c:'esencial', t:'fp', s:1},
 {n:'GuildJen', u:'https://guildjen.com', d:'Guías core, logros, monturas', de:'Core guides, achievements, mounts', c:'esencial', t:'fp', s:1},
 {n:'Hardstuck', u:'https://hardstuck.gg', d:'Guías core y endgame', de:'Core and endgame guides', c:'esencial', t:'fp'},
 {n:'MuklukLabs', u:'https://mukluklabs.com', d:'Guías + enlaces de Mukluk', de:'Guides + Mukluk link hub', c:'esencial', t:'fp'},
 {n:'Dulfy (legado)', u:'https://dulfy.net/category/gw2', d:'Guías antiguas aún útiles', de:'Legacy guides still useful', c:'esencial', t:'fp'},
 {n:'IGN Walkthrough', u:'https://www.ign.com/wikis/guild-wars-2', d:'Guía general para novatos', de:'General beginner walkthrough', c:'esencial', t:'f'},
 {n:'TenTonHammer', u:'https://www.tentonhammer.com/gw2', d:'Guía core clásica', de:'Classic core guide', c:'esencial', t:'f'},
 {n:'Restricciones F2P (wiki)', u:'https://wiki.guildwars2.com/wiki/Account', d:'Qué limita una cuenta gratuita', de:'What a free account limits', c:'esencial', t:'f', s:1},
 {n:'MetaBattle', u:'https://metabattle.com/wiki/Open_World', d:'Builds de leveleo y mundo abierto', de:'Leveling & open-world builds', c:'builds', t:'fp', s:1},
 {n:'GW2Skills (editor)', u:'https://en.gw2skills.net/editor', d:'Editor de builds para planear', de:'Build editor to plan gear', c:'builds', t:'fp'},
 {n:'SnowCrows', u:'https://snowcrows.com', d:'Meta de raids y strikes', de:'Raid & strike meta', c:'builds', t:'p'},
 {n:'Lucky Noobs', u:'https://lucky-noobs.com', d:'Builds de raid', de:'Raid builds', c:'builds', t:'p'},
 {n:'Discretize', u:'https://discretize.eu', d:'Fractales (de básico a CM)', de:'Fractals (basic to CM)', c:'builds', t:'fp'},
 {n:'Healing in GW2', u:'https://healingingw2.com', d:'Guías de sanador', de:'Healer build guides', c:'builds', t:'p'},
 {n:'Metaforge', u:'https://metaforge.app', d:'Planificador de legendarias', de:'Legendary planner', c:'builds', t:'p'},
 {n:'True Farming', u:'https://www.true-farming.com', d:'Trenes de farmeo diarios, timers y bot de Discord', de:'Daily farm trains, timers and a Discord bot', c:'oro', t:'fp', s:1},
 {n:'FAST Farming', u:'https://fast.farming-community.eu', d:'Farms de oro (Silverwastes a 80)', de:'Gold farms (Silverwastes to 80)', c:'oro', t:'fp', s:1},
 {n:'GW2 Nodes', u:'https://gw2nodes.com', d:'Mapas de nodos de recursos', de:'Resource node maps', c:'oro', t:'fp', s:1},
 {n:'GW2 Timer', u:'http://gw2timer.com', d:'Jefes de mundo y metas con reloj', de:'World bosses & metas with timers', c:'mapa', t:'fp', s:1},
 {n:'Blish HUD', u:'https://blishhud.com', d:'Overlay: pathing, farming tracker', de:'Overlay: pathing, farming tracker', c:'mapa', t:'fp', s:1},
 {n:'TacO', u:'https://gw2taco.blogspot.com', d:'Overlay táctico clásico', de:'Classic tactical overlay', c:'mapa', t:'fp'},
 {n:"Tekkit's Workshop", u:'https://tekkitsworkshop.net', d:'Marcadores de rutas de completado', de:'Map-completion route markers', c:'mapa', t:'fp', s:1},
 {n:'GW2.homes', u:'https://gw2.homes', d:'Hogar y decoración (Homestead)', de:'Homestead & decorating', c:'mapa', t:'p'},
 {n:'GW2BLTC', u:'https://www.gw2bltc.com', d:'Precios del bazar y flipping', de:'Trading Post prices & flipping', c:'tp', t:'fp', s:1},
 {n:'GW2TP', u:'https://www.gw2tp.com', d:'Flipping de alto nivel', de:'High-end flipping', c:'tp', t:'p'},
 {n:'GW2Spidy', u:'https://www.gw2spidy.com', d:'Gráficas de mercado', de:'Market graphs', c:'tp', t:'f'},
 {n:'GW2 Treasures', u:'https://gw2treasures.com', d:'Base de datos de items', de:'Item database', c:'tp', t:'fp'},
 {n:'Gemstore tracker', u:'https://www.gw2bltc.com/en/gem', d:'Cambio oro ⇄ gemas', de:'Gold ⇄ gems exchange', c:'tp', t:'p'},
 {n:'GW2Crafts', u:'https://gw2crafts.net', d:'Crafteo 1-400/500 barato (da XP)', de:'Cheap crafting 1-400/500 (gives XP)', c:'craft', t:'fp', s:1},
 {n:'Crafting Joonas', u:'https://gw2crafting.joonas.me', d:'Calculadora de crafteo', de:'Crafting calculator', c:'craft', t:'fp'},
 {n:'GW2Efficiency', u:'https://gw2efficiency.com', d:'Tu cuenta: equipo, slots, legendarias', de:'Your account: gear, slots, legendaries', c:'cuenta', t:'fp', s:1},
 {n:'GW2AP', u:'https://gw2ap.com', d:'Rastreador de logros', de:'Achievement tracker', c:'cuenta', t:'fp'},
 {n:'GW2 Armory', u:'https://gw2armory.com', d:'Perfiles públicos de cuenta', de:'Public account profiles', c:'cuenta', t:'fp'},
 {n:'Peu Research', u:'https://peuresearchcenter.com', d:'Investigación y guías raras', de:'Research & niche guides', c:'cuenta', t:'f'},
 {n:'Immortius Wardrobe', u:'https://immortius.xyz/wardrobe-unlock-analyser', d:'Analiza tus skins desbloqueadas', de:'Analyze unlocked skins', c:'cuenta', t:'p'},
 {n:'GW2Dyes', u:'https://gw2dyes.com', d:'Tintes y fashion', de:'Dyes & fashion', c:'cuenta', t:'p'},
 {n:'Kulinda Dyes', u:'https://kulinda.github.io/dyes', d:'Explorador de tintes', de:'Dye explorer', c:'cuenta', t:'p'},
 {n:'GW2Mists', u:'https://gw2mists.com', d:'WvW: builds y guías', de:'WvW: builds & guides', c:'endgame', t:'fp'},
 {n:'GW2 Wingman', u:'https://gw2wingman.nevermindcreations.de', d:'Estadísticas de logs DPS', de:'DPS log statistics', c:'endgame', t:'p'},
 {n:'dps.report', u:'https://dps.report', d:'Analizador de logs ArcDPS', de:'ArcDPS log analyzer', c:'endgame', t:'p'},
 {n:'Killproof.me', u:'https://killproof.me', d:'LFG de endgame (KP)', de:'Endgame LFG (KP)', c:'endgame', t:'p'},
 {n:'PlenBot', u:'https://github.com/Plenyx/PlenBotLogUploader', d:'Subida automática de logs', de:'Automatic log uploader', c:'endgame', t:'p'},
 {n:'GW2 Raidar (legado)', u:'https://www.gw2raidar.com', d:'Análisis de raids antiguo', de:'Legacy raid analysis', c:'endgame', t:'p'},
 {n:'Reddit r/Guildwars2', u:'https://www.reddit.com/r/Guildwars2', d:'Guía de nuevo jugador + comunidad', de:'New player guide + community', c:'social', t:'fp', s:1},
 {n:'Foros oficiales', u:'https://en-forum.guildwars2.com', d:'Foro oficial', de:'Official forum', c:'social', t:'fp'},
 {n:'Overflow Trading Co.', u:'https://discord.gg/gw2overflow', d:'Discord de mercadeo', de:'Trading Discord', c:'social', t:'p'},
 {n:'Reddit r/GW2Exchange', u:'https://www.reddit.com/r/GW2Exchange', d:'Intercambios entre jugadores', de:'Player-to-player exchange', c:'social', t:'p'},
 {n:'Mukluk', yt:'Mukluk GW2', d:'Guías de leveleo y novato', de:'Leveling & new-player guides', c:'yt', t:'fp', s:1},
 {n:'MightyTeapot', yt:'MightyTeapot GW2', d:'De 0 a héroe + endgame', de:'Zero to hero + endgame', c:'yt', t:'fp'},
 {n:'Lord Hizen', yt:'Lord Hizen GW2', d:'Builds solo de mundo abierto', de:'Solo open-world builds', c:'yt', t:'fp', s:1},
 {n:'Vallun', yt:'Vallun GW2', d:'PvP y WvW para novatos', de:'PvP & WvW for beginners', c:'yt', t:'fp'},
 {n:'Laranity', yt:'Laranity GW2', d:'Farmeo de oro (SW, Drizzlewood)', de:'Gold farming (SW, Drizzlewood)', c:'yt', t:'fp', s:1},
 {n:'Tekkit', yt:'Tekkit Workshop GW2', d:'Rutas de completado de mapa', de:'Map-completion routes', c:'yt', t:'fp', s:1},
 {n:'GuildJen', yt:'GuildJen GW2', d:'Logros y legendarias en vídeo', de:'Achievements & legendaries on video', c:'yt', t:'fp'},
 {n:'WoodenPotatoes', yt:'WoodenPotatoes GW2', d:'Lore de Tyria', de:'Tyria lore', c:'yt', t:'fp'},
 {n:'AyinMaiden', yt:'AyinMaiden GW2', d:'Jumping puzzles paso a paso', de:'Jumping puzzles step by step', c:'yt', t:'fp'},
 {n:'Deroir', yt:'Deroir GW2', d:'Fractales para empezar', de:'Fractals for beginners', c:'yt', t:'fp'},
 {n:'Bootts Bad Builds', yt:'Bootts GW2 builds', d:'Builds divertidas F2P', de:'Fun F2P builds', c:'yt', t:'f'},
 {n:'Rheyo', yt:'Rheyo GW2', d:'Exploración core', de:'Core exploration', c:'yt', t:'f'},
 {n:'Caffeinated Dad', yt:'Caffeinated Dad Gaming GW2', d:'Guías de jugador nuevo', de:'New player guides', c:'yt', t:'fp', s:1},
 {n:'Noxxi', yt:'Noxxi GW2', d:'Memes y vida F2P', de:'Memes & F2P life', c:'yt', t:'f'},
 {n:'Sindrener', yt:'Sindrener GW2', d:'Thief PvP', de:'Thief PvP', c:'yt', t:'f'},
 {n:'Naru', yt:'Naru GW2 WvW', d:'WvW roaming', de:'WvW roaming', c:'yt', t:'f'},
 {n:'Noody', yt:'Noody GW2', d:'Eventos core', de:'Core events', c:'yt', t:'f'},
 {n:'Krytan Herald', yt:'Krytan Herald GW2', d:'Lore', de:'Lore', c:'yt', t:'f'},
 {n:'Abaddons Mouth', yt:'Abaddons Mouth GW2', d:'Comunidad', de:'Community', c:'yt', t:'f'},
 {n:'Syrma Gaming', yt:'Syrma Gaming GW2', d:'Mejores webs de GW2', de:'Best GW2 websites', c:'yt', t:'f'},
 {n:'Snow Crows (canal)', yt:'Snow Crows GW2', d:'Benchmarks de DPS', de:'DPS benchmarks', c:'yt', t:'p'},
 {n:'Magic Find', yt:'Magic Find GW2 gold', d:'Trucos de oro P2P', de:'P2P gold tricks', c:'yt', t:'p'},
 {n:'Samug', yt:'Samug GW2', d:'Endgame y builds', de:'Endgame & builds', c:'yt', t:'p'},
 {n:'Nike', yt:'Nike GW2 raids', d:'Raids y PvE', de:'Raids & PvE', c:'yt', t:'p'},
 {n:'Kroof', yt:'Kroof GW2', d:'Specs de élite y noticias', de:'Elite specs & news', c:'yt', t:'p'},
 {n:'Emi', yt:'Emi GW2 fashion', d:'Fashion Wars y monturas', de:'Fashion Wars & mounts', c:'yt', t:'p'},
 {n:'Brea', yt:'Brea GW2 strikes', d:'Strikes y CMs', de:'Strikes & CMs', c:'yt', t:'p'},
 {n:'DeanyBox', yt:'DeanyBox GW2', d:'Análisis de expansiones', de:'Expansion deep dives', c:'yt', t:'p'},
 {n:'GW2 Oficial', yt:'Guild Wars 2 official', d:'Tráilers y streams dev', de:'Trailers & dev streams', c:'yt', t:'p'},
];

const RCATS = {esencial:'Esenciales', builds:'Builds', oro:'Oro y farmeo', mapa:'Mapas y overlays',
  tp:'Mercado', craft:'Crafteo', cuenta:'Cuenta y logros', endgame:'WvW y endgame', social:'Comunidad', yt:'YouTube'};
const RCATS_EN = {esencial:'Essentials', builds:'Builds', oro:'Gold & farming', mapa:'Maps & overlays',
  tp:'Market', craft:'Crafting', cuenta:'Account & achievements', endgame:'WvW & endgame', social:'Community', yt:'YouTube'};

const RS = {f:'all', c:'all'};
const resEn = () => document.body.classList.contains('lang-en');

function resUrl(r){
  return r.u || ('https://www.youtube.com/results?search_query=' + encodeURIComponent(r.yt));
}
function resPass(r){
  if (RS.f === 'f2p' && r.t.indexOf('f') < 0) return false;
  if (RS.f === 'p2p' && r.t.indexOf('p') < 0) return false;
  if (RS.f === 'star' && !r.s) return false;
  if (RS.c !== 'all' && r.c !== RS.c) return false;
  return true;
}
function renderRes(){
  const en = resEn();
  const CAT = en ? RCATS_EN : RCATS;
  const allLabel = en ? 'All' : 'Todas';
  const lvlLabel = en ? '⭐ Leveling' : '⭐ Leveleo';
  const rows = RES.filter(resPass);
  const f1 = [['all', en?'All':'Todos'],['f2p','🆓 F2P'],['p2p','💎 P2P'],['star', lvlLabel]]
    .map(([v,l]) => `<button class="fchip ${RS.f===v?'on':''}" data-f="${v}">${l}</button>`).join('');
  const f2 = [['all', allLabel]].concat(Object.keys(CAT).map(k => [k, CAT[k]]))
    .map(([v,l]) => `<button class="fchip ${RS.c===v?'on':''}" data-c="${v}">${l}</button>`).join('');
  const rf = document.getElementById('resFilters');
  if (rf) rf.innerHTML = `<div class="chipsbar">${f1}</div><div class="chipsbar">${f2}</div>`;
  const rg = document.getElementById('resGrid');
  if (rg) rg.innerHTML = rows.map(r =>
    `<a class="res" href="${resUrl(r)}" target="_blank" rel="noopener">
      <b>${r.c==='yt'?'▶️ ':''}${r.n}${r.s?' <i class="st">⭐</i>':''}</b>
      <span>${en ? (r.de||r.d) : r.d}</span>
      <div class="rtags">${r.t.indexOf('f')>=0?'<i class="rt f">F2P</i>':''}${r.t.indexOf('p')>=0?'<i class="rt p">P2P</i>':''}<i class="rt c">${CAT[r.c]}</i></div>
    </a>`).join('');
  const rc = document.getElementById('resCount');
  if (rc) rc.textContent = rows.length + (en ? ' resources' : ' recursos');
}
document.addEventListener('click', e => {
  const b = e.target.closest('.fchip');
  if (!b) return;
  if (b.dataset.f) RS.f = b.dataset.f;
  if (b.dataset.c) RS.c = b.dataset.c;
  renderRes();
});
renderRes();
