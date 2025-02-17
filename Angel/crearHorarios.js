// Función para obtener y mostrar el horario completo de un alumno
async function getHorariosAlumno() {
  const idAlumno = document.getElementById("alumnoId").value;
  if (!idAlumno) {
      alert("Por favor, ingresa un ID de alumno.");
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/horariosAlumno/${idAlumno}`);
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      const sesiones = await response.json();
      console.log("Sesiones del alumno:", sesiones);

      if (sesiones.length === 0) {
          document.getElementById("result").innerHTML = "<p>No se encontraron horarios para este alumno.</p>";
          return;
      }

      // Definir los días de la semana y los rangos horarios fijos
      const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
      const horariosDisponibles = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00'];

      // Colores para cada día
      const coloresDias = {
          'lunes': '#FFC107',    // Amarillo
          'martes': '#17A2B8',   // Azul
          'miércoles': '#28A745', // Verde
          'jueves': '#DC3545',   // Rojo
          'viernes': '#6610F2'   // Morado
      };

      // Crear objeto para el horario con todos los rangos y días definidos, inicialmente vacíos
      const schedule = {};
      horariosDisponibles.forEach(rango => {
          schedule[rango] = {};
          diasSemana.forEach(dia => {
              schedule[rango][dia] = "";  // celda vacía
          });
      });

      // Rellenar la estructura con las sesiones obtenidas
      sesiones.forEach(sesion => {
          const horaInicio = sesion.hora_ini.slice(11, 16);
          const horaFin = sesion.hora_fin.slice(11, 16);
          const rangoHoras = `${horaInicio} - ${horaFin}`;
          const dia = sesion.dia.toLowerCase();
          if (!diasSemana.includes(dia)) return;

          const nombreModulo = sesion.nombre_modulo || "Módulo no disponible";

          if (schedule[rangoHoras][dia] !== "") {
              schedule[rangoHoras][dia] += "<br>" + nombreModulo;
          } else {
              schedule[rangoHoras][dia] = nombreModulo;
          }
      });

      console.log("Datos generados para la tabla:", schedule);

      // Generar la tabla HTML con colores dinámicos
      let tableHTML = `
      <table class="table table-bordered">
          <thead>
              <tr>
                  <th>Hora</th>
                  <th style="background-color: ${coloresDias['lunes']}; color: black;">Lunes</th>
                  <th style="background-color: ${coloresDias['martes']}; color: white;">Martes</th>
                  <th style="background-color: ${coloresDias['miércoles']}; color: white;">Miércoles</th>
                  <th style="background-color: ${coloresDias['jueves']}; color: white;">Jueves</th>
                  <th style="background-color: ${coloresDias['viernes']}; color: white;">Viernes</th>
              </tr>
          </thead>
          <tbody>
      `;

      horariosDisponibles.forEach(rango => {
          tableHTML += `<tr><td>${rango}</td>`;
          diasSemana.forEach(dia => {
              const colorFondo = coloresDias[dia];
              tableHTML += `<td style="background-color: ${colorFondo}; color: white;">${schedule[rango][dia] || ''}</td>`;
          });
          tableHTML += "</tr>";
      });

      tableHTML += "</tbody></table>";
      document.getElementById("result").innerHTML = tableHTML;
  } catch (error) {
      console.error("Error al obtener horarios del alumno:", error);
      document.getElementById("result").innerHTML = "Error: " + error.message;
  }
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Horarios del Alumno", 15, 15);

  let y = 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // Seleccionar la tabla generada en #result
  const table = document.querySelector("#result table");
  if (!table || table.rows.length === 0) {
      alert("No hay horarios disponibles para exportar.");
      return;
  }

  const headers = Array.from(table.rows[0].cells).map(cell => cell.textContent);
  const data = [];
  
  // Obtener filas de la tabla
  for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const rowData = Array.from(row.cells).map(cell => cell.textContent);
      data.push(rowData);
  }

  doc.autoTable({
      head: [headers], 
      body: data,
      startY: y,
      styles: { fillColor: [255, 255, 255] }, // Evita el error de color
      headStyles: { fillColor: [100, 100, 100], textColor: [255, 255, 255] }, // Encabezado en gris
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Filas alternas gris claro
  });

  doc.save("HorarioAlumno.pdf");
}

// Función para obtener y mostrar las sesiones de un alumno
async function getSesionesAlumno() {
  const idAlumno = document.getElementById("alumnoId").value; 
  if (!idAlumno) {
    alert("Por favor, ingresa un ID de alumno.");
    return;
  }

  // Actualizamos el contenedor "result" con un mensaje inicial
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "<p>Cargando sesiones...</p>";

  try {
    const response = await fetch(`http://localhost:3000/sesionesAlumno/${idAlumno}`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const sesiones = await response.json();
    console.log("Sesiones obtenidas:", sesiones); 
    mostrarSesiones(sesiones); 
  } catch (error) {
    console.error("Error al obtener sesiones del alumno:", error);
    alert("Error al obtener sesiones del alumno: " + error.message);
  }
}

function mostrarSesiones(sesiones) {
  const container = document.getElementById("sessionsContainer");
  
  // Limpiar cualquier contenido previo
  container.innerHTML = '';
  
  // Si no hay sesiones, mostramos un mensaje
  if (sesiones.length === 0) {
    container.innerHTML = '<p>No se encontraron sesiones para este alumno.</p>';
    return;
  }

  // Creamos una tabla para mostrar las sesiones
  const table = document.createElement("table");
  const tableHeader = `
    <thead>
      <tr>
        <th>ID Sesión</th>
        <th>Hora de Inicio</th>
        <th>Hora de Fin</th>
        <th>Día</th>
        <th>Aula</th>
        <th>Descripción</th>
        <th>Nombre Módulo</th>
        <th>Nombre Ciclo</th>
        <th>Profesor</th>
      </tr>
    </thead>
  `;
  
  table.innerHTML = tableHeader; 

  const tableBody = document.createElement("tbody");

  sesiones.forEach(sesion => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${sesion.id_sesiones}</td>
      <td>${sesion.hora_ini}</td>
      <td>${sesion.hora_fin}</td>
      <td>${sesion.dia}</td>
      <td>${sesion.aula}</td>
      <td>${sesion.descripcion_sesion}</td>
      <td>${sesion.nombre_modulo}</td>
      <td>${sesion.nombre_ciclo}</td>
      <td>${sesion.nombre_profesor || 'Sin Profesor'}</td>
    `;

    // Añadir un evento para mostrar el formulario de modificación cuando se hace clic en la fila
    row.onclick = () => {
      mostrarFormularioModificar(sesion);
    };

    tableBody.appendChild(row); 
  });

  table.appendChild(tableBody); 
  container.appendChild(table); 
}

function mostrarFormularioModificar(sesion) {
  const modifyForm = document.getElementById("modifyForm");
  const sesionIdInput = document.getElementById("sesionId");
  const horaIniInput = document.getElementById("horaIni");
  const horaFinInput = document.getElementById("horaFin");
  const diaInput = document.getElementById("dia");
  const aulaInput = document.getElementById("aula");
  const descripcionInput = document.getElementById("descripcion");

  // Asignamos los valores de la sesión seleccionada al formulario
  sesionIdInput.value = sesion.id_sesiones;
  horaIniInput.value = sesion.hora_ini;
  horaFinInput.value = sesion.hora_fin;
  diaInput.value = sesion.dia;
  aulaInput.value = sesion.aula;
  descripcionInput.value = sesion.descripcion_sesion;

  // Mostramos el formulario de modificación
  modifyForm.style.display = 'block';
}
// Llamar a la función cuando el usuario hace clic en el botón
document.getElementById("btnObtenerSesiones").addEventListener("click", getSesionesAlumno);
