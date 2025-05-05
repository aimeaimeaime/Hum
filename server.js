// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// // Connexion à ta base de données distante
// const db = mysql.createConnection({
//   host: 'sql7.freesqldatabase.com',
//   user: 'sql7776142',
//   password: 'etSxEQTvi1',
//   database: 'sql7776142',
//   port: 3306
// });

// db.connect(err => {
//   if (err) {
//     console.error('Erreur de connexion à la base de données :', err);
//   } else {
//     console.log('Connecté à la base de données MySQL distante.');
//   }
// });

// // Endpoint pour enregistrer un abonnement
// app.post('/subscribe', (req, res) => {
//   const { endpoint, expirationTime, keys } = req.body;

//   if (!endpoint) {
//     return res.status(400).send("Champ 'endpoint' manquant.");
//   }

//   const { p256dh, auth } = keys || {};

//   const sql = `
//     INSERT INTO subcriptions (endpointIndex, expirationTime, p256dh, auth)
//     VALUES (?, ?, ?, ?)
//   `;

//   db.query(sql, [endpoint, expirationTime, p256dh, auth], (err, result) => {
//     if (err) {
//       console.error('Erreur MySQL :', err);
//       return res.status(500).send("Erreur lors de l'insertion");
//     }
//     res.status(201).send('Abonnement enregistré avec succès');
//   });
// });

// app.get('/', (req, res) => {
//   res.send('Serveur Node opérationnel');
// });

// app.listen(PORT, () => {
//   console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
// });












const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à ta base de données freesqldatabase.com
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7776142',
  password: 'etSxEQTvi1',
  database: 'sql7776142',
  port: 3306
});

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur Node + MySQL opérationnel');
});

// Route d’abonnement – enregistre le token dans `push_tokens`
app.post('/subscribe', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token manquant' });
  }

  const sql = 'INSERT INTO push_tokens (token) VALUES (?)';

  db.query(sql, [token], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'insertion :', err);
      return res.status(500).json({ message: 'Erreur lors de l\'insertion en base' });
    }

    return res.status(200).json({ message: 'Token enregistré avec succès' });
  });
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
