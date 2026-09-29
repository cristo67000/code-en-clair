/*
 * Construit data/glossaire.json à partir des fichiers de build/termes/*.txt.
 *
 *     node build/construire.mjs
 *
 * ── Pourquoi un format texte plutôt que du JSON ou du JavaScript ────────────
 *
 * Un glossaire du code est plein de guillemets, d'antislashs, d'apostrophes et
 * de lignes de code sur plusieurs lignes : dans du JSON, chaque exemple serait
 * une chaîne illisible, pleine de « \" » et de « \n ». Ici, un terme s'écrit
 * comme il se lit, et le code comme il se tape.
 *
 *     @ amend                      un terme : son identifiant
 *     cat: git                     sa catégorie
 *     nom: Amend                   le terme, tel qu'on l'écrit dans le code
 *     nom-fr: amender              (facultatif) le mot français
 *     nom-en: to amend             (facultatif) le mot anglais
 *     dev: …                       (facultatif) le nom développé d'un sigle
 *     alias: a, b                  autres graphies cherchées par la recherche
 *     voir: commit, rebase         termes voisins (identifiants)
 *     schema: amend                schéma de js/schemas/*.js (facultatif)
 *     fr: Définition en français.
 *       suite sur une ligne indentée de deux espaces
 *     en: Definition in English.
 *     +fr: Pour aller plus loin (facultatif).
 *     +en: Going further (optional).
 *     ex: bash                     un exemple : le langage, puis les lignes
 *     | git commit --amend         de code, précédées de « | »
 *     ex-fr: Ce que fait l'exemple.
 *     ex-en: What the example does.
 *     attention-fr: À ne pas confondre avec…
 *     attention-en: Not to be confused with…
 *
 * Un terme aux sens multiples (« blob » : objet Git, objet web) répète, après
 * chaque ligne « sens: libellé FR | label EN », les champs fr, en, ex, schema.
 *
 * Toute ligne « # … » est un commentaire. « {BS} » donne une antislash : l'outil
 * d'écriture de la session efface les séquences « antislash + u » et les
 * remplace par le caractère — d'où ce détour pour écrire une séquence d'échappement Unicode.
 *
 * Le script échoue à la moindre incohérence (identifiant en double, renvoi vers
 * un terme inexistant, définition trop courte, schéma introuvable) : une
 * erreur de contenu ne doit pas arriver dans le téléphone de quelqu'un.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.dirname(ICI);
const ANTISLASH = String.fromCharCode(92);

/* Les catégories : l'ordre est celui de l'affichage. */
const CATEGORIES = [
  { id: 'git',     fr: 'Git et GitHub',                en: 'Git & GitHub',              icone: 'git' },
  { id: 'shell',   fr: 'Terminal et shell',            en: 'Terminal & shell',          icone: 'shell' },
  { id: 'web',     fr: 'Web et navigateur',            en: 'Web & browser',             icone: 'web' },
  { id: 'reseau',  fr: 'Réseau et HTTP',               en: 'Network & HTTP',            icone: 'reseau' },
  { id: 'data',    fr: 'Données et encodage',          en: 'Data & encoding',           icone: 'data' },
  { id: 'secu',    fr: 'Sécurité et cryptographie',    en: 'Security & cryptography',   icone: 'secu' },
  { id: 'langage', fr: 'Langages et programmation',    en: 'Languages & programming',   icone: 'langage' },
  { id: 'outils',  fr: 'Outils et construction',       en: 'Tools & build',             icone: 'outils' },
  { id: 'image',   fr: 'Images et couleurs',           en: 'Images & colors',           icone: 'image' },
  { id: 'bdd',     fr: 'Bases de données',             en: 'Databases',                 icone: 'bdd' },
  { id: 'mobile',  fr: 'Android et mobile',            en: 'Android & mobile',          icone: 'mobile' },
  { id: 'ia',      fr: 'IA et assistants de code',     en: 'AI & coding assistants',    icone: 'ia' },
  { id: 'qualite', fr: 'Tests et qualité',             en: 'Testing & quality',         icone: 'qualite' },
  { id: 'archi',   fr: 'Architecture et concepts',     en: 'Architecture & concepts',   icone: 'archi' },
];
const ID_CATEGORIES = new Set(CATEGORIES.map((c) => c.id));

const LANGAGES = new Set(['bash', 'js', 'json', 'html', 'css', 'py', 'sql', 'xml', 'yaml', 'java',
  'kotlin', 'ts', 'c', 'ini', 'diff', 'text', 'http', 'gradle']);

const CLES = new Set(['cat', 'nom', 'nom-fr', 'nom-en', 'dev', 'alias', 'voir', 'schema', 'sens',
  'fr', 'en', '+fr', '+en', 'ex', 'ex-fr', 'ex-en', 'attention-fr', 'attention-en']);

const erreurs = [];
const avertissements = [];
function erreur(lieu, message) { erreurs.push(lieu + ' — ' + message); }
function avertir(lieu, message) { avertissements.push(lieu + ' — ' + message); }

/* Typographie : l'apostrophe droite entre deux lettres devient « ’ », comme
 * dans les autres applications du dossier. Le code, lui, n'est jamais touché. */
function typographie(texte) {
  return texte.replace(/(\p{L})'(\p{L})/gu, '$1’$2');
}

function bs(texte) {
  return texte.split('{BS}').join(ANTISLASH);
}

// ── Lecture d'un fichier de termes ──────────────────────────────────────────

function lireFichier(fichier, termes) {
  const nom = path.basename(fichier);
  const lignes = fs.readFileSync(fichier, 'utf-8').replace(/\r\n?/g, '\n').split('\n');

  let terme = null;
  let sens = null;
  let champ = null;       // le champ en cours de continuation : { cible, cle }
  let code = null;        // le bloc de code en cours

  function nouveauSens() {
    sens = { lb: null, fr: '', en: '', pf: '', pe: '', ex: null, sc: null, af: '', ae: '' };
    terme.sens.push(sens);
    return sens;
  }
  function sensCourant() { return sens || nouveauSens(); }

  lignes.forEach((brute, i) => {
    const lieu = nom + ':' + (i + 1);
    const ligne = bs(brute);

    if (ligne.startsWith('|')) {
      if (!code) { erreur(lieu, 'ligne de code sans « ex: » avant'); return; }
      code.lignes.push(ligne.startsWith('| ') ? ligne.slice(2) : ligne.slice(1));
      return;
    }
    code = code && ligne.trim() === '' ? code : null;   // une ligne vide ne ferme pas encore
    if (ligne.trim() === '') { champ = null; code = null; return; }
    if (ligne.startsWith('#')) return;

    if (ligne.startsWith('@ ')) {
      const id = ligne.slice(2).trim();
      if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) erreur(lieu, 'identifiant invalide « ' + id + ' »');
      terme = { id, cat: null, nom: null, nf: '', ne: '', dev: '', al: [], voir: [], sens: [], lieu };
      termes.push(terme);
      sens = null; champ = null; code = null;
      return;
    }
    if (!terme) { erreur(lieu, 'contenu avant le premier « @ identifiant »'); return; }

    if (ligne.startsWith('  ')) {
      if (!champ) { erreur(lieu, 'ligne indentée sans champ à continuer'); return; }
      champ.cible[champ.cle] = (champ.cible[champ.cle] + ' ' + ligne.trim()).trim();
      return;
    }

    const m = /^([a-z+][a-z+-]*):\s?(.*)$/.exec(ligne);
    if (!m || !CLES.has(m[1])) { erreur(lieu, 'ligne incomprise : « ' + ligne.slice(0, 60) + ' »'); return; }
    const cle = m[1];
    const valeur = m[2].trim();
    champ = null;
    code = null;

    switch (cle) {
      case 'cat': terme.cat = valeur; break;
      case 'nom': terme.nom = valeur; break;
      case 'nom-fr': terme.nf = valeur; champ = { cible: terme, cle: 'nf' }; break;
      case 'nom-en': terme.ne = valeur; champ = { cible: terme, cle: 'ne' }; break;
      case 'dev': terme.dev = valeur; break;
      case 'alias': terme.al = valeur.split(',').map((s) => s.trim()).filter(Boolean); break;
      case 'voir': terme.voir = valeur.split(',').map((s) => s.trim()).filter(Boolean); break;
      case 'schema': sensCourant().sc = valeur; break;
      case 'sens': {
        if (sens && !sens.lb && (sens.fr || sens.en)) erreur(lieu, '« sens: » après des champs sans libellé');
        nouveauSens();
        const parts = valeur.split(' | ').map((s) => s.trim());
        sens.lb = [parts[0], parts[1] || parts[0]];
        break;
      }
      case 'fr': sensCourant().fr = valeur; champ = { cible: sens, cle: 'fr' }; break;
      case 'en': sensCourant().en = valeur; champ = { cible: sens, cle: 'en' }; break;
      case '+fr': sensCourant().pf = valeur; champ = { cible: sens, cle: 'pf' }; break;
      case '+en': sensCourant().pe = valeur; champ = { cible: sens, cle: 'pe' }; break;
      case 'attention-fr': sensCourant().af = valeur; champ = { cible: sens, cle: 'af' }; break;
      case 'attention-en': sensCourant().ae = valeur; champ = { cible: sens, cle: 'ae' }; break;
      case 'ex': {
        if (sensCourant().ex) erreur(lieu, 'deux exemples dans le même sens');
        if (!LANGAGES.has(valeur)) erreur(lieu, 'langage d’exemple inconnu « ' + valeur + ' »');
        sens.ex = { l: valeur, c: '', f: '', e: '' };
        code = { lignes: [], ex: sens.ex };
        // le texte sera assemblé à la fin
        sens.ex.__lignes = code.lignes;
        break;
      }
      case 'ex-fr': if (!sensCourant().ex) erreur(lieu, 'ex-fr sans ex'); else { sens.ex.f = valeur; champ = { cible: sens.ex, cle: 'f' }; } break;
      case 'ex-en': if (!sensCourant().ex) erreur(lieu, 'ex-en sans ex'); else { sens.ex.e = valeur; champ = { cible: sens.ex, cle: 'e' }; } break;
      default: break;
    }
  });
}

// ── Schémas connus de l'application ─────────────────────────────────────────

function chargerSchemas() {
  const dossier = path.join(RACINE, 'js', 'schemas');
  const fenetre = {};
  if (!fs.existsSync(dossier)) return {};
  const contexte = vm.createContext({ window: fenetre });
  for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith('.js')).sort()) {
    try {
      vm.runInContext(fs.readFileSync(path.join(dossier, f), 'utf-8'), contexte, { filename: f });
    } catch (e) {
      erreur('js/schemas/' + f, 'ne se charge pas : ' + e.message);
    }
  }
  return fenetre.Schemas || {};
}

// ── Assemblage ──────────────────────────────────────────────────────────────

function main() {
  const dossier = path.join(ICI, 'termes');
  const fichiers = fs.readdirSync(dossier).filter((f) => f.endsWith('.txt')).sort();
  const termes = [];
  for (const f of fichiers) lireFichier(path.join(dossier, f), termes);

  const schemas = chargerSchemas();
  const ids = new Map();
  const schemasUtilises = new Set();

  for (const t of termes) {
    const lieu = t.lieu + ' (' + t.id + ')';
    if (ids.has(t.id)) erreur(lieu, 'identifiant déjà pris à ' + ids.get(t.id));
    ids.set(t.id, t.lieu);
    if (!t.nom) erreur(lieu, 'pas de « nom: »');
    if (!ID_CATEGORIES.has(t.cat)) erreur(lieu, 'catégorie inconnue « ' + t.cat + ' »');
    if (!t.sens.length) erreur(lieu, 'aucune définition');
    if (t.sens.length > 1 && t.sens.some((s) => !s.lb)) erreur(lieu, 'plusieurs sens : chacun doit porter « sens: »');

    for (const s of t.sens) {
      // typographie sur la prose, jamais sur le code
      s.fr = typographie(s.fr); s.en = typographie(s.en);
      s.pf = typographie(s.pf); s.pe = typographie(s.pe);
      s.af = typographie(s.af); s.ae = typographie(s.ae);
      if (s.lb) s.lb = s.lb.map(typographie);
      if (s.ex) {
        s.ex.c = s.ex.__lignes.join('\n').replace(/\s+$/, '');
        delete s.ex.__lignes;
        s.ex.f = typographie(s.ex.f); s.ex.e = typographie(s.ex.e);
        if (!s.ex.c) erreur(lieu, 'exemple vide');
      }
      if (s.fr.length < 40) erreur(lieu, 'définition française trop courte (' + s.fr.length + ')');
      if (s.en.length < 40) erreur(lieu, 'définition anglaise trop courte (' + s.en.length + ')');
      if (s.fr.length > 700) avertir(lieu, 'définition française longue (' + s.fr.length + ')');
      if (s.en.length > 700) avertir(lieu, 'définition anglaise longue (' + s.en.length + ')');
      if (Boolean(s.pf) !== Boolean(s.pe)) avertir(lieu, '« +fr » et « +en » vont par deux');
      if (Boolean(s.af) !== Boolean(s.ae)) avertir(lieu, '« attention-fr » et « attention-en » vont par deux');
      if (s.ex && Boolean(s.ex.f) !== Boolean(s.ex.e)) avertir(lieu, '« ex-fr » et « ex-en » vont par deux');
      for (const champ of [s.fr, s.en, s.pf, s.pe, s.af, s.ae]) {
        if (/TBD|XXX|\?\?\?|à compléter|lorem ipsum/i.test(champ)) erreur(lieu, 'marque de travail restée dans le texte');
        if (/\s{2,}/.test(champ)) avertir(lieu, 'espaces doublées');
      }
      if (/[À-ÿ]/.test(s.en) && /\b(le|la|les|des|une|est|sont)\b/.test(s.en)) {
        avertir(lieu, 'la définition anglaise ressemble à du français');
      }
      if (s.sc) {
        schemasUtilises.add(s.sc);
        if (!schemas[s.sc]) erreur(lieu, 'schéma introuvable « ' + s.sc + ' »');
      }
    }
  }
  for (const t of termes) {
    const lieu = t.lieu + ' (' + t.id + ')';
    for (const v of t.voir) {
      if (!ids.has(v)) erreur(lieu, 'voir : terme inexistant « ' + v + ' »');
      if (v === t.id) erreur(lieu, 'voir : renvoie à lui-même');
    }
  }
  for (const nom of Object.keys(schemas)) {
    if (!schemasUtilises.has(nom)) avertir('js/schemas', 'schéma jamais utilisé : ' + nom);
  }

  if (erreurs.length) {
    console.error('\n' + erreurs.length + ' ERREUR(S) :');
    for (const e of erreurs) console.error('  ✗ ' + e);
    process.exit(1);
  }

  // Tri : par nom, sans tenir compte de la casse ni des signes.
  const cle = (s) => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/^[^a-z0-9]+/, '');
  termes.sort((a, b) => cle(a.nom).localeCompare(cle(b.nom), 'en'));

  const sortie = {
    format: 1,
    cats: CATEGORIES,
    termes: termes.map((t) => {
      const o = { id: t.id, c: t.cat, n: t.nom };
      if (t.nf) o.nf = t.nf;
      if (t.ne) o.ne = t.ne;
      if (t.dev) o.dev = t.dev;
      if (t.al.length) o.al = t.al;
      if (t.voir.length) o.v = t.voir;
      o.s = t.sens.map((s) => {
        const x = { f: s.fr, e: s.en };
        if (s.lb) x.lb = s.lb;
        if (s.pf) { x.pf = s.pf; x.pe = s.pe; }
        if (s.af) { x.af = s.af; x.ae = s.ae; }
        if (s.ex) {
          x.ex = { l: s.ex.l, c: s.ex.c };
          if (s.ex.f) { x.ex.f = s.ex.f; x.ex.e = s.ex.e; }
        }
        if (s.sc) x.sc = s.sc;
        return x;
      });
      return o;
    }),
  };

  const json = JSON.stringify(sortie);
  fs.writeFileSync(path.join(RACINE, 'data', 'glossaire.json'), json, 'utf-8');
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const manifeste = {
    format: 1, construit: aujourdhui, termes: termes.length,
    schemas: Object.keys(schemas).length, octets: Buffer.byteLength(json),
  };
  fs.writeFileSync(path.join(RACINE, 'data', 'manifeste.json'), JSON.stringify(manifeste) + '\n', 'utf-8');

  // Rapport
  const parCat = {};
  for (const t of termes) parCat[t.cat] = (parCat[t.cat] || 0) + 1;
  const senses = termes.reduce((n, t) => n + t.sens.length, 0);
  const avecEx = termes.filter((t) => t.sens.some((s) => s.ex)).length;
  const avecSc = termes.filter((t) => t.sens.some((s) => s.sc)).length;
  const lignes = [
    'Glossaire construit le ' + aujourdhui,
    termes.length + ' termes, ' + senses + ' sens, ' + avecEx + ' avec exemple, '
      + avecSc + ' avec schéma (' + schemasUtilises.size + ' schémas utilisés / ' + Object.keys(schemas).length + ' définis)',
    json.length + ' octets de JSON',
    '',
    ...CATEGORIES.map((c) => '  ' + c.id.padEnd(8) + String(parCat[c.id] || 0).padStart(4)),
  ];
  if (avertissements.length) {
    lignes.push('', avertissements.length + ' avertissement(s) :');
    for (const a of avertissements) lignes.push('  ! ' + a);
  }
  fs.writeFileSync(path.join(ICI, 'rapport.txt'), lignes.join('\n') + '\n', 'utf-8');
  console.log(lignes.join('\n'));
}

main();
