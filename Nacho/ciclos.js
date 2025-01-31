const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = 'C:\\Users\\a23ignaciorf\\Documents\\DI\\Proyecto Gestión de Horarios\\proyectogithub\\HorariApp\\BD\\horariAppBD';

function validarDNI(dni) {
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const dniRegex = /^[0-9]{8}[A-Z]$/;

    if (!dniRegex.test(dni)) return false;

    const numero = parseInt(dni.slice(0, 8), 10);
    const letra = dni.slice(-1);
    return letra === letras[numero % 23];
}

app.get('/estudiantesPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'estudiantes.html'));
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
        res.json(rows);
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

app.post('/estudiantes', async (req, res) => {
    const { id_usuario, nombre, contrasenha, esAdmin, dni } = req.body;

    if (!id_usuario || !nombre || !contrasenha || !dni) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    if (!validarDNI(dni)) {
        return res.status(400).send('DNI inválido. Introduzca un DNI correcto.');
    }

    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Estudiante (id_usuario, nombre, contrasenha, esAdmin, dni) VALUES (?, ?, ?, ?, ?)`,
                [id_usuario, nombre, contrasenha, esAdmin, dni],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.json({ message: 'Estudiante agregado correctamente', id_usuario });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            // Comprobar específicamente si el error es por `id_usuario`
            if (error.message.includes('Estudiante.id_usuario')) {
                res.status(400).send('El ID de usuario ya existe en la base de datos.');
            } else {
                res.status(400).send('Violación de restricción única en la base de datos.');
            }
        } else {
            res.status(500).send('Error al agregar estudiante: ' + error.message);
        }
    } finally {
        db.close();
    }
});



// Obtener estudiante por DNI
app.get('/estudiantes/:dni', async (req, res) => {
    const dni = req.params.dni;
    const db = new sqlite3.Database(dbPath);

    try {
        const estudiante = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM Estudiante WHERE dni = ?', [dni], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!estudiante) {
            res.status(404).send("Estudiante no encontrado.");
            return;
        }

        res.json(estudiante);
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

// Actualizar estudiante por DNI
app.put('/estudiantes/:dni', async (req, res) => {
    const dni = req.params.dni;
    const { id_usuario, nombre, contrasenha, esAdmin } = req.body;

    if (!id_usuario || !nombre || !contrasenha || esAdmin === undefined) {
        return res.status(400).send("Todos los campos son obligatorios.");
    }

    const db = new sqlite3.Database(dbPath);
    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `UPDATE Estudiante SET id_usuario = ?, nombre = ?, contrasenha = ?, esAdmin = ? WHERE dni = ?`,
                [id_usuario, nombre, contrasenha, esAdmin, dni],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });

        if (result === 0) {
            return res.status(404).send("No se encontró el estudiante para actualizar.");
        }

        res.json({ message: "Estudiante actualizado correctamente." });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            // Comprobar si el error es por id_usuario
            if (error.message.includes('Estudiante.id_usuario')) {
                return res.status(400).send("El ID de usuario ya existe en la base de datos.");
            } else {
                return res.status(400).send("Violación de restricción única en la base de datos.");
            }
        } else {
            return res.status(500).send("Error al actualizar estudiante: " + error.message);
        }
    } finally {
        db.close();
    }
});


// Ruta para servir la página de edición
app.get('/editarEstudiante', (req, res) => {
    res.sendFile(path.join(__dirname, 'editarEstudiante.html'));
});

// Eliminar estudiante por DNI
app.delete('/estudiantes/:dni', async (req, res) => {
    const dni = req.params.dni;
    const db = new sqlite3.Database(dbPath);

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(`DELETE FROM Estudiante WHERE dni = ?`, [dni], function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });

        if (result === 0) {
            res.status(404).send("Estudiante no encontrado.");
            return;
        }

        res.json({ message: "Estudiante eliminado correctamente." });
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

// Ruta para servir la página de eliminación
app.get('/eliminarEstudiante', (req, res) => {
    res.sendFile(path.join(__dirname, 'eliminarEstudiante.html'));
});





app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
