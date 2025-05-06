

// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAb8gGl4qBZVtBqYS4--XkmeGPCZy8M25Y",
  authDomain: "my-noti-16c94.firebaseapp.com",
  projectId: "my-noti-16c94",
  storageBucket: "my-noti-16c94.appspot.com",
  messagingSenderId: "1062983320683",
  appId: "1:1062983320683:web:da32270bb7eea4524a5d2e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // optionnel
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
