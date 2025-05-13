import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/uploads/')) {
    event.respondWith(fetch(event.request))
    return
  }
})

self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  const title = data.title || 'Notificación'
  const options = {
    body: data.body || 'Tienes una nueva alerta',
    icon: '/icons/icon-192x192.png',
    image: data.image || '/icons/icon-192x192.png',
    data: data.url || '/'
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data))
})
