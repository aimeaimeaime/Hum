


// // Importation des modules nécessaires
// const express = require('express');
// const bodyParser = require('body-parser');
// const admin = require('firebase-admin');
// const mysql = require('mysql');
// const path = require('path');

// // Initialisation de l'application express
// const app = express();

// // Configuration de Firebase Admin SDK
// const serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Connexion MySQL
// const db = mysql.createConnection({
//   host: 'sql7.freesqldatabase.com',
//   user: 'sql7776142',
//   password: 'etSxEQTvi1',
//   database: 'sql7776142',
//   port: 3306,
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Erreur de connexion MySQL :', err);
//   } else {
//     console.log('Connecté à MySQL');
//   }
// });

// // Middleware
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname))); // Sert index.html et firebase-messaging-sw.js

// // Route racine (sert index.html)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Enregistrement du token push
// app.post('/register-token', (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).send('Token manquant');
//   }

//   const query = 'INSERT INTO push_tokens (token) VALUES (?)';
//   db.query(query, [token], (err, result) => {
//     if (err) {
//       console.error("Erreur d'insertion:", err);
//       return res.status(500).send("Erreur lors de l'enregistrement du token");
//     }
//     res.status(200).send('Token enregistré avec succès');
//   });
// });

// // Lancer le serveur
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Serveur en ligne sur le port ${PORT}`);
// });


























const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const mysql = require('mysql');
const path = require('path');

// Initialisation de l'application express
const app = express();

// Configuration Firebase Admin SDK
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
    console.error('Erreur de connexion MySQL :', err);
  } else {
    console.log('Connecté à MySQL');
  }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Sert index.html et firebase-messaging-sw.js

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Enregistrement du token push
app.post('/register-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Token manquant');
  }

  // Empêche les doublons sans erreur
  const query = 'INSERT IGNORE INTO push_tokens (token) VALUES (?)';

  db.query(query, [token], (err, result) => {
    if (err) {
      console.error("Erreur d'insertion:", err);
      return res.status(500).send("Erreur SQL: " + err.message);
    }

    if (result.affectedRows === 0) {
      res.status(200).send('Token déjà enregistré');
    } else {
      res.status(200).send('Token enregistré avec succès');
    }
  });
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});
