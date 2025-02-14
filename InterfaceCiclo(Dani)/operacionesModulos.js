
// FUNCIONES PARA TRAER LOS DATOS DEL SERVER
async function cargarModulosById(idCiclo) {
    try {
        const response = await fetch(`http://localhost:3000/selectModulos/${idCiclo}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los Modulos: ${response.statusText}`);
        }
        const modulos = await response.json();
        mostrarModulos(modulos, idCiclo);
    } catch (error) {
        console.error(error);
    }
}

function mostrarModulos(modulos, idCiclo) {
    const container = document.querySelector('.popup-body');
    const popupHeader = document.querySelector('.idCicloHeader');
    container.innerHTML = '';
    popupHeader.innerHTML = `Modulos del Ciclo: ${idCiclo}`;
    modulos.forEach(modulo => {
        const row = document.createElement('div');
        row.id = modulo.id_modulo;
        row.className = "popupModulo";
        row.innerHTML = `
                    <div><strong>${modulo.id_modulo}</strong></div>
                    <div>${modulo.nombre}</div>
                `;
        container.appendChild(row);
    });
}


