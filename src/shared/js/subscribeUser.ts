import { API } from "./api";

const PUBLIC_VAPID_KEY = 'BFnkI-bc7pnSW_LdKf2LcAWML9B56L6Y-uHW5cYJMVDX_1JOZaBg5wP5QSPM4b0O9mnZ55M8PmHuUWObRPr75d4';

async function subscribeUser() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;

      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Ya estás suscrito:', existingSubscription);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      const response = await API.subscribeNotification(subscription);
      console.log('Suscripción enviada al servidor:', response);
    } catch (error) {
      console.error('Error al suscribirse a las notificaciones:', error);
    }
  } else {
    console.warn('El navegador no soporta notificaciones push.');
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function requestAndSubscribeUser() {
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('Permiso concedido para notificaciones');
    await subscribeUser();
  } else {
    console.warn('Permiso para notificaciones denegado');
  }
}
