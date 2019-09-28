var cacheName = 'makerbuild-ide';
var filesToCache = [
  './',
  './index.html',
  './makerbuild.js',
  './ide.html',
  './template_generic.html',
  './template_index.html',
  './bundle.js',
  './favicon.ico',
  './readme.html',
  './logo.png',
  './ace/src/ace.js',
  'https://unpkg.com/axios/dist/axios.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css'
];
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});