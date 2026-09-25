// Builds ro/index.html: the same page with the Romanian text baked in, so /ro/ is a real,
// crawlable Romanian page (its own lang, canonical and hreflang). The English originals ride
// along in data-en attributes so the in-page EN/RO switch still works instantly.
// Run after editing index.html or js/i18n.js:   node tools/build-ro.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

// load the Romanian dictionary from js/i18n.js without a browser
const stub = { documentElement: { lang: 'en' }, querySelector: () => null, querySelectorAll: () => [] };
const win = {};
new Function('window', 'document', fs.readFileSync(path.join(root, 'js/i18n.js'), 'utf8'))(win, stub);
const RO = win.WHV.RO;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const missing = [];

// text
html = html.replace(/(<([a-z0-9]+)\b[^>]*?\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, tag, key, inner, close) => {
  if (!(key in RO)) { missing.push(key); return m; }
  return open.replace(/>$/, ` data-en="${esc(inner)}">`) + RO[key] + close;
});
// aria labels
html = html.replace(/aria-label="([^"]*)"([^>]*?)data-i18n-aria="([^"]+)"/g, (m, en, mid, key) =>
  `aria-label="${esc(RO[key] || en)}" data-en-aria="${en}"${mid}data-i18n-aria="${key}"`);
html = html.replace(/aria-label="Source (\d+)"/g, 'aria-label="Sursa $1"');

// head and language
const T = {
  title: 'Când oamenii dispar: ce s-ar întâmpla dacă oamenii ar dispărea?',
  desc: 'O cronologie interactivă, bazată pe dovezi, a Pământului după dispariția oamenilor: primele ore, când cad rețelele electrice, secolele în care orașele devin pădure și milioanele de ani care urmează.',
  ogt: 'Când oamenii dispar',
  ogd: 'Mâine dimineață nu se mai trezește nimeni. O cronologie interactivă a Pământului în orele, secolele și milioanele de ani de după dispariția noastră.',
};
const base = 'https://mariuscomper.uk/when-humans-vanish/';
const swaps = [
  ['<html lang="en" class="no-js">', '<html lang="ro" class="no-js">'],
  [/<title>[^<]*<\/title>/, `<title>${T.title}</title>`],
  [/(<meta name="description" content=")[^"]*/, `$1${T.desc}`],
  [/(<link rel="canonical" href=")[^"]*/, `$1${base}ro/`],
  ['<meta property="og:locale" content="en_GB">', '<meta property="og:locale" content="ro_RO">'],
  ['<meta property="og:locale:alternate" content="ro_RO">', '<meta property="og:locale:alternate" content="en_GB">'],
  [/(<meta property="og:title" content=")[^"]*/, `$1${T.ogt}`],
  [/(<meta property="og:description" content=")[^"]*/, `$1${T.ogd}`],
  [/(<meta property="og:url" content=")[^"]*/, `$1${base}ro/`],
  [/("headline": ")[^"]*/, `$1${T.title}`],
  [/("alternativeHeadline": ")[^"]*/, '$1O cronologie a Pământului fără noi, de la primele ore la un miliard de ani'],
  [/("description": ")[^"]*/, `$1${T.desc}`],
  ['"inLanguage": "en"', '"inLanguage": "ro"'],
  [`"url": "${base}"`, `"url": "${base}ro/"`],
  // assets live one level up
  [/(href|src)="(css|js|vendor)\//g, '$1="../$2/'],
  ['href="favicon.svg"', 'href="../favicon.svg"'],
  // language switch
  ['<a id="lang-en" data-lang="en" href="./" hreflang="en" lang="en" aria-current="true">EN</a>', '<a id="lang-en" data-lang="en" href="../" hreflang="en" lang="en">EN</a>'],
  ['<a id="lang-ro" data-lang="ro" href="ro/" hreflang="ro" lang="ro">RO</a>', '<a id="lang-ro" data-lang="ro" href="./" hreflang="ro" lang="ro" aria-current="true">RO</a>'],
];
for (const [a, b] of swaps) {
  const before = html;
  html = html.replace(a, b);
  if (before === html) throw new Error('build-ro: pattern not found: ' + a);
}
if (missing.length) throw new Error('build-ro: no Romanian text for ' + missing.join(', '));
fs.mkdirSync(path.join(root, 'ro'), { recursive: true });
fs.writeFileSync(path.join(root, 'ro/index.html'), html);
console.log('ro/index.html written');
