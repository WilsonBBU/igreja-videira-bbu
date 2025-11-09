/* =========================================================
   SISTEMA DE ACESSO - IGREJA VIDEIRA BBU
   Armazena contas no localStorage e controla login e aprovação.
   ========================================================== */

/* ---------- MENU MOBILE ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const body = document.body;

  if(menuToggle){
    menuToggle.addEventListener("click", () => {
      body.classList.toggle("menu-open");
    });
  }
});


/* ---------- LOGIN ---------- */
function login() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("erro");

  const contas = JSON.parse(localStorage.getItem("contas")) || [];

  const conta = contas.find(c => c.email === email && c.senha === senha);

  if (!conta) {
    msg.style.color = "red";
    msg.textContent = "E-mail ou senha incorretos.";
    return;
  }

  if (!conta.aprovado) {
    msg.style.color = "red";
    msg.textContent = "Sua conta ainda aguarda aprovação do pastor.";
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(conta));
  window.location.href = "dashboard.html";
}


/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}


/* ---------- DASHBOARD (Pastor e Membros) ---------- */

function carregarPendentes() {
  const contas = JSON.parse(localStorage.getItem("contas")) || [];
  const lista = document.getElementById("listaPendentes");
  if (!lista) return;
  
  lista.innerHTML = "";

  contas.forEach((c, index) => {
    if (!c.aprovado) {
      lista.innerHTML += `
      <tr>
        <td>${c.nome}</td>
        <td>${c.email}</td>
        <td><button class="btn btn-primary" onclick="aprovar(${index})">Aprovar</button></td>
      </tr>`;
    }
  });
}

function aprovar(i) {
  const contas = JSON.parse(localStorage.getItem("contas"));
  contas[i].aprovado = true;
  localStorage.setItem("contas", JSON.stringify(contas));
  carregarPendentes();
}


/* ---------- IDENTIFICAÇÃO DE QUEM ESTÁ LOGADO ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const painelPastor = document.getElementById("painelPastor");
  const painelMembro = document.getElementById("painelMembro");
  const nomeUsuario = document.getElementById("nomeUsuario");

  if (nomeUsuario && usuario) {
    nomeUsuario.textContent = usuario.nome;
  }

  if (usuario && usuario.email === "videira.bbu@gmail.com") {
    if (painelPastor) painelPastor.style.display = "block";
    carregarPendentes();
  } else {
    if (painelMembro) painelMembro.style.display = "block";
  }
});
