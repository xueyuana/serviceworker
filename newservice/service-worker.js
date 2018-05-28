const precache = 'my-cache'
const runtime = 'runtime'

const cacheFiles = [
  '/newservice/index.html',
  // '/demo.js',
  '/newservice/style.css'
]

self.addEventListener('install', (event) => {
  //在waituntil事件完成前不会下载完成
  event.waitUntil (
    //创建新的Cache缓存名字为my-cache
    caches.open(precache)
      .then ((cache) => {
      //检索URL将请求的response对象添加给cache对象
       cache.addAll(cacheFiles)
    }).then (self.skipWaiting())
  )
})

//删除旧缓存
self.addEventListener('activate', event => {
  const currentCaches = [precache, runtime];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    })
      .then( cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});
//任何被service worker 监控到的资源被请求到时，都会触发fetch事件，
// 这些资源包括制定的scope内的文档 和文档内其他引用的任何资源
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  // if (event.request.url.startsWith(self.location.origin)) {
    //截取http相应
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(runtime).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  // }
});

