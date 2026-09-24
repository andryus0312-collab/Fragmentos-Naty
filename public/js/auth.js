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
                console.error("Error:", error.code, error.message);
                errorMsg.textContent = "Error: " + error.code;
                errorMsg.style.color = "#E53E3E";
            }
        });
    }
});
