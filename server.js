









// const express = require('express');
// const path = require('path');
// const mysql = require('mysql');
// const admin = require('firebase-admin');
// const serviceAccount = require('./firebase-service-account.json');

// const app = express();
// const port = process.env.PORT || 10000;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = mysql.createConnection({
//   host: 'sql7.freesqldatabase.com',
//   user: 'sql7776142',
//   password: 'etSxEQTvi1',
//   database: 'sql7776142',
//   port: 3306
// });

// db.connect((err) => {
//   if (err) return console.error('Erreur DB:', err);
//   console.log('Connecté à la base de données');
// });

// app.use(express.json());
// app.use(express.static('public')); // Pour servir le service worker
// app.use(express.static(__dirname)); // Pour servir index.html

// app.post('/register-token', (req, res) => {
//   const { token } = req.body;
//   if (!token) return res.status(400).send('Token manquant');

//   db.query('INSERT INTO push_tokens (token) VALUES (?)', [token], (err) => {
//     if (err) return res.status(500).send('Erreur d\'enregistrement');
//     res.send('Token enregistré');
//   });
// });

// app.post('/send-notification', (req, res) => {
//   const { title, body } = req.body;
//   db.query('SELECT token FROM push_tokens', (err, results) => {
//     if (err) return res.status(500).send('Erreur DB');
//     const tokens = results.map(r => r.token);
//     if (!tokens.length) return res.status(404).send('Aucun token');

//     admin.messaging().sendMulticast({
//       notification: { title, body },
//       tokens
//     }).then(response => {
//       res.send(`Envoyées: ${response.successCount}, Échecs: ${response.failureCount}`);
//     }).catch(err => {
//       console.error('Erreur envoi:', err);
//       res.status(500).send('Erreur envoi');
//     });
//   });
// });

// app.listen(port, () => {
//   console.log(`Serveur démarré sur le port ${port}`);
// });














const express = require('express');
const mysql = require('mysql');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
require('dotenv').config();

const serviceAccount = require('./serviceAccountKey.json'); // ton fichier de clé Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

// Connexion à ta base de données FreeSQLDatabase
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'sql7.freesqldatabase.com',
  user: process.env.DB_USER || 'sql7776142',
  password: process.env.DB_PASSWORD || 'etSxEQTvi1',
  database: process.env.DB_NAME || 'sql7776142',
  port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('✅ Connecté à la base de données');
});

// Enregistrer un token dans la table `push_tokens`
app.post('/save-token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send('Token manquant');

  const query = 'INSERT INTO push_tokens (token) VALUES (?)';
  connection.query(query, [token], (err) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du token :', err);
      return res.status(500).send('Erreur serveur');
    }
    res.send('Token enregistré avec succès');
  });
});

// Envoyer une notification à tous les tokens
app.post('/send-notification', (req, res) => {
  const { title, body } = req.body;

  const query = 'SELECT token FROM push_tokens';
  connection.query(query, async (err, results) => {
    if (err) {
      console.error('Erreur récupération tokens :', err);
      return res.status(500).send('Erreur serveur');
    }

    const tokens = results.map(r => r.token);
    if (tokens.length === 0) {
      return res.status(200).send('Aucun token enregistré');
    }

    const message = {
      notification: { title, body },
      tokens: tokens
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      res.send(`Notifications envoyées : ${response.successCount} réussies`);
    } catch (error) {
      console.error('Erreur envoi :', error);
      res.status(500).send('Erreur envoi notification');
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Serveur en ligne sur le port ${port}`);
});
