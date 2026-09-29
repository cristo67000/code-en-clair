/*
 * Recette fonctionnelle, dans un vrai Chrome piloté par le protocole DevTools.
 *
 *     node build/essais.mjs
 *
 * Elle ouvre l'application à la taille d'un téléphone et fait ce que ferait une
 * personne : chercher, ouvrir une fiche, écrire une note, un exemple, un terme,
 * jouer au quiz, changer de langue — puis coupe le serveur et vérifie que
 * l'application se relance hors ligne. Elle échoue à la moindre erreur de page,
 * exception ou violation de la politique de sécurité.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lancerChrome, fermerChrome, ouvrirOnglet } from './pilote_chrome.mjs';
import { demarrerServeur } from './serveur_local.mjs';

const RACINE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const VERSION_SW = /const VERSION = '([^']+)'/.exec(fs.readFileSync(path.join(RACINE, 'sw.js'), 'utf-8'))[1];
const PORT_WEB = 8199;
const PORT_CHROME = 9351;
const BASE = 'http://127.0.0.1:' + PORT_WEB + '/';

let bons = 0;
const echecs = [];
const ignores = [];
function ok(condition, message) { if (condition) bons += 1; else echecs.push(message); }
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const serveur = await demarrerServeur(PORT_WEB);
const chrome = await lancerChrome({ port: PORT_CHROME });
let onglet = null;

async function ouvrir(url) {
  if (onglet) onglet.fermer();
  onglet = await ouvrirOnglet(chrome, 'about:blank');
  await onglet.envoyer('Emulation.setDeviceMetricsOverride', { width: 400, height: 820, deviceScaleFactor: 1, mobile: true });
  await onglet.naviguer(url);
}

async function attendre(condition, ms, quoi) {
  const fin = Date.now() + (ms || 8000);
  while (Date.now() < fin) {
    try { if (await onglet.evaluer('return !!(' + condition + ')')) return true; } catch (e) { /* la page change */ }
    await pause(100);
  }
  let etat = '';
  try {
    etat = ' — état : ' + JSON.stringify(await onglet.evaluer(
      'return { fiche: Fiche.ouverte, ref: Fiche.ref, cachee: document.getElementById("fiche").hidden, classes: document.body.className, vue: App.vue, reculs: window.reculsAttendus, erreur: (document.querySelector("#editeur .erreur") || {}).textContent }'));
  } catch (e) { /* la page ne répond plus */ }
  echecs.push('délai dépassé : ' + (quoi || condition) + etat);
  return false;
}
const js = (source) => onglet.evaluer(source);

async function demarrage() {
  await ouvrir(BASE + 'index.html');
  await attendre("document.getElementById('demarrage').hidden === true", 15000, 'démarrage de l’application');
}

try {
  // ── Démarrage ─────────────────────────────────────────────────────────────
  await demarrage();
  ok(await js('return Glossaire.termes.length') >= 300, 'le glossaire est chargé (' + await js('return Glossaire.termes.length') + ' termes)');
  ok(await js("return document.querySelectorAll('#liste .terme-ligne').length") === await js('return Glossaire.termes.length'), 'toute la liste est dessinée');
  ok(await js("return document.querySelector('#compte').textContent") === '399 termes', 'le compteur dit « 399 termes »');
  ok(await js("return document.getElementById('du-jour').hidden === false"), 'le terme du jour est affiché');
  ok(await js("return document.querySelectorAll('.lettre').length") > 15, 'des lettres séparent la liste');
  ok(await js("return document.documentElement.lang") === 'fr', 'langue française par défaut');

  // ── Les termes demandés se trouvent ───────────────────────────────────────
  const demandes = {
    amend: 'amend', chunk: 'chunk', byte: 'byte', 'clone web': 'clone-web', blob: 'blob', bash: 'bash',
    commit: 'commit', empreinte: 'empreinte', diff: 'diff', fetch: 'fetch', hash: 'hash', headless: 'headless',
    git: 'git', 'git slash': 'dossier-git', js: 'js', id: 'id', '.gitignore': 'gitignore', gitignore: 'gitignore',
    manifest: 'manifest', manifeste: 'manifest', main: 'main', porcelain: 'porcelain', remote: 'remote',
    repository: 'repository', push: 'push', pull: 'pull', sha: 'sha', srgb: 'srgb', stash: 'stash', tag: 'tag',
    webp: 'webp', 'service worker': 'service-worker', 'sw.js': 'sw-js', token: 'token', 'identity noreply': 'noreply',
    noreply: 'noreply', 'clone': 'clone', 'dépôt': 'repository', 'hachage': 'hash', 'etiquette': 'tag', 'octet': 'byte',
    'Empreinte': 'empreinte', 'amender': 'amend', 'jeton': 'token', 'porcelaine': 'porcelain', 'AMEND': 'amend',
  };
  const echoues = [];
  for (const [requete, attendu] of Object.entries(demandes)) {
    const tetes = await js('return Glossaire.chercher(' + JSON.stringify(requete) + ').slice(0, 3).map((r) => r.terme.id)');
    if (!tetes.includes(attendu)) echoues.push(requete + ' → ' + tetes.join(', '));
  }
  ok(echoues.length === 0, 'recherche : ' + echoues.join(' | '));
  ok(await js("return Glossaire.chercher('dichotomique').some((r) => ['bisect', 'algorithme'].includes(r.terme.id))"), 'la recherche trouve un mot de la définition');
  ok(await js("return Glossaire.chercher('zzzzqq').length") === 0, 'une requête absurde ne trouve rien');

  // ── Recherche par l'interface ─────────────────────────────────────────────
  await js("const q = document.getElementById('q'); q.value = 'amend'; q.dispatchEvent(new Event('input')); return 1");
  await attendre("document.querySelector('#liste .terme-ligne .terme-mot').textContent === 'Amend'", 3000, 'résultat « Amend »');
  ok(await js("return document.getElementById('accueil').hidden === true"), 'la recherche cache l’accueil');
  await js("document.getElementById('q-vider').click(); return 1");
  await attendre("document.getElementById('accueil').hidden === false", 3000, 'retour à l’accueil');
  await js("const q = document.getElementById('q'); q.value = 'zzzzqq'; q.dispatchEvent(new Event('input')); return 1");
  await attendre("document.getElementById('rien').hidden === false", 3000, 'message « aucun terme »');
  ok(await js("return document.getElementById('b-ajouter-depuis-recherche').textContent.includes('zzzzqq')"), 'proposition d’ajouter le terme cherché');
  await js("document.getElementById('q-vider').click(); return 1");

  // ── Catégories ────────────────────────────────────────────────────────────
  await js("document.querySelectorAll('#filtres .filtre')[1].click(); return 1");
  await attendre("document.getElementById('compte').textContent === '50 termes'", 3000, 'filtre Git : 50 termes');
  ok(await js("return document.querySelectorAll('#liste .terme-ligne').length") === 50, 'le filtre Git montre 50 termes');
  ok(await js("return document.querySelectorAll('#filtres .filtre')[1].getAttribute('aria-pressed')") === 'true', 'la catégorie active est annoncée');
  await js("document.querySelectorAll('#filtres .filtre')[0].click(); return 1");
  await attendre("document.getElementById('compte').textContent === '399 termes'", 3000, 'retour à tous les termes');

  // ── Ce que la recherche montre et propose ─────────────────────────────────
  const tape = (texte) => js("const q = document.getElementById('q'); q.value = " + JSON.stringify(texte) + "; q.dispatchEvent(new Event('input')); return 1");
  await tape('hachage');
  await attendre("document.querySelector('#liste .terme-ligne[data-ref=hash] .via-alias')", 3000, 'Hash trouvé par « hachage »');
  ok(await js("return document.querySelector('#liste .terme-ligne[data-ref=hash] .via-alias').textContent") === 'hachage', 'un terme trouvé par un autre nom montre ce nom');
  ok(await js("return document.querySelector('#liste .terme-ligne[data-ref=hash] .via-alias mark.trouve')?.textContent") === 'hachage', 'ce qui correspond est surligné');
  await tape('dichotomique');
  await attendre("document.querySelector('#liste .terme-ligne[data-ref=bisect] .apercu mark')", 3000, 'surlignage dans la définition');
  ok(await js("return document.querySelector('#liste .terme-ligne[data-ref=bisect] .apercu mark').textContent.toLowerCase()") === 'dichotomique', 'un mot trouvé dans la définition y est surligné');
  await tape('comitt');
  await attendre("document.getElementById('suggestions').hidden === false", 3000, 'suggestions');
  ok(await js("return [...document.querySelectorAll('#suggestions-liste .voisin')].some((b) => b.textContent === 'Commit')"), 'une faute de frappe propose le bon terme (« comitt » → Commit)');
  ok(await js("return Glossaire.suggerer('rebsae')[0]?.id") === 'rebase', 'une inversion de lettres est pardonnée (« rebsae » → Rebase)');
  ok(await js("return Glossaire.suggerer('zzzzqq').length") === 0, 'une requête absurde ne suggère rien');
  await js("document.querySelectorAll('#filtres .filtre')[1].click(); return 1");
  await tape('webp');
  await attendre("document.querySelector('#suggestions-liste .partout')", 3000, 'chercher partout');
  await js("document.querySelector('#suggestions-liste .partout').click(); return 1");
  await attendre("document.querySelector('#liste .terme-ligne[data-ref=webp]')", 3000, 'WebP hors du filtre Git');
  ok(await js("return document.querySelectorAll('#filtres .filtre')[0].getAttribute('aria-pressed')") === 'true', '« chercher partout » retire le filtre de catégorie');
  // au clavier : ↓ descend dans les résultats, ↑ remonte au champ, Entrée ouvre le terme exact
  await tape('commit');
  await pause(250);
  await js("document.getElementById('q').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); return 1");
  ok(await js("return document.activeElement.classList.contains('terme-ligne')"), '↓ passe du champ au premier résultat');
  await js("document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })); return 1");
  ok(await js("return document.activeElement.id") === 'q', '↑ depuis le premier résultat revient au champ');
  await js("document.getElementById('q').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return 1");
  await attendre("Fiche.ouverte && Fiche.ref === 'commit'", 3000, 'Entrée ouvre Commit');
  await js("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return 1");
  await attendre('Fiche.ouverte === false', 3000, 'Échap ferme la fiche');
  await js("document.getElementById('q').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return 1");
  await attendre("document.getElementById('q').value === '' && document.getElementById('accueil').hidden === false", 3000, 'Échap efface la recherche');
  await js("document.getElementById('q').blur(); document.body.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true })); return 1");
  ok(await js("return document.activeElement.id") === 'q', '« / » met le curseur dans la recherche');
  await js("document.getElementById('q').blur(); return 1");
  // la réglette des lettres et le hasard
  ok(await js("return document.querySelectorAll('#index-lettres button').length === document.querySelectorAll('#liste .lettre').length && document.getElementById('index-lettres').hidden === false"), 'la réglette a un bouton par lettre de la liste');
  await js("document.querySelector('#index-lettres [data-lettre=M]').click(); return 1");
  await pause(150);
  const sautM = await js("const g = document.getElementById('lettre-M').nextElementSibling.getBoundingClientRect().top; const r = document.getElementById('bloc-recherche').getBoundingClientRect().bottom; return { g, r, y: scrollY }");
  ok(sautM.y > 1000 && sautM.g > sautM.r && sautM.g - sautM.r < 80, 'la réglette amène la lettre M juste sous la recherche (' + JSON.stringify(sautM) + ')');
  ok(await js("return document.getElementById('bloc-recherche').getBoundingClientRect().top") === 0, 'la recherche reste collée en haut en parcourant la liste');
  await js("window.scrollTo(0, 0); document.getElementById('b-hasard').click(); return 1");
  await attendre('Fiche.ouverte', 3000, 'un terme au hasard');
  ok(await js("return !!Glossaire.parId(Fiche.ref)"), '« Au hasard » ouvre un terme du glossaire');
  await js('Fiche.fermer(); return 1');
  await attendre('Fiche.ouverte === false', 3000);

  // ── La fiche ──────────────────────────────────────────────────────────────
  await js("Fiche.ouvrir('amend'); return 1");
  await attendre("document.querySelector('#fiche .terme-nom')", 3000, 'fiche Amend');
  ok(await js("return document.querySelector('#fiche .terme-nom').textContent") === 'Amend', 'la fiche porte le nom du terme');
  ok(await js("return !!document.querySelector('#fiche .def-fr .def-phrase') && !!document.querySelector('#fiche .def-en .def-phrase')"), 'définitions française et anglaise');
  ok(await js("return document.querySelector('#fiche figure.schema svg')?.getBoundingClientRect().height > 60"), 'le schéma est dessiné');
  ok(await js("return document.querySelector('#fiche .exemple pre.code').textContent.includes('git commit --amend')"), 'l’exemple de code est là');
  ok(await js("return document.querySelectorAll('#fiche .exemple pre.code span.t-o').length") >= 1, 'le code est coloré (option --amend)');
  ok(await js("return document.querySelectorAll('#fiche .voisin').length") >= 3, 'des termes voisins sont proposés');
  ok(await js("return !!document.getElementById('mes-notes')"), 'la zone « Mes notes et exemples » existe');
  ok(await js("return document.body.classList.contains('fiche-ouverte')"), 'la page derrière est figée');
  // navigation : voisin puis retour
  await js("[...document.querySelectorAll('#fiche .voisin')].find((b) => b.textContent === 'Commit').click(); return 1");
  await attendre("document.querySelector('#fiche .terme-nom').textContent === 'Commit'", 3000, 'fiche Commit');
  ok(await js('return Fiche.profondeur') === 2, 'deux fiches empilées');
  await js('history.back(); return 1');
  await attendre("document.querySelector('#fiche .terme-nom').textContent === 'Amend'", 3000, 'retour à Amend');
  ok(await js('return Fiche.ouverte'), 'le retour du téléphone revient à la fiche précédente');
  await js('history.back(); return 1');
  await attendre('Fiche.ouverte === false', 3000, 'fermeture par le retour');
  ok(await js("return document.getElementById('fiche').hidden === true"), 'un second retour ferme la fiche');
  // fiche à plusieurs sens
  await js("Fiche.ouvrir('blob'); return 1");
  await attendre("document.querySelectorAll('#fiche .sens-titre').length === 3", 3000, 'blob : trois sens');
  ok(await js("return document.querySelectorAll('#fiche .sens-bloc').length") === 3, 'un terme à trois sens en montre trois');
  await js('Fiche.fermer(); return 1');
  await attendre('Fiche.ouverte === false', 3000);
  // partager : le lien ouvre la fiche du terme
  const partage = await js(`
    let recu = null;
    const avant = navigator.share;
    navigator.share = async (d) => { recu = d; };
    Fiche.ouvrir('amend');
    for (let i = 0; i < 30 && !document.querySelector('#fiche .fiche-partager'); i += 1) await new Promise((r) => setTimeout(r, 50));
    document.querySelector('#fiche .fiche-partager').click();
    await new Promise((r) => setTimeout(r, 50));
    navigator.share = avant;
    return recu;
  `);
  ok(partage && /\?terme=amend$/.test(partage.url) && partage.title.startsWith('Amend'), 'partager donne le lien de la fiche (' + (partage && partage.url) + ')');
  // écouter : seulement avec une voix anglaise locale — une voix distante enverrait le mot à un serveur
  const voix = await js(`
    const vraie = speechSynthesis.getVoices;
    const essayer = async (liste) => {
      speechSynthesis.getVoices = () => liste;
      speechSynthesis.dispatchEvent(new Event('voiceschanged'));
      await new Promise((r) => setTimeout(r, 150));
      const b = document.querySelector('#fiche .bouton-ecouter');
      return b ? b.getAttribute('aria-label') : null;
    };
    const distante = await essayer([{ lang: 'en-US', localService: false, name: 'en ligne' }]);
    const locale = await essayer([{ lang: 'en-GB', localService: true, name: 'locale' }]);
    const aucune = await essayer([]);
    speechSynthesis.getVoices = vraie;
    return { distante, locale, aucune };
  `);
  ok(voix.distante === null, 'pas de bouton « Écouter » avec une voix distante');
  ok(voix.locale && voix.locale.includes('Amend'), 'un bouton « Écouter » avec une voix anglaise locale (' + voix.locale + ')');
  ok(voix.aucune === null, 'le bouton disparaît sans voix');
  await js('Fiche.fermer(); return 1');
  await attendre('Fiche.ouverte === false', 3000);

  // ── Langue des définitions ────────────────────────────────────────────────
  await js("await App.ecrireReglage('definitions', 'fr'); App.appliquerReglages(); Fiche.ouvrir('commit'); return 1");
  await attendre("document.querySelector('#fiche .terme-nom')", 3000);
  ok(await js("return !document.querySelector('#fiche .def-en') && !!document.querySelector('#fiche .def-fr')"), 'définitions : français seul');
  await js("await App.ecrireReglage('definitions', 'en'); App.appliquerReglages(); return 1");
  await attendre("document.querySelector('#fiche .def-en')", 3000);
  ok(await js("return !document.querySelector('#fiche .def-fr') && !!document.querySelector('#fiche .def-en')"), 'définitions : anglais seul');
  await js("await App.ecrireReglage('definitions', 'les-deux'); App.appliquerReglages(); return 1");
  await attendre("document.querySelector('#fiche .def-fr') && document.querySelector('#fiche .def-en')", 3000);
  await js('Fiche.fermer(); return 1');
  await attendre('Fiche.ouverte === false', 3000);

  // ── Une note, un exemple ──────────────────────────────────────────────────
  await js("Fiche.ouvrir('stash'); return 1");
  await attendre("document.getElementById('mes-notes')", 3000);
  await js("[...document.querySelectorAll('#mes-notes button')].find((b) => b.textContent.includes('note')).click(); return 1");
  await attendre("document.getElementById('editeur').hidden === false && document.getElementById('e-texte')", 3000, 'éditeur de note');
  await js("document.querySelector('#editeur .pied-formulaire .bouton-principal').click(); return 1");
  ok(await js("return document.querySelector('#editeur .erreur').hidden === false"), 'une note vide est refusée');
  await js("const t = document.getElementById('e-texte'); t.value = 'brouillon'; t.dispatchEvent(new Event('input', { bubbles: true })); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return 1");
  ok(await js("return document.getElementById('editeur').hidden === false"), 'Échap ne jette pas une note commencée');
  await js("const t = document.getElementById('e-texte'); t.value = 'Penser à git stash -u pour les fichiers non suivis.'; document.getElementById('e-titre').value = 'Piège'; document.querySelector('#editeur .pied-formulaire .bouton-principal').click(); return 1");
  await attendre("document.getElementById('editeur').hidden === true", 3000, 'éditeur refermé');
  await attendre("document.querySelectorAll('#fiche .note-carte').length === 1", 3000, 'la note apparaît');
  ok(await js("return document.querySelector('#fiche .note-carte .note-texte').textContent.includes('git stash -u')"), 'le texte de la note est affiché');
  ok(await js("return document.querySelector('#fiche .note-carte .note-titre').textContent") === 'Piège', 'le titre de la note est affiché');
  ok(await js("return Fiche.ouverte && document.querySelector('#fiche .terme-nom').textContent") === 'Stash', 'on est revenu à la fiche après l’enregistrement');
  // un exemple
  await js("[...document.querySelectorAll('#mes-notes button')].find((b) => b.textContent.includes('exemple')).click(); return 1");
  await attendre("document.getElementById('e-code')", 3000, 'éditeur d’exemple');
  await js("document.getElementById('e-langage').value = 'js'; document.getElementById('e-code').value = 'const a = 1; // <b>pas du html</b>'; document.querySelector('#editeur .pied-formulaire .bouton-principal').click(); return 1");
  await attendre("document.querySelectorAll('#fiche .note-carte').length === 2", 3000, 'l’exemple apparaît');
  ok(await js("return document.querySelector('#fiche .type-exemple pre.code span.t-k')?.textContent") === 'const', 'l’exemple est coloré');
  ok(await js("return document.querySelector('#fiche .type-exemple pre.code').textContent.includes('<b>pas du html</b>') && !document.querySelector('#fiche .type-exemple pre.code b')"), 'le code saisi n’est jamais interprété comme du HTML');
  // persistance : on recharge la page
  await demarrage();
  ok(await js("return (await Store.notesDe('stash')).length") === 2, 'les notes survivent au rechargement');
  await js("Fiche.ouvrir('stash'); return 1");
  await attendre("document.querySelectorAll('#fiche .note-carte').length === 2", 3000, 'notes rechargées');
  // modification
  await js("[...document.querySelectorAll('#fiche .note-carte')][0].querySelector('.lien-discret').click(); return 1");
  await attendre("document.getElementById('e-texte')", 3000, 'édition');
  ok(await js("return document.getElementById('e-texte').value.includes('git stash -u')"), 'l’éditeur reprend le texte de la note');
  await js("document.getElementById('e-texte').value = 'Texte corrigé.'; document.querySelector('#editeur .pied-formulaire .bouton-principal').click(); return 1");
  await attendre("[...document.querySelectorAll('#fiche .note-texte')].some((p) => p.textContent === 'Texte corrigé.')", 3000, 'note corrigée');
  // suppression avec annulation
  await js("[...document.querySelectorAll('#fiche .note-carte')][0].querySelector('.lien-discret').click(); return 1");
  await attendre("document.querySelector('#editeur .supprimer')", 3000, 'bouton supprimer');
  await js("document.querySelector('#editeur .supprimer').click(); return 1");
  ok(await js("return document.getElementById('editeur').hidden === false"), 'la suppression demande une seconde confirmation');
  await js("document.querySelector('#editeur .supprimer').click(); return 1");
  await attendre("document.querySelectorAll('#fiche .note-carte').length === 1", 3000, 'note supprimée');
  await attendre("document.getElementById('annonce').hidden === false && document.querySelector('#annonce .lien-annonce')", 3000, 'annonce « annuler »');
  await js("document.querySelector('#annonce .lien-annonce').click(); return 1");
  await attendre("document.querySelectorAll('#fiche .note-carte').length === 2", 3000, 'suppression annulée');
  ok(true, 'suppression puis annulation');

  // ── Favoris et « à revoir » ───────────────────────────────────────────────
  await js("document.querySelectorAll('#fiche .actions-fiche .bouton-etat')[0].click(); return 1");
  await attendre("document.querySelectorAll('#fiche .actions-fiche .bouton-etat')[0].getAttribute('aria-pressed') === 'true'", 3000, 'favori');
  ok(await js("return (await Store.lireSuivi('stash')).favori"), 'le favori est enregistré');
  await js("document.querySelectorAll('#fiche .actions-fiche .bouton-etat')[1].click(); return 1");
  await attendre("document.querySelectorAll('#fiche .actions-fiche .bouton-etat')[1].getAttribute('aria-pressed') === 'true'", 3000, 'à revoir');
  await js('Fiche.fermer(); return 1');
  await attendre('Fiche.ouverte === false', 3000);
  await js("document.querySelector('#onglets [data-vue=carnet]').click(); return 1");
  await attendre("document.querySelectorAll('#carnet-contenu .terme-ligne').length === 1", 3000, 'un favori dans le carnet');
  ok(await js("return document.querySelector('#carnet-contenu .terme-mot').textContent") === 'Stash', 'le carnet liste le favori');
  await attendre("document.querySelector('#carnet-onglets [data-rubrique=favoris] .nombre-rubrique').textContent === '1'", 3000, 'compteur des favoris');
  ok(await js("const n = document.querySelector('#carnet-onglets [data-rubrique=exemples] .nombre-rubrique'); return n.hidden === false && n.textContent === '1'"), 'chaque rubrique du carnet affiche son nombre');
  ok(await js("return document.querySelector('#carnet-onglets [data-rubrique=termes] .nombre-rubrique').hidden"), 'une rubrique vide n’affiche pas de nombre');
  await js("document.querySelector('#carnet-onglets [data-rubrique=a-revoir]').click(); return 1");
  await attendre("document.querySelector('#carnet-contenu .terme-mot')?.textContent === 'Stash'", 3000, 'à revoir');
  await js("document.querySelector('#carnet-onglets [data-rubrique=notes]').click(); return 1");
  await attendre("document.querySelectorAll('#carnet-contenu .terme-ligne').length === 1", 3000, 'la note dans le carnet');
  await js("document.querySelector('#carnet-onglets [data-rubrique=exemples]').click(); return 1");
  await attendre("document.querySelectorAll('#carnet-contenu .terme-ligne').length === 1", 3000, 'l’exemple dans le carnet');
  ok(await js("return document.querySelector('#carnet-contenu .apercu-code').textContent.includes('const a = 1')"), 'l’extrait de l’exemple s’affiche en code');
  await js("const f = document.getElementById('carnet-filtre'); f.value = 'zzzz'; f.dispatchEvent(new Event('input')); return 1");
  await attendre("document.querySelectorAll('#carnet-contenu .terme-ligne').length === 0", 3000, 'filtre du carnet');

  // ── Un terme à soi ────────────────────────────────────────────────────────
  await js("document.querySelector('#carnet-onglets [data-rubrique=termes]').click(); return 1");
  await attendre("document.querySelector('#carnet-contenu .bouton-principal')", 3000);
  await js("document.getElementById('carnet-filtre').value = ''; document.getElementById('carnet-filtre').dispatchEvent(new Event('input')); document.querySelector('#carnet-contenu .bouton-principal').click(); return 1");
  await attendre("document.getElementById('e-nom')", 3000, 'formulaire de terme');
  await js("document.getElementById('e-nom').value = 'Commit'; document.getElementById('e-fr').value = 'Un doublon.'; document.querySelector('#editeur .pied-formulaire .bouton-principal').click(); return 1");
  ok(await js("return document.querySelector('#editeur .erreur').textContent.includes('existe déjà')"), 'un terme déjà au glossaire est refusé');
  await js("document.getElementById('e-nom').value = 'Foobar'; document.getElementById('e-cat').value = 'outils'; document.getElementById('e-fr').value = 'Un mot de passe entre collègues, dans un projet.'; document.getElementById('e-en').value = ''; document.getElementById('e-al').value = 'foo bar, fb'; document.querySelector('#editeur .pied-formulaire .bouton-principal').click(); return 1");
  await attendre("document.getElementById('editeur').hidden === true", 3000, 'terme enregistré');
  ok(await js("return Glossaire.termes.filter((t) => t.perso).length") === 1, 'le terme à soi entre dans l’index');
  ok(await js("return Glossaire.chercher('fb')[0].terme.n") === 'Foobar', 'et se trouve par un de ses alias');
  await attendre("document.querySelectorAll('#carnet-contenu .terme-ligne').length === 1", 3000, 'le terme dans le carnet');
  await js("document.querySelector('#onglets [data-vue=glossaire]').click(); return 1");
  await js("const q = document.getElementById('q'); q.value = 'foobar'; q.dispatchEvent(new Event('input')); return 1");
  await attendre("document.querySelectorAll('#liste .terme-ligne').length === 1", 3000, 'la recherche ne garde que Foobar');
  await attendre("document.querySelector('#liste .terme-ligne .pastille')?.textContent === 'à moi'", 3000, 'pastille « à moi »');
  await js("document.querySelector('#liste .terme-ligne').click(); return 1");
  await attendre("document.querySelector('#fiche .terme-nom')?.textContent === 'Foobar'", 3000, 'fiche du terme à soi');
  ok(await js("return !!document.querySelector('#fiche .def-fr') && !document.querySelector('#fiche .def-en')"), 'seule la définition écrite est montrée');
  // suppression du terme
  await js("[...document.querySelectorAll('#fiche button')].find((b) => b.textContent.includes('Modifier ce terme')).click(); return 1");
  await attendre("document.querySelector('#editeur .supprimer')", 3000);
  await js("document.querySelector('#editeur .supprimer').click(); document.querySelector('#editeur .supprimer').click(); return 1");
  await attendre("Glossaire.termes.filter((t) => t.perso).length === 0", 3000, 'terme supprimé');
  await attendre('Fiche.ouverte === false && document.getElementById("editeur").hidden === true', 3000, 'fiche fermée avec le terme');
  await js("document.getElementById('q-vider').click(); return 1");

  // ── Le quiz ───────────────────────────────────────────────────────────────
  await js("await App.ecrireReglage('quizNombre', 5); await App.ecrireReglage('quizSens', 'mixte'); await App.ecrireReglage('quizLangue', 'mixte'); document.querySelector('#onglets [data-vue=quiz]').click(); return 1");
  await attendre("document.querySelector('#quiz-contenu .bouton-principal')", 3000, 'accueil du quiz');
  await js("document.querySelector('#quiz-contenu .bouton-principal').click(); return 1");
  await attendre("document.querySelectorAll('#quiz-contenu .choix').length === 4", 3000, 'première question');
  let justes = 0;
  for (let i = 0; i < 5; i += 1) {
    await attendre("document.querySelectorAll('#quiz-contenu .choix').length === 4 && !document.querySelector('#quiz-contenu .choix[disabled]')", 3000, 'question ' + (i + 1));
    await js("document.querySelectorAll('#quiz-contenu .choix')[0].click(); return 1");
    await attendre("document.querySelector('#quiz-contenu .verdict:not([hidden])')", 3000, 'verdict ' + (i + 1));
    if (await js("return !!document.querySelector('#quiz-contenu .verdict.juste')")) justes += 1;
    ok(await js("return document.querySelectorAll('#quiz-contenu .choix.bonne').length") === 1, 'une seule bonne réponse marquée (question ' + (i + 1) + ')');
    ok(await js("return document.querySelectorAll('#quiz-contenu .pastille-q.juste, #quiz-contenu .pastille-q.faux').length") === i + 1, 'une pastille colorée par réponse (question ' + (i + 1) + ')');
    await js("document.querySelector('#quiz-contenu .verdict .bouton-principal').click(); return 1");
  }
  await attendre("document.querySelector('#quiz-contenu .bilan-score')", 3000, 'bilan du quiz');
  ok(await js("return document.querySelector('#quiz-contenu .bilan-score').textContent") === justes + ' sur 5', 'le bilan compte ' + justes + ' bonne(s) réponse(s)');
  ok(await js("return !!document.querySelector('#quiz-contenu .anneau .anneau-arc')"), 'le score s’affiche en anneau');
  const suivis = await js('return (await Store.tousLesSuivis()).filter((s) => s.ok || s.ko).length');
  ok(suivis >= 1, 'le quiz enregistre le suivi des termes');
  // qualité des questions : pas de réponse qui se devine
  const rapport = await js(`
    const problemes = [];
    let total = 0;
    for (const sens of ['def-terme', 'terme-def']) {
      const qs = await Quiz.construire({ source: 'tous', sens, langue: 'mixte', n: 60 });
      for (const q of qs) {
        total += 1;
        const cible = q.cible;
        const bonnes = q.propositions.filter((p) => p.terme.id === cible.id).length;
        if (bonnes !== 1) problemes.push('bonnes réponses : ' + bonnes + ' pour ' + cible.id);
        if (new Set(q.propositions.map((p) => p.terme.id)).size !== 4) problemes.push('doublon de proposition pour ' + cible.id);
        const voisins = new Set(cible.v || []);
        for (const p of q.propositions) if (p.terme.id !== cible.id && voisins.has(p.terme.id)) problemes.push('leurre voisin ' + p.terme.id + ' pour ' + cible.id);
        const nomsNus = (t) => [t.n].filter((x) => x.replace(/[^A-Za-z0-9]/g, '').length >= 5);
        // le mot lui-même, éventuellement au pluriel — pas « optional » pour « option »
        const contient = (texte, nom) => new RegExp('(^|[^a-z0-9])' + nom.toLowerCase().replace(/[^a-z0-9]/g, '.') + '(s|es|x)?($|[^a-z0-9])').test(texte.toLowerCase());
        if (sens === 'def-terme') {
          for (const nom of nomsNus(cible)) if (contient(q.enonce, nom)) problemes.push('l’énoncé contient « ' + nom + ' »');
        } else {
          for (const p of q.propositions) for (const nom of nomsNus(p.terme)) if (contient(p.texte, nom)) problemes.push('la proposition de ' + p.terme.id + ' contient son nom « ' + nom + ' »');
        }
      }
    }
    return { total, problemes: problemes.slice(0, 8), n: problemes.length };
  `);
  ok(rapport.total >= 80 && rapport.n === 0, 'questions du quiz : ' + rapport.total + ' examinées, ' + rapport.n + ' problème(s) ' + rapport.problemes.join(' | '));

  // ── Le quiz au clavier ────────────────────────────────────────────────────
  const touche = (k) => js("document.dispatchEvent(new KeyboardEvent('keydown', { key: " + JSON.stringify(k) + ", bubbles: true })); return 1");
  const retourAccueilQuiz = () => js("[...document.querySelectorAll('#quiz-contenu .bouton-discret')].pop().click(); return 1");
  await retourAccueilQuiz();
  await attendre("document.querySelector('#quiz-contenu .segments-mode')", 3000, 'retour à l’accueil du quiz');
  await js("document.querySelector('#quiz-contenu .bouton-principal').click(); return 1");
  await attendre("document.querySelectorAll('#quiz-contenu .choix').length === 4", 3000, 'question au clavier');
  await touche('2');
  await attendre("document.querySelector('#quiz-contenu .verdict:not([hidden])')", 3000, 'réponse par la touche 2');
  ok(await js("return document.querySelectorAll('#quiz-contenu .choix')[1].matches('.bonne, .mauvaise')"), 'la touche 2 répond par la deuxième proposition');
  await touche('Enter');
  await attendre("document.querySelectorAll('#quiz-contenu .pastille-q.juste, #quiz-contenu .pastille-q.faux').length === 1 && document.querySelectorAll('#quiz-contenu .choix').length === 4 && !document.querySelector('#quiz-contenu .choix[disabled]')", 3000, 'Entrée passe à la question suivante');
  await js("document.querySelector('#quiz-contenu .seance-infos .lien-discret').click(); return 1");
  await attendre("document.querySelector('#quiz-contenu .bilan-score')", 3000, 'bilan après arrêt');
  ok(await js("return document.querySelector('#quiz-contenu .bilan-score').textContent.endsWith('sur 1')"), 'arrêter en cours de séance compte les réponses données');

  // ── Les cartes à retourner ────────────────────────────────────────────────
  await js("await App.ecrireReglage('quizMode', 'cartes'); await App.ecrireReglage('quizSens', 'terme-def'); await App.ecrireReglage('quizNombre', 5); return 1");
  await retourAccueilQuiz();
  await attendre("document.querySelector('#quiz-contenu .segments-mode [aria-pressed=true]')?.textContent === 'Cartes à retourner'", 3000, 'mode cartes');
  const jugees = () => js('return (await Store.tousLesSuivis()).reduce((n, s) => n + (s.ok || 0) + (s.ko || 0), 0)');
  const avantCartes = await jugees();
  await js("document.querySelector('#quiz-contenu .bouton-principal').click(); return 1");
  await attendre("document.querySelector('#quiz-contenu .carte-flash')", 3000, 'première carte');
  const carteN = (n) => attendre("document.querySelector('#quiz-contenu .seance-infos .discret')?.textContent.startsWith('Carte " + n + " ')", 3000, 'carte ' + n);
  ok(await js("return document.querySelector('#quiz-contenu .jugement').hidden"), 'on ne juge pas une carte avant de l’avoir retournée');
  await js("document.querySelector('.carte-flash').click(); return 1");
  ok(await js("return document.querySelector('.carte-flash').classList.contains('retournee') && !document.querySelector('.jugement').hidden && document.querySelector('.verso').getAttribute('aria-hidden') === 'false'"), 'toucher la carte la retourne, et le verso devient lisible');
  await js("document.querySelector('.juge-oui').click(); return 1");
  await carteN(2);
  await touche('ArrowRight');
  ok(await js("return document.querySelector('.carte-flash').classList.contains('retournee')"), '→ retourne une carte pas encore vue');
  await touche('ArrowLeft');
  await carteN(3);
  await js(`
    const c = document.querySelector('.carte-flash');
    c.click();
    const r = c.getBoundingClientRect();
    const ev = (t, x) => c.dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: x, clientY: r.top + 40, pointerId: 7, button: 0 }));
    ev('pointerdown', 100); ev('pointermove', 130); ev('pointermove', 260); ev('pointerup', 260);
    return 1;
  `);
  await carteN(4);
  ok(await js("return document.querySelectorAll('.pastille-q.juste').length === 2 && document.querySelectorAll('.pastille-q.faux').length === 1"), 'je savais, à revoir, glissé à droite : deux justes, une à revoir');
  await js("document.querySelector('.carte-flash').click(); document.querySelector('.juge-oui').click(); return 1");
  await carteN(5);
  await js("document.querySelector('.carte-flash').click(); document.querySelector('.juge-oui').click(); return 1");
  await attendre("document.querySelector('#quiz-contenu .bilan-score')", 3000, 'bilan des cartes');
  ok(await js("return document.querySelector('#quiz-contenu .bilan-score').textContent") === '4 sur 5', 'le bilan des cartes compte 4 sur 5');
  ok(await js("return !!document.querySelector('#quiz-contenu .anneau-arc.bien')"), 'l’anneau prend la couleur du résultat');
  ok(await jugees() - avantCartes === 5, 'chaque carte jugée compte dans le suivi');
  await js("await App.ecrireReglage('quizMode', 'qcm'); return 1");

  // ── Réglages : langue, thème, taille ──────────────────────────────────────
  await js("document.querySelector('#onglets [data-vue=reglages]').click(); return 1");
  await attendre("document.querySelector('#reglages-contenu .segments')", 3000, 'réglages');
  await js("[...document.querySelectorAll('#reglages-contenu .segments button')].find((b) => b.textContent === 'English').click(); return 1");
  await attendre("document.documentElement.lang === 'en'", 3000, 'passage à l’anglais');
  ok(await js("return document.querySelector('#onglets [data-vue=glossaire] span').textContent") === 'Glossary', 'les onglets passent en anglais');
  await pause(400);
  ok(await js("return document.querySelectorAll('#recents .rubrique-ligne').length") <= 1, 'la rubrique « consultés récemment » n’est jamais dessinée en double');
  ok(await js("return document.querySelectorAll('#du-jour .carte-du-jour').length") <= 1, 'le terme du jour n’est jamais dessiné en double');
  ok(await js("return document.getElementById('q').placeholder.startsWith('A term')"), 'le champ de recherche passe en anglais');
  ok(await js("return document.querySelector('#reglages-contenu h2').textContent") === 'Settings', 'l’écran des réglages est redessiné en anglais');
  await js("document.querySelector('#onglets [data-vue=glossaire]').click(); Fiche.ouvrir('git'); return 1");
  await attendre("document.querySelector('#fiche .mes-notes h3')", 3000, 'fiche en anglais');
  ok(await js("return document.querySelector('#fiche .mes-notes h3').textContent") === 'My notes and examples', 'la fiche est en anglais');
  await js('Fiche.fermer(); return 1');
  await attendre('Fiche.ouverte === false', 3000);
  await js("document.querySelector('#onglets [data-vue=reglages]').click(); [...document.querySelectorAll('#reglages-contenu .segments button')].find((b) => b.textContent === 'Français').click(); return 1");
  await attendre("document.documentElement.lang === 'fr'", 3000, 'retour au français');
  await js("[...document.querySelectorAll('#reglages-contenu .segments button')].find((b) => b.textContent === 'Sombre').click(); return 1");
  await attendre("document.documentElement.getAttribute('data-theme') === 'sombre'", 3000, 'thème sombre');
  ok(await js("return getComputedStyle(document.body).backgroundColor") === 'rgb(13, 18, 32)', 'le fond sombre est appliqué');
  await js("[...document.querySelectorAll('#reglages-contenu .segments button')].find((b) => b.textContent === 'Automatique').click(); return 1");
  await attendre("!document.documentElement.hasAttribute('data-theme')", 3000, 'thème automatique');
  await js("[...document.querySelectorAll('#reglages-contenu .segments button')].find((b) => b.textContent === 'Très grand').click(); return 1");
  await attendre("document.documentElement.style.fontSize === '20.5px'", 3000, 'très grand texte');
  await js("[...document.querySelectorAll('#reglages-contenu .segments button')].find((b) => b.textContent === 'Normal').click(); return 1");
  await attendre("document.documentElement.style.fontSize === '16px'", 3000, 'texte normal');

  // ── Sauvegarde : fusion, le plus récent l'emporte ─────────────────────────
  const fusion = await js(`
    const maintenant = Date.now();
    const d = { application: 'code-en-clair', format: 1, notes: [
      { id: 'n-vieux', ref: 'git', type: 'note', titre: '', texte: 'ancienne', cree: 1, modifie: 1 },
      { id: 'n-neuf', ref: 'git', type: 'note', titre: '', texte: 'récente', cree: 1, modifie: maintenant + 1000 },
    ], perso: [], suivis: [{ ref: 'git', favori: true, aRevoir: false, vu: 3, ok: 2, ko: 0, serie: 2, dernier: maintenant }] };
    const avant = await Store.ecrireNote({ id: 'n-neuf', ref: 'git', type: 'note', titre: '', texte: 'locale', cree: 1, modifie: maintenant });
    const b1 = await Sauvegarde.fusionner(d);
    const b2 = await Sauvegarde.fusionner(d);
    return { b1, b2, neuf: (await Store.lireNote('n-neuf')).texte, vieux: (await Store.lireNote('n-vieux')).texte, fav: (await Store.lireSuivi('git')).favori,
             valide: Sauvegarde.valide(d), invalide: Sauvegarde.valide({ application: 'autre', format: 1, notes: [] }) };
  `);
  ok(fusion.neuf === 'récente' && fusion.vieux === 'ancienne', 'fusion : la version la plus récente l’emporte');
  ok(fusion.b2.ajoutes === 0 && fusion.b2.misAJour === 0, 'fusion : recharger deux fois ne change plus rien');
  ok(fusion.fav === true && fusion.valide === true && fusion.invalide === false, 'sauvegarde : validité et favoris repris');
  const exporte = await js(`
    let telecharge = null;
    const vrai = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { telecharge = { nom: this.download, href: this.href }; };
    const r = await Sauvegarde.exporter();
    HTMLAnchorElement.prototype.click = vrai;
    return { r, telecharge };
  `);
  ok(/^lexicode-\d{4}-\d\d-\d\d\.json$/.test(exporte.telecharge && exporte.telecharge.nom), 'l’export nomme son fichier lexicode-AAAA-MM-JJ.json');
  ok(exporte.r.notes >= 2, 'l’export contient les notes');

  // ── Politique de confidentialité ─────────────────────────────────────────
  await ouvrir(BASE + 'confidentialite.html');
  ok(await js("return document.querySelectorAll('h1').length") === 2, 'la politique de confidentialité existe en deux langues');
  ok(await js("return document.body.textContent.includes('cristo67apps@gmail.com')"), 'l’adresse de contact publique y figure');
  // l'adresse personnelle est recomposée ici : elle ne doit figurer nulle part dans le dépôt
  ok(await js("return !document.body.textContent.includes('cristo67000' + '@' + 'gmail.com')"), 'l’adresse personnelle n’y figure pas');

  // ── Toutes les figures : dessin sans erreur, texte dans le cadre ──────────
  for (const langue of ['fr', 'en']) {
    await ouvrir(BASE + 'build/galerie.html?l=' + langue);
    await attendre('document.body.dataset.pret !== undefined', 15000, 'galerie ' + langue);
    const bilanFigures = await js(`
      const figures = [...document.querySelectorAll('figure')];
      const erreurs = figures.filter((f) => f.textContent.startsWith('ERREUR')).map((f) => f.id);
      const debordent = [];
      const collisions = [];
      for (const f of figures) {
        const svg = f.querySelector('svg');
        if (!svg) continue;
        const [, , L, H] = svg.getAttribute('viewBox').split(' ').map(Number);
        if (!svg.getAttribute('aria-label')) debordent.push(f.id + ' : pas de description');
        for (const t of svg.querySelectorAll('text')) {
          const b = t.getBBox();
          if (b.width && (b.x < -1 || b.x + b.width > L + 1 || b.y < -1 || b.y + b.height > H + 2)) {
            debordent.push(f.id + ' : « ' + t.textContent.slice(0, 24) + ' » (' + Math.round(b.x) + '→' + Math.round(b.x + b.width) + ' sur ' + L + ')');
          }
        }
      }
      return { n: figures.length, erreurs, debordent: debordent.slice(0, 12), nb: debordent.length };
    `);
    ok(bilanFigures.n >= 150, langue + ' : ' + bilanFigures.n + ' figures dessinées');
    ok(bilanFigures.erreurs.length === 0, langue + ' : figures en erreur : ' + bilanFigures.erreurs.join(', '));
    ok(bilanFigures.nb === 0, langue + ' : textes qui sortent du cadre : ' + bilanFigures.nb + ' — ' + bilanFigures.debordent.join(' ; '));
  }

  // ── Service worker et hors ligne réel ─────────────────────────────────────
  await demarrage();
  const sonde = await js(`
    try { const c = await caches.open('sonde'); await c.put('/sonde', new Response('bonjour')); await caches.delete('sonde'); return 'ok'; }
    catch (e) { return String(e); }
  `);
  if (sonde !== 'ok') {
    ignores.push('hors ligne : l’API Cache de ce Chrome est inutilisable (' + sonde + ') — épreuve non faite');
  } else {
    const installe = await attendre("navigator.serviceWorker && navigator.serviceWorker.controller || (await navigator.serviceWorker.getRegistration())?.active", 20000, 'installation du service worker');
    if (installe) {
      // le premier chargement n'est pas contrôlé : on recharge
      await onglet.envoyer('Page.reload');
      await attendre("document.getElementById('demarrage').hidden === true", 15000, 'rechargement');
      ok(await attendre('navigator.serviceWorker.controller', 8000, 'contrôle par le service worker'), 'le service worker contrôle la page');
      const fichiers = await js("const noms = await caches.keys(); const c = await caches.open(noms.find((n) => n.startsWith('code-en-clair-coquille-'))); return (await c.keys()).length");
      ok(fichiers >= 40, 'la coquille contient tous les fichiers (' + fichiers + ')');
      const version = await js(`
        const canal = new MessageChannel();
        const reponse = new Promise((r) => { canal.port1.onmessage = (e) => r(e.data.version); });
        navigator.serviceWorker.controller.postMessage({ type: 'version' }, [canal.port2]);
        return await reponse;
      `);
      ok(version === VERSION_SW, 'le service worker annonce sa version (' + version + ', attendu ' + VERSION_SW + ')');
      // on coupe le serveur : plus de réseau du tout
      await serveur.arreter();
      await onglet.envoyer('Page.reload');
      const relance = await attendre("document.getElementById('demarrage').hidden === true", 15000, 'relance hors ligne');
      ok(relance, 'l’application se relance sans réseau');
      ok(await js('return Glossaire.termes.length') >= 300, 'hors ligne : le glossaire est là');
      await js("Fiche.ouvrir('service-worker'); return 1");
      await attendre("document.querySelector('#fiche figure.schema svg')", 5000, 'fiche hors ligne');
      ok(await js("return !!document.querySelector('#fiche figure.schema svg') && !!document.querySelector('#fiche .exemple pre.code')"), 'hors ligne : une fiche complète, schéma et exemple');
      ok(await js("return (await Store.notesDe('stash')).length") === 2, 'hors ligne : les notes sont là');
    }
  }

  // ── Aucune erreur de page, aucune violation de sécurité ───────────────────
  ok(onglet.erreurs.length === 0, 'erreurs de page : ' + onglet.erreurs.slice(0, 4).join(' | '));
} catch (erreur) {
  echecs.push('EXCEPTION DE L’ÉPREUVE : ' + (erreur && erreur.stack ? erreur.stack : erreur));
} finally {
  if (onglet) onglet.fermer();
  await fermerChrome(chrome);
  try { await serveur.arreter(); } catch (e) { /* déjà arrêté */ }
}

console.log(bons + ' contrôles réussis, ' + echecs.length + ' échec(s), ' + ignores.length + ' ignoré(s).');
for (const i of ignores) console.log('  ~ ' + i);
for (const e of echecs) console.log('  ✗ ' + e);
process.exit(echecs.length ? 1 : 0);
