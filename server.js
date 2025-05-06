









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
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const mysql = require('mysql');
const path = require('path');

const app = express();

// Configuration Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connexion MySQL
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7776142',
  password: 'etSxEQTvi1',
  database: 'sql7776142',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err);
  } else {
    console.log('Connecté à MySQL');
  }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Sert les fichiers comme firebase-messaging-sw.js

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Token manquant');
  }

  const query = 'INSERT INTO push_tokens (token) VALUES (?)';
  db.query(query, [token], (err) => {
    if (err) {
      console.error('Erreur insertion token :', err);
      return res.status(500).send('Erreur d\'enregistrement du token');
    }
    return res.status(200).send('Token enregistré');
  });
});

// Lancement serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en ligne sur le port ${port}`);
});
