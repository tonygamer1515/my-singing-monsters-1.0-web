const CACHE='msm-1.0-port-v6-layout-depth-parts';
const CORE=['./?build=6','index.html?build=6','styles.css?build=6','game.js?build=6','manifest.webmanifest','assets/images/app-icon.png','assets/data/sprites.json','assets/data/island-tiles.json'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin||event.request.url.endsWith('.ipa'))return;
 const url=new URL(event.request.url),fresh=event.request.mode==='navigate'||url.searchParams.has('build');
 const save=response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response};
 if(fresh)event.respondWith(fetch(event.request).then(save).catch(()=>caches.match(event.request)));
 else event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(save)));
});
