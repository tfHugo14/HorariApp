const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
// Esto por algún motivo no me funciona sin ruta absoluta
const dbPath = 'C:\\Users\\a23hugotf\\Desktop\\nuevacarpeta\\BD\\horariAppBD';
const cors = require('cors'); 

app.use(cors());
// app.get busca en "http://localhost:3000" que es el fichero de la base de datos una tabla "ciclos"
app.get('/ciclos', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Ciclos', [], (err, rows) => {
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

// El servidor se lanza con el comando: " node .\PruebaConexion\ciclos.js "