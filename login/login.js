document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector("button");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    function setError(input) {
        input.style.borderBottom = "2px solid red";
    }

    function clearError(input) {
        input.style.borderBottom = "2px solid #235EA1";
    }

    button.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        clearError(usernameInput);
        clearError(passwordInput);

        if (username === "") {
            alert("El campo de usuario no puede estar vacío.");
            setError(usernameInput);
            usernameInput.focus();
            return;
        }

        if (password === "") {
            alert("El campo de contraseña no puede estar vacío.");
            setError(passwordInput);
            passwordInput.focus();
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            setError(passwordInput);
            passwordInput.focus();
            return;
        }

        alert("Acceso concedido");
    });
});
