document.getElementById("downloadButton").addEventListener("click", function () {
    let icono = document.getElementById("iconoDescarga");
    let linea = document.getElementById("linea");
  
    // Agregar las clases de animación
    icono.classList.add("rebotando");
    linea.classList.add("doblandose");
  
    // Remover las clases después de la animación para que pueda repetirse
    setTimeout(() => {
      icono.classList.remove("rebotando");
      linea.classList.remove("doblandose");
    }, 1500); // Igual a la duración de la animación
  });