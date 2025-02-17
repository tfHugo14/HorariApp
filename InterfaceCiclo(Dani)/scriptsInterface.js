document.addEventListener("click", function (event) {
    if (event.target.closest(".boton")) {
        const boton = event.target.closest(".boton");
        const itemHeader = boton.closest(".itemHeader");
        const itemBody = itemHeader.nextElementSibling;
        const flecha = boton.querySelector(".flecha");

        if (itemBody.classList.contains("mostrar")) {
            itemBody.style.maxHeight = itemBody.scrollHeight + "px"; // Fijar altura antes de contraer
            setTimeout(() => {
                itemBody.classList.remove("mostrar");
                itemBody.style.maxHeight = "0px"; // Contraer
                itemHeader.classList.remove("abierto");
                flecha.classList.remove("rotar");
            }, 10);
        } else {
            itemBody.classList.add("mostrar");
            itemHeader.classList.add("abierto");
            flecha.classList.add("rotar");
            itemBody.style.maxHeight = itemBody.scrollHeight + "px"; // Expandir suavemente

            setTimeout(() => {
                itemBody.style.maxHeight = "none";
            }, 300);
        }
    }

    // Manejar la apertura del popup 
    if (event.target.closest(".verModulos")) {
        document.querySelector(".popup-overlay").style.display = "flex";
    }
    if (event.target.closest(".close-popup") || event.target.classList.contains("popup-overlay")) {
        document.querySelector(".popup-overlay").style.display = "none";
    }
    if (event.target.closest(".addIcon")) {
        crearCicloVacio();
        document.querySelector(".popup-overlay").style.display = "flex";
    }
});

