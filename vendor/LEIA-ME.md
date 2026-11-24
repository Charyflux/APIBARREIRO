# Bibliotecas guardadas no próprio site

Estas bibliotecas eram carregadas de CDNs (cdnjs e jsDelivr). Agora vêm do próprio site, para que
um problema ou ataque num CDN não consiga pôr código na StreetAlert, e para a Content Security Policy
poder aceitar só scripts do próprio site (`script-src 'self'`).

Todas foram tiradas do registo npm com `npm pack` (que confirma a integridade do pacote) e não foram alteradas.

| Ficheiro | Pacote npm | SHA-256 |
|---|---|---|
| `leaflet-1.9.4.js` | `leaflet@1.9.4` (`dist/leaflet.js`) | `db49d009c841f5ca34a888c96511ae936fd9f5533e90d8b2c4d57596f4e5641a` |
| `leaflet.markercluster-1.5.3.js` | `leaflet.markercluster@1.5.3` (`dist/leaflet.markercluster.js`) | `1e4e1d22972a3926f48598e0caf14e3fe7049835d428a344fed4f9e3665b3508` |
| `maplibre-gl-4.7.1.js` | `maplibre-gl@4.7.1` (`dist/maplibre-gl.js`) | `be9633c4d870e26fb37f1cfe5c5a77181667114003ea16207ac7850d8da8add1` |
| `maplibre-gl-4.7.1.css` | `maplibre-gl@4.7.1` (`dist/maplibre-gl.css`) | `576b085fdd9487a65a19215328c1e086c07ce5bf6da09b666b3806d3d008dae9` |
| `leaflet-maplibre-gl-0.0.22.js` | `@maplibre/maplibre-gl-leaflet@0.0.22` | `59ecd8d2b32779d24f1bd26b87c8890f27e4a6e7858d993bd17e4d878e6d2677` |
| `supabase-2.45.4/supabase.js` | `@supabase/supabase-js@2.45.4` (`dist/umd/`) | `8596965fe918e656600a1b568d3a168f5c0d3d22a600886bb6f44a6555db01e7` |
| `supabase-2.45.4/591.supabase.js` | idem (pedaço carregado pelo anterior) | `9c305b77dab63dd79eb96efab9069366fb2255bd8731d6b862287558d2560406` |
| `qrcode-1.0.0.min.js` | `qrcodejs@1.0.0` (`qrcode.min.js`) | `c541ef06327885a8415bca8df6071e14189b4855336def4f36db54bde8484f36` |

Para atualizar uma biblioteca: `npm pack <pacote>@<versão>`, copiar o ficheiro para aqui com a versão no nome,
mudar a referência em `index.html` / `admin.html` e atualizar esta tabela (`sha256sum vendor/...`).
