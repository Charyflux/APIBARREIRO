// Copia o site (index.html, i18n.js, config.js, admin.html, mapa-pt.json, freguesias.json, privacidade.html, icons/ e vendor/) para www/, que o Capacitor empacota na app.
import { mkdirSync, copyFileSync, cpSync, existsSync, rmSync } from 'node:fs';
const out = 'www';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'i18n.js', 'config.js', 'admin.html', 'mapa-pt.json', 'freguesias.json', 'privacidade.html', 'manifest.webmanifest', 'sw.js']) {
  if (existsSync(f)) copyFileSync(f, `${out}/${f}`);
}
if (existsSync('icons')) cpSync('icons', `${out}/icons`, { recursive: true });
if (existsSync('vendor')) cpSync('vendor', `${out}/vendor`, { recursive: true });
console.log('www/ pronto');
