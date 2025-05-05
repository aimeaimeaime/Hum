// ===== server.js =====
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL');
});

// Route pour enregistrer un abonné
app.post('/subscribe', (req, res) => {
    const { endpoint, expirationTime, keys } = req.body;
    const { p256dh, auth } = keys;

    connection.query(
        'INSERT INTO subcriptions (endpointIndex, expirationTime, p256dh, auth) VALUES (?, ?, ?, ?)',
        [endpoint, expirationTime, p256dh, auth],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur lors de l\'enregistrement');
            }
            res.status(200).send('Abonnement enregistré');
        }
    );
});

// Démarre le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));