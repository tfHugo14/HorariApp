async function getHorarios(idModulo) {
    try {
        if (!idModulo) {
            document.getElementById('result').textContent = 'Por favor, ingresa un ID de módulo.';
            return;
        }

        const response = await fetch(`http://localhost:3000/horarios/${idModulo}`);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const sesiones = await response.json();
        console.log("📌 Respuesta del servidor:", sesiones);

        // Verificar la estructura de una sesión
        if (sesiones.length > 0) {
            console.log("📌 Estructura de una sesión:", sesiones[0]);
        }

        // Definir los días de la semana y los rangos de horas
        const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
        const horariosDisponibles = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00'];

        // Crear estructura vacía de la tabla
        const horarios = {};
        horariosDisponibles.forEach(rango => {
            horarios[rango] = { lunes: '', martes: '', miércoles: '', jueves: '', viernes: '' };
        });

        // **Llenar la estructura con las sesiones recibidas**
        sesiones.forEach(sesion => {
            console.log("🔹 Procesando sesión:", sesion);

            const diaSemana = sesion.dia.toLowerCase(); // El día ya viene en formato texto
            if (!diasSemana.includes(diaSemana)) return; // Ignorar si el día no es válido

            // Obtener solo la hora en formato HH:MM
            const horaInicio = sesion.hora_ini.slice(11, 16);
            const horaFin = sesion.hora_fin.slice(11, 16);
            const rangoHoras = `${horaInicio} - ${horaFin}`;

            console.log(`✅ Asignando sesión al día ${diaSemana} en horario ${rangoHoras}`);

            // Si el horario coincide con uno de los definidos, lo insertamos
            if (horarios[rangoHoras]) {
                // **Mostrar el nombre del módulo desde la respuesta del servidor**
                const nombreModulo = sesion.nombre_modulo || "Módulo no disponible";
                horarios[rangoHoras][diaSemana] = nombreModulo;
            }
        });

        console.log("📊 Datos generados para la tabla:", horarios);

        // **Crear la tabla HTML**
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Hora</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
            </tr>
        `;

        // **Insertar filas con los datos**
        Object.keys(horarios).forEach(rangoHoras => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rangoHoras}</td>
                <td>${horarios[rangoHoras].lunes || ''}</td>
                <td>${horarios[rangoHoras].martes || ''}</td>
                <td>${horarios[rangoHoras].miércoles || ''}</td>
                <td>${horarios[rangoHoras].jueves || ''}</td>
                <td>${horarios[rangoHoras].viernes || ''}</td>
            `;
            table.appendChild(row);
        });

        // **Insertar la tabla en el HTML**
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ''; // Limpiar antes de agregar la nueva tabla
        resultDiv.appendChild(table);
        console.log("✅ Tabla añadida al DOM.");

        // **Mostrar formulario de modificación**
        document.getElementById('modifyForm').style.display = 'block';
    } catch (error) {
        console.error("❌ Error:", error);
        document.getElementById('result').textContent = 'Error al cargar los horarios: ' + error.message;
    }
}


function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Horarios de Módulo", 20, 20);

    let y = 30; // Iniciamos la posición Y para la tabla

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Seleccionamos la tabla con id 'result' y aseguramos que tiene datos
    const table = document.querySelector("#result table");

    // Si no existe la tabla o está vacía, mostramos un mensaje
    if (!table || table.rows.length === 0) {
        alert("No hay horarios disponibles para exportar.");
        return;
    }

    // Definir los anchos de las columnas (ajustar según sea necesario)
    const colWidths = [30, 35, 35, 35, 35, 35]; // Ajuste de los anchos para las columnas (en milímetros)
    const marginLeft = 2.5;  // Márgenes para el contenido
    const cellPadding = 4;  // Espaciado interno de las celdas

    // Escribimos las cabeceras de la tabla en el PDF
    const headers = Array.from(table.rows[0].cells).map(cell => cell.textContent);

    // Dibujar cabeceras
    let x = marginLeft;
    headers.forEach((header, index) => {
        doc.text(header, x + cellPadding, y + cellPadding, { maxWidth: colWidths[index] - 2 * cellPadding });
        x += colWidths[index];
    });
    y += 10; // Aumentamos la posición Y después de las cabeceras

    // Dibujar líneas de la tabla para las cabeceras
    x = marginLeft;
    doc.line(marginLeft, y, marginLeft + colWidths.reduce((a, b) => a + b, 0), y); // Línea horizontal
    headers.forEach((_, index) => {
        doc.line(x, y - 10, x, y); // Líneas verticales
        x += colWidths[index];
    });

    // Recorremos las filas de la tabla (empezando desde la fila 1, que contiene los datos)
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cells = Array.from(row.cells).map(cell => cell.textContent);

        // Calcular el alto de la fila basado en el contenido
        let maxLines = 1;
        cells.forEach((cell, index) => {
            const textLines = doc.splitTextToSize(cell, colWidths[index] - 2 * cellPadding);
            if (textLines.length > maxLines) {
                maxLines = textLines.length;
            }
        });

        // Dibujar las celdas de la fila
        x = marginLeft;
        cells.forEach((cell, index) => {
            const textLines = doc.splitTextToSize(cell, colWidths[index] - 2 * cellPadding);
            textLines.forEach((line, lineIndex) => {
                doc.text(line, x + cellPadding, y + cellPadding + lineIndex * 10, { maxWidth: colWidths[index] - 2 * cellPadding });
            });
            // Dibujar líneas verticales
            doc.line(x, y, x, y + maxLines * 10);
            x += colWidths[index];
        });

        // Dibujar línea horizontal al final de la fila
        doc.line(marginLeft, y + maxLines * 10, x, y + maxLines * 10);
        y += maxLines * 10; // Aumentamos la posición Y para la siguiente fila

        // Si llegamos al final de la página, añadimos una nueva
        if (y > 260) {
            doc.addPage();
            y = 20; // Reiniciamos la posición Y
        }
    }

    // Dibujar la línea vertical final de la tabla
    doc.line(marginLeft + colWidths.reduce((a, b) => a + b, 0), 30, marginLeft + colWidths.reduce((a, b) => a + b, 0), y);

    // Finalmente, guardamos el archivo PDF
    doc.save("Horario.pdf");
}