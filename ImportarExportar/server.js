const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { parseString } = require('xml2js');

const app = express();
const dbPath = './horariappBD';

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de multer para manejar archivos subidos
const upload = multer({ dest: 'uploads/' });

// Ruta para importar el archivo XML
app.post('/importar', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ningún archivo." });
    }

    // Leer el archivo XML
    fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error al leer el archivo." });
        }

        // Convertir XML a JSON
        parseString(data, async (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error al procesar el XML." });
            }

            // Extraer datos de los alumnos
            const alumnos = result.Alumnado.Alumnos[0].Alumno;

            const db = new sqlite3.Database(dbPath);

            try {
                for (const alumno of alumnos) {
                    const id_usuario = alumno.ID[0];
                    const nombre = `${alumno.Nombre[0]} ${alumno.Apellido[0]}`;
                    const dni = alumno.DNI[0];

                    // Insertar en la base de datos
                    await new Promise((resolve, reject) => {
                        db.run(
                            `INSERT INTO Estudiante (id_usuario, nombre, dni) VALUES (?, ?, ?)`,
                            [id_usuario, nombre, dni],
                            function (err) {
                                if (err) reject(err);
                                else resolve();
                            }
                        );
                    });
                }

                res.json({ message: "Importación completada correctamente." });

            } catch (error) {
                res.status(500).json({ message: "Error al insertar en la base de datos: " + error.message });
            } finally {
                db.close();
                fs.unlink(req.file.path, () => {}); // Eliminar el archivo subido
            }
        });
    });
});

// Servidor
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
