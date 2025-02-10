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
});


