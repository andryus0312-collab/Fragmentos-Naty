// 📍 public/js/firebase-config.js
// Importar las funciones necesarias desde los servidores de Firebase (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// PEGA AQUÍ TUS CREDENCIALES DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAGSV6Oc9iGAcsxTMLw9GyILQrbNDecLJ0",
  authDomain: "fragmentos-naty.firebaseapp.com",
  projectId: "fragmentos-naty",
  storageBucket: "fragmentos-naty.firebasestorage.app",
  messagingSenderId: "967090680217",
  appId: "1:967090680217:web:3eeb5bc0d57c1b3414e308"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar para usar en otros archivos
export { auth, db };
