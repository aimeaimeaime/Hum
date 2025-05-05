const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données distante
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7776142',
  password: 'etSxEQTvi1',
  database: 'sql7776142',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données');
});

// Route pour recevoir les abonnements
app.post('/subscribe', (req, res) => {
  const { endpoint, expirationTime, keys } = req.body;

  if (!endpoint) {
    return res.status(400).send('Données manquantes');
  }

  const query = `
    INSERT INTO subcriptions (endpointIndex, expirationTime, p256dh, auth)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [
    endpoint,
    expirationTime || '',
    keys?.p256dh || '',
    keys?.auth || ''
  ], (err, result) => {
    if (err) {
      console.error('Erreur lors de l’insertion:', err);
      return res.status(500).send('Erreur serveur');
    }

    res.status(201).send('Abonnement enregistré');
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en ligne sur le port ${port}`);
});
