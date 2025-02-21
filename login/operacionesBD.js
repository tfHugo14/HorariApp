async function checkCredentials() {
    const usuario = {
        nombre: document.querySelector('input[name="username"]').value,
        contrasenha: document.querySelector('input[name="password"]').value,
    };

    try {
        // Try logging in as an Estudiante
        const estudianteResponse = await fetch('http://localhost:3000/estudiantes/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        if (estudianteResponse.ok) {
            return 0; // Success: user is a student
        } else if (estudianteResponse.status !== 404) {
            return -1; // Other error (e.g., 500, network issue)
        }

        // If not found (404), try logging in as an Admin
        const adminResponse = await fetch('http://localhost:3000/administrador/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        if (adminResponse.ok) {
            return 1; // Success: user is an admin
        } else if (adminResponse.status !== 404) {
            return -1; // Other error (e.g., 500, network issue)
        }

        // If neither login works, return -2
        return -2;

    } catch (error) {
        console.error("Error en la conexión:", error);
        return -1; // Network error
    }
}
