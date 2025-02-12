function toggleItem(button) {
    const itemHeader = button.closest('.itemHeader'); // Encuentra el itemHeader más cercano
    const itemBody = itemHeader.nextElementSibling; // Obtiene el div .itemBody que está justo después
    const flecha = button.querySelector('.flecha'); // Obtiene la imagen dentro del botón

    itemBody.classList.toggle('mostrar'); // Alterna la visibilidad del contenido
    flecha.classList.toggle('rotar'); // Alterna la rotación de la flecha
}