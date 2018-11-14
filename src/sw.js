const networkCache = 'currency-converter-network';
const staticCache = 'currency-converter-static-v1';
const filesToCache = [
    '/',
    '/index.html',
    '/js/scripts.js',
    '/css/style.css',
    '/img/arrow.png',
    '/fonts/merriweather-v19-latin-900.eot',
    '/fonts/merriweather-v19-latin-900.svg',
    '/fonts/merriweather-v19-latin-900.ttf',
    '/fonts/merriweather-v19-latin-900.woff',
    '/fonts/merriweather-v19-latin-900.woff2',
    '/fonts/merriweather-v19-latin-regular.eot',
    '/fonts/merriweather-v19-latin-regular.svg',
    '/fonts/merriweather-v19-latin-regular.ttf',
    '/fonts/merriweather-v19-latin-regular.woff',
    '/fonts/merriweather-v19-latin-regular.woff2',
];

// Cache on install
this.addEventListener('install', event => {
    console.info('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(staticCache).then(cache => {
            console.info('[ServiceWorker] Caching static files');
            return cache.addAll(filesToCache);
        })
    );
});

// Clear cache on activate
this.addEventListener('activate', event => {
    console.info('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== staticCache && key !== networkCache) {
                    console.info('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // runs SW instantly in any existing tab previously from SW activation
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    console.info('[Service Worker] Fetch', event.request.url);

    const dataUrl = 'https://api.exchangeratesapi.io/latest?base=';
    const isApiRequest = event.request.url.indexOf(dataUrl) > -1;

    if (isApiRequest) {
      //network response first, cache if fails & update cache always
        event.respondWith(
            caches.open(networkCache).then(cache => {
                return fetch(event.request).then(networkResponse => {
                    // update cache with latest network response
                    cache.put(event.request, networkResponse.clone());

                    if (networkResponse.ok) {
                        return networkResponse;
                    } else {
                        // retrieve from cache in case server fails
                        return cache.match(event.request);
                    }
                }).catch(err => {
                    // retrieve from cache in case network request fails
                    return cache.match(event.request);
                });
            })
        );
    } else {
        //cache response first, network response if fails & update cache always
        event.respondWith(
            caches.match(event.request).then(cacheResponse => {
                return cacheResponse || fetch(event.request);
            })
        );
    }
});
