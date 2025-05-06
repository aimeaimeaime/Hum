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

// Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données');
});

// Initialiser Firebase Admin avec la clé JSON depuis Render
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Route pour enregistrer un token
app.post('/subscribe', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Token manquant');
  }

  db.query('INSERT INTO tokens (token) VALUES (?) ON DUPLICATE KEY UPDATE token = token', [token], (err, result) => {
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

  db.query('SELECT token FROM tokens', async (err, results) => {
    if (err) {
      console.error('Erreur lors de la lecture des tokens:', err);
      return res.status(500).send('Erreur de lecture des tokens');
    }

    const tokens = results.map(r => r.token);
    if (tokens.length === 0) return res.status(200).send('Aucun token enregistré');

    const message = {
      notification: { title, body },
      tokens,
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      res.status(200).json({
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      });
    } catch (error) {
      console.error('Erreur lors de l’envoi de la notification:', error);
      res.status(500).send('Erreur d’envoi');
    }
  });
});

// (Optionnel) Route pour lister les tokens
app.get('/tokens', (req, res) => {
  db.query('SELECT * FROM tokens', (err, results) => {
    if (err) {
      return res.status(500).send('Erreur');
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Serveur en ligne sur le port ${port}`);
});
