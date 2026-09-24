// 📍 public/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "fragmentos-naty.firebaseapp.com",
  projectId: "fragmentos-naty",
  storageBucket: "fragmentos-naty.appspot.com",
  messagingSenderId: "TU_ID_AQUI",
  appId: "TU_APP_ID_AQUI"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
