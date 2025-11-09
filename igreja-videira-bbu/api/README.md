# API (opcional) para Igreja Videira BBU

Este diretório contém um backend Node.js (Express) **opcional**. O site no GitHub Pages é 100% estático e já funciona usando `localStorage` como banco de dados de demonstração. 
Quando quiser algo real (login com senha, biblioteca privada, etc.), publique esta API em um serviço como Render, Railway, Fly.io, Deta, Cloudflare Workers, etc., e depois edite `config.js` definindo `apiBaseUrl` (ex.: `"https://sua-api.onrender.com"`).

## Rodar localmente
```bash
cd api
npm i
npm start
```
A API sobe em `http://localhost:3000`.

## Rotas
- `POST /auth/login` { email, chave } → retorna { token, user }
- `GET /members` → lista
- `POST /members` → cria
- `GET /library` / `POST /library`
- `GET /study-sessions` / `POST /study-sessions`
