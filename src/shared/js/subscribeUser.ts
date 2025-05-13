import { API } from "./api";

const PUBLIC_VAPID_KEY = 'BFnkI-bc7pnSW_LdKf2LcAWML9B56L6Y-uHW5cYJMVDX_1JOZaBg5wP5QSPM4b0O9mnZ55M8PmHuUWObRPr75d4';

// Función para suscribir al usuario a las notificaciones push
async function subscribeUser(userId: string, userName: string) {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;

      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        console.log('Ya estás suscrito:', existingSubscription);
        // Enviar la suscripción al servidor
        await sendSubscriptionToServer(existingSubscription, userId, userName);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      await sendSubscriptionToServer(subscription, userId, userName);

    } catch (error) {
      console.error('Error al suscribirse a las notificaciones:', error);
    }
  } else {
    console.warn('El navegador no soporta notificaciones push.');
  }
}

// Función para enviar la suscripción al servidor
async function sendSubscriptionToServer(
  subscription: PushSubscription,
  userId: string,
  userName: string
) {
  console.log('Enviando suscripción al servidor:', subscription.endpoint);
  const payload = {
    userId,
    userName,
    subscription
  };

  try {
    const response = await API.subscribeNotification(payload);
    console.log('Suscripción enviada al servidor:', response);
  } catch (error) {
    console.error('Error enviando la suscripción al servidor:', error);
  }
}

// Función para convertir la clave pública en base64 a un Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// Función para pedir permiso y suscribir al usuario
export async function requestAndSubscribeUser(userId: string, userName: string) {
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('Permiso concedido para notificaciones');
    await subscribeUser(userId, userName);
  } else {
    console.warn('Permiso para notificaciones denegado');
  }
}
