// Import des scripts Firebase
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Configuration Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAb8gGl4qBZVtBqYS4--XkmeGPCZy8M25Y",
  authDomain: "my-noti-16c94.firebaseapp.com",
  projectId: "my-noti-16c94",
  storageBucket: "my-noti-16c94.appspot.com",
  messagingSenderId: "1062983320683",
  appId: "1:1062983320683:web:da32270bb7eea4524a5d2e"
});

// Initialisation du service messaging
const messaging = firebase.messaging();

// Gestion de la réception des notifications en arrière-plan
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan : ', payload);

  const notificationTitle = payload.notification.title || "Notification";
  const notificationOptions = {
    body: payload.notification.body || "Vous avez une nouvelle notification.",
    icon: payload.notification.icon || "/icon.png"
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
