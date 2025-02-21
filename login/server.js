const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const dbPath = './copiaHorariappBD';

const cors = require('cors');

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));


// ******************  LOGIN ESTUDIANTE Y ADMINISTRADOR ******************

// Select estudiante por contraseña y usuario
app.post('/administrador/login', async (req, res) => {
    const { nombre, contrasenha } = req.body; // Obtener datos del body
    const db = new sqlite3.Database(dbPath);
    try {
        const administrador = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM Administrador WHERE nombre = ? AND contrasenha = ?',
                [nombre, contrasenha],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
        if (!administrador) {
            res.status(404).send("Contraseña o usuario incorrecto");
            return;
        }

        res.json(administrador);
    } catch (error) {
        res.status(500).send(error.message);
        db.close();
    }
});

// Select estudiante por contraseña y usuario
app.post('/estudiantes/login', async (req, res) => {
    const { nombre, contrasenha } = req.body; // Obtener datos del body
    const db = new sqlite3.Database(dbPath);
    try {
        const estudiante = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM Estudiante WHERE nombre = ? AND contrasenha = ?',
                [nombre, contrasenha],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
        if (!estudiante) {
            res.status(404).send("Contraseña o usuario incorrecto");
            return;
        }

        res.json(estudiante);
    } catch (error) {
        res.status(500).send(error.message);
        db.close();
    }
});
// ******************   ******************




// ****************** MODULOS Y PROFESORES (DANI) ******************

// Select profesores

app.get('/selectProfesores', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Profesor', [], (err, rows) => {
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

// Select
app.get('/selectModulos', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Modulos', [], (err, rows) => {
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
app.post('/insertModulo',
    async (req, res) => {
        const { id_modulo, duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor } = req.body;
        const db = new sqlite3.Database(dbPath);
        try {
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO Modulos (id_modulo, duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [id_modulo, duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor], function (err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
            });
            res.status(201).send('Modulo insertado correctamente');
        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            db.close();
        }
    });

//Delete
app.delete('/deleteModulo/:id', async (req, res) => {
    const { id } = req.params; // ID del ciclo que queremos eliminar
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Modulos WHERE id_modulo = ?', [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes); // Devuelve cuántas filas fueron eliminadas
            });
        });
        res.send('Modulo eliminado correctamente');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

//Update
app.put('/updateModulo/:id', async (req, res) => {
    const { id } = req.params;
    const { duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor } = req.body;
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('UPDATE Modulos SET duracion = ? , nombre = ?, horas_semanales = ? , descripcion = ?, id_ciclos = ?, id_profesor = ? WHERE id_modulo = ?', [duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor, id], function (err) {
                if (err) reject(err);
                else resolve(this.changes); // Devuelve cuántas filas fueron modificadas
            });
        });
        res.send('Modulo actualizado correctamente');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

// ****************** ESTUDIANTES(NACHO) ******************
// ****************** CAMBIAR ******************

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
                `INSERT INTO Estudiante (id_usuario, nombre, contrasenha, dni) VALUES (?, ?, ?, ?, ?)`,
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

//Update
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

// Ruta para servir la página de eliminación
app.get('/eliminarEstudiante', (req, res) => {
    res.sendFile(path.join(__dirname, 'eliminarEstudiante.html'));
});

// ****************** CICLOS(HUGO) ******************


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





// ****************** SESIONES Y HORARIO(ANGEL) ******************


// Obtener horarios de un módulo específico
app.get('/horarios/:idModulo', async (req, res) => {
    const { idModulo } = req.params; // Obtener el ID del módulo de la URL
    const db = new sqlite3.Database(dbPath);

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Sesiones WHERE id_modulos = ?', [idModulo], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        res.json(rows); // Devuelve los horarios en formato JSON
    } catch (error) {
        console.error('Error al cargar los horarios:', error.message);
        res.status(500).send(error.message); // Enviar el mensaje de error
    } finally {
        db.close();
    }
});

// Crear una nueva sesión para un módulo
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

// Modificar una sesión existente
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

// Eliminar una sesión
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



// Servidor

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));