document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".boton");

    botones.forEach(boton => {
        boton.addEventListener("click", function () {
            const itemHeader = this.closest(".itemHeader"); 
            const itemBody = itemHeader.nextElementSibling;
            const flecha = this.querySelector(".flecha");

            if (itemBody.classList.contains("mostrar")) {
                itemBody.style.maxHeight = itemBody.scrollHeight + "%"; // Fijar altura antes de contraer
                setTimeout(() => {
                    itemBody.classList.remove("mostrar");
                    itemHeader.classList.remove("abierto");
                    flecha.classList.remove("rotar");
                }, 10); 
            } else {
                itemBody.classList.add("mostrar");
                itemHeader.classList.add("abierto");
                flecha.classList.add("rotar");
                itemBody.style.maxHeight = itemBody.scrollHeight + "%"; // Expandir suavemente
            }
        });
    });

    // Nueva funcionalidad para mostrar y ocultar los mainContainers y mantener el botón activo sin cambiar su tamaño
    const btnDistancia = document.querySelector("button:nth-child(1)");
    const btnPresencial = document.querySelector("button:nth-child(2)");
    const mainDistancia = document.getElementById("mainContainerDistancia");
    const mainPresencial = document.getElementById("mainContainerPresencial");

    // Ocultar ambos al inicio
    mainDistancia.style.display = "none";
    mainPresencial.style.display = "none";

    // Función para cambiar el estado de los botones sin modificar su tamaño
    function activarBoton(botonActivo, botonInactivo) {
        botonActivo.style.backgroundColor = "#1BF49D"; // Verde cuando está seleccionado
        botonInactivo.style.backgroundColor = "#F4791B"; // Naranja cuando no está seleccionado
        botonActivo.style.transform = "scale(0.8)"; // Mantiene el tamaño reducido
        botonInactivo.style.transform = "scale(1)"; // Vuelve al tamaño normal el otro botón
    }

    btnDistancia.addEventListener("click", function () {
        mainDistancia.style.display = "block";
        mainPresencial.style.display = "none";
        activarBoton(btnDistancia, btnPresencial);
    });

    btnPresencial.addEventListener("click", function () {
        mainPresencial.style.display = "block";
        mainDistancia.style.display = "none";
        activarBoton(btnPresencial, btnDistancia);
    });
});


