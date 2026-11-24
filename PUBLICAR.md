# Publicar a StreetAlert

A StreetAlert é distribuída como **app web instalável (PWA)**, a partir de https://streetalert.online (GitHub Pages, domínio próprio). Não há APK nem IPA para descarregar: qualquer aparelho instala a app diretamente pelo navegador, e cada alteração publicada chega logo a toda a gente.

## Instalar a app (PWA)

O site tem um botão **Descarregar app**. O popup tem separadores **Android** e **iPhone** (e **Computador** num computador), com o aparelho de quem abre já selecionado:
- **Android e computador (Chrome, Edge, Samsung Internet):** o toque no botão abre logo a janela de instalação do navegador. Noutros navegadores mostra o caminho pelo menu ⋮.
- **iPhone/iPad:** a Apple não deixa nenhum site instalar-se com um só toque, por isso mostra o passo a passo "Partilhar > Adicionar ao ecrã principal" (no Safari), com uma seta a apontar para o botão Partilhar.
- **Computador:** mostra também um QR code para abrir o site no telemóvel.

O botão desaparece quando a app já está instalada.

O que torna a app instalável: `manifest.webmanifest` (nome, ícones 192/512 normais e "maskable", `start_url`, `scope`, cores, `display: standalone`), o service worker `sw.js` (sem cache, com página simples quando não há internet), HTTPS e os meta-tags do iOS em `index.html`.

## Domínio streetalert.online

O site está em **https://streetalert.online**. O ficheiro `CNAME` na raiz diz ao GitHub Pages para usar este domínio, e o endereço antigo (`charyflux.github.io/APIBARREIRO`) passa a redirecionar para ele.

### DNS na GoDaddy (só uma vez)
Em GoDaddy > **Os meus produtos** > streetalert.online > **DNS** > **Gerir DNS**:
1. Apaga os registos do tipo **A** com nome `@` que já lá estejam (por exemplo "Parked" ou "WebsiteBuilder") e o **CNAME** `www`, se existir.
2. Cria quatro registos **A**, todos com Nome `@`:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Cria um registo **CNAME** com Nome `www` e Valor `charyflux.github.io`
4. Se a GoDaddy tiver "Encaminhamento de domínio" (Forwarding) ativo, desliga-o.

A propagação demora entre alguns minutos e algumas horas.

### No GitHub (depois dos DNS)
Em **Settings > Pages** confirma que *Custom domain* mostra `streetalert.online` com "DNS check successful" e marca **Enforce HTTPS** (fica disponível quando o certificado estiver pronto, normalmente menos de uma hora).

## Contas e base de dados partilhada (Supabase)

A app já tem entrada com conta (nome, freguesia e email ou Google), nome e freguesia visíveis em cada reporte, denúncias, bloqueio de contas, limite diário para contas novas e um painel de administração (`admin.html`). Tudo isto usa o [Supabase](https://supabase.com), que é gratuito para começar.

### Regra de entrada

Qualquer pessoa abre o site, vê o mapa e procura cidades ou regiões **sem entrar**. Para **publicar** (e também confirmar ou denunciar) é obrigatório entrar. Ao tocar em **Reportar** sem sessão abre o ecrã **Entrar para reportar**, que pede:
1. **Nome** (2 a 30 letras, sem emails nem links) e **freguesia**, escolhida da lista oficial de freguesias de Portugal (escreve-se parte do nome e a app sugere, com o concelho por baixo). A pessoa aceita que o nome e a freguesia apareçam nos reportes.
2. **Com Supabase ligado:** confirma o email com um código (ou Google). Só depois disto a conta pode publicar. Sem `config.js` preenchido, este passo não existe e a "sessão" (nome + freguesia) fica só nesse aparelho.

Depois de entrar, o reporte continua logo do ponto onde a pessoa estava. Cada reporte mostra "por Ana (Arroios, Lisboa)". Nome e freguesia mudam-se em **A minha conta > Mudar nome ou freguesia**.

No servidor (`supabase/schema.sql`) a regra também vale: só contas com sessão, perfil com freguesia e não bloqueadas podem publicar, e a freguesia tem de existir na tabela `freguesias` (não se consegue gravar outra, nem pela API).

A lista de freguesias (`freguesias.json` e o bloco no fim de `schema.sql`) é a CAOP 2020 da DGT, com 3092 freguesias e 308 concelhos. É gerada por `scripts/build_freguesias.py`. Não inclui ainda as freguesias repostas em 2025; quem for de uma dessas escolhe a união de freguesias a que pertencia.

**Enquanto `config.js` estiver vazio, o site continua a funcionar sem servidor** (alertas só no aparelho), mas já pede nome e freguesia para reportar. Assim que preencheres `config.js`, qualquer pessoa vê o mapa e os reportes sem conta, e a conta passa a ser pedida só para publicar, confirmar ou denunciar.

### Passos que só tu podes fazer

1. **Criar o projeto.** Em [supabase.com](https://supabase.com) cria uma conta e um projeto novo. Em *Region* escolhe **Central EU (Frankfurt)** (fica na UE, por causa do RGPD). Guarda a password da base de dados.
2. **Criar as tabelas e as regras.** No projeto, abre **SQL Editor > New query**, cola o ficheiro [`supabase/schema.sql`](supabase/schema.sql) inteiro e carrega em **Run**. Pode correr-se outra vez sem problema. **Sempre que o `schema.sql` mudar, volta a corrê-lo** (por exemplo, a mudança que abriu a leitura do mapa a quem não tem conta).
3. **Endereços autorizados.** Em **Authentication > URL Configuration**:
   - *Site URL*: `https://streetalert.online/`
   - *Redirect URLs*: adiciona `https://streetalert.online/**` e `https://www.streetalert.online/**`
4. **Código no email.** Em **Authentication > Emails > Templates > Magic Link**, troca o texto por algo assim (o importante é o `{{ .Token }}`, que é o código que a pessoa escreve na app):
   ```html
   <h2>O teu código do StreetAlert</h2>
   <p>Escreve este código na app: <strong style="font-size:24px">{{ .Token }}</strong></p>
   <p>Ou toca aqui para entrar: <a href="{{ .ConfirmationURL }}">Entrar</a></p>
   <p>Se não foste tu, ignora este email.</p>
   ```
   Faz o mesmo em **Confirm signup**.
5. **Envio de emails a sério.** O envio de emails que vem com o Supabase só manda poucos emails por hora e serve apenas para testes. Antes de divulgar a app, em **Authentication > Emails > SMTP Settings** liga um serviço de email (por exemplo Brevo ou Resend, ambos têm plano gratuito).
6. **Ligar o site.** Em **Project Settings > API Keys** copia o *Project URL* e a chave **anon public** (separador *Legacy API keys*, se aparecer). Edita `config.js` no GitHub e cola-os em `supabaseUrl` e `supabaseAnonKey`. Esta chave pode ser pública. **Nunca** coloques a chave `service_role`.
7. **Tornar-te administrador.** Abre o site, toca em Reportar, escreve o teu nome e freguesia e entra com o teu email. Depois, no **SQL Editor**, corre (com o teu email):
   ```sql
   update public.perfis set admin = true
   where id = (select id from auth.users where email = 'o-teu-email@exemplo.pt');
   ```
   Na app, em **A minha conta** (botão redondo com uma pessoa), aparece **Painel de administração**. Também podes abrir `https://streetalert.online/admin.html`.
8. **Segurança.** Segue a lista "Definições do Supabase recomendadas" em [`SEGURANCA.md`](SEGURANCA.md) (endereços autorizados, limites, CAPTCHA, MFA).
9. **Política de privacidade.** Preenche os campos entre `[ ]` em `privacidade.html` (o teu nome, email de contacto e a região do Supabase).

### Opcional: entrar com Google
1. Em [console.cloud.google.com](https://console.cloud.google.com) cria um projeto, configura o *OAuth consent screen* e cria uma credencial **OAuth client ID** do tipo *Web application*.
2. Em *Authorized redirect URIs* põe `https://<o-teu-projeto>.supabase.co/auth/v1/callback` (o Supabase mostra este endereço em **Authentication > Sign In / Providers > Google**).
3. Cola o *Client ID* e o *Client Secret* no Supabase, nessa mesma página, e ativa o Google.
4. Em `config.js` muda `google: false` para `google: true`.

Na app Android/iOS o botão Google fica escondido (lá a entrada é pelo código do email).

### Opcional: confirmação do telemóvel por SMS
O SMS tem custo por mensagem (cobrado pelo fornecedor de SMS, não pelo Supabase).
1. Cria conta num fornecedor suportado (Twilio, MessageBird, Vonage ou Textlocal).
2. Em **Authentication > Sign In / Providers > Phone** ativa o telemóvel e cola as credenciais do fornecedor.
3. No **Painel de administração > Definições**, liga **Exigir telemóvel confirmado por SMS**. A partir daí, quem não confirmou o número vê o mapa mas não consegue publicar, confirmar nem denunciar.

### Regras que já estão ativas
- Sem sessão vê-se o mapa, os reportes visíveis, as confirmações e o nome de exibição de quem publicou. Mais nada: nem emails, nem telemóveis, nem denúncias, nem definições.
- Publicar, confirmar e denunciar exige sessão, nome de exibição e conta não bloqueada. Isto é garantido pelas regras da base de dados (RLS), não só pelo ecrã.
- Cada reporte mostra **"Publicado por <nome>"**. O email e o telemóvel nunca aparecem.
- Contas com menos de 7 dias: até 3 reportes por dia. Restantes: até 20. Ajustável no painel.
- Um reporte com 3 denúncias fica escondido até um administrador o rever (aprovar ou apagar).
- Contas bloqueadas continuam a ver o mapa mas não publicam, confirmam nem denunciam.
- Reportes com mais de 90 dias são apagados automaticamente todos os dias (precisa da extensão `pg_cron`, que o `schema.sql` tenta ativar; se aparecer um aviso, ativa-a em **Database > Extensions** e corre o ficheiro outra vez).
- Qualquer pessoa pode apagar a própria conta e tudo o que publicou em **A minha conta**.
- Não é possível verificar registos criminais; a app não tenta.

Os alertas que cada pessoa guardou só no próprio aparelho antes desta mudança não passam para a base de dados.

## Desenvolver no computador

```
npm install
npm run sync        # copia o site para a app (www/) e atualiza android/ e ios/
npm run android     # abre no Android Studio
npm run ios         # abre no Xcode (só em Mac)
npm run assets      # regenera ícones e ecrã inicial a partir de assets/
```

Identificador da app: `pt.alertaportugal.app` (em `capacitor.config.json`). O nome visível é **StreetAlert**; o identificador interno ficou igual para não estragar as compilações já configuradas, mas ainda o podes mudar antes da primeira publicação nas lojas.

## Apêndice: lojas de apps (opcional, para o futuro)

A pasta do projeto continua preparada com [Capacitor](https://capacitorjs.com) para, um dia, publicar a mesma app na Google Play e na App Store. Nada disto é preciso para a PWA. O GitHub continua a compilar a versão Android a cada alteração (Actions > "Android (APK e AAB)"), só para confirmar que o projeto compila; já não é publicado nenhum APK no site.

### Android (Google Play)
1. Cria a chave uma vez (num computador com Java):
   ```
   keytool -genkey -v -keystore alerta.jks -keyalg RSA -keysize 2048 -validity 10000 -alias alerta
   ```
   Guarda o ficheiro e as passwords num sítio seguro. Sem esta chave não consegues atualizar a app.
2. Converte a chave para texto: `base64 -w0 alerta.jks` (no Mac: `base64 -i alerta.jks`).
3. No GitHub: **Settings > Secrets and variables > Actions > New repository secret**, cria:
   - `ANDROID_KEYSTORE_BASE64` (o texto do passo 2)
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_ALIAS` (`alerta`)
   - `ANDROID_KEY_PASSWORD`
4. Na próxima execução aparece o artefacto `alerta-portugal-release` com o `.apk` e o `.aab` assinados. Envia o `.aab` na Google Play Console.

### iOS (App Store)

1. Inscreve-te no [Apple Developer Program](https://developer.apple.com/programs/).
2. Em developer.apple.com cria o App ID `pt.alertaportugal.app`, um certificado **Apple Distribution** (exporta como `.p12`) e um perfil **App Store** para esse App ID.
3. No App Store Connect cria a app com o mesmo identificador.
4. Cria estes secrets no GitHub:
   - `IOS_CERT_P12_BASE64` e `IOS_CERT_PASSWORD`
   - `IOS_PROVISION_PROFILE_BASE64` e `IOS_PROVISION_PROFILE_NAME` (o nome do perfil)
   - `IOS_TEAM_ID` (o Team ID da tua conta)
5. Corre **Actions > iOS (IPA) > Run workflow**. O `.ipa` aparece em Artifacts. Envia-o com a app Transporter (Mac) ou pelo App Store Connect.

Sem estes secrets, o workflow de iOS só confirma que o projeto compila.
