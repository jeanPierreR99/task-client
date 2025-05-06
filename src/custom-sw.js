import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/uploads/')) {
    event.respondWith(fetch(event.request))
    return
  }
})
