/* CCLN-GW2 · mapa interactivo de la ruta (Leaflet + tiles oficiales de ArenaNet) */
(function(){
'use strict';
const isEn = () => document.body.classList.contains('lang-en');
const T = (es, en) => isEn() ? en : es;

// centros de zona en coordenadas de continente (extraídos de /v2/continents)
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
  if (lv == null) return 'idle';
  const [a,b] = RANGES[z];
  if (lv > b + 1) return 'done';
  if (lv >= a - 1) return 'now';
  return 'todo';
}
const COLORS = {done:'#2fa97c', now:'#ff9d1f', todo:'#6b6257', idle:'#c78bfa', hub:'#ffc46b'};

function paintMarkers(lv){
  for (const z in markers){
    const st = zoneState(z, lv);
    markers[z].setStyle({color:COLORS[st], fillColor:COLORS[st]});
  }
}
window.updateMapLevel = lv => { if (map) paintMarkers(lv); };
window.updateMapLang = () => {
  const lg = document.getElementById('maplegend');
  if (lg) lg.innerHTML = legendHtml();
};

function legendHtml(){
  return `<i style="background:${COLORS.now}"></i>${T('zona actual','current zone')}
    <i style="background:${COLORS.done}"></i>${T('superada','done')}
    <i style="background:${COLORS.todo}"></i>${T('pendiente','upcoming')}
    <i style="background:${COLORS.hub}"></i>Lion's Arch ·
    ${T('conecta tu API en 👤 para ver tu progreso','link your API in 👤 to see your progress')}`;
}

function init(){
  if (map || typeof L === 'undefined') return;
  const el = document.getElementById('gwmap');
  if (!el) return;
  map = L.map('gwmap', {crs: L.CRS.Simple, minZoom: 2, maxZoom: 6, attributionControl: false, zoomSnap: 0.5});
  const un = (c) => map.unproject(c, 7);
  L.tileLayer('https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg', {minZoom:0, maxZoom:7, noWrap:true}).addTo(map);
  map.setMaxBounds(L.latLngBounds(un([30000,45000]), un([65000,20000])));

  const line = names => names.map(n => un(ZC[n]));
  RACIAL.forEach(chain => L.polyline(line(chain), {color:'#2fa97c', weight:3, dashArray:'6 7', opacity:.85}).addTo(map));
  // conexión de cada zona 2 racial a Lion's Arch
  ['Kessex Hills','Diessa Plateau','Snowden Drifts','Brisban Wildlands'].forEach(z =>
    L.polyline(line([z, "Lion's Arch"]), {color:'#2fa97c', weight:2, dashArray:'2 8', opacity:.5}).addTo(map));
  L.polyline(line(COMUN), {color:'#ff9d1f', weight:4, opacity:.9}).addTo(map);

  for (const z in ZC){
    const st = zoneState(z, window.CCLN_LEVEL);
    const r = RANGES[z];
    const m = L.circleMarker(un(ZC[z]), {radius: z==="Lion's Arch"?7:9, color:COLORS[st], fillColor:COLORS[st], fillOpacity:.55, weight:2});
    m.bindTooltip(`<b>${z}</b>${r[1] ? ' · nv '+r[0]+'-'+r[1] : ''}`, {direction:'top'});
    m.addTo(map); markers[z] = m;
  }
  map.setView(un([49500,30500]), 3.5);
  const lg = document.getElementById('maplegend');
  if (lg) lg.innerHTML = legendHtml();
}

// init perezoso al abrir la pestaña Ruta (y por si ya está abierta)
document.addEventListener('click', e => {
  const b = e.target.closest('#mainNav .tab[data-sec="ruta"]');
  if (b) setTimeout(() => { init(); if (map) map.invalidateSize(); }, 60);
});
if (document.getElementById('sec-ruta') && document.getElementById('sec-ruta').classList.contains('on')) init();
})();
