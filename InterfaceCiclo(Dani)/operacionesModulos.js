
// FUNCIONES PARA TRAER LOS DATOS DEL SERVER
async function cargarModulosById(idCiclo) {
    console.log(idCiclo);
    try {
        const response = await fetch(`http://localhost:3000/selectModulos/${idCiclo}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los Modulos: ${response.statusText}`);
        }
        const modulos = await response.json();
        mostrarModulos(modulos);
    } catch (error) {
        console.error(error);
    }
}

function mostrarModulos(modulos) {
    const container = document.querySelector('.popup-content');
    container.innerHTML = '';
    modulos.forEach(modulo => {
        const row = document.createElement('div');
        row.innerHTML = `
                    <div>${modulo.id_modulo}</div>
                    <div>${modulo.nombre}</div>
                `;
        container.appendChild(row);
    });
}

