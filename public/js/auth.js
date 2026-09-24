// 📍 public/js/auth.js
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            
            errorMsg.textContent = "Iniciando sesión...";
            errorMsg.style.color = "#5A6B7C";

            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("Error completo:", error);
                console.error("Código de error:", error.code);
                console.error("Mensaje:", error.message);
                
                let mensajeError = "Error al iniciar sesión.";
                
                if (error.code === "auth/user-not-found") {
                    mensajeError = "❌ No existe cuenta con este correo. Revisa Firebase -> Authentication -> Users.";
                } else if (error.code === "auth/wrong-password") {
                    mensajeError = "❌ Contraseña incorrecta.";
                } else if (error.code === "auth/invalid-email") {
                    mensajeError = "❌ Correo no válido.";
                } else if (error.code === "auth/invalid-api-key") {
                    mensajeError = "❌ API Key de Firebase incorrecta. Revisa firebase-config.js";
                } else if (error.code === "auth/api-key-not-found") {
                    mensajeError = "❌ Falta la API Key. Revisa firebase-config.js";
                } else if (error.code === "auth/too-many-requests") {
                    mensajeError = "⏳ Demasiados intentos. Espera unos minutos.";
                } else if (error.code === "auth/network-request-failed") {
                    mensajeError = "📡 Error de red. Revisa tu conexión.";
                } else {
                    mensajeError = "❌ Error: " + error.code;
                }
                
                errorMsg.textContent = mensajeError;
                errorMsg.style.color = "#E53E3E";
            }
        });
    }
});
