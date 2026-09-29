/*
 * Épreuve du site PUBLIÉ, une fois Pages à jour :
 *
 *     node build/essais_en_ligne.mjs [https://cristo67000.github.io/code-en-clair/]
 *
 *   1. chaque fichier que le service worker range est servi tel qu'il est dans le
 *      dépôt (empreinte SHA-256) — ce n'est pas le code HTTP qui prouve la mise en
 *      ligne, c'est le contenu ;
 *   2. dans un Chrome neuf, l'application démarre sur le site réel, sans erreur,
 *      et son service worker prend la main ;
 *   3. le même profil est relancé avec le domaine COUPÉ (résolution de nom
 *      refusée) : l'application doit démarrer, montrer une fiche complète et
 *      retrouver les notes écrites entre-temps. C'est la seule façon d'éprouver
 *      le hors-ligne du site publié ; les émulations de réseau du protocole ne
 *      coupent pas ce que répond un service worker.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lancerChrome, fermerChrome, ouvrirOnglet } from './pilote_chrome.mjs';

const RACINE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = (process.argv[2] || 'https://cristo67000.github.io/code-en-clair/').replace(/\/?$/, '/');
const DOMAINE = new URL(SITE).hostname;
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
let bons = 0;
const echecs = [];
function ok(condition, message) { if (condition) bons += 1; else echecs.push(message); }

// ── 1. Le contenu servi est celui du dépôt ──────────────────────────────────
const sw = fs.readFileSync(path.join(RACINE, 'sw.js'), 'utf-8');
const fichiers = [...sw.slice(sw.indexOf('const FICHIERS'), sw.indexOf('];', sw.indexOf('const FICHIERS'))).matchAll(/'([^']+)'/g)]
  .map((m) => m[1]).filter((f) => f !== './').concat(['sw.js']);
const differents = [];
for (const f of fichiers) {
  const reponse = await fetch(SITE + f + '?verif=' + Date.now(), { cache: 'no-store' });
  if (!reponse.ok) { differents.push(f + ' : ' + reponse.status); continue; }
  const distant = crypto.createHash('sha256').update(Buffer.from(await reponse.arrayBuffer())).digest('hex');
  const local = crypto.createHash('sha256').update(fs.readFileSync(path.join(RACINE, f))).digest('hex');
  if (distant !== local) differents.push(f);
}
ok(differents.length === 0, fichiers.length + ' fichiers comparés au dépôt, différents : ' + differents.join(', '));

// ── 2. Un Chrome neuf sur le site réel ──────────────────────────────────────
const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'cec-en-ligne-'));
async function session(options, faire) {
  const chrome = await lancerChrome({ port: 9354, profil, options });
  try {
    const onglet = await ouvrirOnglet(chrome, 'about:blank');
    await onglet.envoyer('Emulation.setDeviceMetricsOverride', { width: 400, height: 820, deviceScaleFactor: 1, mobile: true });
    await faire(onglet);
    return onglet.erreurs;
  } finally {
    await fermerChrome(chrome);
  }
}
const attendre = async (onglet, cond, ms) => {
  const fin = Date.now() + (ms || 15000);
  while (Date.now() < fin) {
    try { if (await onglet.evaluer('return !!(' + cond + ')')) return true; } catch (e) { /* */ }
    await pause(150);
  }
  return false;
};

try {
  const erreurs1 = await session([], async (o) => {
    await o.naviguer(SITE);
    ok(await attendre(o, "document.getElementById('demarrage').hidden === true"), 'en ligne : l’application démarre');
    ok(await o.evaluer('return Glossaire.termes.length') === 399, 'en ligne : 399 termes');
    const sonde = await o.evaluer("try { const c = await caches.open('sonde'); await c.put('/sonde', new Response('x')); await caches.delete('sonde'); return 'ok'; } catch (e) { return String(e); }");
    ok(sonde === 'ok', 'en ligne : l’API Cache fonctionne dans ce Chrome (' + sonde + ')');
    ok(await attendre(o, "navigator.serviceWorker.getRegistration().then((r) => !!(r && r.active))", 30000), 'en ligne : le service worker est actif');
    await o.envoyer('Page.reload');
    ok(await attendre(o, "document.getElementById('demarrage').hidden === true && navigator.serviceWorker.controller", 20000), 'en ligne : après rechargement, le service worker contrôle la page');
    const contenu = await o.evaluer("const n = (await caches.keys()).find((k) => k.startsWith('code-en-clair-coquille-')); return n ? (await (await caches.open(n)).keys()).length : 0");
    ok(contenu >= 40, 'en ligne : la coquille est rangée (' + contenu + ' fichiers)');
    await o.evaluer("await Store.ecrireNote({ id: 'n-essai-en-ligne', ref: 'hash', type: 'note', titre: '', texte: 'écrite en ligne', cree: 1, modifie: 1 }); return 1");
  });
  ok(erreurs1.length === 0, 'en ligne : erreurs de page : ' + erreurs1.slice(0, 3).join(' | '));

  // ── 3. Le domaine coupé, même profil ──────────────────────────────────────
  const erreurs2 = await session(['--host-resolver-rules=MAP ' + DOMAINE + ' ~NOTFOUND'], async (o) => {
    await o.naviguer(SITE);
    ok(await attendre(o, "document.getElementById('demarrage').hidden === true"), 'hors ligne : l’application démarre sans le domaine');
    ok(await o.evaluer('return !!navigator.serviceWorker.controller'), 'hors ligne : c’est bien le service worker qui répond');
    ok(await o.evaluer('return Glossaire.termes.length') === 399, 'hors ligne : 399 termes');
    await o.evaluer("Fiche.ouvrir('hash'); return 1");
    ok(await attendre(o, "document.querySelector('#fiche figure.schema svg') && document.querySelector('#fiche .exemple pre.code') && document.querySelector('#fiche .note-carte')"), 'hors ligne : fiche complète (schéma, exemple, note écrite en ligne)');
    // un fichier que le service worker n'a pas : il doit aller au réseau, et échouer
    const reponse = await o.evaluer("try { const r = await fetch('" + SITE + "inconnu-' + Date.now() + '.txt', { cache: 'no-store' }); return r.status; } catch (e) { return 'refusé'; }");
    ok(reponse === 'refusé', 'hors ligne : le domaine est bien injoignable (' + reponse + ')');
  });
  ok(erreurs2.filter((e) => !/ERR_NAME_NOT_RESOLVED|Failed to load resource|Failed to fetch/.test(e)).length === 0, 'hors ligne : erreurs de page : ' + erreurs2.slice(0, 3).join(' | '));
} catch (erreur) {
  echecs.push('EXCEPTION : ' + (erreur && erreur.stack ? erreur.stack : erreur));
} finally {
  try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* tenu par Chrome */ }
}

console.log(bons + ' contrôles réussis sur ' + SITE + ', ' + echecs.length + ' échec(s).');
for (const e of echecs) console.log('  ✗ ' + e);
process.exit(echecs.length ? 1 : 0);
