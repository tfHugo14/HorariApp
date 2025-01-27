const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const path = require('path');
app.get('/estudiantesPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'estudiantes.html'));
});

const dbPath = 'C:\\Users\\a23ignaciorf\\Documents\\DI\\Proyecto Gestión de Horarios\\proyectogithub\\HorariApp\\BD\\horariAppBD';
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

app.get('/estudiantes', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Estudiante', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        res.json(rows); // Devuelve los datos en formato JSON
    } catch (error) {
        res.status(500).send(error.message); // Devuelve el error en caso de fallo
    } finally {
        db.close();
    }
});


// app.post('/estudiantes', express.json(), async (req, res) => {
//     console.log('Recibida la solicitud POST /estudiantes:', req.body);
//     const { nombre, contrasena, esAdmin, dni } = req.body;
//     const db = new sqlite3.Database(dbPath);

//     try {
//         const result = await new Promise((resolve, reject) => {
//             db.run(
//                 `INSERT INTO Estudiante (nombre, contrasenha, esAdmin, dni) VALUES (?, ?, ?, ?)`,
//                 [nombre, contrasena, esAdmin, dni],
//                 function (err) {
//                     if (err) reject(err);
//                     else resolve({ id: this.lastID });
//                 }
//             );
//         });
//         res.json(result);
//     } catch (error) {
//         res.status(500).send(error.message);
//     } finally {
//         db.close();
//     }
// });

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

// El servidor se lanza con el comando: " node .\PruebaConexion\ciclos.js "