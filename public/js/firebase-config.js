// 📍 public/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGSV6Oc9iGAcsxTMLw9GyILQrbNDecLJ0",
  authDomain: "fragmentos-naty.firebaseapp.com",
  projectId: "fragmentos-naty",
  storageBucket: "fragmentos-naty.firebasestorage.app",
  messagingSenderId: "967090680217",
  appId: "1:967090680217:web:3eeb5bc0d57c1b3414e308"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
