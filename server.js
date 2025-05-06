









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
const admin = require('firebase-admin');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

// Initialisation de l'application Express
const app = express();

// Utilisation de body-parser pour analyser les corps de requêtes
app.use(bodyParser.json());

// Initialisation de Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'sql7.freesqldatabase.com',
  user: process.env.DB_USER || 'sql7776142',
  password: process.env.DB_PASSWORD || 'etSxEQTvi1',
  database: process.env.DB_NAME || 'sql7776142',
  port: process.env.DB_PORT || 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
  } else {
    console.log('Connecté à la base de données');
  }
});

// Route pour tester si le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Serveur en ligne');
});

// Route pour envoyer une notification push à tous les tokens stockés dans la base de données
app.post('/send-notification', (req, res) => {
  const message = req.body.message; // Récupérer le message à envoyer

  // Récupérer tous les tokens depuis la base de données
  connection.query('SELECT token FROM push_tokens', (err, results) => {
    if (err) {
      console.error('Erreur de récupération des tokens:', err);
      return res.status(500).send('Erreur serveur');
    }

    // Extraire les tokens dans un tableau
    const tokens = results.map(row => row.token);

    if (tokens.length === 0) {
      return res.status(404).send('Aucun token trouvé');
    }

    // Configuration du message de notification
    const payload = {
      notification: {
        title: 'Notification Push',
        body: message,
      },
    };

    // Envoyer la notification à tous les tokens
    admin.messaging().sendToDevice(tokens, payload)
      .then((response) => {
        console.log('Notification envoyée:', response);
        res.status(200).send('Notifications envoyées avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi de la notification:', error);
        res.status(500).send('Erreur serveur lors de l\'envoi de la notification');
      });
  });
});

// Configurer le port et démarrer le serveur
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Serveur en ligne sur le port ${port}`);
});
