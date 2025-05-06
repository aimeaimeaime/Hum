// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// // Connexion à la base de données distante
// const db = mysql.createConnection({
//   host: 'sql7.freesqldatabase.com',
//   user: 'sql7776142',
//   password: 'etSxEQTvi1',
//   database: 'sql7776142',
//   port: 3306
// });

// db.connect(err => {
//   if (err) {
//     console.error('Erreur de connexion à la base de données:', err);
//     return;
//   }
//   console.log('Connecté à la base de données');
// });

// // Route pour recevoir les abonnements
// app.post('/subscribe', (req, res) => {
//   const { endpoint, expirationTime, keys } = req.body;

//   if (!endpoint) {
//     return res.status(400).send('Données manquantes');
//   }

//   const query = `
//     INSERT INTO subcriptions (endpointIndex, expirationTime, p256dh, auth)
//     VALUES (?, ?, ?, ?)
//   `;

//   db.query(query, [
//     endpoint,
//     expirationTime || '',
//     keys?.p256dh || '',
//     keys?.auth || ''
//   ], (err, result) => {
//     if (err) {
//       console.error('Erreur lors de l’insertion:', err);
//       return res.status(500).send('Erreur serveur');
//     }

//     res.status(201).send('Abonnement enregistré');
//   });
// });

// // Démarrage du serveur
// app.listen(port, () => {
//   console.log(`Serveur en ligne sur le port ${port}`);
// });




















require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

// 🔐 Initialisation Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 📦 Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔗 Connexion MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('Erreur connexion base de données:', err);
    return;
  }
  console.log('✅ Connecté à MySQL');
});

// 📥 Enregistrement des abonnements
app.post('/subscribe', (req, res) => {
  const { endpoint, expirationTime, keys } = req.body;

  if (!endpoint) return res.status(400).send('Token manquant');

  const query = `
    INSERT INTO subcriptions (endpointIndex, expirationTime, p256dh, auth)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE expirationTime = VALUES(expirationTime), p256dh = VALUES(p256dh), auth = VALUES(auth)
  `;

  db.query(query, [
    endpoint,
    expirationTime || '',
    keys?.p256dh || '',
    keys?.auth || ''
  ], (err) => {
    if (err) {
      console.error('❌ Erreur insertion :', err);
      return res.status(500).send('Erreur serveur');
    }
    res.status(201).send('✅ Abonnement enregistré');
  });
});

// 🚀 Envoi de notification à tous
app.post('/send', async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) return res.status(400).json({ error: 'title et body requis' });

  db.query('SELECT endpointIndex AS token FROM subcriptions', async (err, results) => {
    if (err) {
      console.error('❌ Erreur récupération tokens :', err);
      return res.status(500).json({ error: 'Erreur base de données' });
    }

    const tokens = results.map(row => row.token);

    const messages = tokens.map(token => ({
      token,
      notification: { title, body }
    }));

    try {
      const response = await admin.messaging().sendAll(messages);
      console.log(`✅ Notifications envoyées à ${tokens.length} tokens`);
      res.status(200).json({ successCount: response.successCount, failureCount: response.failureCount });
    } catch (e) {
      console.error('❌ Erreur envoi FCM :', e);
      res.status(500).json({ error: e.message });
    }
  });
});

// 🎧 Démarrage serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
