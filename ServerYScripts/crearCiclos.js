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
    const article = document.getElementById('sec_ciclos').querySelector('article');
    // Limpiar la el article antes de agregar nuevos datos
    article.innerHTML = '';
    ciclos.forEach(ciclo => {
        const fila = document.createElement('div');   // crea en el html esta etiqueta = <div> </div>
        fila.id = ciclo.id_ciclos;
        fila.innerHTML = 
        `
            <legend id="id_ciclos" style="align-self: self-start;">${ciclo.id_ciclos} - ${ciclo.nombre}</legend>

            <p>
                <label for="${ciclo.id_ciclos}-idCiclo"><span>Id: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="${ciclo.id_ciclos}-idCiclo" name="ciclo-id" value="${ciclo.id_ciclos}" required></input>
            </p>
            
            <p>
                <label for="${ciclo.id_ciclos}-nombre"><span>Nombre: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="${ciclo.id_ciclos}-nombre" name="ciclo-nombre" value="${ciclo.nombre}" required></input>
            </p>
            
            <p>
                <label for="${ciclo.id_ciclos}-duracion"><span>Duracion: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="${ciclo.id_ciclos}-duracion" name="ciclo-duracion" value="${ciclo.duracion}" required></input>
            </p>

            <p>
                <label for="${ciclo.id_ciclos}-descripcion"><span>Descripcion: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <textarea type="text" id="${ciclo.id_ciclos}-descripcion" name="ciclo-descripcion" required>${ciclo.descripcion}</textarea>
            </p>

            <section style="width: 100%;">
                <button onclick="insertarCiclo('${ciclo.id_ciclos}')">guardar</button>
                <button onclick="eliminarCiclo('${ciclo.id_ciclos}')">eliminar</button>
            </section>
        `
        ;
        article.appendChild(fila);
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
    var art_ciclos = document.getElementById("art_ciclos");
    
    art_ciclos.innerHTML += `
        <div id="${id_ciclo}">
            <legend id="id_ciclos" style="align-self: self-start;"></legend>
            
            <p>
                <label for="${id_ciclo}-idCiclo"><span>Id: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="${id_ciclo}-idCiclo" name="ciclo-id" value="${id_ciclo}" required></input>
            </p>

            <p>
                <label for="${id_ciclo}-nombre"><span>Nombre: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="${id_ciclo}-nombre" name="ciclo-nombre" value="" required></input>
            </p>
            
            <p>
                <label for="${id_ciclo}-duracion"><span>Duracion: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="${id_ciclo}-duracion" name="ciclo-duracion" value="" required></input>
            </p>

            <p>
                <label for="${id_ciclo}-descripcion"><span>Descripcion: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <textarea type="text" id="${id_ciclo}-descripcion" name="ciclo-descripcion" required></textarea>
            </p>

            <section style="width: 100%;">
                <button onclick="insertarCiclo('${id_ciclo}')">guardar</button>
                <button onclick="eliminarCiclo('${id_ciclo}')">eliminar</button>
            </section>
        </div>
    `;
}