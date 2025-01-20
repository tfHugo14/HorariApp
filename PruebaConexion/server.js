const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const dbPath = '..\\BD\\horariappBD';
const cors = require('cors'); 

app.use(cors());
app.get('/pacientes', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Paciente', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        res.json(rows);
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));