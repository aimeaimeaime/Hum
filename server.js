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
const mysql = require('mysql');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// Initialisation Firebase Admin SDK depuis le fichier JSON
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connexion à la base de données distante
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7776142',
  password: 'etSxEQTvi1',
  database: 'sql7776142',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données');
  }
});

// Enregistrement d’un token dans la base
app.post('/register-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Token manquant');
  }

  const sql = 'INSERT INTO push_tokens (token) VALUES (?)';
  db.query(sql, [token], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du token:', err);
      return res.status(500).send('Erreur lors de l\'enregistrement du token');
    }
    res.status(200).send('Token enregistré avec succès');
  });
});

// Envoi de notification à tous les tokens
app.post('/send-notification', (req, res) => {
  const { title, body } = req.body;

  db.query('SELECT token FROM push_tokens', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des tokens:', err);
      return res.status(500).send('Erreur serveur');
    }

    const tokens = results.map(row => row.token);

    if (tokens.length === 0) {
      return res.status(404).send('Aucun token trouvé');
    }

    const message = {
      notification: { title, body },
      tokens: tokens
    };

    admin.messaging().sendMulticast(message)
      .then(response => {
        res.status(200).send(`Notifications envoyées: ${response.successCount} succès, ${response.failureCount} échecs.`);
      })
      .catch(error => {
        console.error('Erreur d\'envoi:', error);
        res.status(500).send('Erreur d\'envoi de notification');
      });
  });
});

app.listen(port, () => {
  console.log(`Serveur en ligne sur le port ${port}`);
});
