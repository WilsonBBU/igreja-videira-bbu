(function(){
  const cfg = window.SITE_CONFIG || {};
  // Preenche itens globais (nav / footer)
  document.addEventListener('DOMContentLoaded', () => {
    const churchNameEls = document.querySelectorAll('[data-church-name]');
    churchNameEls.forEach(el => el.textContent = cfg.nomeIgreja || 'Igreja Videira');

    const whatsEls = document.querySelectorAll('[data-whatsapp-link]');
    whatsEls.forEach(el => {
      if(cfg.whatsapp){
        el.href = `https://wa.me/${cfg.whatsapp}`;
      } else {
        el.style.display = 'none';
      }
    });

    const enderecoEl = document.querySelector('[data-endereco]');
    if(enderecoEl && cfg.endereco){ enderecoEl.textContent = cfg.endereco; }

    const cultoEl = document.querySelector('[data-culto]');
    if(cultoEl && cfg.cultoPrincipal){ cultoEl.textContent = cfg.cultoPrincipal; }

    // Render YouTube embed se existir
    const frame = document.getElementById('youtube-embed');
    if(frame){
      const id = cfg.youtubeVideoDestaque || "";
      const url = id ? `https://www.youtube.com/embed/${id}` : "about:blank";
      frame.src = url;
    }
  });

  // ------------- Mini "API" Local (fallback) -------------
  const useLocal = !cfg.apiBaseUrl;
  const KEY = "videira_bbu";
  const loadLocal = () => JSON.parse(localStorage.getItem(KEY) || '{}');
  const saveLocal = (data) => localStorage.setItem(KEY, JSON.stringify(data));

  async function api(path, method="GET", body){
    if(!useLocal){
      const res = await fetch(cfg.apiBaseUrl + path, {
        method,
        headers: {'Content-Type':'application/json'},
        body: body ? JSON.stringify(body) : undefined
      });
      if(!res.ok) throw new Error(await res.text());
      return res.json();
    }
    // Local fallback
    const db = loadLocal();
    db.members = db.members || [];
    db.library = db.library || [];
    db.studySessions = db.studySessions || [];
    // Simple routes
    if(path==="/auth/login" && method==="POST"){
      const {email, chave} = body;
      const role = (chave === cfg.demoAdminKey) ? "pastor" : (chave === cfg.demoMemberKey ? "membro" : null);
      if(!role) throw new Error("Chave inválida. Solicite ao pastor.");
      const member = db.members.find(m=>m.email===email) || {name: email.split("@")[0], email, role};
      member.role = role;
      if(!db.members.find(m=>m.email===email)){ db.members.push(member); }
      saveLocal(db);
      return {token:"demo", user:member};
    }
    if(path==="/members" && method==="POST"){
      const m = body;
      db.members.push({...m, role:"membro"}); saveLocal(db); return m;
    }
    if(path==="/members" && method==="GET"){
      return db.members;
    }
    if(path==="/library" && method==="GET"){
      return db.library;
    }
    if(path==="/library" && method==="POST"){
      const item = {...body, id: Date.now()};
      db.library.push(item); saveLocal(db); return item;
    }
    if(path==="/study-sessions" && method==="GET"){
      return db.studySessions;
    }
    if(path==="/study-sessions" && method==="POST"){
      const s = {...body, id: Date.now()};
      db.studySessions.push(s); saveLocal(db); return s;
    }
    return {ok:true};
  }
  window.AppAPI = { api };
})();
