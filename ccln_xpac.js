/* CCLN-GW2 · Expansiones (solo P2P): guía de entrada + preparación + mapas interactivos por zona */
(function(){
'use strict';
const isEn = () => document.body.classList.contains('lang-en');
const T = (es,en) => isEn()?en:es;

// marcadores: [nombreES, nombreEN, tipo, coordX, coordY, notaES, notaEN]
// tipo: city (cian) · res (jade, recursos) · farm (naranja, meta/oro) · story (violeta, entrada/historia)
const XPAC = [
 {k:'hot', es:'Heart of Thorns', en:'Heart of Thorns', yr:2015, col:'#7bc043',
  tag:{es:'La jungla de Maguuma · planeo y dominios',en:'The Maguuma jungle · gliding & masteries'},
  entry:{es:'Desde los Páramos de Plata (Silverwastes), entra por el oeste a Selva Esmeralda. La historia arranca sola al pisar el mapa.',
         en:'From the Silverwastes, head west into Verdant Brink. The story starts on entering the map.'},
  prep:{es:'Nivel 80. Equipo exótico (pestaña 🏔️). Aquí desbloqueas el PLANEO — es tu movilidad hasta tener monturas.',
        en:'Level 80. Exotic gear (🏔️ tab). Here you unlock GLIDING — your mobility until you get mounts.'},
  how:{es:'Sube el dominio de Planeo primero (corrientes ascendentes) y luego Hongos y Setas para moverte. Cada mapa tiene un meta-evento con recompensa a la hora en punto.',
       en:'Level Gliding mastery first (updrafts), then Mushrooms. Each map has an hourly meta-event with big rewards.'},
  maps:[
   ['Selva Esmeralda','Verdant Brink','story',35008,31744,'Entrada + meta nocturno (Night Bosses)','Entry + Night Bosses meta'],
   ['Cuenca Áurea','Auric Basin','farm',34304,33920,'META DE ORO: Octovid — cofres de pilares, gemas amalgamadas','GOLD META: Octovine — pillar chests, amalgamated gemstones'],
   ['Profundidades Enredadas','Tangled Depths','res',36992,34944,'Nodos ricos + Chak; laberíntico, usa Setas','Rich nodes + Chak; maze-like, use Mushrooms'],
   ['Antro del Dragón','Dragon’s Stand','farm',35584,37440,'Meta largo (2h) muy rentable en equipo','Long meta (2h), very rewarding gear'],
  ]},
 {k:'pof', es:'Path of Fire', en:'Path of Fire', yr:2017, col:'#f0a830',
  tag:{es:'El Desierto de Cristal · ¡MONTURAS!',en:'The Crystal Desert · MOUNTS!'},
  entry:{es:'Desde Arco del León habla con el mensajero (o usa la historia) para viajar a Oasis de Cristal. Amnoon es la ciudad hub.',
         en:'From Lion’s Arch talk to the messenger (or the story) to travel to Crystal Oasis. Amnoon is the hub city.'},
  prep:{es:'Nivel 80. Lo PRIMERO: consigue el RAPTOR (gratis nada más llegar, en la 1ª misión). Cambia el juego: velocidad y salto.',
        en:'Level 80. FIRST thing: get the RAPTOR (free right away, in the first mission). It transforms travel.'},
  how:{es:'Consigue las 5 monturas (Raptor→Springer→Skimmer→Jackal→...). Cada zona tiene puzzles de montura y forjas de corazón. Griffon: colección larga en Tierras Altas.',
       en:'Get all 5 mounts (Raptor→Springer→Skimmer→Jackal→...). Each zone has mount puzzles. Griffon: long collection in Desert Highlands.'},
  maps:[
   ['Oasis de Cristal','Crystal Oasis','city',59816,43584,'Amnoon (ciudad) + Casino Blitz; aquí pillas el Raptor','Amnoon (city) + Casino Blitz; get the Raptor here'],
   ['Tierras Altas','Desert Highlands','res',59816,41024,'Nodos + inicio de la colección del GRIFO','Nodes + start of the GRIFFON collection'],
   ['Riberas del Elón','Elon Riverlands','story',60032,46464,'Skimmer (barcaza) para cruzar aguas','Skimmer to cross water'],
   ['La Desolación','The Desolation','res',60032,50752,'Arena tóxica (necesita Skimmer/Jackal) · Serpent’s Ire','Toxic sand (Skimmer/Jackal) · Serpent’s Ire'],
   ['Dominio de Vabbi','Domain of Vabbi','farm',66048,53952,'NODOS RICOS abundantes + oro; zona rica en recursos','Abundant RICH NODES + gold; resource-rich zone'],
  ]},
 {k:'eod', es:'End of Dragons', en:'End of Dragons', yr:2022, col:'#4cc9c0',
  tag:{es:'Cantha · esquife, bot de jade y pesca',en:'Cantha · skiff, jade bot & fishing'},
  entry:{es:'Acepta la carta «Aurene te necesita» en el correo (aparece a nv 80) y viaja a Provincia de Seitung.',
         en:'Accept the "Aurene needs you" letter in your mail (appears at lv 80) and travel to Seitung Province.'},
  prep:{es:'Nivel 80. Consigues el ESQUIFE (barca) y el protocolo del BOT DE JADE (batería que mejora tus habilidades). Nueva Kaineng es la megaciudad.',
        en:'Level 80. You get the SKIFF (boat) and the JADE BOT (battery that upgrades your skills). New Kaineng is the megacity.'},
  how:{es:'Sube el bot de jade para curación/mordientes. Pesca desde el esquife. La meta de Dragon’s End (Soo-Won) es de las más rentables del juego.',
       en:'Level the jade bot for healing/gliding boosts. Fish from the skiff. The Dragon’s End meta (Soo-Won) is one of the most rewarding.'},
  maps:[
   ['Provincia de Seitung','Seitung Province','story',23079,101801,'Entrada de la expansión + bot de jade','Expansion entry + jade bot'],
   ['Nueva Kaineng','New Kaineng City','city',26920,99380,'Megaciudad: comercios, artesanos, pesca urbana','Megacity: vendors, crafters, urban fishing'],
   ['Yermo de Echovald','The Echovald Wilds','res',31105,102170,'Nodos + meta de la Corte de Jade','Nodes + Jade Court meta'],
   ['Fin del Dragón','Dragon’s End','farm',34214,103694,'META TOP DE ORO: Soo-Won (turbio pero muy rentable)','TOP GOLD META: Soo-Won (tough but very rewarding)'],
  ]},
 {k:'soto', es:'Secrets of the Obscure', en:'Secrets of the Obscure', yr:2023, col:'#c78bfa',
  tag:{es:'Cielos de Tyria · SKYSCALE desde el minuto 1',en:'The skies of Tyria · SKYSCALE from minute 1'},
  entry:{es:'Acepta la historia de SotO en el correo. Viajas al Archipiélago de Skyward; la Torre del Mago es el hub.',
         en:'Accept the SotO story in your mail. You travel to Skywatch Archipelago; the Wizard’s Tower is the hub.'},
  prep:{es:'Nivel 80. Te dan un SKYSCALE básico casi al instante (aunque no lo tuvieras). Movilidad aérea total desde el principio.',
        en:'Level 80. You get a basic SKYSCALE almost instantly (even if you never had one). Full air mobility from the start.'},
  how:{es:'Cierra GRIETAS (rifts) por Tyria con el esencia-imán para forjar equipo ascendido barato. Las metas de Skyward y Amnytas dan buen loot.',
       en:'Close RIFTS across Tyria with the essence magnet to forge cheap ascended gear. Skywatch and Amnytas metas drop well.'},
  maps:[
   ['Archipiélago de Skyward','Skywatch Archipelago','city',25446,23738,'Torre del Mago (hub) + skyscale','Wizard’s Tower (hub) + skyscale'],
   ['Amnytas','Amnytas','farm',24086,20410,'Meta + nodos; equipo ascendido por grietas','Meta + nodes; ascended gear from rifts'],
  ]},
 {k:'jw', es:'Janthir Wilds', en:'Janthir Wilds', yr:2024, col:'#2fa97c',
  tag:{es:'Las islas Janthir · HOGAR (Homestead) y warclaw',en:'The Janthir isles · HOMESTEAD & land warclaw'},
  entry:{es:'Acepta la historia de Janthir en el correo. Llegas a Costa de Tierras Bajas; desbloqueas tu HOGAR (Homestead).',
         en:'Accept the Janthir story in your mail. You arrive at Lowland Shore; you unlock your HOMESTEAD.'},
  prep:{es:'Nivel 80. El warclaw ahora sirve en mundo abierto. Tu HOGAR tiene nodos de recolección diarios GRATIS (pestaña 💰 lo usa).',
        en:'Level 80. The warclaw now works in the open world. Your HOMESTEAD has FREE daily gathering nodes (used in the 💰 tab).'},
  how:{es:'Decora y mejora tu Homestead (nodos, artesanos). Las metas de Janthir Syntri dan materiales de la expansión.',
       en:'Decorate and upgrade your Homestead (nodes, crafters). Janthir Syntri metas drop expansion materials.'},
  maps:[
   ['Costa de Tierras Bajas','Lowland Shore','story',42039,22798,'Entrada + tu HOGAR (Homestead)','Entry + your HOMESTEAD'],
   ['Janthir Syntri','Janthir Syntri','farm',39894,15618,'Meta + materiales de expansión','Meta + expansion materials'],
  ]},
];

const MTYPE = {
  city:{c:'#4cc9c0', i:'🏙️', es:'Ciudad / hub', en:'City / hub'},
  res: {c:'#2fa97c', i:'⛏️', es:'Recursos', en:'Resources'},
  farm:{c:'#ff9d1f', i:'💰', es:'Meta / oro', en:'Meta / gold'},
  story:{c:'#c78bfa', i:'📖', es:'Entrada / historia', en:'Entry / story'},
};

let map = null, layer = null, sel = 'hot';

function buildMenu(){
  const nav = document.getElementById('xpacNav');
  if (!nav) return;
  nav.innerHTML = XPAC.map(x =>
    `<button class="xpbtn ${x.k===sel?'on':''}" data-xp="${x.k}" style="--xc:${x.col}">
       <b>${x.k.toUpperCase()}</b><span>${x.yr}</span></button>`).join('');
}

function drawMarkers(x){
  if (!map) return;
  if (layer) layer.remove();
  layer = L.layerGroup().addTo(map);
  const un = c => map.unproject(c, 7);
  const pts = x.maps.map(m => un([m[3], m[4]]));
  L.polyline(pts, {color:'#0a0806', weight:7, opacity:.7, lineCap:'round'}).addTo(layer);
  L.polyline(pts, {color:x.col, weight:3.5, opacity:.9, dashArray:'2 8', lineCap:'round'}).addTo(layer);
  x.maps.forEach((m, i) => {
    const ty = MTYPE[m[2]];
    const ic = L.divIcon({className:'', iconSize:[30,30], iconAnchor:[15,15],
      html:`<div class="xpmk" style="background:${ty.c}">${i+1}</div>`});
    const mk = L.marker(un([m[3], m[4]]), {icon:ic}).addTo(layer);
    mk.bindTooltip(
      `<div class="ztitle"><b class="zn" style="background:${ty.c}">${i+1}</b>${isEn()?m[1]:m[0]}</div>` +
      `<div class="zrange">${ty.i} ${isEn()?ty.en:ty.es}</div>` +
      `<div class="zwp">${isEn()?m[6]:m[5]}</div>`, {direction:'top', offset:[0,-14], opacity:1});
  });
  map.fitBounds(L.latLngBounds(pts).pad(0.4));
}

function paintContent(){
  const x = XPAC.find(z => z.k === sel);
  const el = document.getElementById('xpacContent');
  if (!el || !x) return;
  el.innerHTML =
    `<div class="xphead" style="--xc:${x.col}">
       <h3>${isEn()?x.en:x.es} <span class="xpyr">${x.yr}</span></h3>
       <p class="xptag">${isEn()?x.tag.en:x.tag.es}</p></div>
     <div class="xpsteps">
       <div class="xpstep"><span class="xi">🚪</span><div><b>${T('Cómo entrar','How to enter')}</b><p>${isEn()?x.entry.en:x.entry.es}</p></div></div>
       <div class="xpstep"><span class="xi">🎒</span><div><b>${T('Qué preparar','What to prepare')}</b><p>${isEn()?x.prep.en:x.prep.es}</p></div></div>
       <div class="xpstep"><span class="xi">🧭</span><div><b>${T('Cómo se juega / completa','How to play / complete')}</b><p>${isEn()?x.how.en:x.how.es}</p></div></div>
     </div>
     <div class="xpmaphead">🗺️ ${T('Ruta por sus mapas — pasa el ratón por cada número','Route through its maps — hover each number')}</div>
     <div id="xpmap"></div>
     <div class="xplegend">
       <span><i style="background:${MTYPE.story.c}"></i>${T('entrada','entry')}</span>
       <span><i style="background:${MTYPE.city.c}"></i>${T('ciudad/hub','city/hub')}</span>
       <span><i style="background:${MTYPE.res.c}"></i>${T('recursos','resources')}</span>
       <span><i style="background:${MTYPE.farm.c}"></i>${T('meta/oro','meta/gold')}</span>
     </div>
     <div class="xplist">${x.maps.map((m,i)=>{
        const ty=MTYPE[m[2]];
        return `<div class="xprow"><b style="background:${ty.c}">${i+1}</b><span class="xn">${isEn()?m[1]:m[0]}</span><span class="xnote">${isEn()?m[6]:m[5]}</span></div>`;
     }).join('')}</div>`;

  if (!map){
    map = L.map('xpmap', {crs:L.CRS.Simple, minZoom:2, maxZoom:6, attributionControl:false, zoomSnap:0.5});
    L.tileLayer('https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg', {minZoom:0, maxZoom:7, noWrap:true}).addTo(map);
    const un = c => map.unproject(c, 7);
    L.rectangle(L.latLngBounds(un([0,120000]), un([120000,0])),
      {color:'#000', weight:0, fillColor:'#000', fillOpacity:.3, interactive:false}).addTo(map);
  } else {
    // mover el contenedor recién creado
    const cont = document.getElementById('xpmap');
    map.getContainer().parentNode !== cont && cont.appendChild(map.getContainer());
  }
  setTimeout(() => { map.invalidateSize(); drawMarkers(x); }, 60);
}

function open(){
  buildMenu();
  paintContent();
}
window.updateXpacLang = () => { if (document.getElementById('xpacContent')) { buildMenu(); paintContent(); } };

document.addEventListener('click', e => {
  const tab = e.target.closest('#mainNav .tab[data-sec="xpac"]');
  if (tab){ setTimeout(open, 60); return; }
  const b = e.target.closest('.xpbtn');
  if (b){ sel = b.dataset.xp; buildMenu(); paintContent(); }
});
})();
