const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connexion MySQL distante
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7776142',
  password: 'etSxEQTvi1',
  database: 'sql7776142',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Erreur connexion base de données:', err);
    return;
  }
  console.log('Connecté à la base de données distante');
});

// Route POST pour enregistrer l'abonnement
app.post('/subscribe', (req, res) => {
  const { endpoint } = req.body;

  const query = 'INSERT INTO subcriptions (endpointIndex) VALUES (?)';
  db.query(query, [endpoint], (err, result) => {
    if (err) {
      console.error('Erreur insertion:', err);
      return res.status(500).send('Erreur lors de l'insertion');
    }
    res.send('Abonnement enregistré');
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
