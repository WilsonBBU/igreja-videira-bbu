# Igreja Videira BBU — Site + Dashboard (GitHub Pages)

Este repositório contém:
- **Site estático** (HTML/CSS/JS) pronto para o GitHub Pages;
- **Dashboard de membros** (login demo com chave, biblioteca e sala de estudos);
- **API Node opcional** em `/api` para quando quiser evoluir para um backend real.

## Como publicar no GitHub Pages
1. Faça **upload** de todos os arquivos na branch `main` do seu repositório.
2. No GitHub, vá em **Settings → Pages → Build and deployment**:
   - *Source:* "Deploy from a branch"
   - *Branch:* `main` (folder `/root`)
3. Abra a URL do Pages gerada.

## Onde trocar conteúdos
- **Logo:** `assets/img/logo.png` (substitua pela sua)
- **Foto do hero:** `assets/img/hero.jpg` (substitua pelas suas fotos — você pode criar uma pasta `assets/img/fotos/` e usar onde quiser)
- **Vídeo do YouTube:** edite `config.js` → `youtubeVideoDestaque` (ID do vídeo) ou `youtubeCanal`
- **Endereço, WhatsApp, horários:** edite `config.js`
- **Nome da igreja:** `config.js` → `nomeIgreja`

## Dashboard (membros)
- **Cadastro:** `pages/cadastro.html` (salva local ou via API)
- **Login:** `pages/login.html` (usa uma *chave de demonstração* — mude no `config.js`)
- **Biblioteca e Estudos:** `pages/dashboard.html`
  - Se `apiBaseUrl` estiver vazio, os dados ficam no *localStorage* (demo).
  - Para produção, publique a API do diretório `/api` e defina a URL no `config.js`.

## Ideias extras
- Área de **intercessão** (pedidos de oração com aprovação pastoral).
- **Cursos/discipulado** com trilhas e certificados (Google Forms + Drive, ou API real).
- **Agendamento de aconselhamento** (slots do pastor).
- **Doações** (link do Pix e relatório de transparência).
- **Multi-ministérios** com páginas próprias e formulários de voluntariado.

---

Feito com ❤️ no estilo "Videira": verde, limpo, objetivo e focado em pessoas.
