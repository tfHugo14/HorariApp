async function cargarModulosById(idEstudiante) {
    try {
        const response = await fetch(`http://localhost:3000/estudiantes/${idEstudiante}/ciclos`);
        if (!response.ok) {
            throw new Error(`Error al obtener los Modulos: ${response.statusText}`);
        }
        const modulos = await response.json();
        mostrarModulos(modulos, idEstudiante);
    } catch (error) {
        console.error("Error al cargar: " + idEstudiante);
    }
}

function mostrarModulos(modulos, idEstudiante) {
    const container = document.querySelector('#contenido_modulos');
    const popupHeader = document.querySelector('#titulo_modulos');
    container.innerHTML = '';
    popupHeader.innerHTML = `Modulos del Estudiante: ${idEstudiante}`;
    modulos.forEach(modulo => {
        const row = document.createElement('div');
        row.id = modulo.id_modulo;
        row.className = "popupModulo";
        row.innerHTML = `
                    <div><strong>${modulo.id_modulo}</strong></div>
                    <div>${modulo.nombre_modulo}</div>
                `;
        container.appendChild(row);
    });
}

document.addEventListener("click", function (event) {
    // Manejar la apertura del popup 
    if (event.target.closest(".verModulos")) {
        document.querySelector("#modal_modulos_alumno").style.display = "flex";
    }
    if (event.target.closest(".cerrar_modal_modulos")) {
        document.querySelector("#modal_modulos_alumno").style.display = "none";
    }

});


