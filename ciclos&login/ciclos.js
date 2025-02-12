document.addEventListener("DOMContentLoaded", function () {
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
        botonActivo.style.backgroundColor = "rgb(27 244 157 / 63%)"; // Verde cuando está seleccionado
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

function toggleItem(button) {
    const itemHeader = button.closest('.itemHeader'); // Encuentra el itemHeader más cercano
    const itemBody = itemHeader.nextElementSibling; // Obtiene el div .itemBody que está justo después
    const flecha = button.querySelector('.flecha'); // Obtiene la imagen dentro del botón

    itemBody.classList.toggle('mostrar'); // Alterna la visibilidad del contenido
    itemHeader.classList.toggle('abierto');
    flecha.classList.toggle('rotar'); // Alterna la rotación de la flecha
}