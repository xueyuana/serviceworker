const precache = 'my-cache'
const runtime = 'runtime'

const baseurl = '/com.systoon.album/src/'
const cacheFiles = [
  baseurl + 'index.html',
  baseurl + 'single.html',
  baseurl + 'tpl/landingPage.html',
  baseurl + 'tpl/listC.html',
  baseurl + 'tpl/listG.html',
  baseurl + 'tpl/release.html',
  baseurl + 'tpl/viewImage.html',

  baseurl + 'scss/common.css',
  baseurl + 'scss/Iscroll.css',
  baseurl + 'scss/LandingPage.css',
  baseurl + 'scss/list.css',
  baseurl + 'scss/listC.css',
  baseurl + 'scss/listG.css',
  baseurl + 'scss/release.css',
  baseurl + 'scss/swiper.css',
  baseurl + 'scss/viewImage.css',

  baseurl + 'js/main.js',
  baseurl + 'js/common/analytics.js',
  baseurl + 'js/common/config.js',
  baseurl + 'js/common/fn_waterFlow.js',
  baseurl + 'js/common/iscrollpage.js',
  baseurl + 'js/common/router.js',
  baseurl + 'js/module/listC.js',
  baseurl + 'js/module/listC_bak.js',
  baseurl + 'js/module/listG.js',
  baseurl + 'js/module/listG_bak.js',
  baseurl + 'js/module/release.js',
  baseurl + 'js/module/release_bak.js',
  baseurl + 'js/module/viewImage.js',

  baseurl + 'img/loading.jpg',
  baseurl + 'img/pull-icon@2x.png',
  baseurl + 'img/releaseIcon3.png',
  baseurl + 'img/success.png',
  baseurl + 'img/uploadImg2.png'
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

  // if (event.request.url.startsWith(self.location.origin)) {
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

});

