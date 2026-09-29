/*
 * Prend en photo une page du projet, en largeur de téléphone, découpée en
 * tranches — pour relire les schémas et les écrans à l'œil.
 *
 *     node build/voir.mjs "<chemin ou URL>" <dossier-sortie> [--largeur 400]
 *          [--tranche 1400] [--echelle 1.5] [--sombre] [--attendre "<js>"]
 *
 * Le chemin est relatif au serveur local (http://127.0.0.1:8147/). Sortie :
 * <dossier>/tranche-01.png, tranche-02.png…
 */
import fs from 'node:fs';
import path from 'node:path';
import { lancerChrome, fermerChrome, ouvrirOnglet } from './pilote_chrome.mjs';

const args = process.argv.slice(2);
const cible = args[0];
const sortie = args[1];
function option(nom, defaut) {
  const i = args.indexOf('--' + nom);
  return i === -1 ? defaut : args[i + 1];
}
const largeur = Number(option('largeur', 400));
const tranche = Number(option('tranche', 1400));
const echelle = Number(option('echelle', 1.5));
const sombre = args.includes('--sombre');
const attendre = option('attendre', null);
const hauteurEcran = Number(option('hauteur', 900));
const avant = option('avant', null);   // du JavaScript à exécuter avant la photo
const port = Number(option('port', 9341));
if (!cible || !sortie) { console.error('usage : voir.mjs <chemin> <dossier>'); process.exit(2); }

fs.mkdirSync(sortie, { recursive: true });
for (const f of fs.readdirSync(sortie)) if (f.startsWith('tranche-')) fs.unlinkSync(path.join(sortie, f));

const url = /^https?:/.test(cible) ? cible : 'http://127.0.0.1:8147/' + cible.replace(/^\//, '');
const chrome = await lancerChrome({ port });
try {
  const onglet = await ouvrirOnglet(chrome, 'about:blank');
  await onglet.envoyer('Emulation.setDeviceMetricsOverride', {
    width: largeur, height: hauteurEcran, deviceScaleFactor: echelle, mobile: true,
  });
  if (sombre) {
    await onglet.envoyer('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  }
  await onglet.naviguer(url);
  for (let i = 0; i < 80; i += 1) {
    const pret = await onglet.evaluer(attendre
      ? 'return !!(' + attendre + ')'
      : 'return document.body && document.body.dataset.pret !== undefined');
    if (pret) break;
    await new Promise((r) => setTimeout(r, 250));
  }
  if (avant) { await onglet.evaluer(avant); }
  await new Promise((r) => setTimeout(r, 700));
  const hauteur = await onglet.evaluer('return Math.ceil(document.documentElement.scrollHeight)');
  let n = 0;
  for (let y = 0; y < hauteur; y += tranche) {
    n += 1;
    const h = Math.min(tranche, hauteur - y);
    const img = await onglet.envoyer('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y, width: largeur, height: h, scale: 1 },
    });
    fs.writeFileSync(path.join(sortie, 'tranche-' + String(n).padStart(2, '0') + '.png'), Buffer.from(img.data, 'base64'));
  }
  console.log(n + ' tranche(s), page haute de ' + hauteur + ' px');
  if (onglet.erreurs.length) console.log('ERREURS DE PAGE :\n  ' + onglet.erreurs.join('\n  '));
  onglet.fermer();
} finally {
  await fermerChrome(chrome);
}
