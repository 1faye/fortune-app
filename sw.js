const CACHE='fortune-v1';
const URLS=['/fortune-app/','/fortune-app/index.html','/fortune-app/app.min.js','/fortune-app/css/style.css','/fortune-app/manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)).catch(()=>new Response('离线中',{status:503})));});
