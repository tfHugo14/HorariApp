const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { parseStringPromise } = require('xml2js');
const { create } = require('xmlbuilder2');

const app = express();
const dbPath = './horariappBD';

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de multer para manejar archivos subidos
const upload = multer({ dest: 'uploads/' });

// Ruta para importar el archivo XML
app.post('/importar', upload.single('file'), async (req, res) => {  // <-- Convertido en función async
    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ningún archivo." });
    }

    try {
        // Leer el archivo XML
        const data = fs.readFileSync(req.file.path, 'utf8');

        // Convertir XML a JSON
        const result = await parseStringPromise(data);  // <-- Cambio importante aquí

        // Extraer datos de los alumnos
        const alumnos = result.Alumnado.Alumnos[0].Alumno;

        const db = new sqlite3.Database(dbPath);

        for (const alumno of alumnos) {
            const id_usuario = alumno.ID[0];
            const nombre = `${alumno.Nombre[0]} ${alumno.Apellido[0]}`;
            const dni = alumno.DNI[0];

            // Insertar en la base de datos
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO Estudiante (id_usuario, nombre, dni) VALUES (?, ?, ?)` ,
                    [id_usuario, nombre, dni],
                    function (err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        res.json({ message: "Importación completada correctamente." });

        db.close();
    } catch (error) {
        res.status(500).json({ message: "Error al procesar el XML: " + error.message });
    } finally {
        fs.unlink(req.file.path, () => {});  // Eliminar el archivo subido
    }
});

// Ruta para exportar datos a XML
app.get('/exportar', async (req, res) => {
    const db = new sqlite3.Database(dbPath);
    db.all("SELECT id_usuario, nombre, dni FROM Estudiante", [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: "Error al obtener los datos" });
            db.close();
            return;
        }

        // Construcción del XML
        const root = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('Alumnado')
            .ele('Centro')
                .ele('Nombre').txt('IES San Clemente').up()
                .ele('CodigoCentro').txt('15006141').up()
                .ele('Direccion')
                    .ele('Calle').txt('Rúa San Clemente, s/n').up()
                    .ele('Ciudad').txt('Santiago de Compostela').up()
                    .ele('CodigoPostal').txt('15705').up()
                    .ele('Provincia').txt('A Coruña').up()
                .up()
                .ele('Telefonos')
                    .ele('Telefono').txt('881867501').up()
                    .ele('Telefono').txt('881867502').up()
                .up()
                .ele('Email').txt('ies.sanclemente@edu.xunta.gal').up()
            .up()
            .ele('Alumnos');

        rows.forEach(row => {
            const nombreParts = row.nombre.trim().split(/\s+/);
            const nombre = nombreParts.shift() || "";
            const apellidos = nombreParts.join(" ") || "";

            root.ele('Alumno')
                .ele('ID').txt(row.id_usuario).up()
                .ele('Nombre').txt(nombre).up()
                .ele('Apellido').txt(apellidos).up()
                .ele('DNI').txt(row.dni).up()
            .up();
        });

        const xmlString = root.end({ prettyPrint: true });
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', 'attachment; filename=estudiantes.xml');
        res.send(xmlString);
        db.close();
    });
});

// Servidor
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));