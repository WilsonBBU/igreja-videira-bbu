(function(){
  const CFG = window.SITE_CONFIG;

  // ====== Firebase init ======
  firebase.initializeApp(CFG.firebaseConfig);
  const auth = firebase.auth();
  const db   = firebase.firestore();
  const st   = firebase.storage();

  // ====== Helpers ======
  const qs  = (s,sc=document)=>sc.querySelector(s);
  const qsa = (s,sc=document)=>Array.from(sc.querySelectorAll(s));
  const setTxt = (sel,txt)=> qsa(sel).forEach(e=>e.textContent = txt);

  document.addEventListener('DOMContentLoaded', ()=>{
    // Header info
    setTxt('[data-church-name]', CFG.nomeIgreja || 'Igreja Videira');
    const w = qs('[data-whatsapp-link]');
    if(w && CFG.whatsapp) w.href = `https://wa.me/${CFG.whatsapp}`;
    const end = qs('[data-endereco]'); if(end) end.textContent = CFG.endereco||'';
    const cul = qs('[data-culto]');    if(cul) cul.textContent = CFG.cultoPrincipal||'';

    // YouTube
    const frame = qs('#youtube-embed');
    if(frame){
      frame.src = CFG.youtubeVideoDestaque
        ? `https://www.youtube.com/embed/${CFG.youtubeVideoDestaque}`
        : 'about:blank';
    }
  });

  // ====== Auth ======
  async function signUp({name,email,password,accessKey,phone}) {
    const cred = await auth.createUserWithEmailAndPassword(email,password);
    await cred.user.updateProfile({ displayName: name });
    // define role por chave (se informada)
    let role = 'membro';
    if(accessKey === CFG.pastorAccessKey) role = 'pastor';
    else if(accessKey === CFG.memberAccessKey) role = 'membro';

    await db.collection('members').doc(cred.user.uid).set({
      name, email, phone: phone||'', role, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return cred.user;
  }

  async function signIn({email,password}) {
    const cred = await auth.signInWithEmailAndPassword(email,password);
    return cred.user;
  }

  function signOut(){ return auth.signOut(); }

  async function currentUserDoc(){
    const u = auth.currentUser;
    if(!u) return null;
    const doc = await db.collection('members').doc(u.uid).get();
    return doc.exists ? {id:u.uid, ...doc.data()} : {id:u.uid, name:u.displayName||'', email:u.email, role:'membro'};
  }

  // ====== Biblioteca ======
  function listLibrary(){ return db.collection('library').orderBy('createdAt','desc').get().then(s=>s.docs.map(d=>({id:d.id,...d.data()}))); }
  function addLibrary({title,author,link}){
    return db.collection('library').add({ title, author:author||'', link:link||'', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  }

  // ====== Estudos ======
  function listStudies(){ return db.collection('studies').orderBy('dueAt','asc').get().then(s=>s.docs.map(d=>({id:d.id,...d.data()}))); }
  function addStudy({tema, dueAt, link}){
    return db.collection('studies').add({
      tema, link:link||'', dueAt: dueAt ? new Date(dueAt) : null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  // inscrições / conclusão
  function enrollStudy(studyId, user){
    return db.collection('completions').doc(`${studyId}_${user.id}`).set({
      studyId, userId:user.id, userName:user.name, status:'inscrito',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, {merge:true});
  }
  function completeStudy(studyId, user){
    return db.collection('completions').doc(`${studyId}_${user.id}`).set({
      status:'concluido',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, {merge:true});
  }
  function listCompletionsByStudy(studyId){
    return db.collection('completions').where('studyId','==',studyId).get().then(s=>s.docs.map(d=>({id:d.id,...d.data()})));
  }
  function listUserCompletions(userId){
    return db.collection('completions').where('userId','==',userId).get().then(s=>s.docs.map(d=>({id:d.id,...d.data()})));
  }

  // Aprovação do pastor + certificado
  async function approveCompletion(studyId, userId){
    const id = `${studyId}_${userId}`;
    await db.collection('completions').doc(id).set({
      status:'aprovado',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, {merge:true});
    // cria certificado
    const certRef = await db.collection('certificates').add({
      studyId, userId, issuedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return certRef.id;
  }

  // ====== Expor no escopo global ======
  window.App = {
    CFG, auth, db, st,
    signUp, signIn, signOut, currentUserDoc,
    listLibrary, addLibrary,
    listStudies, addStudy,
    enrollStudy, completeStudy,
    listCompletionsByStudy, listUserCompletions,
    approveCompletion
  };
})();
