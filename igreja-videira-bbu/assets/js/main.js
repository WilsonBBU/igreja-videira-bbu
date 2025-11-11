/* arquivo: assets/js/main.js  (USAR COMO ESCRITO, MÓDULO) */
// =============================
// CONFIG GLOBAL DO SITE
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// --------- Site config lida do config.js se existir ---------
const CFG = (window.SITE_CONFIG ?? {
  nomeIgreja: "Igreja Videira BBU",
  endereco: "Endereço será configurado",
  cultoPrincipal: "Domingos, 19h",
  whatsapp: "",
  youtubeVideoDestaque: ""
});

// --------- Firebase (DADOS QUE VOCÊ ME PASSOU) -------------
const firebaseConfig = {
  apiKey: "AIzaSyCuJMso4QQt2iF0sY5NV8kiVVahbRQ5uAI",
  authDomain: "videira-bbu.firebaseapp.com",
  projectId: "videira-bbu",
  storageBucket: "videira-bbu.firebasestorage.app",
  messagingSenderId: "788422997867",
  appId: "1:788422997867:web:7a46de2ae6a10ae0e7fe2e",
  measurementId: "G-VKM1VJ42M0"
};

// --------- Inicialização ---------
const app = initializeApp(firebaseConfig);
try { getAnalytics(app); } catch(_) {} // analytics opcional (ignora em http)
export const auth = getAuth(app);
export const db = getFirestore(app);

// --------- Helpers UI ---------
function $ (sel, root=document){ return root.querySelector(sel); }
function $$ (sel, root=document){ return [...root.querySelectorAll(sel)]; }
function setTextAll(attr, text){ $$(attr).forEach(el=>el.textContent=text); }

// --------- Preenche textos dinâmicos (nome, endereço, culto, vídeo) ---------
document.addEventListener("DOMContentLoaded", ()=>{
  setTextAll("[data-church-name]", CFG.nomeIgreja || "Igreja Videira");
  const end = $("[data-endereco]"); if(end) end.textContent = CFG.endereco || "—";
  const cul = $("[data-culto]"); if(cul) cul.textContent = CFG.cultoPrincipal || "—";
  $$( "[data-whatsapp-link]" ).forEach(a=>{
    if(CFG.whatsapp){ a.href = `https://wa.me/${CFG.whatsapp}`; } else { a.style.display="none"; }
  });
  const yt = $("#youtube-embed");
  if(yt){
    const id = CFG.youtubeVideoDestaque || "";
    yt.src = id ? `https://www.youtube.com/embed/${id}` : "about:blank";
  }
});

// --------- MENU MOBILE (hambúrguer) ---------
document.addEventListener("click", (ev)=>{
  const btn = ev.target.closest("#menuToggle");
  if(btn){
    const nav = $("#mainNav");
    nav?.classList.toggle("open");
  }
  if(ev.target.closest(".nav a")){ $("#mainNav")?.classList.remove("open"); }
});

// --------- AUTH API (corrige erro 'signUp undefined') ---------
export async function signUp({name, email, password, role="membro"}) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if(name){ await updateProfile(cred.user, { displayName: name }); }
  // cria perfil no Firestore
  await setDoc(doc(db, "members", cred.user.uid), {
    name: name || email.split("@")[0],
    email, role, createdAt: serverTimestamp(), whatsapp: ""
  });
  return cred.user;
}

export function signIn({email, password}) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function logOut(){ return signOut(auth); }
export function resetPass(email){ return sendPasswordResetEmail(auth, email); }

// --------- Biblioteca / Estudos (base) ---------
export async function listLibrary(){
  const snap = await getDocs(collection(db,"library"));
  return snap.docs.map(d=>({id:d.id, ...d.data()}));
}
export async function addLibrary(item){
  return addDoc(collection(db,"library"), {...item, createdAt: serverTimestamp()});
}
export async function listStudies(){
  const snap = await getDocs(collection(db,"studySessions"));
  return snap.docs.map(d=>({id:d.id, ...d.data()}));
}
export async function addStudy(item){
  return addDoc(collection(db,"studySessions"), {...item, createdAt: serverTimestamp(), status:"aguardando"});
}

// --------- Guarda usuário (para dashboard) ---------
onAuthStateChanged(auth, async (user)=>{
  // mostra nome/perfil se existir boxUser
  const box = $("#boxUser");
  if(!box) return;
  if(!user){
    box.className="error";
    box.innerHTML = "Você não está logado. <a href='login.html'>Entrar</a>";
    return;
  }
  // pega perfil no Firestore:
  const d = await getDoc(doc(db,"members",user.uid));
  const prof = d.exists() ? d.data() : { name: user.displayName || user.email, role:"membro" };
  localStorage.setItem("videira_user", JSON.stringify({ uid:user.uid, ...prof, email:user.email }));
  box.className="success";
  box.innerHTML = `Bem-vindo, <strong>${prof.name || user.email}</strong> — Perfil: ${prof.role}`;
  // exibe painel do pastor se existir
  const admin = $("#adminPanel");
  if(admin){ admin.style.display = (prof.role==="pastor"?"block":"none"); }
});
