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






















const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données distante
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'sql7.freesqldatabase.com',
  user: process.env.DB_USER || 'sql7776142',
  password: process.env.DB_PASSWORD || 'etSxEQTvi1',
  database: process.env.DB_NAME || 'sql7776142',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données');
});

// Initialisation Firebase Admin SDK avec la clé d'environnement Render
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialisé");
} catch (error) {
  console.error("Erreur d'initialisation Firebase Admin SDK:", error);
}

// Route pour recevoir les abonnements
app.post('/subscribe', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Token manquant');
  }

  const query = 'INSERT INTO subscriptions (token) VALUES (?)';

  db.query(query, [token], (err, result) => {
    if (err) {
      console.error('Erreur lors de l’insertion:', err);
      return res.status(500).send('Erreur serveur');
    }

    res.status(201).send('Token enregistré');
  });
});

// Route pour envoyer une notification à tous les tokens
app.post('/send-notification', (req, res) => {
  const { title, body } = req.body;

  const query = 'SELECT token FROM subscriptions';

  db.query(query, async (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des tokens:', err);
      return res.status(500).send('Erreur serveur');
    }

    const tokens = results.map(row => row.token);

    const message = {
      notification: {
        title: title || 'Titre par défaut',
        body: body || 'Corps du message par défaut'
      },
      tokens: tokens
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log('Notifications envoyées:', response);
      res.status(200).json({ success: true, result: response });
    } catch (error) {
      console.error("Erreur lors de l'envoi des notifications:", error);
      res.status(500).send('Erreur lors de l’envoi des notifications');
    }
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en ligne sur le port ${port}`);
});
