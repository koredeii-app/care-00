const CACHE_NAME =
  "support-app-v2";

const urlsToCache = [

  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js"

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
  キャッシュ利用
*/
self.addEventListener(
  "fetch",
  event => {

    event.respondWith(

      caches.match(event.request)
        .then(response => {

          return (
            response ||
            fetch(event.request)
          );

        })

    );

  }
);
