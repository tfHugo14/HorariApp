const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const dbPath = './copiaHorariappBD';

const cors = require('cors'); 

app.use(cors());
app.use(express.json());

// Operaciones con la tabla CICLOS

app.get('/selectCiclos', async (req, res) => {
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
app.delete('/deleteCiclo/:id', async (req, res) => {
    const { id } = req.params; // ID del ciclo que queremos eliminar
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Ciclos WHERE id_ciclos = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes); // Devuelve cuántas filas fueron eliminadas
            });
        });
        res.send('Ciclo eliminado correctamente');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});
app.post('/insertCiclo',
 async (req, res) => {
    const { id_ciclos, nombre, descripcion, duracion } = req.body; 
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO Ciclos (id_ciclos, nombre, descripcion, duracion) VALUES (?, ?, ?, ?)', [id_ciclos, nombre, descripcion,duracion], function(err) {
                if (err) reject(err);
                else resolve(this.lastID); 
            });
        });
        res.status(201).send('Ciclo insertado correctamente');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});
app.put('/updateCiclo/:id', async (req, res) => {
    const { id } = req.params;  // ID del ciclo que queremos actualizar
    const { nombre, descripcion } = req.body;  // Nuevos valores para el ciclo
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('UPDATE Ciclos SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id], function(err) {
                if (err) reject(err);
                else resolve(this.changes); // Devuelve cuántas filas fueron modificadas
            });
        });
        res.send('Ciclo actualizado correctamente');
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        db.close();
    }
});

// Operaciones con la tabla MATRICULAR_MODULOS



// Operaciones con la tabla MODULOS

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

app.post('/insertModulo',
 async (req, res) => {
    const { id_modulo, duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor } = req.body; 
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO Modulos (id_modulo, duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor) VALUES (?, ?, ?, ?, ?, ?, ?)',
             [id_modulo, duracion, nombre, horas_semanales, descripcion, id_ciclos, id_profesor], function(err) {
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
app.delete('/deleteModulo/:id', async (req, res) => {
    const { id } = req.params; // ID del ciclo que queremos eliminar
    const db = new sqlite3.Database(dbPath);
    try {
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Modulos WHERE id_modulo = ?', [id], function(err) {
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

// Operaciones con la tabla PROFESOR

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

// Servidor

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));