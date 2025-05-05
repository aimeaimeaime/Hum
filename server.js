




// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connexion à ta base de données freesqldatabase.com
// const db = mysql.createConnection({
//   host: 'sql7.freesqldatabase.com',
//   user: 'sql7776142',
//   password: 'etSxEQTvi1',
//   database: 'sql7776142',
//   port: 3306
// });

// // Route de test
// app.get('/', (req, res) => {
//   res.send('Serveur Node + MySQL opérationnel');
// });

// // Route d’abonnement – enregistre le token dans `push_tokens`
// app.post('/subscribe', (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ message: 'Token manquant' });
//   }

//   const sql = 'INSERT INTO push_tokens (token) VALUES (?)';

//   db.query(sql, [token], (err, results) => {
//     if (err) {
//       console.error('Erreur lors de l\'insertion :', err);
//       return res.status(500).json({ message: 'Erreur lors de l\'insertion en base' });
//     }

//     return res.status(200).json({ message: 'Token enregistré avec succès' });
//   });
// });

// // Lancer le serveur
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Serveur lancé sur le port ${PORT}`);
// });

















// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const admin = require('firebase-admin');
// const cors = require('cors');
// const path = require('path');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connexion à la base de données
// const db = mysql.createConnection({
//   host: 'sql7.freesqldatabase.com',
//   user: 'sql7776142',
//   password: 'etSxEQTvi1',
//   database: 'sql7776142',
//   port: 3306
// });

// db.connect(err => {
//   if (err) {
//     console.error('Erreur connexion DB :', err);
//   } else {
//     console.log('Connexion DB réussie');
//   }
// });

// // Firebase Admin SDK
// const serviceAccount = require('./service-account.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// // Route test
// app.get('/', (req, res) => {
//   res.send('Serveur Node opérationnel');
// });

// // Route d’abonnement (enregistrement token)
// app.post('/subscribe', (req, res) => {
//   const token = req.body.token;

//   if (!token) {
//     return res.status(400).send('Token manquant');
//   }

//   const sql = 'INSERT INTO push_tokens (token) VALUES (?)';

//   db.query(sql, [token], (err, result) => {
//     if (err) {
//       console.error('Erreur insertion token :', err);
//       return res.status(500).send("Erreur lors de l'insertion");
//     }

//     console.log('Token enregistré');
//     res.send('Abonnement enregistré avec succès');
//   });
// });

// // Route d’envoi de notification
// app.post('/send', async (req, res) => {
//   const { title, body } = req.body;

//   db.query('SELECT token FROM push_tokens', async (err, results) => {
//     if (err) {
//       console.error('Erreur récupération tokens :', err);
//       return res.status(500).send('Erreur récupération des tokens');
//     }

//     const tokens = results.map(row => row.token);

//     const message = {
//       notification: {
//         title: title || 'Notification',
//         body: body || 'Contenu par défaut'
//       },
//       tokens
//     };

//     try {
//       const response = await admin.messaging().sendMulticast(message);
//       console.log(`${response.successCount} notifications envoyées`);
//       res.send(`Notifications envoyées : ${response.successCount}`);
//     } catch (e) {
//       console.error('Erreur envoi FCM :', e);
//       res.status(500).send('Erreur envoi notifications');
//     }
//   });
// });

// // Lancer le serveur
// app.listen(PORT, () => {
//   console.log(`Serveur lancé sur le port ${PORT}`);
// });





















const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config();  // pour charger les variables d'environnement

const app = express();
const PORT = process.env.PORT || 3000;

// Initialisation de Firebase Admin avec la clé d'authentification
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);  // Charge la clé depuis la variable d'environnement
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Serveur opérationnel !');
});

// Exemple de route POST pour envoyer des notifications
app.post('/send-notification', (req, res) => {
  const message = {
    notification: {
      title: 'Test Notification',
      body: 'Ceci est un test.',
    },
    token: 'TOKEN_D_UTILISATEUR',  // Remplacez cela par le token FCM d'un utilisateur
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log('Notification envoyée avec succès:', response);
      res.status(200).send('Notification envoyée!');
    })
    .catch((error) => {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      res.status(500).send('Erreur lors de l\'envoi de la notification');
    });
});

// Servir tous les fichiers à la racine du projet (comme index.html, etc.)
app.use(express.static(path.join(__dirname)));

// Si l'application a un front-end (par exemple React ou autre), envoyer index.html pour les autres routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));  // Si vous avez un fichier index.html
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
