/* CCLN-GW2 · capa VIVA: cuenta (API key), equipo visual, alertas de jefes (+notificaciones), bazar, logros.
   La API key se guarda SOLO en localStorage del navegador y va directa a api.guildwars2.com. */
(function(){
'use strict';
const API = 'https://api.guildwars2.com/v2';
const $$ = id => document.getElementById(id);
const isEn = () => document.body.classList.contains('lang-en');
const T = (es, en) => isEn() ? en : es;
const loc = () => isEn() ? 'en-US' : 'es-ES';

function coins(c){
  const g = Math.floor(c/10000), s = Math.floor(c%10000/100), b = c%100;
  return (g? g+'<i class="g">g</i> ':'') + (s? s+'<i class="s">s</i> ':'') + b+'<i class="b">c</i>';
}

/* sonido de aviso (WebAudio: campana corta de dos tonos, sin archivos) */
let _ac = null;
function beep(){
  try {
    _ac = _ac || new (window.AudioContext || window.webkitAudioContext)();
    if (_ac.state === 'suspended') _ac.resume();
    [[880,0],[1320,.12]].forEach(([f,t]) => {
      const o = _ac.createOscillator(), g = _ac.createGain(), s = _ac.currentTime + t;
      o.type = 'sine'; o.frequency.value = f;
      o.connect(g); g.connect(_ac.destination);
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(.22, s + .02);
      g.gain.exponentialRampToValueAtTime(.001, s + .34);
      o.start(s); o.stop(s + .36);
    });
  } catch(e){}
}
/* service worker: notificaciones de sistema (sobreviven a la pestaña en segundo plano) */
let swReg = null;
if ('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').then(r => { swReg = r; }).catch(()=>{});
}
const NICON = 'https://render.guildwars2.com/file/9A29B75E9E0C1C61B4B1CF1FEC0A93D0B0C4F4E0/62653.png';
function fireNotif(title, body, tag){
  const opts = {body, tag, icon:NICON, requireInteraction:true, silent:false};
  // 1) vía service worker (nivel sistema, más fiable con la pestaña en segundo plano)
  if (swReg && swReg.active){
    swReg.active.postMessage({type:'notify', title, body, tag, icon:NICON, url:location.href});
  } else if (swReg && swReg.showNotification){
    try { swReg.showNotification(title, opts); } catch(e){ try { new Notification(title, opts); } catch(e2){} }
  } else {
    try { new Notification(title, opts); } catch(e){}
  }
  beep();
}

/* ============ JEFES DE MUNDO (horario wiki, UTC) ============ */
const ROUTE_SET = new Set(['Queensdale','Kessex Hills','Gendarran Fields','Harathi Hinterlands',
  'Bloodtide Coast','Sparkfly Fen','Fireheart Rise','Frostgorge Sound','Plains of Ashford',
  'Diessa Plateau','Wayfarer Foothills','Snowden Drifts','Metrica Province','Caledon Forest','Brisban Wildlands']);
const BOSSES = [
  {es:'Almirante Taidha Covington', en:'Admiral Taidha Covington', z:'Bloodtide Coast', start:0,   step:180},
  {es:'Jefe chamán svanir',          en:'Svanir Shaman Chief',      z:'Wayfarer Foothills', start:15, step:120},
  {es:'Megadestructor',              en:'Megadestroyer',            z:'Mount Maelstrom', start:30,  step:180},
  {es:'Elemental de Fuego',          en:'Fire Elemental',           z:'Metrica Province', start:45, step:120},
  {es:'El Despedazador',             en:'The Shatterer',            z:'Blazeridge Steppes', start:60, step:180},
  {es:'Gran gusano de la selva',     en:'Great Jungle Wurm',        z:'Caledon Forest', start:75,  step:120},
  {es:'Ulgoth el Modniir',           en:'Modniir Ulgoth',           z:'Harathi Hinterlands', start:90, step:180},
  {es:'Behemot de las Sombras',      en:'Shadow Behemoth',          z:'Queensdale', start:105, step:120},
  {es:'Golem Serie II',              en:'Golem Mark II',            z:'Mount Maelstrom', start:120, step:180},
  {es:'Garra de Jormag',             en:'Claw of Jormag',           z:'Frostgorge Sound', start:150, step:180},
  {es:'Tequatl el Insomne',          en:'Tequatl the Sunless',      z:'Sparkfly Fen', times:[0,180,420,690,960,1140], hard:1},
  {es:'Triple Amenaza',              en:'Triple Trouble',           z:'Bloodtide Coast', times:[60,240,480,750,1020,1200], hard:1},
  {es:'Reina karka',                 en:'Karka Queen',              z:'Southsun Cove', times:[120,360,630,900,1080,1380], hard:1},
];
function nextSpawns(){
  const now = new Date();
  const utcMin = now.getUTCHours()*60 + now.getUTCMinutes() + now.getUTCSeconds()/60;
  const dayEpoch = Math.floor(now.getTime() / 86400000);
  const list = [];
  for (const b of BOSSES){
    let mins = [];
    if (b.times) mins = b.times;
    else for (let t=b.start; t<1440; t+=b.step) mins.push(t);
    let next = mins.find(m => m > utcMin);
    let wait, slot;
    if (next === undefined){ wait = 1440 - utcMin + mins[0]; slot = (dayEpoch+1)*1440 + mins[0]; }
    else { wait = next - utcMin; slot = dayEpoch*1440 + next; }
    list.push({b, wait, slot});
  }
  return list.sort((a,c)=>a.wait-c.wait);
}

/* --- notificaciones de escritorio (activables en Mi cuenta) --- */
const notified = new Set();
function notifOn(){ try { return localStorage.getItem('ccln-notif') === '1'; } catch(e){ return false; } }
function paintNotifState(){
  const st = $$('notifState'), chk = $$('notifChk');
  if (!st || !chk) return;
  chk.checked = notifOn();
  if (!('Notification' in window)) st.textContent = T('Tu navegador no soporta notificaciones.','Your browser does not support notifications.');
  else if (!notifOn()) st.textContent = T('Desactivadas.','Off.');
  else if (Notification.permission === 'granted') st.innerHTML = T(
    '✓ Activadas: aviso 5 min antes de cada jefe de tu ruta (deja esta pestaña abierta).<br>' +
    '<b>Si juegas y no te salen:</b> Windows silencia los avisos con juegos a pantalla completa. Solución: pon GW2 en <b>ventana sin bordes</b> y desactiva <b>Asistente de concentración</b> (Configuración → Sistema → Asistente de concentración → Desactivado, y quita «Cuando juego a un juego»).',
    '✓ On: ping 5 min before each route boss (keep this tab open).<br>' +
    '<b>If you get none while playing:</b> Windows mutes alerts during fullscreen games. Fix: run GW2 in <b>windowed fullscreen (borderless)</b> and turn off <b>Focus assist</b> (Settings → System → Focus assist → Off, and uncheck "When I\'m playing a game").');
  else st.textContent = T('Falta el permiso del navegador — vuelve a activar y acepta.','Browser permission missing — toggle again and accept.');
}
function checkNotifs(spawns){
  if (!notifOn() || !('Notification' in window) || Notification.permission !== 'granted') return;
  for (const {b, wait, slot} of spawns){
    if (!ROUTE_SET.has(b.z)) continue;
    const key = b.en + '@' + slot;
    if (wait <= 6 && wait > 0 && !notified.has(key)){   // margen: en 2º plano el navegador despierta ~1 vez/min
      notified.add(key);
      fireNotif('⚔️ ' + (isEn()?b.en:b.es),
        T(`Empieza en ${Math.ceil(wait)} min — ${b.z}`, `Starts in ${Math.ceil(wait)} min — ${b.z}`), key);
    }
  }
}
function paintBosses(){
  const el = $$('bossBox');
  const spawns = nextSpawns();
  checkNotifs(spawns);
  if (!el) return;
  const top = spawns.slice(0,5);
  el.innerHTML = `<span class="t">🐉 ${T('Próximos jefes de mundo','Next world bosses')}</span>` +
    top.map(({b,wait}) => {
      const m = Math.floor(wait), s = Math.floor((wait-m)*60);
      const cd = m >= 60 ? Math.floor(m/60)+'h '+(m%60)+'m' : m+'m '+String(s).padStart(2,'0')+'s';
      const ruta = ROUTE_SET.has(b.z) ? `<i class="rt f">${T('EN TU RUTA','ON YOUR ROUTE')}</i>` : '';
      return `<div class="bossrow"><b class="cd">${cd}</b><span>${isEn()?b.en:b.es}</span>` +
             `<span class="bz">${b.z}</span>${ruta}${b.hard?'<i class="rt p">HARD</i>':''}</div>`;
    }).join('') +
    `<div class="bfoot">${T('Horario fijo del juego (wiki) · 1 cofre por jefe y día · 🔔 avisos en 👤 Mi cuenta','Fixed in-game schedule (wiki) · 1 chest per boss per day · 🔔 alerts in 👤 My account')}</div>`;
}
setInterval(paintBosses, 1000);

/* ============ BAZAR AHORA ============ */
const MATS = [
  {id:19697, es:'Mineral de cobre', en:'Copper Ore'},
  {id:19699, es:'Mineral de hierro', en:'Iron Ore'},
  {id:19702, es:'Mineral de platino', en:'Platinum Ore'},
  {id:19700, es:'Mineral de mithril', en:'Mithril Ore'},
  {id:19701, es:'Mineral de oricalco', en:'Orichalcum Ore'},
  {id:19723, es:'Madera verde', en:'Green Wood Log'},
  {id:19726, es:'Madera blanda', en:'Soft Wood Log'},
  {id:19727, es:'Madera curtida', en:'Seasoned Wood Log'},
  {id:19724, es:'Madera sólida', en:'Hard Wood Log'},
  {id:19722, es:'Madera ancestral', en:'Elder Wood Log'},
  {id:19728, es:'Cuero fino', en:'Thin Leather Section'},
  {id:19729, es:'Cuero grueso', en:'Thick Leather Section'},
  {id:19721, es:'Ectoplasma', en:'Glob of Ectoplasm'},
];
let tpData = null;
function paintTP(){
  const el = $$('tpLive');
  if (!el) return;
  if (!tpData){ el.innerHTML = `<span class="t">📈 ${T('Bazar AHORA','Trading Post NOW')}</span><p style="color:var(--dim)">…</p>`; return; }
  const rows = MATS.map(m => ({m, p: tpData[m.id]})).filter(x => x.p && x.p.buys)
    .sort((a,c) => c.p.buys.unit_price - a.p.buys.unit_price);
  const best = rows[0];
  el.innerHTML =
    `<span class="t">📈 ${T('Bazar AHORA — qué paga recolectar','Trading Post NOW — what gathering pays')}</span>` +
    `<p class="tpbest">${T('Ahora mismo lo que mejor paga','Best payer right now')}: <b>${isEn()?best.m.en:best.m.es}</b> (${coins(best.p.buys.unit_price)}/u)</p>` +
    `<div class="tpgrid">` + rows.map(({m,p}) =>
      `<div class="tprow"><span>${isEn()?m.en:m.es}</span><b>${coins(p.buys.unit_price)}</b></div>`).join('') +
    `</div><div class="bfoot">${T('Precio de venta instantánea, de este preciso instante (API oficial).','Instant-sell price, right now (official API).')}</div>`;
}
function loadTP(){
  fetch(API + '/commerce/prices?ids=' + MATS.map(m=>m.id).join(','))
    .then(r=>r.json())
    .then(arr => { tpData = {}; arr.forEach(p => tpData[p.id] = p); paintTP(); })
    .catch(()=>{ const el=$$('tpLive'); if(el) el.innerHTML = `<span class="t">📈 Bazar</span><p style="color:var(--dim)">${T('Sin conexión con la API','No API connection')}</p>`; });
}

/* ============ LOGROS INTERNOS ============ */
const ACHV = [
  {id:'link',  ico:'🔗', es:'Cuenta vinculada',     en:'Account linked',   des:'Conecta tu API key', den:'Connect your API key'},
  {id:'apply', ico:'🎯', es:'Ruta calibrada',       en:'Route calibrated', des:'Aplica tu nivel al buscador', den:'Apply your level to the finder'},
  {id:'karma50',ico:'💜', es:'Ahorrador de karma',  en:'Karma saver',      des:'Acumula 50.000 de karma', den:'Save up 50,000 karma'},
  {id:'lv80',  ico:'👑', es:'Ochentero',            en:'Level 80 club',    des:'Ten un personaje a nivel 80', den:'Have a level-80 character'},
  {id:'tabs',  ico:'🧭', es:'Explorador de la web', en:'Site explorer',    des:'Visita todas las pestañas', den:'Visit every tab'},
];
function achvGet(){ try { return JSON.parse(localStorage.getItem('ccln-achv')||'{}'); } catch(e){ return {}; } }
function achvUnlock(id){
  const a = achvGet();
  if (!a[id]){ a[id] = Date.now(); try{ localStorage.setItem('ccln-achv', JSON.stringify(a)); }catch(e){} paintAchv(); }
}
function paintAchv(){
  const el = $$('achvBox');
  if (!el) return;
  const a = achvGet();
  el.innerHTML = `<span class="t">🏅 ${T('Logros de eficiencia','Efficiency achievements')}</span><div class="achvgrid">` +
    ACHV.map(x => `<div class="achv ${a[x.id]?'on':''}" title="${isEn()?x.den:x.des}">` +
      `<span>${x.ico}</span><b>${isEn()?x.en:x.es}</b></div>`).join('') + `</div>`;
}
const seenTabs = new Set();
document.addEventListener('click', e => {
  const b = e.target.closest('#mainNav .tab');
  if (!b) return;
  seenTabs.add(b.dataset.sec);
  if (seenTabs.size >= document.querySelectorAll('#mainNav .tab').length) achvUnlock('tabs');
});

/* ============ PANEL DE CUENTA ============ */
let ACC = null;
window.CCLN_LEVEL = null;

function keyGet(){ try { return localStorage.getItem('ccln-apikey') || ''; } catch(e){ return ''; } }
function keySet(k){ try { k ? localStorage.setItem('ccln-apikey', k) : localStorage.removeItem('ccln-apikey'); } catch(e){} }
function api(path){
  return fetch(API + path + (path.includes('?') ? '&' : '?') + 'access_token=' + encodeURIComponent(keyGet()))
    .then(r => { if (!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}
function accStatus(msg, err){
  const el = $$('accStatus');
  if (el){ el.textContent = msg; el.style.color = err ? 'var(--skip)' : 'var(--vine)'; }
}

/* refresco automático: cada 5 min se vuelve a leer TODO de la API (nivel, equipo,
   cartera y la vista de almacén abierta) sin tener que reentrar en la pestaña */
const AUTO_MS = 300000;
let lastSync = 0, autoTimer = null;
function syncLabel(){
  const el = $$('syncInfo');
  if (!el) return;
  if (!lastSync){ el.textContent = ''; return; }
  const s = Math.round((Date.now() - lastSync)/1000);
  const ago = s < 60 ? T(`hace ${s} s`, `${s}s ago`) : T(`hace ${Math.floor(s/60)} min`, `${Math.floor(s/60)}m ago`);
  el.innerHTML = `🔄 ${T('Actualizado','Updated')} ${ago} · ${T('se refresca solo cada 5 min','auto-refreshes every 5 min')} ` +
    `<button class="ghostBtn" id="syncNow" style="padding:3px 10px;font-size:11.5px">${T('Actualizar ya','Refresh now')}</button>`;
}
setInterval(syncLabel, 5000);
function startAuto(){
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => { if (keyGet()) loadAccount(true); }, AUTO_MS);
}

function loadAccount(silent){
  if (!keyGet()){ paintAccount(); return; }
  if (!silent) accStatus(T('Conectando con la API oficial…','Connecting to the official API…'));
  Promise.all([ api('/account'), api('/characters?ids=all'), api('/account/wallet') ])
    .then(([acc, chars, wallet]) => {
      const prevSel = ACC && ACC.sel;
      const w = {}; wallet.forEach(x => w[x.id] = x.value);
      chars.sort((a,b) => b.level - a.level);
      const keepSel = prevSel && chars.some(c => c.name === prevSel) ? prevSel : (chars[0] ? chars[0].name : null);
      ACC = { name: acc.name, access: acc.access || [], chars, wallet: w,
              sel: keepSel, eq: null, stats: null };
      achvUnlock('link');
      if ((w[2]||0) >= 50000) achvUnlock('karma50');
      if (chars.some(c => c.level >= 80)) achvUnlock('lv80');
      const p2p = ACC.access.some(a => a !== 'PlayForFree' && a !== 'None');
      try { localStorage.setItem('ccln-mode', p2p ? 'p2p' : 'f2p'); } catch(e){}
      document.body.classList.remove('f2p','p2p');
      document.body.classList.add(p2p ? 'p2p' : 'f2p');
      const mb = $$('modeBtn'); if (mb) mb.textContent = p2p ? '💎 P2P' : '🆓 F2P';
      accStatus('✓ ' + T('Conectado como','Connected as') + ' ' + acc.name + ' · ' + T('clave recordada en este navegador','key remembered in this browser'));
      lastSync = Date.now();
      paintAccount();
      loadEquip();
      if (stgOpen) loadStorage(stgOpen, true);   // refresca también la vista de almacén abierta
      startAuto();
    })
    .catch(() => { accStatus(T('Clave rechazada o sin permisos (necesita: account, characters, wallet, inventories)','Key rejected or missing permissions (needs: account, characters, wallet, inventories)'), true); });
}

/* ---- equipo visual estilo juego ---- */
const RARCOL = {Junk:'#aaa',Basic:'#fff',Fine:'#62a4da',Masterwork:'#3ba51e',Rare:'#fcd00b',
                Exotic:'#ffa405',Ascended:'#fb3e8d',Legendary:'#a63cf9'};
const SLOTS_L = ['Helm','Shoulders','Coat','Gloves','Leggings','Boots'];
const SLOTS_R = ['Backpack','Accessory1','Accessory2','Amulet','Ring1','Ring2'];
const SLOTS_W = ['WeaponA1','WeaponA2','WeaponB1','WeaponB2'];
const SLOT_TXT = {
  Helm:{es:'Casco',en:'Helm'},Shoulders:{es:'Hombros',en:'Shoulders'},Coat:{es:'Pecho',en:'Chest'},
  Gloves:{es:'Guantes',en:'Gloves'},Leggings:{es:'Perneras',en:'Leggings'},Boots:{es:'Botas',en:'Boots'},
  Backpack:{es:'Espalda',en:'Back'},Accessory1:{es:'Accesorio 1',en:'Accessory 1'},Accessory2:{es:'Accesorio 2',en:'Accessory 2'},
  Amulet:{es:'Amuleto',en:'Amulet'},Ring1:{es:'Anillo 1',en:'Ring 1'},Ring2:{es:'Anillo 2',en:'Ring 2'},
  WeaponA1:{es:'Arma A · mano hábil',en:'Weapon A · main'},WeaponA2:{es:'Arma A · torpe',en:'Weapon A · off'},
  WeaponB1:{es:'Arma B · mano hábil',en:'Weapon B · main'},WeaponB2:{es:'Arma B · torpe',en:'Weapon B · off'},
};
const ATTR_TXT = {Power:{es:'Potencia',en:'Power'},Precision:{es:'Precisión',en:'Precision'},
  Toughness:{es:'Dureza',en:'Toughness'},Vitality:{es:'Vitalidad',en:'Vitality'},
  CritDamage:{es:'Ferocidad',en:'Ferocity'},ConditionDamage:{es:'Daño de condición',en:'Condition Damage'},
  Healing:{es:'Poder de curación',en:'Healing Power'},BoonDuration:{es:'Concentración',en:'Concentration'}};
const PROF_ICO = {Guardian:'🛡️',Warrior:'⚔️',Engineer:'🔧',Ranger:'🏹',Thief:'🗡️',
  Elementalist:'🔥',Necromancer:'💀',Mesmer:'🦋',Revenant:'⚡'};

function loadEquip(){
  if (!ACC || !ACC.sel) return;
  api('/characters/' + encodeURIComponent(ACC.sel) + '/equipment')
    .then(eq => {
      const ids = [...new Set((eq.equipment||[]).map(e => e.id))].slice(0, 80);
      if (!ids.length){ ACC.eq = {}; ACC.stats = {}; paintAccount(); return; }
      return fetch(API + '/items?ids=' + ids.join(',') + '&lang=' + (isEn()?'en':'es'))
        .then(r=>r.json())
        .then(items => {
          const byId = {}; items.forEach(i => byId[i.id] = i);
          const slots = {}, stats = {}; let defense = 0;
          (eq.equipment||[]).forEach(e => {
            const it = byId[e.id];
            if (!it) return;
            slots[e.slot] = it;
            const det = it.details || {};
            if (det.defense) defense += det.defense;
            ((det.infix_upgrade||{}).attributes||[]).forEach(a => {
              stats[a.attribute] = (stats[a.attribute]||0) + a.modifier;
            });
          });
          ACC.eq = slots; ACC.stats = {attrs: stats, defense};
          paintAccount();
        });
    }).catch(()=>{});
}

function slotHtml(slot, ch){
  const it = ACC.eq ? ACC.eq[slot] : null;
  const stxt = SLOT_TXT[slot] ? (isEn()?SLOT_TXT[slot].en:SLOT_TXT[slot].es) : slot;
  if (!it) return `<div class="eqslot empty" data-slot="${slot}" data-tip="${stxt} — ${T('vacío','empty')}"><span>·</span></div>`;
  const old = ch.level < 80 && it.level > 0 && it.level <= ch.level - 10;
  return `<div class="eqslot ${old?'old':''}" data-slot="${slot}" style="border-color:${RARCOL[it.rarity]||'#666'}">` +
    `<img src="${it.icon}" alt="">${old?'<i class="warn">⚠</i>':''}</div>`;
}
/* tooltip de objeto tipo juego: nombre por rareza, cantidad, daño/defensa, stats, descripción */
function itemInfoHtml(it, opts){
  opts = opts || {};
  if (!it) return `<b>${opts.slotTxt||''}</b><br><span class="dim">${T('Slot vacío','Empty slot')}</span>`;
  const det = it.details || {};
  const line2 = [opts.slotTxt, it.level ? 'nv '+it.level : null, it.rarity,
                 (it.type||'') ].filter(Boolean).join(' · ');
  let h = `<b style="color:${RARCOL[it.rarity]||'#fff'}">${it.name}</b>` +
    (opts.count > 1 ? `<span class="qty">×${opts.count.toLocaleString(loc())}</span>` : '') +
    `<div class="dim">${line2}</div>`;
  if (det.min_power) h += `<div>⚔ ${T('Daño','Damage')}: ${det.min_power}–${det.max_power}</div>`;
  if (det.defense)  h += `<div>🛡 ${T('Defensa','Defense')}: ${det.defense}</div>`;
  (((det.infix_upgrade)||{}).attributes||[]).forEach(a => {
    const at = ATTR_TXT[a.attribute]; h += `<div class="stat">+${a.modifier} ${at?(isEn()?at.en:at.es):a.attribute}</div>`;
  });
  if (typeof it.vendor_value === 'number' && it.vendor_value > 0)
    h += `<div class="dim" style="margin-top:4px">${T('Valor NPC','Vendor')}: ${coins(it.vendor_value)}${opts.count>1?' ('+T('unidad','each')+')':''}</div>`;
  const desc = (it.description||'').replace(/<[^>]*>/g,'').trim();
  if (desc) h += `<div class="desc">${desc.slice(0,220)}</div>`;
  return h;
}
function eqTipHtml(slot, ch){
  const stxt = SLOT_TXT[slot] ? (isEn()?SLOT_TXT[slot].en:SLOT_TXT[slot].es) : slot;
  const it = ACC.eq ? ACC.eq[slot] : null;
  let h = itemInfoHtml(it, {slotTxt: stxt});
  if (it){
    const old = ch.level < 80 && it.level > 0 && it.level <= ch.level - 10;
    if (old) h += `<div class="warn2">⚠ ${T('Desfasado: '+(ch.level-it.level)+' niveles por detrás — mira 🛒','Outdated: '+(ch.level-it.level)+' levels behind — check 🛒')}</div>`;
  }
  return h;
}
function statsHtml(){
  if (!ACC.stats) return '';
  const st = ACC.stats.attrs || {};
  const keys = Object.keys(st).sort((a,b)=>st[b]-st[a]);
  return `<div class="eqstats"><span class="tl">${T('Bonus del equipo','Gear bonuses')}</span>` +
    (ACC.stats.defense ? `<div class="strow"><span>🛡 ${T('Defensa','Defense')}</span><b>${ACC.stats.defense}</b></div>` : '') +
    (keys.length ? keys.map(k => {
      const at = ATTR_TXT[k];
      return `<div class="strow"><span>${at?(isEn()?at.en:at.es):k}</span><b>+${st[k]}</b></div>`;
    }).join('') : `<div class="dim" style="font-size:12px">${T('Sin stats aún','No stats yet')}</div>`) + `</div>`;
}

/* ---- almacén: banco, materiales, bolsa del personaje ----
   Caché PERSISTENTE de objetos (por idioma) en localStorage: los datos de un ítem no
   cambian, así que tras la 1ª vez la carga es instantánea y solo se piden los nuevos. */
const CACHES = {es:{}, en:{}};
const ckey = l => 'ccln-items-v2-' + l;
['es','en'].forEach(l => { try { CACHES[l] = JSON.parse(localStorage.getItem(ckey(l)) || '{}'); } catch(e){ CACHES[l] = {}; } });
const IC = () => CACHES[isEn() ? 'en' : 'es'];
let cacheDirty = false;

function trimItem(it){          // guardamos solo lo que pinta el tooltip (cabe mucho más)
  const d = it.details || {};
  const o = {i:it.id, n:it.name, c:it.icon, r:it.rarity, l:it.level, t:it.type, v:it.vendor_value};
  if (it.description) o.d = it.description;
  if (d.min_power) { o.mn = d.min_power; o.mx = d.max_power; }
  if (d.defense) o.df = d.defense;
  const at = (d.infix_upgrade||{}).attributes;
  if (at && at.length) o.a = at.map(x => [x.attribute, x.modifier]);
  return o;
}
function expand(o){             // vuelve al formato que usan los tooltips
  if (!o) return null;
  const det = {};
  if (o.mn) { det.min_power = o.mn; det.max_power = o.mx; }
  if (o.df) det.defense = o.df;
  if (o.a) det.infix_upgrade = {attributes: o.a.map(([k,v]) => ({attribute:k, modifier:v}))};
  return {id:o.i, name:o.n, icon:o.c, rarity:o.r, level:o.l, type:o.t,
          vendor_value:o.v, description:o.d, details:det};
}
const CACHE_MAX = 4000;   // ~1 MB por idioma; el límite del navegador ronda los 5 MB
function saveCache(){
  if (!cacheDirty) return;
  cacheDirty = false;
  ['es','en'].forEach(l => {
    const keys = Object.keys(CACHES[l]);
    if (keys.length > CACHE_MAX){                       // recorta lo más antiguo
      const keep = {}; keys.slice(-CACHE_MAX).forEach(k => keep[k] = CACHES[l][k]);
      CACHES[l] = keep;
    }
    try { localStorage.setItem(ckey(l), JSON.stringify(CACHES[l])); }
    catch(e){ try { localStorage.removeItem(ckey(l)); } catch(e2){} }  // cuota llena → se regenera
  });
}
function resolveItems(ids, onProgress){
  const cache = IC();
  const need = [...new Set(ids)].filter(id => id && !cache[id]);
  if (!need.length) return Promise.resolve();
  const chunks = [];
  for (let i=0; i<need.length; i+=200) chunks.push(need.slice(i, i+200));   // 200 = máximo de la API
  let done = 0;
  return Promise.all(chunks.map(c =>
    fetch(API + '/items?ids=' + c.join(',') + '&lang=' + (isEn()?'en':'es'))
      .then(r=>r.json())
      .then(arr => { arr.forEach(it => { cache[it.id] = trimItem(it); }); cacheDirty = true; })
      .catch(()=>{})
      .then(()=>{ done++; if (onProgress) onProgress(done, chunks.length); })
  )).then(saveCache);
}
function gridHtml(entries){
  // entries: [{id,count}] — pinta lo que ya está en caché y deja hueco al resto
  const cache = IC();
  if (!entries.length) return `<p class="dim" style="font-size:12px">${T('Vacío.','Empty.')}</p>`;
  return `<div class="stgrid">` + entries.map(e => {
    const o = cache[e.id];
    if (!o) return `<div class="stcell pend" data-item="${e.id}" data-count="${e.count}"></div>`;
    return `<div class="stcell" style="border-color:${RARCOL[o.r]||'#555'}" ` +
      `data-item="${e.id}" data-count="${e.count}">` +
      `<img src="${o.c}" loading="lazy" alt=""><b>${e.count>1?e.count:''}</b></div>`;
  }).join('') + `</div>`;
}
let stgOpen = null;
const stgCache = {};   // últimas filas por tipo, para repintar sin volver a pedir

/* pinta ya (con lo cacheado) y luego rellena lo que falte */
function paintStorage(kind, rows, header){
  const box = $$('storageBox');
  if (!box || stgOpen !== kind) return Promise.resolve();
  stgCache[kind] = {rows, header};
  const cache = IC();
  const missing = rows.filter(r => !cache[r.id]).length;
  const bar = missing
    ? `<div class="stload"><i></i>${T('cargando '+missing+' objetos nuevos…','loading '+missing+' new items…')}</div>` : '';
  box.innerHTML = `<div class="stcount">${header}</div>` + bar + gridHtml(rows);
  if (!missing) return Promise.resolve();
  return resolveItems(rows.map(r => r.id)).then(() => {
    if (stgOpen !== kind) return;
    box.innerHTML = `<div class="stcount">${header}</div>` + gridHtml(rows);
  });
}
function loadStorage(kind, silent){
  const box = $$('storageBox');
  if (!box) return;
  if (!silent && stgOpen === kind){ stgOpen = null; box.innerHTML = ''; renderStgTabs(); return; }
  stgOpen = kind; renderStgTabs();
  if (!silent && !stgCache[kind]) box.innerHTML = `<p class="dim" style="font-size:12px">${T('Cargando…','Loading…')}</p>`;
  const fail = () => { if (stgOpen === kind) box.innerHTML = `<p class="dim">${T('No se pudo (¿permiso inventories?)','Failed (inventories permission?)')}</p>`; };

  if (kind === 'mats'){
    api('/account/materials').then(mats => {
      // OJO: /v2/account/materials devuelve el campo "id" (no "item_id")
      const rows = mats.filter(m => m.count > 0).map(m => ({id: m.id || m.item_id, count: m.count}));
      const total = rows.reduce((a,r)=>a+r.count,0).toLocaleString(loc());
      return paintStorage(kind, rows, `${rows.length} ${T('tipos de material · ','material types · ')}${total} ${T('en total','total')}`);
    }).catch(fail);
  } else if (kind === 'bank'){
    api('/account/bank').then(bank => {
      const rows = (bank||[]).filter(x => x).map(r => ({id:r.id, count:r.count}));
      return paintStorage(kind, rows, `${rows.length} ${T('objetos en el banco','items in the bank')}`);
    }).catch(fail);
  } else if (kind === 'bag'){
    if (!ACC || !ACC.sel){ box.innerHTML=''; return; }
    api('/characters/' + encodeURIComponent(ACC.sel) + '/inventory').then(inv => {
      const items = [];
      (inv.bags||[]).forEach(bag => { if (bag) (bag.inventory||[]).forEach(it => { if (it) items.push({id:it.id, count:it.count}); }); });
      return paintStorage(kind, items, `${items.length} ${T('objetos en la bolsa de ','items in ')}${ACC.sel}`);
    }).catch(fail);
  }
}
function renderStgTabs(){
  const el = $$('storageTabs');
  if (!el) return;
  const t = [['bank','🏦 '+T('Banco','Bank')],['mats','📦 '+T('Materiales','Materials')],['bag','🎒 '+T('Bolsa','Bag')]];
  el.innerHTML = t.map(([k,l]) => `<button class="stbtn ${stgOpen===k?'on':''}" data-stg="${k}">${l}</button>`).join('');
}

function fase(lv){
  if (lv < 10)  return T('Fase 1 — arranque: ciudades / zona inicial','Phase 1 — start: cities / starter zone');
  if (lv < 15)  return T('Fase 2 — zonas iniciales + equipo nv 10-15 de corazones','Phase 2 — starter zones + lv 10-15 heart gear');
  if (lv < 55)  return T('Fase 3 — zonas 2 + ruta común · junta 15 oro','Phase 3 — second zones + common route · save 15 gold');
  if (lv < 69)  return T('Fase 4 — crafteo turbo: 2 disciplinas a 400 = +14 niveles','Phase 4 — crafting turbo: 2 disciplines to 400 = +14 levels');
  if (lv < 80)  return T('Fase 5 — remate: Fireheart → Frostgorge','Phase 5 — finish: Fireheart → Frostgorge');
  return T('¡Nivel 80! → pestaña 🏔️ y a farmear (💰)','Level 80! → 🏔️ tab and start farming (💰)');
}
function consejoKarma(lv, karma, prof){
  if (typeof DATA === 'undefined') return '';
  const cls = (prof||'').toLowerCase();
  const use = r => {
    if (r.lv > lv + 1) return false;
    const v = cls === 'necromancer' ? r.vN : cls === 'mesmer' ? r.vM : (r.vM || r.vN);
    return typeof v === 'string' && v.indexOf('COMPRAR') === 0;
  };
  const cand = DATA.filter(use).sort((a,b) => b.karma - a.karma);
  if (!cand.length) return '';
  const afford = cand.filter(r => r.karma <= karma);
  const missing = cand.filter(r => r.karma > karma).sort((a,b) => a.karma - b.karma)[0];
  let out = '';
  if (afford.length){
    const top = afford[0];
    out += `<li>💜 ${T('Ya puedes pagar','You can already afford')} <b>${afford.length}</b> ${T('ítems verdes del buscador. El mejor:','green finder items. Best one:')} <b>${isEn()?top.nEn:top.nEs}</b> (${top.karma.toLocaleString(loc())} karma, nv ${top.lv})</li>`;
  }
  if (missing){
    out += `<li>⏳ ${T('Te faltan','You are short')} <b>${(missing.karma - karma).toLocaleString(loc())}</b> karma ${T('para','for')} <b>${isEn()?missing.nEn:missing.nEs}</b> — ${T('haz corazones/eventos de tu zona','do hearts/events in your zone')}</li>`;
  }
  return out;
}

function paintAccount(){
  const box = $$('accBox');
  if (!box) return;
  const key = keyGet();
  const inp = $$('apiKeyInput');
  if (inp) inp.value = key ? '••••••••••••' + key.slice(-6) : '';
  if (key && !ACC) accStatus('✓ ' + T('Clave recordada en este navegador — conectando…','Key remembered in this browser — connecting…'));
  if (!key || !ACC){ box.style.display = 'none'; return; }
  box.style.display = '';
  const ch = ACC.chars.find(c => c.name === ACC.sel) || ACC.chars[0];
  if (!ch){ box.innerHTML = T('No hay personajes en la cuenta.','No characters on the account.'); return; }
  window.CCLN_LEVEL = ch.level;
  if (typeof window.updateMapLevel === 'function') window.updateMapLevel(ch.level);
  const karma = ACC.wallet[2] || 0, oro = ACC.wallet[1] || 0, laur = ACC.wallet[3] || 0;
  const pct = Math.min(100, ch.level / 80 * 100);

  box.innerHTML =
    `<div class="tiles">
      <div class="tile"><span class="tl">👤 ${T('Cuenta','Account')}</span><b>${ACC.name}</b>
        <p>${ACC.access.includes('PlayForFree') && ACC.access.length===1 ? '🆓 Free to Play' : '💎 ' + T('Con expansiones','Expansions owned')}</p></div>
      <div class="tile"><span class="tl">🧝 ${T('Personaje','Character')}</span>
        <select id="charSel">${ACC.chars.map(c=>`<option ${c.name===ACC.sel?'selected':''}>${c.name}</option>`).join('')}</select>
        <p>${ch.profession} · ${T('nivel','level')} ${ch.level}</p></div>
      <div class="tile"><span class="tl">💰 ${T('Cartera','Wallet')}</span>
        <b>${coins(oro)}</b><p>💜 ${karma.toLocaleString(loc())} karma · 🌿 ${laur.toLocaleString(loc())} ${T('laureles','laurels')}</p></div>
      <div class="tile wide"><span class="tl">🛤️ ${T('Camino al 80','Road to 80')}</span>
        <div class="cbar big"><div class="cfill" style="width:${pct}%"></div></div>
        <p><b>${ch.level}</b>/80 · ${fase(ch.level)}</p></div>

      <div class="tile wide"><span class="tl">🛡️ ${T('Equipo de','Gear of')} ${ch.name}</span>
        <div class="paperdoll">
          ${statsHtml()}
          <div class="dollmid">
            <div class="dollcol">${SLOTS_L.map(s=>slotHtml(s,ch)).join('')}</div>
            <div class="dollchar"><span class="dico">${PROF_ICO[ch.profession]||'🧝'}</span>
              <b>${ch.name}</b><span class="dim">${ch.profession} · nv ${ch.level}</span></div>
            <div class="dollcol">${SLOTS_R.map(s=>slotHtml(s,ch)).join('')}</div>
          </div>
          <div class="dollweap">${SLOTS_W.map(s=>slotHtml(s,ch)).join('')}</div>
        </div>
        <p class="tfoot">${T('Pasa el ratón por cada slot · ⚠ = desfasado 10+ niveles','Hover each slot · ⚠ = 10+ levels outdated')}</p></div>

      <div class="tile wide syncbar" id="syncInfo"></div>

      <div class="tile wide"><span class="tl">🏦 ${T('Almacén y bolsas — sin entrar al juego','Storage & bags — without opening the game')}</span>
        <div class="stbtns" id="storageTabs"></div>
        <div id="storageBox"></div></div>

      <div class="tile wide"><span class="tl">🧠 ${T('Consejos AHORA','Advice NOW')}</span><ul class="advice">
        <li>🗺️ ${T('Corazones que puedes hacer: hasta nivel','Hearts you can do: up to level')} <b>${Math.min(80, ch.level+1)}</b></li>
        ${consejoKarma(ch.level, karma, ch.profession)}
        <li>🐉 ${T('Próximos jefes en 🏠 · activa los avisos 🔔 arriba','Upcoming bosses in 🏠 · enable 🔔 alerts above')}</li>
      </ul>
      <button class="applyBtn" id="applyChar">🎯 ${T('Aplicar mi nivel y clase al buscador','Apply my level & class to the finder')}</button></div>
    </div>`;

  renderStgTabs();
  syncLabel();
  const sel = $$('charSel');
  if (sel) sel.addEventListener('change', e => { ACC.sel = e.target.value; ACC.eq = null; ACC.stats = null; stgOpen = null; paintAccount(); loadEquip(); });
  const ap = $$('applyChar');
  if (ap) ap.addEventListener('click', () => {
    achvUnlock('apply');
    const lvMax = $$('lvMax'), lvMin = $$('lvMin');
    if (lvMax){ lvMax.value = Math.min(80, ch.level+1); lvMax.dispatchEvent(new Event('input')); }
    if (lvMin){ lvMin.value = Math.max(1, ch.level-15); lvMin.dispatchEvent(new Event('input')); }
    const fc = $$('fClass');
    if (fc){
      const p = ch.profession.toLowerCase();
      if ([...fc.options].some(o=>o.value===p)){ fc.value = p; fc.dispatchEvent(new Event('change')); }
    }
    const tab = document.querySelector('#mainNav .tab[data-sec="compras"]');
    if (tab) tab.click();
    window.scrollTo(0,0);
  });
}

/* ---- tooltip del equipo ---- */
let tipEl = null;
function ensureTip(){
  if (tipEl) return tipEl;
  tipEl = document.createElement('div');
  tipEl.id = 'eqtip';
  document.body.appendChild(tipEl);
  return tipEl;
}
document.addEventListener('mouseover', e => {
  const s = e.target.closest('.eqslot'), c = e.target.closest('.stcell');
  const t = ensureTip();
  if (s && ACC){
    const ch = ACC.chars.find(x => x.name === ACC.sel) || ACC.chars[0];
    t.innerHTML = eqTipHtml(s.dataset.slot, ch);
  } else if (c){
    t.innerHTML = itemInfoHtml(expand(IC()[c.dataset.item]), {count: +c.dataset.count || 1});
  } else { t.style.display = 'none'; return; }
  const anchor = s || c;
  t.style.display = 'block';
  const r = anchor.getBoundingClientRect(), w = t.offsetWidth;
  t.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width/2 - w/2)) + 'px';
  t.style.top = (r.top + window.scrollY - t.offsetHeight - 10) + 'px';
});
document.addEventListener('mouseout', e => {
  if (e.target.closest && (e.target.closest('.eqslot') || e.target.closest('.stcell')) && tipEl) tipEl.style.display = 'none';
});
document.addEventListener('click', e => {
  const b = e.target.closest('.stbtn');
  if (b) loadStorage(b.dataset.stg);
  if (e.target.closest('#syncNow')) loadAccount(true);
});

/* ---- formulario ---- */
document.addEventListener('click', e => {
  if (e.target.id === 'apiKeySave' || (e.target.closest && e.target.closest('#apiKeySave'))){
    const v = $$('apiKeyInput').value.trim();
    if (v && !v.startsWith('••')){ keySet(v); ACC = null; loadAccount(); }
  }
  if (e.target.id === 'apiKeyClear' || (e.target.closest && e.target.closest('#apiKeyClear'))){
    keySet(''); ACC = null; window.CCLN_LEVEL = null;
    if ($$('apiKeyInput')) $$('apiKeyInput').value = '';
    accStatus(T('Clave borrada de este navegador.','Key removed from this browser.'));
    paintAccount();
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'notifChk'){
    if (e.target.checked){
      try { localStorage.setItem('ccln-notif','1'); } catch(err){}
      const test = () => {
        if ('Notification' in window && Notification.permission === 'granted')
          fireNotif('🔔 CCLN-GW2', T('¡Avisos activados! Sonarán 5 min antes de los jefes de tu ruta.','Alerts on! You will be pinged 5 min before your route bosses.'), 'ccln-test');
        else beep();  // al menos suena de prueba
        paintNotifState();
      };
      if ('Notification' in window && Notification.permission !== 'granted')
        Notification.requestPermission().then(test);
      else test();
    } else {
      try { localStorage.setItem('ccln-notif','0'); } catch(err){}
      paintNotifState();
    }
  }
});

window.updateLiveLang = function(){ paintBosses(); paintTP(); paintAchv(); paintNotifState(); if (ACC && ACC.eq){ loadEquip(); } paintAccount(); };

paintBosses(); loadTP(); paintAchv(); paintNotifState(); loadAccount();
})();
