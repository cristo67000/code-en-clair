'use strict';
/*
 * Le glossaire : chargement, index de recherche, choix du « terme du jour ».
 *
 * Le glossaire tient dans un seul fichier (data/glossaire.json, quelques
 * centaines de Ko) : il est chargé en entier au démarrage et gardé en mémoire,
 * ce qui rend la recherche instantanée et sans réseau. Les termes que la
 * personne ajoute elle-même (`Store.tousLesTermesPerso`) sont fondus dans le
 * même index, avec une marque `perso`.
 *
 * Forme d'un terme, une fois chargé :
 *
 *   id, c (catégorie), n (le terme), nf / ne (mot français / anglais),
 *   dev (nom développé d'un sigle), al (alias), v (voisins),
 *   s: [ { f, e (définitions), pf, pe (« pour aller plus loin »),
 *          af, ae (« à ne pas confondre »), ex { l, c, f, e }, sc, lb } ]
 *
 * et, ajoutés au chargement : `cle` (nom normalisé), `cles` (toutes les
 * graphies cherchables), `texte` (définitions normalisées, pour la recherche
 * plein texte), `perso`.
 */
(function (racine) {

  const { normaliser } = Outils;

  let termes = [];
  let parId = new Map();
  let categories = [];
  let integres = [];

  function preparer(terme) {
    const graphies = [terme.n, terme.nf, terme.ne, terme.dev].concat(terme.al || []).filter(Boolean);
    const cles = [];
    for (const g of graphies) {
      const n = normaliser(g);
      if (n) cles.push(n);
      // « .gitignore », « --amend » : on cherche aussi sans la ponctuation de tête
      const nu = n.replace(/^[^a-z0-9]+/, '');
      if (nu && nu !== n) cles.push(nu);
    }
    terme.cle = normaliser(terme.n);
    terme.cleNue = terme.cle.replace(/^[^a-z0-9]+/, '') || terme.cle;
    terme.cles = cles;
    terme.texte = normaliser(terme.s.map((s) => [s.f, s.e, s.pf, s.pe].filter(Boolean).join(' ')).join(' '));
    const premiere = terme.cleNue.charAt(0).toUpperCase();
    terme.lettre = /[A-Z]/.test(premiere) ? premiere : '#';
    return terme;
  }

  async function charger(manifeste) {
    const reponse = await fetch('data/glossaire.json' + (manifeste ? '?m=' + encodeURIComponent(manifeste.construit) : ''));
    if (!reponse.ok) throw new Error('glossaire : ' + reponse.status);
    const donnees = await reponse.json();
    categories = donnees.cats;
    integres = donnees.termes.map(preparer);
    reconstruire([]);
    return { termes: integres.length };
  }

  /* Fond les termes de la personne dans l'index. Un terme à soi a pour
   * identifiant « perso:<id> » ; ses définitions manquantes restent vides. */
  function reconstruire(perso) {
    const siens = perso.map((p) => preparer({
      id: 'perso:' + p.id,
      c: p.cat || 'autre',
      n: p.nom,
      al: p.alias || [],
      s: [{ f: p.fr || '', e: p.en || '', ex: p.exemple || null }],
      perso: true,
      cree: p.cree,
    }));
    termes = integres.concat(siens);
    termes.sort((a, b) => a.cleNue.localeCompare(b.cleNue, 'en'));
    parId = new Map(termes.map((t) => [t.id, t]));
  }

  function categorie(id) {
    return categories.find((c) => c.id === id) || { id: 'autre', fr: 'Autre', en: 'Other', icone: 'autre' };
  }

  // ── Recherche ─────────────────────────────────────────────────────────────

  /* Note un terme pour une requête, 0 s'il ne correspond pas.
   * Du plus fort au plus faible : le terme lui-même, un alias, le mot français
   * ou anglais, puis le corps des définitions. */
  function noter(terme, requete, jetons) {
    let meilleur = 0;
    let via = '';
    const q = requete;
    if (terme.cle === q || terme.cleNue === q) return { note: 100, via: '' };
    if (terme.cle.startsWith(q) || terme.cleNue.startsWith(q)) { meilleur = 82; }
    for (const g of terme.cles) {
      if (g === q) { if (meilleur < 92) { meilleur = 92; via = g; } }
      else if (g.startsWith(q)) { if (meilleur < 72) { meilleur = 72; via = g; } }
      else if (g.includes(q)) { if (meilleur < 58) { meilleur = 58; via = g; } }
    }
    if (terme.cle.includes(q) && meilleur < 64) meilleur = 64;
    if (meilleur) return { note: meilleur, via: via === terme.cle ? '' : via };

    // Plusieurs mots : chacun doit se trouver quelque part
    if (jetons.length > 1) {
      const tout = terme.cles.join(' ') + ' ' + terme.texte;
      if (jetons.every((j) => tout.includes(j))) {
        const dansNoms = jetons.every((j) => terme.cles.some((c) => c.includes(j)));
        return { note: dansNoms ? 50 : 22, via: dansNoms ? '' : 'texte' };
      }
      return { note: 0, via: '' };
    }
    if (q.length >= 3 && terme.texte.includes(q)) return { note: 20, via: 'texte' };
    return { note: 0, via: '' };
  }

  /* Cherche dans les termes, éventuellement d'une seule catégorie.
   * Renvoie [{ terme, note, via }] du plus pertinent au moins pertinent. */
  function chercher(requete, options) {
    const opt = options || {};
    const q = normaliser(requete);
    let base = termes;
    if (opt.cat) base = base.filter((t) => t.c === opt.cat);
    if (!q) return base.map((terme) => ({ terme, note: 0, via: '' }));
    const jetons = q.split(' ').filter(Boolean);
    const trouves = [];
    for (const terme of base) {
      const r = noter(terme, q, jetons);
      if (r.note > 0) trouves.push({ terme, note: r.note, via: r.via });
    }
    trouves.sort((a, b) => (b.note - a.note) || a.terme.cleNue.localeCompare(b.terme.cleNue, 'en'));
    return trouves;
  }

  // ── Textes ────────────────────────────────────────────────────────────────

  /* La première phrase d'une définition : un point suivi d'une espace et d'une
   * majuscule (ou de la fin). « .gitignore », « sw.js », « v1.0 » n'y coupent
   * pas : aucun n'a d'espace après son point. */
  function premierePhrase(texte) {
    if (!texte) return '';
    const m = /^(.*?[.!?])(\s+(?=[A-ZÀ-ÖØ-Þ«“"(])|$)/su.exec(texte);
    return (m ? m[1] : texte).trim();
  }

  function definition(sens, langue) {
    return (langue === 'en' ? sens.e : sens.f) || sens.f || sens.e || '';
  }

  /* Le nom d'un terme tel qu'on le montre dans une langue. « Hexadécimal » est
   * un terme français : en anglais, on montre son équivalent (« hexadecimal »).
   * Un terme qui porte les deux noms (« Repository » / « dépôt ») garde celui
   * qu'on tape dans le code. */
  function nom(terme, langue) {
    if (langue === 'en' && terme.ne && !terme.nf) return terme.ne.split(/[,/]/)[0].trim();
    return terme.n;
  }

  function apercu(terme, langue) {
    return premierePhrase(definition(terme.s[0], langue));
  }

  function echapper(motif) {
    return motif.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* Remplace, dans un texte, les noms des termes donnés par « … ». Sert au
   * quiz : une définition qui contient le mot qu'on cherche le livrerait. */
  function masquer(texte, listeDeTermes) {
    let sortie = texte;
    const noms = new Set();
    for (const t of listeDeTermes) {
      for (const g of [t.n, t.nf, t.ne].concat(t.al || [])) {
        const propre = String(g || '').replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
        if (propre.length >= 3) noms.add(propre);
      }
    }
    const tries = Array.from(noms).sort((a, b) => b.length - a.length);
    for (const nom of tries) {
      // le pluriel compte aussi : « option » masque « options »
      const motif = new RegExp('(^|[^\\p{L}\\p{N}])' + echapper(nom) + '(?:s|es|x)?(?=$|[^\\p{L}\\p{N}])', 'giu');
      sortie = sortie.replace(motif, '$1…');
    }
    return sortie;
  }

  // ── Le terme du jour ──────────────────────────────────────────────────────

  /* Un terme par jour, le même pour tout le monde ce jour-là, et qui change à
   * minuit. Pris parmi les termes livrés (ceux qui ont un exemple ou un
   * schéma sont préférés : ils font un meilleur aperçu). */
  function termeDuJour() {
    const riches = integres.filter((t) => t.s.some((s) => s.sc || s.ex));
    const base = riches.length ? riches : integres;
    if (!base.length) return null;
    const jour = Outils.jourCourant();
    // un mélange simple mais qui ne répète pas d'un jour à l'autre
    const graine = (jour * 2654435761) >>> 0;
    return base[graine % base.length];
  }

  racine.Glossaire = {
    charger, reconstruire, categorie, chercher, premierePhrase, definition, apercu, masquer, nom,
    termeDuJour,
    get termes() { return termes; },
    get integres() { return integres; },
    get categories() { return categories; },
    parId: (id) => parId.get(id) || null,
  };

})(window);
