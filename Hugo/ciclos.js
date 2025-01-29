const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
// Esto por algún motivo no me funciona sin ruta absoluta
const dbPath = 'C:\\Users\\a23hugotf\\Desktop\\horariApp\\BD\\horariAppBD';
const cors = require('cors'); 

app.use(cors());
app.use(express.json());

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

//app.post lee el json que de la ruta 'http://localhost:3000/ciclos' 
app.post('/ciclos', async (req, res) => {
    // campos que debe tener el json o lo que es lo mismo la base de datos
    const { id_ciclos, nombre, duracion, descripcion } = req.body;
    
    // si no están todos devuelve un error 400
    if (!id_ciclos || !nombre || !duracion || !descripcion) {
        return res.status(400).send('All fields are required.');
    }

    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Ciclos (id_ciclos, nombre, duracion, descripcion) VALUES (?, ?, ?, ?)`,
                [id_ciclos, nombre, duracion, descripcion],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
        res.status(201).send('Ciclo inserted successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

app.delete('/ciclos/:id', async (req, res) => {
    console.log("Intentando eliminar ID:", req.params.id);
    const { id } = req.params;
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Ciclos WHERE id_ciclos = ?', [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
        res.status(200).send('Ciclo deleted successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

// El servidor se lanza con el comando: " node .\PruebaConexion\ciclos.js "