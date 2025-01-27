async function getHorarios(idModulo) {
    try {
        if (!idModulo) {
            document.getElementById('result').textContent = 'Por favor, ingresa un ID de módulo.';
            return;
        }

        const response = await fetch(`http://localhost:3000/horarios/${idModulo}`);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const sesiones = await response.json();

        // Rangos horarios predefinidos
        const rangosHoras = [
            '08:00 - 10:00',
            '10:00 - 12:00',
            '12:00 - 14:00',
            '14:00 - 16:00'
        ];

        // Días de la semana
        const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];

        // Crear estructura inicial para la tabla con los rangos horarios vacíos
        const horarios = {};
        rangosHoras.forEach(rango => {
            horarios[rango] = {};
            diasSemana.forEach(dia => {
                horarios[rango][dia] = ''; // Inicialmente vacío
            });
        });

        // Función para convertir fecha a día de la semana
        function getDayOfWeek(dateString) {
            const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
            const date = new Date(dateString);
            return days[date.getDay()];
        }

        // Rellenar con datos de las sesiones
        sesiones.forEach(sesion => {
            const horaInicio = sesion.hora_ini.split(' ')[1].slice(0, 5);
            const horaFin = sesion.hora_fin.split(' ')[1].slice(0, 5);
            const rangoHoras = `${horaInicio} - ${horaFin}`;
            const dia = getDayOfWeek(sesion.dia);

            if (horarios[rangoHoras] && horarios[rangoHoras][dia] !== undefined) {
                horarios[rangoHoras][dia] = `Aula: ${sesion.aula}<br> ${sesion.descripcion}`;
            }
        });

        // Crear la tabla
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headers = ['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Llenar la tabla con datos (incluyendo los vacíos)
        rangosHoras.forEach(rangoHoras => {
            const row = document.createElement('tr');

            // Celda de rango de horas
            const horaCell = document.createElement('td');
            horaCell.textContent = rangoHoras;
            row.appendChild(horaCell);

            // Celdas de los días de la semana
            diasSemana.forEach(dia => {
                const cell = document.createElement('td');
                cell.innerHTML = horarios[rangoHoras][dia] || ''; // Mostrar vacío si no hay datos
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        // Mostrar la tabla
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ''; // Limpiar contenido previo
        resultDiv.appendChild(table);

        // Mostrar el formulario de modificación
        document.getElementById('modifyForm').style.display = 'block';
    } catch (error) {
        console.error('Error:', error); // Depuración
        document.getElementById('result').textContent = 'Error al cargar los horarios: ' + error.message;
    }
}
