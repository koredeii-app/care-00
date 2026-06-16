const CACHE_NAME =
  "support-app-v7";

const urlsToCache = [

  "./",
  "./index.html",
  "./style.css",
  "./app.js"

];

/*
  インストール
*/
self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches.open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            urlsToCache
          );

        })

    );

    self.skipWaiting();

  }
);

/*
  古いキャッシュ削除・即時制御取得
*/
self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches.keys().then(keys =>

        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )

      )

    );

    self.clients.claim();

  }
);

/*
  ネットワーク優先・オフライン時はキャッシュを使用
*/
self.addEventListener(
  "fetch",
  event => {

    event.respondWith(

      fetch(event.request)
        .then(response => {

          const clone =
            response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(
                event.request,
                clone
              );
            });

          return response;

        })
        .catch(() => {

          return caches.match(
            event.request
          );

        })

    );

  }
);
