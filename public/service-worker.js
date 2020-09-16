const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "app.js",
  "/manifest.webmanifest",
  "/styles.css"
];

const STATIC_CACHE = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key)
            return caches.delete(key)
          }
        })
      )
    })
  )
})

self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
        .then(response => {
          if (response.status === 200) {
            cache.put(event.request.url, response.clone())
          }
          return response
        })
        .catch(err => {
          return cache.match(event.request)
        })
      }).catch(err => console.log(err))
    )
    return
  }
})