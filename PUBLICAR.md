# Publicar o Alerta Portugal (web, Android e iOS)

A app é o mesmo site (`index.html`) empacotado com [Capacitor](https://capacitorjs.com).
Quando mudas o site, a app muda também na próxima compilação.

| Plataforma | Onde fica | O que precisas |
|---|---|---|
| Web | https://charyflux.github.io/APIBARREIRO/ (GitHub Pages) | Nada. Também se instala no telemóvel com "Adicionar ao ecrã inicial". |
| Android (APK de teste) | GitHub > Actions > "Android (APK e AAB)" > Artifacts | Nada. Compila sozinho a cada alteração. |
| Android (Google Play) | Ficheiro `.aab` assinado no mesmo sítio | Conta Google Play Console (25 USD, pagamento único) e uma chave de assinatura. |
| iOS (IPA, App Store) | GitHub > Actions > "iOS (IPA)" > Run workflow | Conta Apple Developer (99 USD/ano), certificado e perfil de distribuição. |

## Contas e base de dados partilhada (Supabase)

A app já tem entrada com conta (email ou Google), nome visível em cada reporte, denúncias, bloqueio de contas, limite diário para contas novas e um painel de administração (`admin.html`). Tudo isto usa o [Supabase](https://supabase.com), que é gratuito para começar.

**Enquanto `config.js` estiver vazio, o site continua a funcionar como antes** (alertas só no aparelho, sem conta). Assim que preencheres `config.js`, a conta passa a ser obrigatória.

### Passos que só tu podes fazer

1. **Criar o projeto.** Em [supabase.com](https://supabase.com) cria uma conta e um projeto novo. Em *Region* escolhe **Central EU (Frankfurt)** (fica na UE, por causa do RGPD). Guarda a password da base de dados.
2. **Criar as tabelas e as regras.** No projeto, abre **SQL Editor > New query**, cola o ficheiro [`supabase/schema.sql`](supabase/schema.sql) inteiro e carrega em **Run**. Pode correr-se outra vez sem problema.
3. **Endereços autorizados.** Em **Authentication > URL Configuration**:
   - *Site URL*: `https://charyflux.github.io/APIBARREIRO/`
   - *Redirect URLs*: adiciona `https://charyflux.github.io/APIBARREIRO/**`
4. **Código no email.** Em **Authentication > Emails > Templates > Magic Link**, troca o texto por algo assim (o importante é o `{{ .Token }}`, que é o código que a pessoa escreve na app):
   ```html
   <h2>O teu código do Alerta Portugal</h2>
   <p>Escreve este código na app: <strong style="font-size:24px">{{ .Token }}</strong></p>
   <p>Ou toca aqui para entrar: <a href="{{ .ConfirmationURL }}">Entrar</a></p>
   <p>Se não foste tu, ignora este email.</p>
   ```
   Faz o mesmo em **Confirm signup**.
5. **Envio de emails a sério.** O envio de emails que vem com o Supabase só manda poucos emails por hora e serve apenas para testes. Antes de divulgar a app, em **Authentication > Emails > SMTP Settings** liga um serviço de email (por exemplo Brevo ou Resend, ambos têm plano gratuito).
6. **Ligar o site.** Em **Project Settings > API Keys** copia o *Project URL* e a chave **anon public** (separador *Legacy API keys*, se aparecer). Edita `config.js` no GitHub e cola-os em `supabaseUrl` e `supabaseAnonKey`. Esta chave pode ser pública. **Nunca** coloques a chave `service_role`.
7. **Tornar-te administrador.** Abre o site, entra com o teu email e escolhe o teu nome. Depois, no **SQL Editor**, corre (com o teu email):
   ```sql
   update public.perfis set admin = true
   where id = (select id from auth.users where email = 'o-teu-email@exemplo.pt');
   ```
   Na app, em **A minha conta** (botão redondo com uma pessoa), aparece **Painel de administração**. Também podes abrir `https://charyflux.github.io/APIBARREIRO/admin.html`.
8. **Política de privacidade.** Preenche os campos entre `[ ]` em `privacidade.html` (o teu nome, email de contacto e a região do Supabase).

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
- Sem sessão iniciada não se vê nenhum reporte.
- Cada reporte mostra **"Marcado por <nome>"**. O email e o telemóvel nunca aparecem.
- Contas com menos de 7 dias: até 3 reportes por dia. Restantes: até 20. Ajustável no painel.
- Um reporte com 3 denúncias fica escondido até um administrador o rever (aprovar ou apagar).
- Contas bloqueadas continuam a ver o mapa mas não publicam, confirmam nem denunciam.
- Reportes com mais de 90 dias são apagados automaticamente todos os dias (precisa da extensão `pg_cron`, que o `schema.sql` tenta ativar; se aparecer um aviso, ativa-a em **Database > Extensions** e corre o ficheiro outra vez).
- Qualquer pessoa pode apagar a própria conta e tudo o que publicou em **A minha conta**.
- Não é possível verificar registos criminais; a app não tenta.

Os alertas que cada pessoa guardou só no próprio aparelho antes desta mudança não passam para a base de dados.

## Android

### APK de teste (já funciona)
Em cada alteração na branch `main`, o GitHub compila um APK de teste. Para o descarregar: separador **Actions** > última execução de "Android (APK e AAB)" > **Artifacts** > `alerta-portugal-debug-apk`. Instala-o no telemóvel (é preciso permitir "fontes desconhecidas").

### Versão assinada para a Google Play
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

## iOS

1. Inscreve-te no [Apple Developer Program](https://developer.apple.com/programs/).
2. Em developer.apple.com cria o App ID `pt.alertaportugal.app`, um certificado **Apple Distribution** (exporta como `.p12`) e um perfil **App Store** para esse App ID.
3. No App Store Connect cria a app com o mesmo identificador.
4. Cria estes secrets no GitHub:
   - `IOS_CERT_P12_BASE64` e `IOS_CERT_PASSWORD`
   - `IOS_PROVISION_PROFILE_BASE64` e `IOS_PROVISION_PROFILE_NAME` (o nome do perfil)
   - `IOS_TEAM_ID` (o Team ID da tua conta)
5. Corre **Actions > iOS (IPA) > Run workflow**. O `.ipa` aparece em Artifacts. Envia-o com a app Transporter (Mac) ou pelo App Store Connect.

Sem estes secrets, o workflow de iOS só confirma que o projeto compila.

## Desenvolver no computador

```
npm install
npm run sync        # copia o site para a app (www/) e atualiza android/ e ios/
npm run android     # abre no Android Studio
npm run ios         # abre no Xcode (só em Mac)
npm run assets      # regenera ícones e ecrã inicial a partir de assets/
```

Identificador da app: `pt.alertaportugal.app` (em `capacitor.config.json`). Só o podes mudar antes da primeira publicação.
