const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const dbPath = './horariappBD';

const cors = require('cors');

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// ****************** ESTUDIANTES ******************

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

//Select
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

//Insert
app.post('/estudiantes', async (req, res) => {
    const { id_usuario, nombre, contrasenha, dni } = req.body;

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
                `INSERT INTO Estudiante (id_usuario, nombre, contrasenha, dni) VALUES (?, ?, ?, ?)`,
                [id_usuario, nombre, contrasenha, dni],
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


// Select estudiante por dni
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

// Editar estudiante
app.put('/estudiantes/:dni', async (req, res) => {
    const dni = req.params.dni;
    const { id_usuario, nombre, contrasenha } = req.body;

    if (!id_usuario || !nombre || !contrasenha) {
        return res.status(400).send("Todos los campos son obligatorios.");
    }

    const db = new sqlite3.Database(dbPath);
    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `UPDATE Estudiante SET id_usuario = ?, nombre = ?, contrasenha = ? WHERE dni = ?`,
                [id_usuario, nombre, contrasenha, dni],
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

// Prueba para mostrar ciclos:
// http://localhost:3000/estudiantes/E001/ciclos
// Prueba ok: muestra id del ciclo, nombre etc.

app.get('/estudiantes/:id_usuario/ciclos', async (req, res) => {
    const id_usuario = req.params.id_usuario;
    const db = new sqlite3.Database(dbPath);

    try {
        const ciclos = await new Promise((resolve, reject) => {
            db.all(
                `SELECT c.id_ciclos, c.nombre AS nombre_ciclo, c.descripcion AS descripcion_ciclo,
                        m.id_modulo, m.nombre AS nombre_modulo, m.horas_semanales, m.descripcion AS descripcion_modulo
                 FROM matricular_modulos mm
                 JOIN Modulos m ON mm.id_modulos = m.id_modulo
                 JOIN Ciclos c ON m.id_ciclos = c.id_ciclos
                 WHERE mm.id_usuario = ?`,
                [id_usuario],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        res.json(ciclos);
    } catch (error) {
        res.status(500).send("Error al obtener los ciclos del estudiante: " + error.message);
    } finally {
        db.close();
    }
});


// Ruta para servir la página de eliminación
app.get('/eliminarEstudiante', (req, res) => {
    res.sendFile(path.join(__dirname, 'eliminarEstudiante.html'));
});



// Servidor

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));