// Función para obtener los datos de los ciclos
async function cargarCiclos() {
    try {
        // Obtiene los datos de la tabla ciclos en forma json
        const response = await fetch('http://localhost:3000/ciclos');
        if (!response.ok) {
            throw new Error(`Error al obtener los ciclos: ${response.statusText}`);
        }
        const ciclos = await response.json();
        mostrarCiclos(ciclos);
    } catch (error) {
        console.error(error);
    }
}

// Función para cargar los ciclos en la seccion
function mostrarCiclos(ciclos) {
    // Busca el elemento html al que le vamos a agregar los datos
    const section = document.getElementById('sectionContainer');
    // Limpiar la el article antes de agregar nuevos datos

    section.innerHTML = '';
    ciclos.forEach(ciclo => {
        const fila = document.createElement('article');   // crea en el html esta etiqueta = <div> </div>
        fila.id = ciclo.id_ciclos;
        fila.className = "itemWrapper";

        fila.innerHTML = `
        <div class="itemHeader" id="${ciclo.id_ciclos}Header">
         <button class="deleteCiclo">&times;</button>
            <h3 style="margin: 0;">idCiclo: ${ciclo.id_ciclos}</h3>
            <button class="boton"><img src="imagenes/flecha.png" class="flecha" alt="flecha"></button>
        </div>
        <div class="itemBody">
            <p><span style="font-weight:bold; text-decoration:underline;">Nombre:</span> <span class="ciclo-nombre">${ciclo.nombre}</span></p>
            <p><span style="font-weight:bold; text-decoration:underline;">Duración:</span> <span class="ciclo-duracion">${ciclo.duracion}</span></p>
            <p style="word-wrap: break-word; "><span style="font-weight:bold; text-decoration:underline;">Descripción:</span> <span class="ciclo-descripcion">${ciclo.descripcion}</span></p>
            <div class="botonesCiclo">
                <button onClick="cargarModulosById('${ciclo.id_ciclos}')" class="verModulos">Modulos</button>
                <button class="editarCiclo" onclick="editarCiclo('${ciclo.id_ciclos}')">Editar</button>
            </div>
        </div>`;

        section.appendChild(fila);
    });
}

async function eliminarCiclo(id_ciclos) {
    try {
        const response = await fetch(`http://localhost:3000/ciclos/${id_ciclos}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el ciclo: ${response.statusText}`);
        }

        alert(`Ciclo ${id_ciclos} eliminado correctamente.`);
        cargarCiclos();
    } catch (error) {
        console.error(error);
    }
}

async function insertarCiclo(id) {
    var div = document.getElementById(id);

    if (!div) {
        console.error(`No se encontró el div con ID: ${id}`);
        return;
    }

    const nuevoCiclo = {
        "id_ciclos": div.querySelector(`input[name="ciclo-id"]`)?.value || "",
        "nombre": div.querySelector(`input[name="ciclo-nombre"]`)?.value || "",
        "descripcion": div.querySelector(`textarea[name="ciclo-descripcion"]`)?.value || "",
        "duracion": parseInt(div.querySelector(`input[name="ciclo-duracion"]`)?.value, 10) || 0
    };

    console.log("Enviando datos:", nuevoCiclo); // Debug para verificar los datos

    try {
        const response = await fetch('http://localhost:3000/ciclos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCiclo)
        });

        if (!response.ok) {
            throw new Error(`Error al insertar ciclo: ${response.statusText}`);
        }

        console.log('Ciclo insertado exitosamente.');
        alert('Ciclo insertado correctamente.');
    } catch (error) {
        console.error(error);
    }
}

function crearCicloVacio() {
    let id_ciclo = prompt("Introduce el ID del ciclo:", "C000");
    const container = document.querySelector('.popup-body');
    const popupHeader = document.querySelector('.idCicloHeader');
    popupHeader.innerHTML = 'Añade un ciclo:';
    container.innerHTML = '';
    container.innerHTML += `
        <form id="${id_ciclo}">
    <legend id="id_ciclos">Formulario Ciclo</legend>
    
    <p>
        <label for="${id_ciclo}-idCiclo"><span>Id: </span>
        </label>
        <input type="text" id="${id_ciclo}-idCiclo" name="ciclo-id" value="${id_ciclo}" required></input>
    </p>

    <p>
        <label for="${id_ciclo}-nombre"><span>Nombre: </span>
        </label>
        <input type="text" id="${id_ciclo}-nombre" name="ciclo-nombre" value="" required></input>
    </p>
    
    <p>
        <label for="${id_ciclo}-duracion"><span>Duración: </span>
        </label>
        <input type="text" id="${id_ciclo}-duracion" name="ciclo-duracion" value="" required></input>
    </p>

    <p>
        <label for="${id_ciclo}-descripcion"><span>Descripción: </span>
        </label>
        <textarea type="text" id="${id_ciclo}-descripcion" name="ciclo-descripcion" required></textarea>
    </p>

    <section style="width: 100%;">
        <button onclick="insertarCiclo('${id_ciclo}')">guardar</button>
    </section>
</form>
    `;
}
// Editar 

function editarCiclo(id_ciclo) {
    console.log(id_ciclo);
    // Seleccionar la fila correspondiente (en este caso, el div del ciclo)
    const row = document.getElementById(`${id_ciclo}Header`);
    const body = row.nextElementSibling; // El body es el div donde están los detalles

    console.log(row);
    console.log(body);
    // Verificar si ya está en modo edición
    if (body.getAttribute('data-editing') === 'true') {
        return; // Evitar múltiples ediciones en la misma fila
    }

    // Cambiar atributo para indicar que está en edición
    body.setAttribute('data-editing', 'true');

    // Obtener los valores actuales de los campos
    const nombre = body.querySelector('.ciclo-nombre').textContent;
    const duracion = body.querySelector('.ciclo-duracion').textContent;
    const descripcion = body.querySelector('.ciclo-descripcion').textContent;

    // Reemplazar contenido por campos editables
    body.querySelector('.ciclo-nombre').innerHTML = `<input type="text" value="${nombre}" style="padding: 5px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; width: 100%;">`;
    body.querySelector('.ciclo-duracion').innerHTML = `<input type="text" value="${duracion}" style="padding: 5px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; width: 100%;">`;
    body.querySelector('.ciclo-descripcion').innerHTML = `<textarea style="padding: 5px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px; width: 100%; height: 100px;">${descripcion}</textarea>`;


    // Cambiar el botón de "Editar" por "Aceptar"
    const editarBtn = body.querySelector('.editarCiclo');
    editarBtn.innerHTML = 'Aceptar';
    editarBtn.onclick = () => aceptarEdicionCiclo(id_ciclo);

    // Deshabilitar el botón de "Modulos" mientras se edita
    const modulosBtn = body.querySelector('.verModulos');
    modulosBtn.disabled = true;
}

async function aceptarEdicionCiclo(id_ciclo) {
    // Seleccionar la fila correspondiente (en este caso, el div del ciclo)
    const row = document.getElementById(`${id_ciclo}Header`);
    const body = row.nextElementSibling;

    // Obtener los valores de los campos editables
    const nombre = body.querySelector('.ciclo-nombre input').value;
    const duracion = body.querySelector('.ciclo-duracion input').value;
    const descripcion = body.querySelector('.ciclo-descripcion textarea').value;

    const data = { id_ciclo, nombre, duracion, descripcion };

    try {
        const response = await fetch(`http://localhost:3000/updateCiclo/${id_ciclo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Ciclo actualizado correctamente');
            cargarCiclos(); // Recargar la lista de ciclos
        } else {
            const errorMessage = await response.text();
            alert(`Error al actualizar el ciclo: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error al actualizar el ciclo:', error);
        alert('Hubo un error al actualizar el ciclo.');
    }

    // Reemplazar los inputs por texto
    body.querySelector('.ciclo-nombre').textContent = nombre;
    body.querySelector('.ciclo-duracion').textContent = duracion;
    body.querySelector('.ciclo-descripcion').textContent = descripcion;

    // Cambiar el botón de "Aceptar" por "Editar"
    const editarBtn = body.querySelector('.editarCiclo');
    editarBtn.innerHTML = 'Editar';
    editarBtn.onclick = () => editarCiclo(id_ciclo);

    // Habilitar el botón de "Modulos"
    const modulosBtn = body.querySelector('.verModulos');
    modulosBtn.disabled = false;

    // Remover el atributo de edición
    body.removeAttribute('data-editing');
}

cargarCiclos();