/*
 * Les captures d'écran de la fiche Play Store : huit écrans, en français puis
 * en anglais, à la taille exigée (1080 × 1920, PNG).
 *
 *     node build/captures.mjs [dossier-de-sortie]
 *
 * L'application est pilotée comme une personne le ferait, sur un profil neuf :
 * on ne fabrique pas d'écran, on photographie l'application qui tourne. Les
 * seules données posées d'avance sont les notes et l'exemple de l'écran 6, qui
 * sont ce qu'une personne y écrirait — ce n'est pas un faux : le glossaire, lui,
 * est réel.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lancerChrome, fermerChrome, ouvrirOnglet } from './pilote_chrome.mjs';
import { demarrerServeur } from './serveur_local.mjs';

const RACINE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SORTIE = process.argv[2] || path.join(RACINE, 'captures');
const PORT_WEB = 8197;
const PORT_CHROME = 9353;
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const serveur = await demarrerServeur(PORT_WEB);
const chrome = await lancerChrome({ port: PORT_CHROME });

async function photographier(onglet, fichier) {
  const img = await onglet.envoyer('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(fichier, Buffer.from(img.data, 'base64'));
}

async function jouer(langue) {
  const dossier = path.join(SORTIE, langue);
  fs.mkdirSync(dossier, { recursive: true });
  const onglet = await ouvrirOnglet(chrome, 'about:blank');
  // 360 × 640 points à trois pixels par point : 1080 × 1920
  await onglet.envoyer('Emulation.setDeviceMetricsOverride', { width: 360, height: 640, deviceScaleFactor: 3, mobile: true });
  await onglet.envoyer('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
  await onglet.naviguer('http://127.0.0.1:' + PORT_WEB + '/index.html');
  const js = (s) => onglet.evaluer(s);
  const attendre = async (cond) => { for (let i = 0; i < 80; i += 1) { try { if (await js('return !!(' + cond + ')')) return; } catch (e) { /* */ } await pause(100); } throw new Error('délai : ' + cond); };
  await attendre("document.getElementById('demarrage').hidden === true");
  await js("await App.ecrireReglage('langue', '" + langue + "'); await App.ecrireReglage('definitions', 'les-deux'); App.appliquerReglages(); return 1");
  await pause(400);
  const nom = (n) => path.join(dossier, n);

  // 1. Le glossaire : la recherche, les catégories, le terme du jour
  await js("window.scrollTo(0, 0); return 1");
  await photographier(onglet, nom('1-glossaire.png'));

  // 2. Une recherche
  await js("const q = document.getElementById('q'); q.value = '" + (langue === 'fr' ? 'empreinte' : 'hash') + "'; q.dispatchEvent(new Event('input')); return 1");
  await pause(500);
  await photographier(onglet, nom('2-recherche.png'));
  await js("document.getElementById('q-vider').click(); return 1");

  // 3. Une fiche : la définition dans les deux langues, puis son schéma
  await js("Fiche.ouvrir('amend'); return 1");
  await attendre("document.querySelector('#fiche .mes-notes')");
  await pause(400);
  await photographier(onglet, nom('3-fiche-definitions.png'));

  // 4. Le schéma et l'exemple de la même fiche
  await js("document.getElementById('fiche').scrollTop = document.querySelector('#fiche figure.schema').offsetTop - 50; return 1");
  await pause(300);
  await photographier(onglet, nom('4-schema-et-exemple.png'));
  await js("Fiche.fermer(); return 1");
  await attendre('Fiche.ouverte === false');

  // 5. Un terme à plusieurs sens
  await js("Fiche.ouvrir('token'); return 1");
  await attendre("document.querySelector('#fiche .mes-notes')");
  await js("document.getElementById('fiche').scrollTop = 0; return 1");
  await pause(400);
  await photographier(onglet, nom('5-plusieurs-sens.png'));
  await js("Fiche.fermer(); return 1");
  await attendre('Fiche.ouverte === false');

  // 6. Ses propres notes et exemples
  const note = langue === 'fr'
    ? { titre: 'Mon aide-mémoire', texte: 'Je range mes modifs avant de changer de branche, puis je les reprends avec pop. -u pour les fichiers non suivis.' }
    : { titre: 'My cheat sheet', texte: 'I shelve my changes before switching branches, then get them back with pop. -u for untracked files.' };
  await js(`
    await Store.ecrireNote({ id: 'n-demo-1', ref: 'stash', type: 'note', titre: ${JSON.stringify(note.titre)}, texte: ${JSON.stringify(note.texte)}, cree: Date.now() - 5000, modifie: Date.now() - 5000 });
    await Store.ecrireNote({ id: 'n-demo-2', ref: 'stash', type: 'exemple', titre: ${JSON.stringify(langue === 'fr' ? 'Mon flux habituel' : 'My usual flow')}, langage: 'bash', code: 'git stash -u\\ngit switch main\\ngit pull\\ngit switch -\\ngit stash pop', texte: '', cree: Date.now() - 4000, modifie: Date.now() - 4000 });
    Fiche.ouvrir('stash');
    return 1;
  `);
  await attendre("document.querySelectorAll('#fiche .note-carte').length === 2");
  await js("document.getElementById('fiche').scrollTop = document.getElementById('mes-notes').offsetTop - 70; return 1");
  await pause(400);
  await photographier(onglet, nom('6-mes-notes-et-exemples.png'));
  await js("Fiche.fermer(); return 1");
  await attendre('Fiche.ouverte === false');

  // 7. Le quiz
  await js("await App.ecrireReglage('quizNombre', 5); await App.ecrireReglage('quizSens', 'def-terme'); await App.ecrireReglage('quizLangue', 'interface'); document.querySelector('#onglets [data-vue=quiz]').click(); return 1");
  await attendre("document.querySelector('#quiz-contenu .bouton-principal')");
  await js("document.querySelector('#quiz-contenu .bouton-principal').click(); return 1");
  await attendre("document.querySelectorAll('#quiz-contenu .choix').length === 4");
  await pause(500);
  await photographier(onglet, nom('7-quiz.png'));

  // 8. Le thème sombre, sur une fiche
  await js("document.querySelector('#onglets [data-vue=glossaire]').click(); await App.ecrireReglage('theme', 'sombre'); App.appliquerReglages(); Fiche.ouvrir('hash'); return 1");
  await attendre("document.querySelector('#fiche .mes-notes')");
  await js("document.getElementById('fiche').scrollTop = 0; return 1");
  await pause(500);
  await photographier(onglet, nom('8-theme-sombre.png'));
  await js("await App.ecrireReglage('theme', 'auto'); App.appliquerReglages(); return 1");
  onglet.fermer();
  return onglet.erreurs;
}

try {
  for (const langue of ['fr', 'en']) {
    const erreurs = await jouer(langue);
    console.log(langue + ' : 8 captures' + (erreurs.length ? ', ERREURS ' + erreurs.join(' | ') : ''));
  }
} finally {
  await fermerChrome(chrome);
  await serveur.arreter();
}
