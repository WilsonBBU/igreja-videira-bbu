import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Banco em memória (trocar por Postgres/Mongo depois)
const db = { members: [], library: [], studySessions: [] };

app.post("/auth/login", (req,res)=>{
  const { email, chave } = req.body || {};
  if(!email || !chave) return res.status(400).json({error:"Informe email e chave"});
  const role = (chave==="PASTOR-CHAVE-DEMO") ? "pastor" : (chave==="MEMBRO-CHAVE-DEMO" ? "membro" : null);
  if(!role) return res.status(403).json({error:"Chave inválida"});
  let member = db.members.find(m=>m.email===email);
  if(!member){ member = { name: email.split("@")[0], email, role }; db.members.push(member); }
  member.role = role;
  res.json({ token: "demo", user: member });
});

app.get("/members", (req,res)=> res.json(db.members));
app.post("/members", (req,res)=>{ db.members.push(req.body); res.json(req.body); });

app.get("/library", (req,res)=> res.json(db.library));
app.post("/library", (req,res)=>{ const it = {...req.body, id:Date.now()}; db.library.push(it); res.json(it); });

app.get("/study-sessions", (req,res)=> res.json(db.studySessions));
app.post("/study-sessions", (req,res)=>{ const it = {...req.body, id:Date.now()}; db.studySessions.push(it); res.json(it); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("API rodando na porta", PORT));
