// Import des modules nécessaires
const admin = require('firebase-admin');
const mysql = require('mysql');

// Initialisation de Firebase Admin avec le bon fichier de clé
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7776142',
  password: 'etSxEQTvi1',
  database: 'sql7776142',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }

  console.log('Connecté à la base de données');

  // Récupérer tous les tokens enregistrés
  db.query('SELECT token FROM push_tokens', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des tokens:', err);
      return;
    }

    const tokens = results.map(row => row.token);

    if (tokens.length === 0) {
      console.log('Aucun token trouvé.');
      return;
    }

    // Préparation du message
    const message = {
      notification: {
        title: 'Titre de test',
        body: 'Ceci est un message de test envoyé depuis la ligne de commande',
      },
      tokens: tokens,
    };

    // Envoi du message
    admin.messaging().sendMulticast(message)
      .then((response) => {
        console.log(`${response.successCount} messages envoyés avec succès`);
        if (response.failureCount > 0) {
          console.log(`${response.failureCount} échecs :`);
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              console.log(`- ${tokens[idx]}: ${resp.error.message}`);
            }
          });
        }
        db.end();
      })
      .catch((error) => {
        console.error('Erreur lors de l’envoi:', error);
        db.end();
      });
  });
});
