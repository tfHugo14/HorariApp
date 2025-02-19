async function checkCredentials() {
    const estudiante = {
        "nombre": document.querySelector('input[name="username"]').value,
        "contrasenha": document.querySelector('input[name="password"]').value,
    };
    try {
        const response = await fetch('http://localhost:3000/estudiantes/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(estudiante)
        });

        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
    }
}