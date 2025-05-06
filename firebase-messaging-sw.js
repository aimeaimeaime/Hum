// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// firebase.initializeApp({
//   apiKey: "AIzaSyAb8gGl4qBZVtBqYS4--XkmeGPCZy8M25Y",
//   authDomain: "my-noti-16c94.firebaseapp.com",
//   projectId: "my-noti-16c94",
//   storageBucket: "my-noti-16c94.appspot.com",
//   messagingSenderId: "1062983320683",
//   appId: "1:1062983320683:web:da32270bb7eea4524a5d2e"
// });

// const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan : ', payload);

//   const notificationTitle = payload.notification.title || "Notification";
//   const notificationOptions = {
//     body: payload.notification.body || "Vous avez une nouvelle notification.",
//     icon: payload.notification.icon || "/icon.png"
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });




















FIREBASE_SERVICE_ACCOUNT_KEY={
  "type": "service_account",
  "project_id": "my-noti-16c94",
  "private_key_id": "xxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkq...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "firebase-adminsdk-xxx@my-noti-16c94.iam.gserviceaccount.com",
  "client_id": "xxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxx@my-noti-16c94.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}






