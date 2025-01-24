
// FUNCIONES PARA TRAER LOS DATOS DEL SERVER
async function cargarModulos() {
    try {
        const response = await fetch('http://localhost:3000/selectModulos');
        if (!response.ok) {
            throw new Error(`Error al obtener los ciclos: ${response.statusText}`);
        }
        const modulos = await response.json();
        mostrarModulos(modulos);
    } catch (error) {
        console.error(error);
    }
}

async function cargarCiclos() {
    try {
        const response = await fetch('http://localhost:3000/selectCiclos');
        if (!response.ok) {
            throw new Error(`Error al obtener los ciclos: ${response.statusText}`);
        }
        const ciclos = await response.json();
        mostrarCiclos(ciclos);
    } catch (error) {
        console.error(error);
    }
}

async function cargarProfesores() {
    try {
        const response = await fetch('http://localhost:3000/selectProfesores');
        if (!response.ok) {
            throw new Error(`Error al obtener los profesores: ${response.statusText}`);
        }
        const profesores = await response.json();
        mostrarProfesores(profesores);
    } catch (error) {
        console.error(error);
    }
}

// FUNCIONES PARA MOSTRAR LOS DATOS RECOGIDOS EN "CARGAR" EN EL HTML

function mostrarCiclos(ciclos) {
    const selectCiclos = document.getElementById('id_ciclos');
    ciclos.forEach(ciclo => {
        const option = document.createElement('option');
        option.value = ciclo.id_ciclos;  // Asignar el id del ciclo como valor
        option.textContent = `${ciclo.id_ciclos} - ${ciclo.nombre}`;  // Mostrar "id - nombre"
        selectCiclos.appendChild(option);  // Añadir la opción al select
    });
}

function mostrarProfesores(profesores) {
    const selectProfesores = document.getElementById('id_profesor');
    profesores.forEach(profesor => {
        const option = document.createElement('option');
        option.value = profesor.id_profesor;  // Asignar el id del profesor como valor
        option.textContent = `${profesor.id_profesor} - ${profesor.nombre}`;  // Mostrar "id - nombre"
        selectProfesores.appendChild(option);  // Añadir la opción al select
    });
}


function mostrarModulos(modulos) {
    const container = document.getElementById('modulos');
    const rows = container.querySelectorAll('.table-row');
    rows.forEach(row => row.remove()); // Limpiar las filas anteriores

    modulos.forEach(modulo => {
        const row = document.createElement('div');
        row.classList.add('table-row');
        row.innerHTML = `
                    <div>${modulo.id_modulo}</div>
                    <div>${modulo.nombre}</div>
                    <div>${modulo.duracion}</div>
                    <div>${modulo.horas_semanales}</div>
                    <div>${modulo.descripcion}</div>
                    <div>${modulo.id_ciclos}</div>
                    <div>${modulo.id_profesor}</div>
                    <div onclick="editarModulo('${modulo.id_modulo}')" class="${modulo.id_modulo}-editar"><button>Editar</button></div>
                    <div onclick="eliminarModulo('${modulo.id_modulo}')" class="${modulo.id_modulo}-eliminar"><button>Eliminar</button></div>
                `;
        container.appendChild(row);
    });
}

async function insertarCiclos() {
    document.getElementById('formModulo').addEventListener('submit', async function (event) {

        event.preventDefault();

        const id_modulo = document.getElementById('id_modulo').value;
        const nombre = document.getElementById('nombre').value;
        const duracion = document.getElementById('duracion').value;
        const horas_semanales = document.getElementById('horas_semanales').value;
        const descripcion = document.getElementById('descripcion').value;
        const id_ciclos = document.getElementById('id_ciclos').value;
        const id_profesor = document.getElementById('id_profesor').value;
        

        const data = { id_modulo, nombre, duracion, horas_semanales, descripcion, id_ciclos, id_profesor };

        try {
            const response = await fetch('http://localhost:3000/insertModulo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Modulo insertado correctamente');
                document.getElementById('formModulo').reset();
                cargarModulos(); // Recargar los ciclos
            } else {
                const errorMessage = await response.text();
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error al insertar el modulo:', error);
            alert('Hubo un error al insertar el modulo.');
        }
    });
}
async function eliminarModulo(id_modulo) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el modulo con ID ${id_modulo}?`);
    if (!confirmacion) {
        return; // Si el usuario cancela, no se ejecuta nada
    }

    try {
        const response = await fetch(`http://localhost:3000/deleteModulo/${id_modulo}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Modulo eliminado correctamente');
            cargarCiclos(); // Recargar los ciclos tras la eliminación
        } else {
            const errorMessage = await response.text();
            alert(`Error al eliminar el modulo: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error al intentar eliminar el modulo:', error);
        alert('Hubo un error al intentar eliminar el modulo.');
    }
}

cargarModulos();
cargarCiclos();
cargarProfesores();
insertarCiclos();