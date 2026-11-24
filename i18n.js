// Idioma da app: português de Portugal (por omissão) ou inglês.
// Os textos estão escritos em português no HTML e no código; este dicionário dá a versão inglesa.
// A escolha fica guardada neste aparelho. Sem escolha, usa inglês só se o navegador estiver em inglês.
(function(){
const K='ap-lang-v1';
const get=()=>{try{return localStorage.getItem(K)}catch(e){return null}};
const put=v=>{try{localStorage.setItem(K,v)}catch(e){}};
const q=(()=>{try{return new URLSearchParams(location.search).get('lang')}catch(e){return null}})();
let saved=get();
if(q==='en'||q==='pt'){saved=q;put(q)}
let lang=saved==='en'||saved==='pt'?saved:(/^en\b/i.test(navigator.language||'')?'en':'pt');

const EN={
// ---------- mapa ----------
'Mapa de Portugal':'Map of Portugal','A ligar':'Connecting','Procurar cidade':'Find a city','Procurar cidade ou vila':'Search for a city or town',
'Ver reportes recentes':'See recent reports','Filtros':'Filters','Violência':'Violence','Estacionamento':'Parking','Período':'Period',
'Últimas 24 h':'Last 24 h','7 dias':'7 days','30 dias':'30 days','Sempre':'All time','Reportes recentes':'Recent reports',
'Reportar':'Report','Aproximar':'Zoom in','Afastar':'Zoom out','Centrar em mim':'Centre on me','Ver Portugal inteiro':'Show all of Portugal',
'Como usar a app':'How to use the app','A minha conta':'My account','Arrasta o mapa até ao local exato':'Drag the map to the exact spot',
'Cancelar':'Cancel','É aqui!':"It's here!",'Escolher categoria':'Choose a category','O que aconteceu aqui?':'What happened here?',
'Agressão, assalto ou ameaça':'Assault, robbery or threat','Mau estacionamento':'Bad parking','Passeio, passadeira, lugar reservado':'Pavement, zebra crossing, reserved space',
'Detalhes do reporte':'Report details','Trocar':'Change','Quando?':'When?','Agora':'Now','Há 1 hora':'1 hour ago','Ontem':'Yesterday','Outra data':'Another date',
'Conta em poucas palavras':'Describe it in a few words','Opcional':'Optional',
'Ex.: carro em cima da passadeira junto à escola':'E.g. car parked on the zebra crossing by the school',
'Na descrição, sem matrículas, nomes, telefones nem fotos (RGPD). A posição é arredondada a uns 10 metros.':'No number plates, names, phone numbers or photos in the description (GDPR). The position is rounded to about 10 metres.',
'Publicar':'Publish','Detalhe do reporte':'Report detail','Também vi isto':'I saw this too','Fechar':'Close','Apagar o meu reporte':'Delete my report',
'Denunciar este reporte':'Flag this report','Porque queres denunciar?':'Why are you flagging it?',
'Falso ou inventado':'False or made up','Ofensivo':'Offensive','Identifica pessoas':'Identifies people','Spam ou repetido':'Spam or duplicate',
'Continente':'Mainland','Madeira':'Madeira','Açores':'Azores','Lisboa':'Lisbon','Porto':'Porto','Sem resultados':'No results','{n} mil hab.':'{n}k people',
// ---------- conta ----------
'A tua conta foi bloqueada por um administrador. Podes ver o mapa, mas não podes publicar, confirmar nem denunciar.':'Your account was blocked by an administrator. You can still see the map, but you cannot publish, confirm or flag.',
'Nome que aparece nos teus reportes':'Name shown on your reports','Guardar nome':'Save name','Painel de administração':'Admin panel',
'Terminar sessão':'Sign out','Apagar a minha conta':'Delete my account','Política de privacidade':'Privacy policy',
'Entrar':'Sign in','Para publicares, cria a tua conta ou entra':'To post, create your account or sign in',
'Ver o mapa é livre. Para marcar alertas, confirmar ou denunciar precisas de uma conta. Escreve o teu email e enviamos-te um código: se ainda não tens conta, ela é criada nesse momento.':'Anyone can view the map. To post alerts, confirm or flag you need an account. Enter your email and we\'ll send you a code: if you don\'t have an account yet, it is created at that moment.',
'Um momento…':'One moment…',
'Continuar com Google':'Continue with Google','ou com email':'or with email','O teu email':'Your email','Enviar código':'Send code',
'Vê o teu email':'Check your email','Enviámos um código para':'We sent a code to','. Escreve-o aqui ou toca no link do email.':'. Type it here or tap the link in the email.',
'Código':'Code','Código do email':'Email code','Usar outro email':'Use another email','Como te chamamos?':'What should we call you?',
'Nome de exibição':'Display name','Ex.: Ana P.':'E.g. Ana P.','Percebi e aceito que este nome apareça nos meus reportes.':'I understand and agree that this name will appear on my reports.',
'Continuar':'Continue','Confirma o teu telemóvel':'Confirm your mobile number',
'Enviamos um SMS com um código. O número serve só para confirmar que és uma pessoa real e não aparece a ninguém.':"We'll send you a text message with a code. The number is only used to confirm that you are a real person and is never shown to anyone.",
'Número de telemóvel':'Mobile number','Enviar SMS':'Send text message','Código do SMS':'Text message code','Confirmar':'Confirm','Sair':'Log out',
// ---------- tutorial e localização ----------
'Bem-vindo à StreetAlert':'Welcome to StreetAlert','Arrasta o mapa':'Drag the map','Marcar uma ocorrência':'Mark an incident',
'Violência · há 10 min':'Violence · 10 min ago','Publicado por':'Posted by','a 23/11 às 21:40':'on 23/11 at 21:40','Ver o que se passa':"See what's going on",
'Ajudar a comunidade':'Help the community','Denunciar':'Flag','Esquadra':'Police station','Hospital':'Hospital','Supermercado':'Supermarket','Restaurante':'Restaurant',
'Orienta-te no mapa':'Find your way on the map','Saltar':'Skip','Seguinte':'Next','Começar':'Start',
'Descarregar app':'Download app','Instalar a StreetAlert':'Install StreetAlert','Fica com um ícone no ecrã principal e abre como uma app, em ecrã inteiro.':'Get an icon on your home screen and open it like an app, in full screen.',
'Instalar agora':'Install now','Ver na App Store':'View on the App Store','Descarregar APK para Android':'Download APK for Android',
'O APK instala-se fora da Google Play: o telemóvel vai pedir para autorizares a instalação de apps desta origem ("fontes desconhecidas").':'The APK installs outside Google Play: your phone will ask you to allow installing apps from this source ("unknown sources").',
'Aponta a câmara do telemóvel para abrires a StreetAlert lá e a instalares.':'Point your phone camera here to open StreetAlert there and install it.','App instalada!':'App installed!','Copiar link':'Copy link','Link copiado. Abre o Safari e cola-o na barra de endereço.':'Link copied. Open Safari and paste it in the address bar.',
'Mostrar o mapa onde estás?':'Show the map where you are?','Agora não':'Not now','Sim, localizar':'Yes, find me',
'A localização está bloqueada':'Location is blocked','Percebi':'Got it',
'Abre Definições > StreetAlert > Localização e escolhe "Durante a utilização da app". Depois volta aqui e toca no botão do alvo.':'Open Settings > StreetAlert > Location and choose "While Using the App". Then come back and tap the target button.',
'Abre Definições > Apps > StreetAlert > Permissões > Localização e escolhe "Permitir apenas durante a utilização". Depois volta aqui e toca no botão do alvo.':'Open Settings > Apps > StreetAlert > Permissions > Location and choose "Allow only while using the app". Then come back and tap the target button.',
'No iPhone: Definições > Privacidade e segurança > Serviços de localização > Sites do Safari > "Durante a utilização". Depois recarrega a página e toca no botão do alvo.':'On iPhone: Settings > Privacy & Security > Location Services > Safari Websites > "While Using the App". Then reload the page and tap the target button.',
'No Chrome: toca no ícone à esquerda do endereço do site > Permissões > Localização > Permitir. Depois toca no botão do alvo.':'In Chrome: tap the icon to the left of the site address > Permissions > Location > Allow. Then tap the target button.',
'Clica no ícone à esquerda do endereço do site, ativa a Localização e recarrega a página. Depois clica no botão do alvo.':'Click the icon to the left of the site address, turn on Location and reload the page. Then click the target button.',
'Este aparelho não consegue indicar a localização':'This device cannot share its location','A procurar a tua localização…':'Looking for your location…',
'Pareces estar fora de Portugal. O mapa fica em Portugal.':'You seem to be outside Portugal. The map stays on Portugal.',
'O GPS está a demorar. Tenta outra vez no botão do alvo, de preferência ao ar livre.':'GPS is taking a while. Try again with the target button, ideally outdoors.',
'Não foi possível saber onde estás. Podes procurar a tua cidade.':"We couldn't find where you are. You can search for your city.",
'Sem problema. Podes usar o botão do alvo quando quiseres.':'No problem. You can use the target button whenever you like.',
// ---------- estados, erros e avisos ----------
'Sem ligação':'Offline','Neste aparelho':'On this device','Ao vivo':'Live','Sem sessão':'Signed out','Erro':'Error',
'Não foi possível ligar ao servidor. Verifica a internet e recarrega a página.':"Couldn't connect to the server. Check your internet connection and reload the page.",
'Chegaste ao limite de 1 reporte por dia. Tenta outra vez amanhã.':"You've reached the limit of 1 report per day. Try again tomorrow.",
'Chegaste ao limite de {n} reportes por dia. Tenta outra vez amanhã.':"You've reached the limit of {n} reports per day. Try again tomorrow.",
'A data tem de estar nos últimos 30 dias.':'The date must be within the last 30 days.','Já tinhas feito isto antes.':'You had already done this.',
'A tua conta está bloqueada.':'Your account is blocked.','A tua conta está bloqueada':'Your account is blocked',
'Confirma primeiro o teu telemóvel.':'Confirm your mobile number first.','Não tens permissão para fazer isto.':"You don't have permission to do this.",
'Muitos pedidos seguidos. Espera um minuto e tenta outra vez.':'Too many requests in a row. Wait a minute and try again.',
'Código errado ou expirado. Pede outro.':'Wrong or expired code. Ask for a new one.','Sem ligação à internet. Tenta outra vez.':'No internet connection. Try again.',
'Algo correu mal. Tenta outra vez.':'Something went wrong. Try again.',
'O nome precisa de pelo menos 2 letras.':'The name needs at least 2 letters.','Usa só um nome, sem emails nem links.':'Use just a name, no emails or links.',
'Escreve um email válido.':'Enter a valid email.','Escreve o código que recebeste.':'Enter the code you received.',
'Escreve um número válido, por exemplo 912 345 678.':'Enter a valid number, for example 912 345 678.',
'Nome guardado':'Name saved','Toca outra vez: apaga a conta e todos os teus reportes':'Tap again: deletes your account and all your reports','Conta apagada':'Account deleted',
'Utilizador':'User','Local {x}':'Location {x}','em {x}':'in {x}','a {n} km de {x}':'{n} km from {x}',
'Vai aparecer como publicado por':'It will show as posted by',
'Parece haver uma matrícula. Tira-a do texto, por favor: não publicamos matrículas.':'This looks like a number plate. Please remove it: we do not publish number plates.',
'Tira o e-mail do texto.':'Remove the email address from the text.','Tira o número de telefone do texto.':'Remove the phone number from the text.',
'Parece haver um nome de pessoa. Descreve a situação sem identificar ninguém. Nomes de ruas, como "Rua Maria Pia", podem ficar.':'This looks like a person\'s name. Describe what happened without identifying anyone. Street names, such as "Rua Maria Pia", are fine.',
'Obrigado! Já está no mapa':"Thanks! It's on the map",'Não deu para publicar. Confirma que tens sessão iniciada e tenta outra vez.':"Couldn't publish. Check that you are signed in and try again.",
'agora mesmo':'just now','há {n} min':'{n} min ago','há {n} h':'{n} h ago','ontem':'yesterday','há {n} dias':'{n} days ago',
'Sem descrição.':'No description.','pessoa também viu isto':'person also saw this','pessoas também viram isto':'people also saw this',
'Já confirmaste':'You already confirmed','Apagar (administrador)':'Delete (admin)','(tu)':'(you)','escondido após denúncias, à espera de revisão':'hidden after being flagged, awaiting review',
'Obrigado pela confirmação':'Thanks for confirming','Não deu para confirmar':"Couldn't confirm",'Obrigado. Um administrador vai rever':'Thanks. An administrator will review it',
'Toca outra vez para apagar':'Tap again to delete','Reporte apagado':'Report deleted','Não deu para apagar':"Couldn't delete",
'Ainda não há reportes neste período. Toca no lápis amarelo para criar o primeiro.':'No reports in this period yet. Tap the yellow pencil to add the first one.',
// ---------- administração ----------
'Administração · StreetAlert':'Administration · StreetAlert','← Voltar ao mapa':'← Back to the map','Administração':'Administration',
'A verificar a tua sessão…':'Checking your session…','Só administradores podem ver esta página. Entra primeiro na app com a tua conta.':'Only administrators can see this page. Sign in to the app with your account first.',
'Denúncias':'Flags','Últimos reportes':'Latest reports','Utilizadores':'Users','Definições':'Settings','Reportes denunciados':'Flagged reports',
'A carregar…':'Loading…','Últimos 100 reportes':'Latest 100 reports','Procurar pelo nome':'Search by name','Procurar utilizador':'Search for a user',
'Exigir telemóvel confirmado por SMS para publicar':'Require a mobile number confirmed by text message to publish',
'Reportes por dia numa conta nova':'Reports per day for a new account','Reportes por dia nas outras contas':'Reports per day for other accounts',
'Dias em que uma conta conta como nova':'Days an account counts as new','Denúncias que escondem um reporte até ser revisto':'Flags that hide a report until it is reviewed',
'Só ativa o SMS depois de configurares um fornecedor de SMS no Supabase (ver PUBLICAR.md). Sem isso ninguém consegue confirmar o telemóvel.':'Only turn on text messages after setting up an SMS provider in Supabase (see PUBLICAR.md). Without it nobody can confirm their mobile number.',
'Guardar definições':'Save settings','Escondido':'Hidden','denúncia':'flag','denúncias':'flags','Por':'By','bloqueado':'blocked','(sem descrição)':'(no description)',
'Motivos:':'Reasons:','Ver no OpenStreetMap':'View on OpenStreetMap','Apagar reporte':'Delete report','Está correto: mostrar outra vez':"It's fine: show it again",
'Reporte aprovado':'Report approved','Bloquear autor e apagar os reportes dele':'Block author and delete their reports','Autor bloqueado':'Author blocked',
'Toca outra vez para confirmar':'Tap again to confirm','Erro:':'Error:','Não há denúncias por rever.':'No flags to review.','Ainda não há reportes.':'No reports yet.',
'Ninguém encontrado.':'Nobody found.','desde {d}':'since {d}','{n} reportes':'{n} reports','Desbloquear':'Unblock','Conta desbloqueada':'Account unblocked',
'Bloquear':'Block','Conta bloqueada':'Account blocked','Bloquear e apagar os reportes':'Block and delete their reports','Definições guardadas':'Settings saved',
'A base de dados ainda não está configurada (config.js).':'The database is not set up yet (config.js).','Não foi possível ligar ao servidor.':"Couldn't connect to the server.",
'Entra primeiro na app com a tua conta de administrador e depois volta a esta página.':'Sign in to the app with your administrator account first, then come back to this page.',
'A tua conta não é de administrador.':'Your account is not an administrator account.','Sessão de {n}.':'Signed in as {n}.','tenta outra vez':'try again',
'Política de Privacidade · StreetAlert':'Privacy Policy · StreetAlert'
};
// Textos com formatação (negrito, links): trocados pelo HTML inteiro.
const HT={
'tut-p0':'A map made by the community to flag <b>violence</b> and <b>bad parking</b> in your area. In 30 seconds we\'ll show you how it works.',
'tut-p1':'Tap the <b>yellow pencil</b>, drag the map to the right spot and press <b>It\'s here!</b>. Then choose the type, when it happened and, if you like, a short description.',
'tut-p2':'Tap a point on the map to see what happened, <b>who posted it</b> and <b>the date and time</b>. The list button, next to the search, shows the latest ones.',
'tut-p3':'If you saw it too, press <b>I saw this too</b>: it makes the alert more reliable. If an alert is false or offensive, use <b>Flag</b>. Don\'t write names, number plates or phone numbers.',
'tut-p4':'The coloured dots are landmarks: police stations, hospitals, schools, supermarkets, restaurants and more. The <b>target</b> button takes the map to where you are. The <b>?</b> shows this help again.',
'askloc-p0':'With your location, the map opens right on your street and you see the alerts around you. Your location <b>stays on your phone</b>: we never receive or store it.',
'askloc-p1':'Next, your phone or browser will ask for permission. Press <b>Allow</b>.',
'inst-safari':'To install, use <b>Safari</b> (the blue compass icon). Copy the link, open Safari and paste it in the address bar.',
'inst-inapp':'You\'re inside another app (Instagram, Facebook…). Tap <b>⋯</b> in the corner of the screen and choose <b>Open in Safari</b> or <b>Open in browser</b>. You can also copy the link and paste it in Safari.',
'inst-ios1':'Tap the <b>Share</b> button: the square with an arrow pointing up. On iPhone it\'s in Safari\'s bottom bar; on iPad, at the top right.<small>Can\'t see it? Tap <b>⋯</b> next to the address first.</small>',
'inst-ios2':'Scroll the list up and tap <b>Add to Home Screen</b>.',
'inst-ios3':'Confirm with <b>Add</b>, in the top right corner.',
'inst-ios4':'Done! StreetAlert is now on your <b>Home Screen</b>, like any other app. Always open it from that icon.',
'inst-arrow':'The <b>Share</b> button is down here',
'inst-and1':'Tap the browser menu <b>⋮</b>.',
'inst-and2':'Choose <b>Install app</b> or <b>Add to Home screen</b>.',
'inst-desk':'In Chrome or Edge, click the install icon in the address bar, or the menu <b>⋮</b> &gt; <b>Install StreetAlert</b>.',
'g-note':'<b>Your name is visible.</b> It appears next to every point you post and can be seen by anyone who opens the app. You can use just your first name or a nickname. Your email and mobile number are never shown. <a href="privacidade.html" target="_blank" rel="noopener">Privacy policy</a>'
};
const PT={};for(const k in EN)if(!(EN[k] in PT))PT[EN[k]]=k;
const ptHTML=new Map();
const fill=(s,v)=>v?s.replace(/\{(\w+)\}/g,(m,k)=>k in v?v[k]:m):s;
// Traduz um texto, mantendo os espaços à volta.
function swap(s,to){const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(s);const core=m[2];if(!core)return s;
  const d=to==='en'?EN:PT;const r=d[core];return r==null||r===core?s:m[1]+r+m[3]}
function t(s,v){return fill(lang==='en'?(EN[s]??s):s,v)}
const L=(pt,en)=>lang==='en'?en:pt;
const ATTRS=['placeholder','aria-label','title'];
function apply(root){
  root=root||document.body;if(!root)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode(n){
    if(n.nodeType===1)return /^(SCRIPT|STYLE|SVG|svg)$/.test(n.nodeName)||n.getAttribute('translate')==='no'||n.hasAttribute('data-i18n')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_SKIP;
    return NodeFilter.FILTER_ACCEPT}});
  const texts=[];while(w.nextNode())texts.push(w.currentNode);
  for(const n of texts){const v=swap(n.nodeValue,lang);if(v!==n.nodeValue)n.nodeValue=v}
  root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>{for(const a of ATTRS)if(e.hasAttribute(a)){const v=e.getAttribute(a),x=swap(v,lang);if(x!==v)e.setAttribute(a,x)}});
  root.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(!ptHTML.has(e))ptHTML.set(e,e.innerHTML);
    const h=lang==='en'&&HT[k]?HT[k]:ptHTML.get(e);if(e.innerHTML!==h)e.innerHTML=h});
  document.title=swap(document.title,lang);
  document.documentElement.lang=lang==='en'?'en':'pt-PT';
  paintToggles();
}
const GLOBE='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5s-1.3 6.7-3.9 9.5c-2.6-2.8-3.9-6-3.9-9.5s1.3-6.7 3.9-9.5z"/></svg>';
function paintToggles(){document.querySelectorAll('[data-lang-toggle]').forEach(b=>{
  b.innerHTML=GLOBE+'<span class="'+(lang==='pt'?'on':'')+'">PT</span><span aria-hidden="true">|</span><span class="'+(lang==='en'?'on':'')+'">EN</span>';
  b.setAttribute('aria-label',lang==='en'?'Mudar para português':'Switch to English');b.setAttribute('lang',lang==='en'?'pt-PT':'en');
  if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>set(lang==='en'?'pt':'en'))}})}
const subs=[];
function set(l){if(l!=='en'&&l!=='pt')return;lang=l;put(l);apply();subs.forEach(f=>{try{f(l)}catch(e){}})}
window.I18N={get lang(){return lang},t,L,apply,set,onChange:f=>subs.push(f),
  locale:()=>lang==='en'?'en-GB':'pt-PT'};
document.documentElement.lang=lang==='en'?'en':'pt-PT';
if(document.body)apply();else document.addEventListener('DOMContentLoaded',()=>apply());
})();
