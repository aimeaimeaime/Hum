const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connexion à ta base de données distante
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7776142',
  password: 'etSxEQTvi1',
  database: 'sql7776142',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL distante.');
  }
});

// Endpoint pour enregistrer un abonnement
app.post('/subscribe', (req, res) => {
  const { endpoint, expirationTime, keys } = req.body;

  if (!endpoint) {
    return res.status(400).send("Champ 'endpoint' manquant.");
  }

  const { p256dh, auth } = keys || {};

  const sql = `
    INSERT INTO subcriptions (endpointIndex, expirationTime, p256dh, auth)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [endpoint, expirationTime, p256dh, auth], (err, result) => {
    if (err) {
      console.error('Erreur MySQL :', err);
      return res.status(500).send("Erreur lors de l'insertion");
    }
    res.status(201).send('Abonnement enregistré avec succès');
  });
});

app.get('/', (req, res) => {
  res.send('Serveur Node opérationnel');
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
