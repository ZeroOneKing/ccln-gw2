/* CCLN-GW2 · logica del buscador y secciones */


/* ---------- static maps ---------- */
const WT_ALL = ['Greatsword','Sword','Axe','Dagger','Mace','Hammer','Staff','Scepter','Focus',
  'Torch','Pistol','Warhorn','Shield','Rifle','Short bow','Longbow','Harpoon gun','Spear','Trident'];
const USABLE = {
  guardian:['Sword','Mace','Scepter','Greatsword','Hammer','Staff','Focus','Shield','Torch','Spear','Trident'],
  warrior:['Sword','Axe','Mace','Greatsword','Hammer','Longbow','Rifle','Shield','Warhorn','Harpoon gun','Spear'],
  engineer:['Pistol','Rifle','Shield','Harpoon gun'],
  ranger:['Sword','Axe','Greatsword','Longbow','Short bow','Dagger','Torch','Warhorn','Harpoon gun','Spear'],
  thief:['Sword','Dagger','Pistol','Short bow','Harpoon gun','Spear'],
  elementalist:['Dagger','Scepter','Staff','Focus','Trident'],
  necromancer:['Axe','Dagger','Scepter','Staff','Focus','Warhorn','Spear','Trident'],
  mesmer:['Sword','Scepter','Greatsword','Staff','Focus','Pistol','Torch','Trident','Spear'],
  revenant:['Sword','Mace','Axe','Hammer','Staff','Shield','Spear'],
};
const RACES = ['humano','charr','norn','asura','sylvari'];
const ZONES = [
  ['Queensdale','1-15'],['Kessex Hills','15-25'],['Plains of Ashford','1-15'],['Diessa Plateau','15-25'],
  ['Wayfarer Foothills','1-15'],['Snowden Drifts','15-25'],['Metrica Province','1-15'],
  ['Caledon Forest','1-15'],['Brisban Wildlands','15-25'],['Gendarran Fields','25-35'],
  ['Harathi Hinterlands','35-45'],['Bloodtide Coast','45-55'],['Sparkfly Fen','55-65'],
  ['Fireheart Rise','60-70'],['Frostgorge Sound','70-80']];
const ZONE_ES = {}; DATA.forEach(d => ZONE_ES[d.zEn] = d.zEs);
const RACE_ZONES = {
  humano:['Queensdale','Kessex Hills'], charr:['Plains of Ashford','Diessa Plateau'],
  norn:['Wayfarer Foothills','Snowden Drifts'], asura:['Metrica Province','Brisban Wildlands'],
  sylvari:['Caledon Forest','Brisban Wildlands']};
const COMMON = ['Gendarran Fields','Harathi Hinterlands','Bloodtide Coast','Sparkfly Fen','Fireheart Rise','Frostgorge Sound'];

const I = {
  es: {
    title:'Compras con karma · corazones', race:'Raza', zone:'Zona', cls:'Clase', lvl:'Nivel',
    cat:'Categoría', pow:'Estadísticas', wt:'Tipo de arma', items:'ítems', best:'Calidad', bestOpt:'Solo los mejores (⚔)',
    all:'Todas', allM:'Todos', allZones:'Todas las zonas', allCls:'Todas las clases',
    common:'Ruta común', racial:'Zonas raciales',
    races:{humano:'Humano',charr:'Charr',norn:'Norn',asura:'Asura',sylvari:'Sylvari'},
    classes:{guardian:'Guardián',warrior:'Guerrero',engineer:'Ingeniero',ranger:'Guardabosques',
      thief:'Ladrón',elementalist:'Elementalista',necromancer:'Nigromante',mesmer:'Hipnotizador (Mesmer)',revenant:'Retornado'},
    cats:{Arma:'Armas',Trinket:'Abalorios (trinkets)',Armadura:'Armadura'},
    powOpts:{all:'Todos los mejores',pow:'Con Potencia',powOnly:'Solo Potencia pura'},
    wts:{'Greatsword':'Mandoble','Sword':'Espada','Axe':'Hacha','Dagger':'Daga','Mace':'Maza',
      'Hammer':'Martillo','Staff':'Báculo','Scepter':'Cetro','Focus':'Foco','Torch':'Antorcha',
      'Pistol':'Pistola','Warhorn':'Cuerno de guerra','Shield':'Escudo','Rifle':'Rifle',
      'Short bow':'Arco corto','Longbow':'Arco largo','Harpoon gun':'Fusil arpón',
      'Spear':'Lanza (acuática)','Trident':'Tridente'},
    attrs:{Power:'Potencia',Precision:'Precisión',Toughness:'Dureza',Vitality:'Vitalidad',
      CritDamage:'Ferocidad',ConditionDamage:'Daño de condición',Healing:'Poder de curación',
      BoonDuration:'Concentración'},
    rar:{Basic:'Básico',Fine:'Fino',Masterwork:'Obra maestra',Rare:'Raro',Exotic:'Exótico'},
    verd:{'COMPRAR':'COMPRAR','COMPRAR★':'COMPRAR ★','ESPERAR':'ESPERAR','OPCIONAL':'OPCIONAL','SALTAR':'SALTAR','—':'—'},
    lvIt:'nv', heart:'corazón', karma:'karma',
    note1:'Regla: puedes hacer corazones hasta tu nivel+1. Si el siguiente regalo equivalente por subir de nivel (o de la historia personal) está a 3+ niveles → COMPRAR; si llega en 1-2 niveles → ESPERAR. Puntuación ⚔ = daño base del arma (la defensa de la armadura cuenta como daño) + puntos de Potencia: un ítem sin Potencia solo gana si su stat base supera esa suma.',
    note2:'La historia personal también regala equipo cada ~10 niveles: úsala como extra. Corazones nv 78-80 → SALTAR: a nivel 80 el exótico llega enseguida (mazmorras, templos de Orr con karma, bazar).',
    note3:'Por defecto solo ves los MEJORES: los superados por otro del mismo tipo en su zona (nivel ≤ y ⚔ ≥) se ocultan; desmarca «Solo los mejores» para verlos todos (salen atenuados). Datos: wiki.guildwars2.com + API oficial (nombres es-ES exactos). Etiquetas M/N = veredicto Mesmer / Nigromante; pasa el ratón para ver el motivo.',
  },
  en: {
    title:'Karma shopping · hearts', race:'Race', zone:'Zone', cls:'Class', lvl:'Level',
    cat:'Category', pow:'Stats', wt:'Weapon type', items:'items', best:'Quality', bestOpt:'Best only (⚔)',
    all:'All', allM:'All', allZones:'All zones', allCls:'All classes',
    common:'Common route', racial:'Racial zones',
    races:{humano:'Human',charr:'Charr',norn:'Norn',asura:'Asura',sylvari:'Sylvari'},
    classes:{guardian:'Guardian',warrior:'Warrior',engineer:'Engineer',ranger:'Ranger',
      thief:'Thief',elementalist:'Elementalist',necromancer:'Necromancer',mesmer:'Mesmer',revenant:'Revenant'},
    cats:{Arma:'Weapons',Trinket:'Trinkets',Armadura:'Armor'},
    powOpts:{all:'All best items',pow:'With Power',powOnly:'Power only'},
    wts:{'Greatsword':'Greatsword','Sword':'Sword','Axe':'Axe','Dagger':'Dagger','Mace':'Mace',
      'Hammer':'Hammer','Staff':'Staff','Scepter':'Scepter','Focus':'Focus','Torch':'Torch',
      'Pistol':'Pistol','Warhorn':'Warhorn','Shield':'Shield','Rifle':'Rifle',
      'Short bow':'Short bow','Longbow':'Longbow','Harpoon gun':'Harpoon gun',
      'Spear':'Spear (aquatic)','Trident':'Trident'},
    attrs:{Power:'Power',Precision:'Precision',Toughness:'Toughness',Vitality:'Vitality',
      CritDamage:'Ferocity',ConditionDamage:'Condition Damage',Healing:'Healing Power',
      BoonDuration:'Concentration'},
    rar:{Basic:'Basic',Fine:'Fine',Masterwork:'Masterwork',Rare:'Rare',Exotic:'Exotic'},
    verd:{'COMPRAR':'BUY','COMPRAR★':'BUY ★','ESPERAR':'WAIT','OPCIONAL':'OPTIONAL','SALTAR':'SKIP','—':'—'},
    lvIt:'lv', heart:'heart', karma:'karma',
    note1:'Rule: you can do hearts up to your level+1. If the next equivalent level-up (or personal story) reward is 3+ levels away → BUY; within 1-2 levels → WAIT. Score ⚔ = weapon base damage (armor defense counts as damage) + Power points: an item without Power only wins if its base stat beats that sum.',
    note2:'The personal story also rewards gear every ~10 levels: treat it as a bonus. Hearts lv 78-80 → SKIP: at level 80 exotics come fast (dungeons, Orr temples with karma, Trading Post).',
    note3:'By default only the BEST items show: anything beaten by a same-type item in its zone (level ≤ and ⚔ ≥) is hidden; untick “Best only” to see everything (dimmed). Data: wiki.guildwars2.com + official API (exact names). M/N tags = Mesmer / Necromancer verdict; hover for the reason.',
  }
};

/* ---------- state ---------- */
const S = { lang:'es', race:'', zone:'', cls:'', lvMin:1, lvMax:80,
  cats:{Arma:true,Trinket:true,Armadura:true}, pow:'all', wt:new Set(), best:true };

const $ = id => document.getElementById(id);
const T = () => I[S.lang];

/* ---------- filters UI ---------- */
function fillSelect(sel, opts, val){
  sel.innerHTML = '';
  for (const [v, label] of opts){
    const o = document.createElement('option');
    o.value = v; o.textContent = label;
    sel.appendChild(o);
  }
  sel.value = val;
}
function zoneName(zEn){ return S.lang==='es' ? (ZONE_ES[zEn]||zEn) : zEn; }

function rebuildTop(){
  const t = T();
  $('tRace').textContent = t.race; $('tZone').textContent = t.zone;
  $('tClass').textContent = t.cls; $('tLvl').textContent = t.lvl;
  fillSelect($('fRace'), [['',t.all]].concat(RACES.map(r=>[r,t.races[r]])), S.race);
  const zs = S.race ? RACE_ZONES[S.race].concat(COMMON) : ZONES.map(z=>z[0]);
  const zOpts = [['',t.allZones]].concat(zs.map(z=>{
    const rng = ZONES.find(x=>x[0]===z)[1];
    return [z, `${zoneName(z)} (${rng})`];
  }));
  if (S.zone && !zs.includes(S.zone)) S.zone = '';
  fillSelect($('fZone'), zOpts, S.zone);
  fillSelect($('fClass'), [['',t.allCls]].concat(Object.keys(USABLE).map(c=>[c,t.classes[c]])), S.cls);
  $('lvlVal').textContent = `${S.lvMin} – ${S.lvMax}`;
  const fill = $('fillBar');
  fill.style.left = ((S.lvMin-1)/79*100)+'%';
  fill.style.width = ((S.lvMax-S.lvMin)/79*100)+'%';
}

function rebuildSide(counts){
  const t = T();
  $('tCat').textContent = t.cat; $('tPow').textContent = t.pow; $('tWt').textContent = t.wt;
  $('tBest').textContent = t.best;
  $('bestList').innerHTML = `<label class="opt"><input type="checkbox" id="bestChk" ${S.best?'checked':''}>${t.bestOpt}</label>`;
  const cl = $('catList'); cl.innerHTML = '';
  for (const c of ['Arma','Trinket','Armadura']){
    cl.insertAdjacentHTML('beforeend',
      `<label class="opt"><input type="checkbox" data-cat="${c}" ${S.cats[c]?'checked':''}>${t.cats[c]}<span class="n">${counts.cat[c]||0}</span></label>`);
  }
  const pl = $('powList'); pl.innerHTML = '';
  for (const p of ['all','pow','powOnly']){
    pl.insertAdjacentHTML('beforeend',
      `<label class="opt"><input type="radio" name="pow" value="${p}" ${S.pow===p?'checked':''}>${t.powOpts[p]}</label>`);
  }
  const types = S.cls ? WT_ALL.filter(w=>USABLE[S.cls].includes(w)) : WT_ALL;
  for (const w of [...S.wt]) if (!types.includes(w)) S.wt.delete(w);
  const wl = $('wtList'); wl.innerHTML = '';
  for (const w of types){
    wl.insertAdjacentHTML('beforeend',
      `<label class="opt"><input type="checkbox" data-wt="${w}" ${S.wt.has(w)?'checked':''}>${t.wts[w]}<span class="n">${counts.wt[w]||0}</span></label>`);
  }
}

/* ---------- filtering ---------- */
function passBase(d){
  if (S.best && !d.top) return false;
  if (S.race && !d.races.includes(S.race) && !d.races.includes('comun')) return false;
  if (S.zone && d.zEn !== S.zone) return false;
  if (d.lv < S.lvMin || d.lv > S.lvMax) return false;
  if (S.cls && d.cat==='Arma' && !USABLE[S.cls].includes(d.wt)) return false;
  if (S.pow==='pow' && !d.pow) return false;
  if (S.pow==='powOnly' && !d.powOnly) return false;
  return true;
}
function passAll(d){
  if (!passBase(d)) return false;
  if (!S.cats[d.cat]) return false;
  if (d.cat==='Arma' && S.wt.size && !S.wt.has(d.wt)) return false;
  return true;
}

/* ---------- render ---------- */
const badgeCls = v => v.startsWith('COMPRAR') ? 'b-buy' : v==='ESPERAR' ? 'b-wait'
  : v==='OPCIONAL' ? 'b-opt' : v==='SALTAR' ? 'b-skip' : 'b-na';

const ARMOR_ES = {gloves:'Guantes',boots:'Botas',chest:'Pecho',leggings:'Perneras',
  headgear:'Casco',shoulders:'Hombros','aquatic headgear':'Respirador'};
function armorLabel(wt, lang){
  const m = wt.toLowerCase().match(/^(light|medium|heavy)\s+(aquatic headgear|.+)$/);
  if (!m) return wt;
  if (lang==='en') return wt;
  const peso = {light:'ligera',medium:'media',heavy:'pesada'}[m[1]];
  return `${ARMOR_ES[m[2]]||m[2]} (${peso})`;
}

function badgeHtml(d){
  const t = T();
  const mk = (v, tag) => `<span class="badge ${badgeCls(v)}" title="${(d.mot||'').replace(/"/g,'&quot;')}">${tag?tag+' ':''}${t.verd[v]||v}</span>`;
  if (d.cat!=='Arma') return mk(d.vM,'');
  if (S.cls==='mesmer') return mk(d.vM,'');
  if (S.cls==='necromancer') return mk(d.vN,'');
  if (d.vM===d.vN) return mk(d.vM,'');
  return mk(d.vM,'M') + mk(d.vN,'N');
}

function render(){
  rebuildTop();
  // counts for sidebar (ignoring that facet's own selection)
  const counts = {cat:{}, wt:{}};
  for (const d of DATA){
    if (!passBase(d)) continue;
    if (d.cat!=='Arma' || !S.wt.size || S.wt.has(d.wt)) counts.cat[d.cat]=(counts.cat[d.cat]||0)+1;
    if (d.cat==='Arma' && S.cats['Arma']) counts.wt[d.wt]=(counts.wt[d.wt]||0)+1;
  }
  rebuildSide(counts);

  const t = T();
  const rows = DATA.filter(passAll);
  $('count').textContent = `${rows.length} ${t.items}`;
  const list = $('list');
  const frag = document.createDocumentFragment();
  for (const d of rows){
    const name = S.lang==='es' ? d.nEs : d.nEn;
    const heart = S.lang==='es' ? d.hEs : d.hEn;
    const typeLabel = d.cat==='Arma' ? t.wts[d.wt]
      : d.cat==='Trinket' ? (S.lang==='es' ? {Accessory:'Accesorio',Ring:'Anillo',Amulet:'Amuleto'}[d.wt]||d.wt : d.wt)
      : armorLabel(d.wt, S.lang);
    const stats = (d.av&&d.av.length?d.av:d.attrs.map(a=>[a,null])).map(([a,v])=>`${t.attrs[a]||a}${v?' +'+v:''}`).join(' · ');
    const card = document.createElement('div');
    card.className = (d.top ? 'card' : 'card dom') + ' rb-' + d.rar;
    card.innerHTML =
      `<div class="lvbig"><b>${d.lv}</b>${t.lvIt}</div>` +
      (d.icon ? `<img src="${d.icon}" loading="lazy" alt="">` : '') +
      `<div class="mid">
        <div class="iname r-${d.rar}">${name}</div>
        <div class="chips"><span class="chip">${typeLabel}</span>` +
        (d.score>0?`<span class="chip dmg">&#9876; ${d.score}</span>`:'') +
        (d.karma!=null?`<span class="chip karma">${d.karma.toLocaleString(S.lang==='es'?'es-ES':'en-US')} ${t.karma}</span>`:'') +
        `<span class="chip">${t.rar[d.rar]||d.rar}</span></div>
        <div class="hrt"><span class="h">&#10084;</span> ${heart}</div>
        <div class="loc">${zoneName(d.zEn)} · ${d.npc}</div>` +
        (stats?`<div class="stats">${stats}</div>`:'') +
      `</div><div class="badges">${badgeHtml(d)}</div>`;
    frag.appendChild(card);
  }
  list.innerHTML = '';
  if (!rows.length) list.innerHTML = `<div class="empty">∅</div>`;
  else list.appendChild(frag);
}

/* ---------- events ---------- */
$('fRace').addEventListener('change', e=>{ S.race = e.target.value; render(); });
$('fZone').addEventListener('change', e=>{ S.zone = e.target.value; render(); });
$('fClass').addEventListener('change', e=>{ S.cls = e.target.value; render(); });
$('lvMin').addEventListener('input', e=>{
  S.lvMin = Math.min(+e.target.value, S.lvMax); e.target.value = S.lvMin; render(); });
$('lvMax').addEventListener('input', e=>{
  S.lvMax = Math.max(+e.target.value, S.lvMin); e.target.value = S.lvMax; render(); });
document.getElementById('catList').addEventListener('change', e=>{
  if (e.target.dataset.cat){ S.cats[e.target.dataset.cat] = e.target.checked; render(); }});
document.getElementById('bestList').addEventListener('change', e=>{
  if (e.target.id==='bestChk'){ S.best = e.target.checked; render(); }});
document.getElementById('powList').addEventListener('change', e=>{
  if (e.target.name==='pow'){ S.pow = e.target.value; render(); }});
document.getElementById('wtList').addEventListener('change', e=>{
  const w = e.target.dataset.wt;
  if (w){ e.target.checked ? S.wt.add(w) : S.wt.delete(w); render(); }});

render();

/* ---------- pestañas ---------- */
document.getElementById('mainNav').addEventListener('click', e=>{
  const b = e.target.closest('.tab'); if (!b) return;
  document.querySelectorAll('#mainNav .tab').forEach(x=>x.classList.toggle('on', x===b));
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('on'));
  document.getElementById('sec-'+b.dataset.sec).classList.add('on');
  $('count').style.visibility = b.dataset.sec==='compras' ? 'visible' : 'hidden';
});

/* ---------- regalos por nivel ---------- */
const REWARDS = [
 [6,[["M","Mandoble O Antorcha (a elegir)","Precise Iron Greatsword / Precise Soft Wood Torch"],["N","Báculo O Foco (a elegir)","Precise Soft Wood Staff / Focus"]]],
 [8,[["MN","Tridente + Aquarespirador","Vital Black Earth Trident · Cloth Aquabreather"]]],
 [14,[["MN","Accesorio","Mighty Apprentice Band"]]],
 [15,[["MN","Báculo (elige stats)","Mighty Soft Wood Staff"]]],
 [17,[["MN","Hombreras ligeras (elige stats)","Magician Mantle of the Lich"]]],
 [20,[["T","Anillo","Iron Ring"]]],
 [23,[["MN","Lanza acuática (elige stats)","Iron Spear"]]],
 [24,[["T","Amuleto (elige stats)","Carrion / Hardy / Mighty Amulet"]]],
 [27,[["M","Espada (elige stats)","Honed Iron Sword"],["N","Hacha (elige stats)","Honed Iron Axe"]]],
 [31,[["M","Espada (elige stats)","Strong Iron Sword"],["N","Hacha (elige stats)","Strong Iron Axe"]]],
 [37,[["MN","Abrigo ligero (elige stats)","Magician Coat of Melandru"]]],
 [39,[["MN","Guantes ligeros (elige stats)","Cabalist Gloves"]]],
 [42,[["MN","Aquarespirador (elige stats)","Black Earth Aquabreather"]]],
 [46,[["T","Amuleto (elige stats)","Penetrating / Virulent / Powerful Amulet"]]],
 [47,[["T","Anillo (elige stats)","Penetrating / Powerful / Virulent Ring"]]],
 [49,[["T","Talismán (accesorio)","Talisman of Potency"],["M","Espada (elige stats)","Honed Iron Sword"],["N","Foco (elige stats)","Honed Soft Wood Focus"]]],
 [51,[["MN","Botas O Guantes ligeros","Strong Cabalist"]]],
 [55,[["MN","Manto O Máscara ligera","Honed Conjurer"]]],
 [59,[["MN","Guantes O Botas ligeros","Ravaging Cabalist"]]],
 [63,[["M","Espada","Rampager's Iron Sword"],["N","Hacha","Rampager's Iron Axe"]]],
 [65,[["MN","Guantes / Máscara / Pantalones (elige 1)","Shaman's Seer"]]],
 [72,[["MN","Guantes / Máscara / Pantalones (elige 1)","Carrion Seer"]]],
 [75,[["MN","Botas / Abrigo / Manto (elige 1)","Dire Seer"]]],
];
const WHO = {M:'Mesmer', N:'Nigromante', MN:'Mesmer y Nigro', T:'Todas las clases'};
(function(){
  const el = document.getElementById('rwList');
  let h = '';
  for (const [lv, gifts] of REWARDS){
    const lines = gifts.map(([w, q, en]) =>
      `<div><span class="who${w==='T'?' t':''}">${WHO[w]}</span><span class="qué">${q}</span></div><div class="en">${en}</div>`).join('');
    h += `<div class="rw"><div class="lvbig"><b>${lv}</b>nv</div><div class="rwmid">${lines}</div></div>`;
  }
  el.innerHTML = h;
})();

/* ---------- ruta ---------- */
(function(){
  const hearts = {};
  for (const d of DATA){
    if (!hearts[d.zEn]) hearts[d.zEn] = new Set();
    hearts[d.zEn].add(d.hEn);
  }
  const zcard = z => {
    const rng = ZONES.find(x=>x[0]===z)[1];
    const n = hearts[z] ? hearts[z].size : 0;
    const im = (typeof ZIMG!=='undefined' && ZIMG[z]) ? `<img src="${ZIMG[z]}" alt="">` : '';
    return `<div class="zone">${im}<div class="zi"><b>${ZONE_ES[z]||z}</b><span>nv ${rng} · ❤ ${n}</span></div></div>`;
  };
  const RN = {humano:'Humano', charr:'Charr', norn:'Norn', asura:'Asura', sylvari:'Sylvari'};
  let h = '';
  for (const r of RACES){
    h += `<div class="flow"><div class="zone race"><div class="zi"><b>${RN[r]}</b><span>raza</span></div></div>` +
         RACE_ZONES[r].map(zcard).join('<span class="arrow">→</span>') + '</div>';
  }
  document.getElementById('routeRaces').innerHTML = h;
  document.getElementById('routeCommon').innerHTML =
    COMMON.map(zcard).join('<span class="arrow">→</span>');
})();
