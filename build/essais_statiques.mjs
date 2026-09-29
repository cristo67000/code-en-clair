/*
 * Épreuves qui ne demandent pas de navigateur : cohérence des données, des
 * textes d'interface et des listes de fichiers.
 *
 *     node build/essais_statiques.mjs
 *
 * Ce sont les pannes silencieuses qu'on cherche : une clé de traduction
 * absente d'une langue, un fichier oublié dans la liste du service worker (la
 * page marcherait en ligne et casserait hors ligne), une icône qui n'a pas la
 * taille annoncée par le manifeste, un terme qui renvoie vers un terme qui
 * n'existe plus.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.dirname(ICI);
let bons = 0;
const echecs = [];

function ok(condition, message) {
  if (condition) bons += 1; else echecs.push(message);
}
const lire = (f) => fs.readFileSync(path.join(RACINE, f), 'utf-8');
const existe = (f) => fs.existsSync(path.join(RACINE, f));

// ── Les données ─────────────────────────────────────────────────────────────

const donnees = JSON.parse(lire('data/glossaire.json'));
const termes = donnees.termes;
const manifeste = JSON.parse(lire('data/manifeste.json'));

ok(termes.length >= 300, 'au moins 300 termes (il y en a ' + termes.length + ')');
ok(manifeste.termes === termes.length, 'le manifeste des données annonce le bon nombre de termes');
ok(new Set(termes.map((t) => t.id)).size === termes.length, 'identifiants uniques');
const ids = new Set(termes.map((t) => t.id));

const contexte = vm.createContext({ window: {} });
for (const f of fs.readdirSync(path.join(RACINE, 'js', 'schemas')).filter((x) => x.endsWith('.js'))) {
  vm.runInContext(lire('js/schemas/' + f), contexte, { filename: f });
}
const schemas = contexte.window.Schemas;
ok(Object.keys(schemas).length >= 100, 'au moins 100 schémas');

/* U+FFFD (le « � » d'un mauvais décodage), NUL et autres signes de contrôle
 * hors saut de ligne et tabulation, séparateurs de ligne U+2028 et U+2029. */
function aDesSignesBizarres(texte) {
  for (const signe of texte) {
    const c = signe.codePointAt(0);
    if (c === 0xFFFD || c === 0x2028 || c === 0x2029) return true;
    if (c < 0x20 && c !== 0x0A && c !== 0x09) return true;
  }
  return false;
}

let sensSansFr = 0; let sensSansEn = 0; let identiques = 0; let voirCasse = 0; let schemaCasse = 0;
let avecCaracteresBizarres = 0;
for (const t of termes) {
  for (const s of t.s) {
    if (!s.f || s.f.length < 40) sensSansFr += 1;
    if (!s.e || s.e.length < 40) sensSansEn += 1;
    if (s.f === s.e) identiques += 1;
    if (s.sc && !schemas[s.sc]) schemaCasse += 1;
    const tout = [s.f, s.e, s.pf, s.pe, s.af, s.ae, s.ex && s.ex.c].filter(Boolean).join('\n');
    // U+FFFD, signes de contrôle (hors saut de ligne et tabulation), NUL
    if (aDesSignesBizarres(tout)) avecCaracteresBizarres += 1;
  }
  for (const v of t.v || []) if (!ids.has(v)) voirCasse += 1;
}
ok(sensSansFr === 0, 'chaque sens a une définition française (' + sensSansFr + ' manquent)');
ok(sensSansEn === 0, 'chaque sens a une définition anglaise (' + sensSansEn + ' manquent)');
ok(identiques === 0, 'aucune définition française identique à l’anglaise');
ok(voirCasse === 0, 'tous les renvois « voir aussi » existent');
ok(schemaCasse === 0, 'tous les schémas cités existent');
ok(avecCaracteresBizarres === 0, 'aucun caractère de contrôle ni « � » dans les textes');

// Le « \u » de l'échappement Unicode doit être arrivé intact (l'outil d'écriture
// de la session a l'habitude de le transformer en caractère).
const echap = termes.find((t) => t.id === 'echappement');
ok(echap && echap.s[0].ex.c.includes('\\u00e9'), 'la séquence \\u00e9 est intacte dans « échappement »');
const unicode = termes.find((t) => t.id === 'unicode');
ok(unicode && unicode.s[0].ex.c.includes('\\u00e9'), 'la séquence \\u00e9 est intacte dans « unicode »');

// Chaque catégorie a de quoi faire une liste
for (const c of donnees.cats) {
  const n = termes.filter((t) => t.c === c.id).length;
  ok(n >= 15, 'catégorie ' + c.id + ' : au moins 15 termes (' + n + ')');
}
ok(termes.every((t) => donnees.cats.some((c) => c.id === t.c)), 'toute catégorie de terme existe');

// Les valeurs qu'on a calculées à part doivent être justes dans les exemples
const texteTout = JSON.stringify(termes);
for (const attendu of ['Qm9uam91cg==', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  'ce013625030ba8dba906f756967f9e9ca394464a', '0.30000000000000004', 'C3 A9', '9172e8ee', '2cb4b143']) {
  ok(texteTout.includes(attendu), 'la valeur vérifiée ' + attendu.slice(0, 16) + '… figure au glossaire');
}

// ── Les textes d'interface ──────────────────────────────────────────────────

const contexteI18n = vm.createContext({ window: {}, document: {} });
vm.runInContext(lire('js/i18n.js'), contexteI18n, { filename: 'i18n.js' });
const dico = contexteI18n.window.I18n.dictionnaires;
const clesFr = new Set(Object.keys(dico.fr));
const clesEn = new Set(Object.keys(dico.en));
const seulementFr = [...clesFr].filter((k) => !clesEn.has(k));
const seulementEn = [...clesEn].filter((k) => !clesFr.has(k));
ok(seulementFr.length === 0, 'clés seulement en français : ' + seulementFr.join(', '));
ok(seulementEn.length === 0, 'clés seulement en anglais : ' + seulementEn.join(', '));

const sources = ['index.html'].concat(fs.readdirSync(path.join(RACINE, 'js')).filter((f) => f.endsWith('.js') && f !== 'i18n.js').map((f) => 'js/' + f));
const utilisees = new Set();
const prefixes = new Set();
for (const f of sources) {
  const texte = lire(f);
  for (const m of texte.matchAll(/\bt\('([a-z0-9.-]+)'/g)) utilisees.add(m[1]);
  for (const m of texte.matchAll(/\bplur\('([a-z0-9.-]+)'/g)) { utilisees.add(m[1] + '.1'); utilisees.add(m[1] + '.n'); }
  for (const m of texte.matchAll(/data-t(?:-ph|-aria|-titre)?="([a-z0-9.-]+)"/g)) utilisees.add(m[1]);
  for (const m of texte.matchAll(/\bt\('([a-z0-9.-]+\.)' \+/g)) prefixes.add(m[1]);
  for (const m of texte.matchAll(/'([a-z0-9-]+\.[a-z0-9-]+\.)' \+ /g)) prefixes.add(m[1]);
}
// clés écrites en tableau dans le JavaScript (ex. les trois textes des liens du guide iOS)
for (const f of sources) {
  const texte = lire(f);
  for (const m of texte.matchAll(/'((?:reg|quiz|carnet|fiche|mes|editeur|sauv|maj|rien|via|filtre|onglet|langage|cat|app|demarrage|chercher|compte|recents|du-jour|lettre|perso|favori|a-revoir)\.[a-z0-9.-]+)'/g)) {
    if (clesFr.has(m[1])) utilisees.add(m[1]);
  }
}
const absentes = [...utilisees].filter((k) => !k.endsWith('.') && !clesFr.has(k));
ok(absentes.length === 0, 'clés utilisées mais absentes du dictionnaire : ' + absentes.join(', '));
for (const p of prefixes) ok([...clesFr].some((k) => k.startsWith(p)), 'aucune clé ne commence par « ' + p + ' »');
const inutiles = [...clesFr].filter((k) => !utilisees.has(k) && ![...prefixes].some((p) => k.startsWith(p)));
// les clés composées (ex. 'reg.taille.' + n, 'carnet.vide.' + rubrique) sont couvertes par les préfixes
ok(inutiles.length <= 6, 'trop de clés inutilisées : ' + inutiles.join(', '));

// ── Les fichiers ────────────────────────────────────────────────────────────

const html = lire('index.html');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
const dossiersJs = fs.readdirSync(path.join(RACINE, 'js')).filter((f) => f.endsWith('.js')).map((f) => 'js/' + f)
  .concat(fs.readdirSync(path.join(RACINE, 'js', 'schemas')).filter((f) => f.endsWith('.js')).map((f) => 'js/schemas/' + f));
ok(scripts.every(existe), 'tous les scripts de index.html existent');
ok(dossiersJs.every((f) => scripts.includes(f)), 'tout fichier JS est chargé par index.html : ' + dossiersJs.filter((f) => !scripts.includes(f)).join(', '));

const sw = lire('sw.js');
const liste = [...sw.slice(sw.indexOf('const FICHIERS'), sw.indexOf('];', sw.indexOf('const FICHIERS'))).matchAll(/'([^']+)'/g)]
  .map((m) => m[1]).filter((f) => f !== './');
ok(liste.every(existe), 'tous les fichiers du service worker existent : ' + liste.filter((f) => !existe(f)).join(', '));
const attendus = new Set(['index.html', 'confidentialite.html', 'manifest.webmanifest', ...scripts,
  ...[...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]), 'css/page.css',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'data/manifeste.json', 'data/glossaire.json']);
ok([...attendus].every((f) => liste.includes(f)), 'le service worker range tout ce que la page charge : manque '
  + [...attendus].filter((f) => !liste.includes(f)).join(', '));
ok(liste.every((f) => attendus.has(f)), 'le service worker ne range rien d’inutile : '
  + liste.filter((f) => !attendus.has(f)).join(', '));

const versionSw = /const VERSION = '([^']+)'/.exec(sw)[1];
const versionHtml = /name="application-version" content="([^"]+)"/.exec(html)[1];
ok(versionSw === versionHtml, 'même version dans sw.js (' + versionSw + ') et index.html (' + versionHtml + ')');

// Le manifeste web et ses icônes
const man = JSON.parse(lire('manifest.webmanifest'));
function dimensionsPng(f) {
  const b = fs.readFileSync(path.join(RACINE, f));
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}
for (const icone of man.icons) {
  const [l, h] = dimensionsPng(icone.src);
  ok(icone.sizes === l + 'x' + h, 'icône ' + icone.src + ' : ' + l + 'x' + h + ' au lieu de ' + icone.sizes);
}
ok(man.icons.some((i) => i.purpose === 'maskable'), 'une icône maskable est déclarée');
ok(man.icons.some((i) => i.sizes === '512x512' && i.purpose === 'any'), 'une icône 512 « any » est déclarée');
ok(man.start_url === './' && man.scope === './', 'start_url et scope relatifs');
const [lo, ho] = dimensionsPng('icons/apercu-1200x630.png');
ok(lo === 1200 && ho === 630, 'image d’aperçu en 1200×630');

// La politique de sécurité : aucun script ni style en ligne
ok(!/<script(?![^>]*\bsrc=)[^>]*>/.test(html), 'aucun script en ligne dans index.html');
ok(!/\sstyle="/.test(html), 'aucun attribut style dans index.html');
for (const f of dossiersJs) {
  const texte = lire(f);
  ok(!/\.innerHTML\s*=/.test(texte) && !/insertAdjacentHTML|document\.write\(/.test(texte), f + ' n’écrit jamais de HTML brut');
  ok(!/setAttribute\(\s*['"]style['"]/.test(texte), f + ' ne pose pas d’attribut style');
  ok(!/\beval\(|new Function\(/.test(texte), f + ' sans eval');
}

// ── Bilan ───────────────────────────────────────────────────────────────────

console.log(bons + ' contrôles réussis, ' + echecs.length + ' échec(s).');
for (const e of echecs) console.log('  ✗ ' + e);
process.exit(echecs.length ? 1 : 0);
