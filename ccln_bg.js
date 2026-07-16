/* CCLN-GW2 · fondo de partículas conectadas (naranja sobre negro) */
(function(){
  const c = document.getElementById('bg');
  if (!c) return;
  const x = c.getContext('2d');
  let W, H, mx = -1e4, my = -1e4;
  const vw = () => document.documentElement.clientWidth || innerWidth || 1280;
  const vh = () => document.documentElement.clientHeight || innerHeight || 720;
  const N = Math.min(90, Math.max(40, Math.floor(vw() / 16)));
  const P = [];
  function rs(){ W = c.width = vw(); H = c.height = vh(); }
  addEventListener('resize', rs); rs();
  for (let i = 0; i < N; i++)
    P.push({x: Math.random()*W, y: Math.random()*H,
            vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35});
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  addEventListener('mouseleave', () => { mx = my = -1e4; });
  const LINK = 110, MLINK = 170;
  function step(){
    x.clearRect(0, 0, W, H);
    for (const p of P){
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    for (let i = 0; i < P.length; i++){
      const a = P[i];
      x.fillStyle = 'rgba(255,157,31,.75)';
      x.beginPath(); x.arc(a.x, a.y, 1.6, 0, 7); x.fill();
      for (let j = i + 1; j < P.length; j++){
        const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx*dx + dy*dy;
        if (d2 < LINK*LINK){
          x.strokeStyle = `rgba(255,157,31,${.30*(1 - Math.sqrt(d2)/LINK)})`;
          x.lineWidth = 1;
          x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
        }
      }
      const dx = a.x - mx, dy = a.y - my, d2 = dx*dx + dy*dy;
      if (d2 < MLINK*MLINK){
        x.strokeStyle = `rgba(255,196,107,${.45*(1 - Math.sqrt(d2)/MLINK)})`;
        x.lineWidth = 1;
        x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(mx, my); x.stroke();
      }
    }
    requestAnimationFrame(step);
  }
  step();
})();
