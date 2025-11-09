import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "login.html";

  const lista = document.getElementById("listaArquivos");
  lista.innerHTML = "<p>Carregando...</p>";

  const snap = await getDocs(collection(db, "biblioteca"));

  lista.innerHTML = "";
  snap.forEach(doc => {
    const item = doc.data();
    lista.innerHTML += `
      <div class="card">
        <h3>${item.titulo}</h3>
        <a href="${item.url}" target="_blank" class="btn btn-primary btn-full">Abrir / Baixar PDF</a>
      </div>
    `;
  });
});
