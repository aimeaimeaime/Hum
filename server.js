




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
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// 🔐 Charge le fichier JSON (ne jamais le push sur GitHub)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 👉 Page test GET
app.get('/', (req, res) => {
  res.send('FCM Server is running');
});

// 👉 Envoi d’une notification POST
app.post('/send', async (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: 'token, title, and body are required' });
  }

  try {
    await admin.messaging().send({
      token,
      notification: {
        title,
        body
      }
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
