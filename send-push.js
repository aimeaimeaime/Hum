const admin = require('firebase-admin');
const mysql = require('mysql');

// Initialise Firebase Admin
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
    console.error('Erreur MySQL:', err);
    return;
  }

  // Récupère tous les tokens
  db.query('SELECT token FROM push_tokens', (err, results) => {
    if (err) {
      console.error('Erreur de requête:', err);
      return;
    }

    const tokens = results.map(row => row.token);

    const message = {
      notification: {
        title: 'Test CLI 🚀',
        body: 'Ceci est un test envoyé via Node.js en ligne de commande.',
      },
      tokens: tokens,
    };

    admin.messaging().sendMulticast(message)
      .then((response) => {
        console.log(`${response.successCount} message(s) envoyé(s) avec succès`);
        console.log(`${response.failureCount} échec(s)`);
      })
      .catch((error) => {
        console.error('Erreur lors de l’envoi:', error);
      })
      .finally(() => {
        db.end();
      });
  });
});
