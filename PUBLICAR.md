# Publicar o Alerta Portugal (web, Android e iOS)

A app é o mesmo site (`index.html`) empacotado com [Capacitor](https://capacitorjs.com).
Quando mudas o site, a app muda também na próxima compilação.

| Plataforma | Onde fica | O que precisas |
|---|---|---|
| Web | https://charyflux.github.io/APIBARREIRO/ (GitHub Pages) | Nada. Também se instala no telemóvel com "Adicionar ao ecrã inicial". |
| Android (APK de teste) | GitHub > Actions > "Android (APK e AAB)" > Artifacts | Nada. Compila sozinho a cada alteração. |
| Android (Google Play) | Ficheiro `.aab` assinado no mesmo sítio | Conta Google Play Console (25 USD, pagamento único) e uma chave de assinatura. |
| iOS (IPA, App Store) | GitHub > Actions > "iOS (IPA)" > Run workflow | Conta Apple Developer (99 USD/ano), certificado e perfil de distribuição. |

## Antes de publicar nas lojas

1. **Base de dados partilhada.** Hoje cada pessoa só vê os alertas guardados no próprio aparelho. Para uma app pública, os alertas têm de estar numa base de dados partilhada (por exemplo Supabase, região UE).
2. **Política de privacidade.** Está em `privacidade.html` e fica em https://charyflux.github.io/APIBARREIRO/privacidade.html. Preenche os campos entre `[ ]` (nome, email, prazo de apagamento, serviço de base de dados). As duas lojas pedem este link.
3. **Moderação.** As lojas exigem que conteúdo criado por utilizadores possa ser denunciado e removido. Convém ter um botão "Denunciar" e alguém a rever.

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
