import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user)=>{
  if(!user) return location.href="login.html";

  const lista=document.getElementById("listaEstudos");
  lista.innerHTML="Carregando...";

  const snap=await getDocs(collection(db,"estudos"));
  lista.innerHTML="";

  snap.forEach(d=>{
    const item=d.data();
    lista.innerHTML+=`
      <div class="card">
        <h3>${item.tema}</h3>
        <p>${item.data} às ${item.hora}</p>
        <button class="btn btn-primary btn-full" onclick="presenca('${d.id}')">Marcar Presença ✅</button>
      </div>`;
  });
});

window.presenca = async(id)=>{
  const user = auth.currentUser;
  // salvando UID do membro
  await updateDoc(doc(db,"estudos",id),{
    presenca: arrayUnion(user.uid)
  });
  alert("Presença confirmada com sucesso ✅");
};
