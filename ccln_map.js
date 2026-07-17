/* CCLN-GW2 · mapa de ruta NUMERADO (Leaflet + tiles oficiales de ArenaNet) */
(function(){
'use strict';
const isEn = () => document.body.classList.contains('lang-en');
const T = (es, en) => isEn() ? en : es;

// centros de zona (coordenadas de continente, /v2/continents)
const ZC = {
  'Queensdale':[44416,29248], 'Kessex Hills':[44160,31488], 'Gendarran Fields':[48320,29696],
  'Harathi Hinterlands':[47808,27264], 'Bloodtide Coast':[49216,33856], 'Sparkfly Fen':[49280,37120],
  'Fireheart Rise':[58240,26240], 'Frostgorge Sound':[55040,26112], 'Plains of Ashford':[59904,30976],
  'Diessa Plateau':[58112,28800], 'Wayfarer Foothills':[55424,29952], 'Snowden Drifts':[52480,28672],
  'Metrica Province':[41024,35200], 'Caledon Forest':[43072,34496], 'Brisban Wildlands':[40384,32192],
  "Lion's Arch":[49216,31488],
};
const RANGES = {
  'Queensdale':[1,15],'Kessex Hills':[15,25],'Plains of Ashford':[1,15],'Diessa Plateau':[15,25],
  'Wayfarer Foothills':[1,15],'Snowden Drifts':[15,25],'Metrica Province':[1,15],'Caledon Forest':[1,15],
  'Brisban Wildlands':[15,25],'Gendarran Fields':[25,35],'Harathi Hinterlands':[35,45],
  'Bloodtide Coast':[45,55],'Sparkfly Fen':[55,65],'Fireheart Rise':[60,70],'Frostgorge Sound':[70,80],
  "Lion's Arch":[0,0],
};
// TP de inicio de cada zona 1 (junto a la puerta de la ciudad; el que tienes al crear esa raza)
const STARTWP = {
  'Queensdale':        {en:'Shaemoor Waypoint',   es:'P. de Ruta de Shaemoor',        city:"Divinity's Reach", race:{es:'humano',en:'human'}},
  'Plains of Ashford': {en:'Smokestead Waypoint', es:'P. de Ruta de Paraje del Humo', city:'Black Citadel',    race:{es:'charr',en:'charr'}},
  'Wayfarer Foothills':{en:'Horncall Waypoint',   es:'P. de Ruta de Cuernollamada',   city:'Hoelbrak',         race:{es:'norn',en:'norn'}},
  'Metrica Province':  {en:'Soren Draa Waypoint', es:'P. de Ruta de Soren Draa',      city:'Rata Sum',         race:{es:'asura',en:'asura'}},
  'Caledon Forest':    {en:'Astorea Waypoint',    es:'P. de Ruta de Astoria',         city:'The Grove',        race:{es:'sylvari',en:'sylvari'}},
};
// numeración de la ruta: 1-2 raciales (por rama) · LA · 3→8 comunes
const STEP = {
  'Queensdale':'1','Plains of Ashford':'1','Wayfarer Foothills':'1','Metrica Province':'1','Caledon Forest':'1',
  'Kessex Hills':'2','Diessa Plateau':'2','Snowden Drifts':'2','Brisban Wildlands':'2',
  "Lion's Arch":'LA',
  'Gendarran Fields':'3','Harathi Hinterlands':'4','Bloodtide Coast':'5',
  'Sparkfly Fen':'6','Fireheart Rise':'7','Frostgorge Sound':'8',
};
const RACIAL = [
  ['Queensdale','Kessex Hills'], ['Plains of Ashford','Diessa Plateau'],
  ['Wayfarer Foothills','Snowden Drifts'], ['Metrica Province','Brisban Wildlands'],
  ['Caledon Forest','Brisban Wildlands'],
];
const COMUN = ["Lion's Arch",'Gendarran Fields','Harathi Hinterlands','Bloodtide Coast',
               'Sparkfly Fen','Fireheart Rise','Frostgorge Sound'];

let map = null, markers = {};

function zoneState(z, lv){
  if (z === "Lion's Arch") return 'hub';
  if (lv == null) return 'todo';
  const [a,b] = RANGES[z];
  if (lv > b + 1) return 'done';
  if (lv >= a - 1) return 'now';
  return 'todo';
}
function icon(z, lv){
  const st = zoneState(z, lv);
  return L.divIcon({
    className: '',
    html: `<div class="znum z-${st}">${STEP[z]||'·'}</div>`,
    iconSize: [30,30], iconAnchor: [15,15],
  });
}
function tipHtml(z){
  const r = RANGES[z];
  let h = `<div class="ztitle">${STEP[z] ? '<b class="zn">'+STEP[z]+'</b>' : ''}${z}</div>`;
  if (r[1]) h += `<div class="zrange">nv ${r[0]}–${r[1]}</div>`;
  if (z === "Lion's Arch")
    h += `<div class="zwp">🌀 ${T('Nexo: portales asura a TODAS las capitales','Hub: asura gates to ALL capitals')}</div>`;
  const wp = STARTWP[z];
  if (wp) h += `<div class="zwp">📍 ${T('TP inicial','Starting waypoint')}: <b>${isEn()?wp.en:wp.es}</b><br>` +
    T(`junto a la puerta de ${wp.city} — lo tienes al crear un ${wp.race.es}`,
      `by the ${wp.city} gate — unlocked when you create a ${wp.race.en}`) + `</div>`;
  return h;
}
window.updateMapLevel = lv => {
  if (!map) return;
  for (const z in markers) markers[z].setIcon(icon(z, lv));
};
window.updateMapLang = () => {
  if (!map) return;
  for (const z in markers) markers[z].setTooltipContent(tipHtml(z));
  const lg = document.getElementById('maplegend');
  if (lg) lg.innerHTML = legendHtml();
};
function legendHtml(){
  return `<span class="lgk"><i class="znum z-now lgi">1</i>${T('sigue los números','follow the numbers')}</span>` +
    `<span class="lgk"><i class="lgdot" style="background:#2fa97c"></i>${T('rama racial 1→2','racial branch 1→2')}</span>` +
    `<span class="lgk"><i class="lgdot" style="background:#ff9d1f"></i>${T('ruta común LA→3→8','common route LA→3→8')}</span>` +
    `<span class="lgk">🟢 ${T('superada','done')} · 🟠 ${T('actual','current')} · ⚪ ${T('pendiente','upcoming')}</span>` +
    `<span class="lgk">${T('pasa el ratón por cada número · conecta tu API en 👤','hover each number · link your API in 👤')}</span>`;
}

function init(){
  if (map || typeof L === 'undefined') return;
  const el = document.getElementById('gwmap');
  if (!el) return;
  map = L.map('gwmap', {crs: L.CRS.Simple, minZoom: 2, maxZoom: 6, attributionControl: false, zoomSnap: 0.5});
  const un = c => map.unproject(c, 7);
  L.tileLayer('https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg', {minZoom:0, maxZoom:7, noWrap:true}).addTo(map);
  map.setMaxBounds(L.latLngBounds(un([30000,45000]), un([65000,20000])));
  // velo oscuro para que la ruta destaque sobre el mapa
  L.rectangle(L.latLngBounds(un([0,120000]), un([120000,0])),
    {color:'#000', weight:0, fillColor:'#000', fillOpacity:.34, interactive:false}).addTo(map);

  const line = names => names.map(n => un(ZC[n]));
  const casing = {color:'#0a0806', weight:8, opacity:.75, lineCap:'round'};
  // ramas raciales 1→2 (jade) con borde
  RACIAL.forEach(chain => {
    L.polyline(line(chain), casing).addTo(map);
    L.polyline(line(chain), {color:'#2fa97c', weight:4, opacity:.95, dashArray:'1 9', lineCap:'round'}).addTo(map);
  });
  // conexión de cada zona 2 al Arco del León (fina)
  ['Kessex Hills','Diessa Plateau','Snowden Drifts','Brisban Wildlands'].forEach(z => {
    L.polyline(line([z, "Lion's Arch"]), {color:'#2fa97c', weight:2, dashArray:'2 10', opacity:.55}).addTo(map);
  });
  // ruta común LA→3→8 (naranja) con borde
  L.polyline(line(COMUN), casing).addTo(map);
  L.polyline(line(COMUN), {color:'#ff9d1f', weight:4.5, opacity:.95, lineCap:'round'}).addTo(map);

  for (const z in ZC){
    const m = L.marker(un(ZC[z]), {icon: icon(z, window.CCLN_LEVEL)});
    m.bindTooltip(tipHtml(z), {direction:'top', offset:[0,-14], opacity:1});
    m.addTo(map); markers[z] = m;
  }
  map.setView(un([49500,30500]), 3.5);
  const lg = document.getElementById('maplegend');
  if (lg) lg.innerHTML = legendHtml();
}

document.addEventListener('click', e => {
  const b = e.target.closest('#mainNav .tab[data-sec="ruta"]');
  if (b) setTimeout(() => { init(); if (map) map.invalidateSize(); }, 60);
});
if (document.getElementById('sec-ruta') && document.getElementById('sec-ruta').classList.contains('on')) init();
})();
