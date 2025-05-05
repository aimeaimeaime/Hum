importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyAb8gGl4qBZVtBqYS4--XkmeGPCZy8M25Y",
  authDomain: "my-noti-16c94.firebaseapp.com",
  projectId: "my-noti-16c94",
  storageBucket: "my-noti-16c94.appspot.com",
  messagingSenderId: "1062983320683",
  appId: "1:1062983320683:web:da32270bb7eea4524a5d2e",
  measurementId: "G-R2F9QFQR9Q"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png'
  });
});
