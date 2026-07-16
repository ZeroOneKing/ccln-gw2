# CCLN-GW2 (WebIA) — despliegue en Vercel

Web publica bilingue (EN/ES, ingles por defecto) con SEO orientado a IA.
Es un sitio 100% estatico: no necesita build ni servidor.

## Subir a Vercel (2 minutos, gratis)

### Opcion A — arrastrar y soltar (lo mas facil)
1. Entra en https://vercel.com y crea cuenta (con GitHub o email).
2. Instala la CLI:  `npm i -g vercel`
3. En esta carpeta:  `vercel`  (login la primera vez) y luego `vercel --prod`.
   Vercel te da una URL publica tipo https://ccln-gw2.vercel.app

### Opcion B — desde GitHub
1. Sube esta carpeta a un repositorio de GitHub.
2. En Vercel: "Add New… > Project" > importa el repo > Deploy.
   No hay framework: deja "Other" y root "/".

## Archivos
- index.html          pagina (bilingue, hero de inicio para IAs)
- ccln.css            estilos (negro + naranja, particulas, hero)
- ccln_data.js        1.380 objetos + imagenes de zona
- ccln_app.js         buscador (filtros, veredictos)
- ccln_res.js         directorio de 75 recursos (bilingue)
- ccln_money.js       cambio oro-gemas en vivo (API oficial)
- ccln_mode.js        conmutador F2P / P2P
- ccln_lang.js        conmutador de idioma EN/ES
- ccln_bg.js          fondo de particulas
- llms.txt            resumen para IAs / LLMs (AI-SEO)
- robots.txt          permite crawlers de IA + sitemap
- sitemap.xml         mapa del sitio
- vercel.json         configuracion de Vercel

## Nota de privacidad
Al ser publica, cualquiera con el enlace la usa desde el navegador. El codigo
del front (HTML/CSS/JS) siempre es visible para quien abra la pagina: es asi en
TODA web. Los archivos de tu PC NO se comparten — solo esta copia subida a Vercel.
