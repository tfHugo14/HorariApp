const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const dbPath = 'C:\\Users\\a22angelmm\\Desktop\\ProyectoHorario\\BD\\horariappBD';

app.use(cors());
app.use(express.json()); 

// Ruta para obtener los ciclos
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

// Ruta para obtener horarios de un módulo específico con el nombre del módulo
app.get('/horarios/:idModulo', async (req, res) => {
    const { idModulo } = req.params; // Obtener el ID del módulo de la URL
    const db = new sqlite3.Database(dbPath);

    try {
        // Consulta SQL para obtener las sesiones y el nombre del módulo
        const rows = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    S.id_sesiones, 
                    S.hora_ini, 
                    S.hora_fin, 
                    S.dia, 
                    S.aula, 
                    S.descripcion, 
                    M.nombre AS nombre_modulo
                FROM 
                    Sesiones S
                JOIN 
                    Modulos M ON S.id_modulos = M.id_modulo
                WHERE 
                    S.id_modulos = ?`, 
                [idModulo], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
        });

        // Devolver las sesiones con el nombre del módulo
        res.json(rows); 
    } catch (error) {
        console.error('Error al cargar los horarios:', error.message);
        res.status(500).send(error.message); // Enviar el mensaje de error
    } finally {
        db.close();
    }
});

// Ruta para crear una nueva sesión
app.post('/horarios', async (req, res) => {
    const { idSesiones, horaIni, horaFin, dia, aula, descripcion, idModulos } = req.body;
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Sesiones (id_sesiones, hora_ini, hora_fin, dia, aula, descripcion, id_modulos) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [idSesiones, horaIni, horaFin, dia, aula, descripcion, idModulos],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
        res.status(201).send('Sesión creada con éxito.');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

// Ruta para modificar una sesión existente
app.put('/horarios/:idSesiones', async (req, res) => {
    const { idSesiones } = req.params;
    const { horaIni, horaFin, dia, aula, descripcion } = req.body;
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE Sesiones 
                 SET hora_ini = ?, hora_fin = ?, dia = ?, aula = ?, descripcion = ? 
                 WHERE id_sesiones = ?`,
                [horaIni, horaFin, dia, aula, descripcion, idSesiones],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
        res.send('Sesión modificada con éxito.');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

// Ruta para eliminar una sesión
app.delete('/horarios/:idSesiones', async (req, res) => {
    const { idSesiones } = req.params;
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Sesiones WHERE id_sesiones = ?', [idSesiones], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
        res.send('Sesión eliminada con éxito.');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});



// Iniciar el servidor
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
