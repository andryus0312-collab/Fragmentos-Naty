// 📍 public/js/auth.js
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            
            errorMsg.textContent = "Iniciando sesión...";
            errorMsg.style.color = "#5A6B7C";

            try {
                // Intentar iniciar sesión con Firebase
                await signInWithEmailAndPassword(auth, email, password);
                
                // Si es exitoso, redirigir al dashboard
                window.location.href = "dashboard.html";
                
            } catch (error) {
                // Manejar errores específicos de Firebase
                let mensajeError = "Error al iniciar sesión.";
                
                if (error.code === "auth/user-not-found") {
                    mensajeError = "No existe una cuenta con este correo.";
                } else if (error.code === "auth/wrong-password") {
                    mensajeError = "La contraseña es incorrecta.";
                } else if (error.code === "auth/invalid-email") {
                    mensajeError = "El formato del correo no es válido.";
                } else if (error.code === "auth/too-many-requests") {
                    mensajeError = "Demasiados intentos. Espera un momento.";
                }
                
                errorMsg.textContent = mensajeError;
                errorMsg.style.color = "#E53E3E";
            }
        });
    }
});
