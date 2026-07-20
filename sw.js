/* CCLN-GW2 · service worker: notificaciones a nivel de sistema (más fiables que las de pestaña) */
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'notify'){
    self.registration.showNotification(d.title || 'CCLN-GW2', {
      body: d.body || '',
      tag: d.tag || 'ccln',
      renotify: true,
      requireInteraction: true,   // se queda hasta que la cierres
      silent: false,              // sonido del sistema
      vibrate: [200, 80, 200],
      icon: d.icon,
      badge: d.icon,
      data: {url: d.url || '/'},
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
    for (const c of list){ if ('focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow(e.notification.data && e.notification.data.url || '/');
  }));
});
