// =======================================
// CONFIGURAÇÃO FIREBASE - VIDEIRA BBU
// =======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuJMso4QQt2iF0sY5NV8kiVVahbRQ5uAI",
  authDomain: "videira-bbu.firebaseapp.com",
  projectId: "videira-bbu",
  storageBucket: "videira-bbu.appspot.com",
  messagingSenderId: "788422997867",
  appId: "1:788422997867:web:7a46de2ae6a10ae0e7fe2e",
  measurementId: "G-VKM1VJ42M0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
