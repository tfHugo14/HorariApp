function crearCiclo() {
    let id_ciclo = prompt("Introduce el ID del ciclo:", "C000");
    var art_ciclos = document.getElementById("art_ciclos");
    
    art_ciclos.innerHTML += `
        <fieldset id="${id_ciclo}">
            <legend id="id_ciclos" style="align-self: self-start;"></legend>
            
            <p>
                <label for="name"><span>Id: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="idCiclo" name="ciclo-id" value="${id_ciclo}" required></input>
            </p>

            <p>
                <label for="name"><span>Nombre: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="nombre" name="ciclo-nombre" value="" required></input>
            </p>
            
            <p>
                <label for="pwd"><span>Duracion: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <input type="text" id="duracion" name="ciclo-duracion" value="" required></input>
            </p>

            <p>
                <label for="mail"><span>Descripcion: </span>
                    <strong><span aria-label="required">*</span></strong>
                </label>
                <textarea type="text" id="descripcion" name="ciclo-descripcion" required></textarea>
            </p>

            <section style="width: 100%;">
                <button>guardar</button>
                <button>eliminar</button>
            </section>
        </fieldset>
    `;


}