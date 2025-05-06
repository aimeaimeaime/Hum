const admin = require('firebase-admin');
const mysql = require('mysql');
const cron = require('node-cron');
const serviceAccount = require('./serviceAccountKey.json');

// Initialiser Firebase Admin SDK
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
    console.log('Connecté à la base de données MySQL.');
  }
});

// Tâche planifiée chaque minute
cron.schedule('* * * * *', () => {
  console.log('Envoi de notification push à tous les tokens...');

  db.query('SELECT token FROM push_tokens', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des tokens :', err);
      return;
    }

    const tokens = results.map(row => row.token);

    if (tokens.length === 0) {
      console.log('Aucun token trouvé.');
      return;
    }

    const message = {
      notification: {
        title: 'Bonjour 👋',
        body: 'Voici votre notification automatique !',
      },
      tokens: tokens,
    };

    admin.messaging().sendMulticast(message)
      .then(response => {
        console.log(`${response.successCount} notifications envoyées avec succès`);
        if (response.failureCount > 0) {
          console.log(`${response.failureCount} échecs :`, response.responses.filter(r => !r.success));
        }
      })
      .catch(error => {
        console.error('Erreur lors de l’envoi des notifications :', error);
      });
  });
});
