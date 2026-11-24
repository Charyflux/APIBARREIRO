# Segurança da StreetAlert

Revisão de segurança do código (novembro de 2026): site estático no GitHub Pages, base de dados Supabase
(`supabase/schema.sql`), app Android/iOS com Capacitor e workflows do GitHub Actions.

## O que está protegido e como

- **Chaves.** Não há chaves secretas no código nem no histórico do git. A única chave que vai para o site é a
  `anon` do Supabase, que é pública por natureza: quem decide o que cada pessoa pode ler ou escrever são as regras
  (Row Level Security) de `supabase/schema.sql`. **Nunca** coloques a chave `service_role` em `config.js` nem no GitHub.
  Se alguma vez isso acontecer, roda-a logo em Supabase > Project Settings > API Keys.
- **Content Security Policy** (em `<meta>`, porque o GitHub Pages não deixa definir cabeçalhos): o site só corre scripts
  do próprio site, só fala com o Supabase, OpenFreeMap, Photon e Nominatim, e não pode ser usado para enviar formulários
  ou dados para outros sites. Se um dia usares um domínio próprio no Supabase (em vez de `*.supabase.co`), ou outro
  serviço de mapas/pesquisa, acrescenta-o a `connect-src` em `index.html` e `admin.html`.
- **Bibliotecas no próprio site** (`vendor/`), em vez de CDNs de terceiros. Ver `vendor/LEIA-ME.md`.
- **Clickjacking:** em `streetalert.online`, a página recusa abrir dentro de uma moldura (iframe) de outro site.
- **XSS:** tudo o que vem de utilizadores (nome, descrição, motivo) ou do OpenStreetMap/Photon/Nominatim é mostrado
  com `textContent` ou escapado. Não uses `innerHTML` com estes dados.
- **Regras da base de dados:** quem não tem conta só lê o mapa; publicar, confirmar e denunciar exigem conta não bloqueada;
  ninguém altera reportes; admin e bloqueio só mudam por funções que confirmam que és administrador.
- **Entrada com nome e freguesia:** publicar exige sessão (email confirmado ou Google) e um perfil com nome e freguesia
  (`pode_publicar()`). A freguesia é validada no servidor com uma chave estrangeira para a tabela `freguesias` (lista
  oficial CAOP): pela API não se grava uma freguesia inventada nem num concelho errado. A tabela `freguesias` não pode
  ser lida nem alterada por `anon`/`authenticated`. O perfil só deixa mudar `nome`, `freguesia` e `concelho`.

## Depois de cada mudança em `supabase/schema.sql`
Volta a correr o ficheiro inteiro no Supabase (SQL Editor > New query > Run). Pode correr-se várias vezes.

## Definições do Supabase recomendadas (só o dono pode fazer)
1. **Authentication > URL Configuration:** *Site URL* `https://streetalert.online/` e só os teus domínios em *Redirect URLs*
   (nunca `*` nem domínios de terceiros: evita redirecionamentos abertos no login).
2. **Authentication > Rate Limits:** mantém limites baixos para emails/OTP e verificações por hora.
3. **Authentication > Attack Protection:** ativar CAPTCHA (Cloudflare Turnstile ou hCaptcha) trava contas falsas em massa,
   que são a maior ameaça a um mapa comunitário (denúncias falsas para esconder reportes, spam). **Atenção:** depois de ativar,
   a app tem de enviar o token do CAPTCHA no login; pede essa alteração antes de ligar a opção, senão o login deixa de funcionar.
4. **Ativa a verificação em dois passos (MFA)** nas contas do Supabase, GitHub, Google Cloud e no registo do domínio.
5. **GitHub > Settings > Pages:** *Enforce HTTPS* ligado.
6. **GitHub > Settings > Code security:** ligar *Secret scanning* e *Push protection* (avisa se alguém tentar subir uma chave).

## Workflows do GitHub Actions
Só correm em `push` para `main` ou à mão, com permissão de leitura (`contents: read`) e sem guardar o token do GitHub
durante a compilação. Os segredos de assinatura (Android/iOS) só são lidos nos passos que precisam deles.

## Para reportar um problema de segurança
Contacta o responsável indicado em `privacidade.html`. Não publiques detalhes antes de estar corrigido.
