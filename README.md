# Portfólio — Lucas de Carvalho

Publicitário · Design gráfico & Audiovisual. React + TypeScript + Vite + Motion.

## Rodar no computador
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera a pasta dist/
npm run preview   # serve o build
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Nome, foto, contatos, som padrão, domínio | `src/config/site.ts` |
| Todos os textos (hero, sobre, linha do tempo, serviços, habilidades/ferramentas, contato) | `src/content.ts` |
| Trabalhos de design gráfico e categorias | `src/data/works.ts` + imagens em `public/works/` |
| Vídeos (Instagram, YouTube ou arquivo) | `src/data/videos.ts` + capas em `public/videos/` |
| Título e descrição para Google/WhatsApp | `index.html` e `public/og-image.png` (1200×630) |

### Foto do "Sobre mim"
- O site usa `public/lucas.jpg`. Para trocar, substitua o arquivo mantendo o nome, ou coloque outro arquivo em `public/` e altere `photo` em `src/config/site.ts`.
- Ajuste o enquadramento com `photoPosition` (ex.: `'center 20%'`).
- Sem foto (campo vazio ou arquivo ausente) aparece o espaço **"INSERIR FOTO DO LUCAS"**.

### Contatos
Preencha `contact` em `src/config/site.ts` (e-mail, WhatsApp só com números, Instagram, LinkedIn, Behance). Campos vazios não aparecem; enquanto todos estiverem vazios, a seção de contato mostra o aviso "Contatos a configurar".

### Adicionar um trabalho gráfico
1. Salve a imagem em `public/works/` (de preferência `.webp`, ~1600 px de largura).
2. Acrescente um item em `works` (`src/data/works.ts`) com título, projeto, ano, `image: 'works/arquivo.webp'`, `width`, `height` e uma ou mais `categories`.

### Adicionar um vídeo
Acrescente um item em `videos` (`src/data/videos.ts`):
- Instagram: `kind: 'instagram'`, `url: 'https://www.instagram.com/p/CODIGO/'`
- YouTube: `kind: 'youtube'`, `url: 'https://youtu.be/CODIGO'`
- Arquivo próprio: coloque o `.mp4` em `public/videos/` e use `kind: 'file'`, `url: 'videos/arquivo.mp4'`

Informe também `poster` (capa 9:16 em `public/videos/`). Só o vídeo selecionado fica carregado: ao trocar, o anterior para.

### Som
O obturador toca só ao clicar nos marcadores da linha do tempo (e no play dos vídeos). O visitante liga/desliga no botão "Som" do topo; o padrão está em `soundDefaultOn`.

## Publicar no Netlify

**Opção 1 — arrastar e soltar (mais rápido)**
1. Rode `npm install` e `npm run build`.
2. Acesse app.netlify.com → *Add new site* → *Deploy manually*.
3. Arraste a pasta `dist/` para a página. O site fica no ar com um endereço `*.netlify.app`.
4. Para atualizar, gere o build de novo e arraste a nova `dist/` em *Deploys*.

**Opção 2 — pelo GitHub (atualiza sozinho)**
1. Crie um repositório e envie esta pasta (sem `node_modules` e `dist`).
2. No Netlify: *Add new site* → *Import an existing project* → escolha o repositório.
3. As configurações já vêm do `netlify.toml` (build `npm run build`, pasta `dist`, Node 22). Clique em *Deploy*.

Depois de ter o endereço final, preencha `url` em `src/config/site.ts` e, no `index.html`, troque `/og-image.png` pela URL completa (ex.: `https://seusite.netlify.app/og-image.png`) para a prévia funcionar no WhatsApp.

## Origem do conteúdo
Textos, trabalhos e links de vídeo vêm do portfólio 2026 do Lucas. As imagens dos vídeos são capas recortadas das páginas desse portfólio; os vídeos em si são carregados do Instagram.

### Descrições, legendas e vídeos próprios
- Trabalhos: campo opcional `description` em `src/data/works.ts` (aparece no cartão e no "Ver projeto").
- Vídeos: campos opcionais `description` e `captions` (arquivo `.vtt` em `public/`) em `src/data/videos.ts`.
- Vídeos `kind: 'file'` (MP4 em `public/videos/` ou link direto) iniciam sozinhos **sem som** quando a seção aparece; o botão "Ativar som" libera o áudio. Instagram/YouTube só tocam após o clique (limitação das plataformas).
- Muitos vídeos pesados: hospede fora (YouTube, Cloudflare Stream, Bunny Stream) e use o link no lugar do arquivo.

### Ferramentas
Em `skills` (`src/content.ts`), preencha `tools` só com ferramentas confirmadas. Lista vazia mostra "A confirmar".

## Checklist antes de publicar
- [ ] Hero: "Explorar portfólio" rola até Design; "Entrar em contato" até Contato
- [ ] Linha do tempo: marcadores acendem ao rolar; clique/↑↓/botões trocam a etapa com som
- [ ] Design: carrossel avança, pausa no mouse/toque, setas e pontos funcionam, "Ver projeto" abre o modal
- [ ] Vídeos: troca pausa o anterior; som liga/desliga; links abrem no Instagram
- [ ] Botão "Som on/off" no topo silencia todos os efeitos
- [ ] Celular: sem rolagem lateral, menu abre e fecha
- [ ] Contatos preenchidos em `src/config/site.ts`
