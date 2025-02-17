// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path'); 

const app = express();
const dbPath = 'C:\\Users\\a22angelmm\\Desktop\\ProyectoHorario\\BD\\horariappBD';

app.use(cors());
app.use(express.json());

// Ruta para obtener todos los ciclos
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

// Ruta para obtener horarios de un alumno
app.get('/horariosAlumno/:idAlumno', async (req, res) => {
    const { idAlumno } = req.params;
    const db = new sqlite3.Database(dbPath);
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    S.id_sesiones, 
                    S.hora_ini, 
                    S.hora_fin, 
                    S.dia, 
                    S.aula, 
                    S.descripcion, 
                    M.nombre AS nombre_modulo,
                    C.nombre AS nombre_ciclo
                FROM 
                    Sesiones S
                JOIN 
                    Modulos M ON S.id_modulos = M.id_modulo
                JOIN 
                    matricular_ciclo MC ON M.id_ciclos = MC.id_ciclos
                JOIN 
                    Ciclos C ON MC.id_ciclos = C.id_ciclos
                WHERE 
                    MC.id_usuario = ?
            `, [idAlumno], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        res.json(rows);
    } catch (error) {
        console.error('Error al cargar los horarios del alumno:', error.message);
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

// Rutas para crear, modificar y eliminar sesiones (para completar la funcionalidad)
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
// Ruta para obtener las sesiones de un alumno
// Ruta para obtener las sesiones de un alumno
app.get('/sesionesAlumno/:idAlumno', async (req, res) => {
    const { idAlumno } = req.params;  // Obtiene el ID del alumno de la URL
    const db = new sqlite3.Database(dbPath);  // Abre la base de datos

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    S.id_sesiones, 
                    S.hora_ini, 
                    S.hora_fin, 
                    S.dia, 
                    S.aula, 
                    S.descripcion AS descripcion_sesion, 
                    M.nombre AS nombre_modulo,
                    C.nombre AS nombre_ciclo,
                    P.nombre AS nombre_profesor
                FROM 
                    Sesiones S
                JOIN 
                    Modulos M ON S.id_modulos = M.id_modulo
                JOIN 
                    matricular_modulos MM ON M.id_modulo = MM.id_modulos
                JOIN 
                    Estudiante E ON MM.id_usuario = E.id_usuario
                JOIN 
                    Ciclos C ON M.id_ciclos = C.id_ciclos
                LEFT JOIN 
                    Profesor P ON M.id_profesor = P.id_profesor
                WHERE 
                    E.id_usuario = ?  -- Filtrar por el ID del alumno
            `, [idAlumno], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        res.json(rows);  // Devolver las sesiones en formato JSON
    } catch (error) {
        console.error('Error al obtener sesiones del alumno:', error.message);
        res.status(500).send(error.message);  // Respuesta en caso de error
    } finally {
        db.close();  // Cerrar la conexión a la base de datos
    }
});


// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
