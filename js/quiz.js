'use strict';
/*
 * Le quiz : retrouver un terme d'après sa définition, ou la définition d'après
 * son terme, à quatre choix — ou, en mode « cartes », se tester seul : on
 * retourne la carte, on dit si on savait (voir cartes.js).
 *
 * Trois soins pour que les questions soient justes :
 *
 *   Pas de réponse qui se devine. Une définition contient souvent le mot
 *   qu'elle définit (« Un commit est… ») : si on l'affichait telle quelle, la
 *   réponse serait écrite dans la question. Le nom du terme demandé *et* ceux
 *   des trois leurres sont remplacés par « … » dans tous les textes affichés
 *   — dans tous, sinon la seule proposition sans points de suspension serait
 *   la bonne.
 *
 *   Pas de leurre qui serait aussi une bonne réponse. Les termes que le
 *   glossaire relie entre eux (« voir aussi ») sont exclus des leurres : « hash »
 *   et « SHA » ont des premières phrases qui se ressemblent, et la question
 *   n'aurait plus de réponse unique.
 *
 *   Des leurres du même monde. Ils sont pris d'abord dans la même catégorie,
 *   pour que la question demande de savoir quelque chose plutôt que de
 *   reconnaître qu'un mot de Git côtoie trois mots de cuisine.
 *
 * Chaque réponse met à jour le suivi du terme : une erreur le range dans
 * « À revoir » ; deux bonnes réponses de suite l'en sortent.
 *
 * Pendant la séance, une pastille par question se colore au fil des réponses,
 * et une série de bonnes réponses d'affilée se compte. Au clavier : 1 à 4
 * pour répondre, Entrée pour la suite.
 */
(function (racine) {

  const { element, bouton, melanger, svg } = Outils;
  const { t } = I18n;

  const etat = {
    config: { source: 'tous' },
    questions: [],
    i: 0,
    ok: 0,
    ratees: [],
    resultats: [],      // une case par question : true, false, ou rien encore
    serie: 0,           // bonnes réponses d'affilée
    meilleureSerie: 0,
    repondu: false,
    enCours: false,
    ecran: 'accueil',   // 'accueil' | 'seance' | 'bilan'
    jeton: 0,           // écarte un dessin d'accueil devenu périmé
    touches: null,      // ce que font les touches pour la question à l'écran
    derniere: null,     // les réglages de la dernière séance, pour « Rejouer »
  };
  let zone = null;
  let tete = null;      // l'en-tête de la séance : pastilles et série

  // ── Construction des questions ────────────────────────────────────────────

  function langueDeQuestion(cfg) {
    if (cfg === 'fr' || cfg === 'en') return cfg;
    if (cfg === 'mixte') return Math.random() < 0.5 ? 'fr' : 'en';
    return I18n.langue;
  }

  /* La définition courte d'un terme dans une langue : sa première phrase,
   * coupée à un mot si elle est longue. À défaut, l'autre langue. */
  function courte(terme, langue) {
    let texte = Glossaire.premierePhrase(Glossaire.definition(terme.s[0], langue));
    if (texte.length > 170) {
      texte = texte.slice(0, 170).replace(/\s+\S*$/, '') + '…';
    }
    return texte;
  }

  async function termesDeLaSource(source) {
    const tous = Glossaire.termes;
    if (source === 'tous') return tous;
    if (source.startsWith('cat:')) return tous.filter((x) => x.c === source.slice(4));
    const suivis = await Store.tousLesSuivis().catch(() => []);
    const refs = new Set(suivis.filter((s) => (source === 'favoris' ? s.favori : s.aRevoir)).map((s) => s.ref));
    return tous.filter((x) => refs.has(x.id));
  }

  function voisinsDe(cible) {
    const ids = new Set(cible.v || []);
    for (const x of Glossaire.termes) if ((x.v || []).includes(cible.id)) ids.add(x.id);
    ids.add(cible.id);
    return ids;
  }

  async function construire(cfg) {
    const source = await termesDeLaSource(cfg.source);
    const suivis = new Map((await Store.tousLesSuivis().catch(() => [])).map((s) => [s.ref, s]));
    // les moins bien sus d'abord, à égalité au hasard
    const ordre = melanger(source).sort((a, b) => ((suivis.get(a.id) || {}).serie || 0) - ((suivis.get(b.id) || {}).serie || 0));
    const questions = [];
    for (const cible of ordre) {
      if (questions.length >= cfg.n) break;
      const langue = langueDeQuestion(cfg.langue);
      const sens = cfg.sens === 'mixte' ? (Math.random() < 0.5 ? 'def-terme' : 'terme-def') : cfg.sens;
      if (!courte(cible, langue)) continue;
      if (cfg.mode === 'cartes') {
        // une carte n'a pas de leurres : seul son nom est à cacher
        questions.push({
          type: 'carte', cible, langue, sens,
          recto: sens === 'def-terme' ? Glossaire.masquer(courte(cible, langue), [cible]) : Glossaire.nom(cible, langue),
        });
        continue;
      }
      const interdits = voisinsDe(cible);
      const candidats = Glossaire.termes.filter((x) => !interdits.has(x.id) && courte(x, langue));
      if (candidats.length < 3) continue;
      const memes = melanger(candidats.filter((x) => x.c === cible.c));
      const autres = melanger(candidats.filter((x) => x.c !== cible.c));
      const leurres = memes.concat(autres).slice(0, 3);
      const propositions = melanger([cible].concat(leurres));
      const concernes = [cible].concat(leurres);
      questions.push({
        type: 'qcm', cible, langue, sens,
        propositions: propositions.map((x) => ({
          terme: x,
          texte: sens === 'def-terme' ? Glossaire.nom(x, langue) : Glossaire.masquer(courte(x, langue), concernes),
        })),
        enonce: sens === 'def-terme' ? Glossaire.masquer(courte(cible, langue), concernes) : Glossaire.nom(cible, langue),
      });
    }
    return questions;
  }

  function reglagesDeSeance(source) {
    const r = App.reglages;
    return { source: source || etat.config.source, sens: r.quizSens, langue: r.quizLangue, n: r.quizNombre, mode: r.quizMode };
  }

  // ── Écran d'accueil du quiz ───────────────────────────────────────────────

  function segments(nom, valeurs, actuelle, action, libelle) {
    const g = element('div', 'segments segments-' + nom);
    g.setAttribute('role', 'group');
    for (const v of valeurs) {
      const b = bouton('', libelle(v), () => action(v));
      b.setAttribute('aria-pressed', String(v) === String(actuelle) ? 'true' : 'false');
      g.appendChild(b);
    }
    return g;
  }

  /* Une jauge simple : un fond, une barre dont la largeur est posée par le
   * CSSOM (la politique de sécurité interdit l'attribut « style »). */
  function jauge(part, classe) {
    const j = element('div', 'jauge' + (classe ? ' ' + classe : ''));
    const barre = element('div');
    j.appendChild(barre);
    requestAnimationFrame(() => { barre.style.width = Math.round(Math.max(0, Math.min(1, part)) * 100) + '%'; });
    return j;
  }

  async function dessinerAccueil() {
    etat.ecran = 'accueil';
    etat.jeton += 1;
    const jeton = etat.jeton;
    const r = App.reglages;
    const suivis = await Store.tousLesSuivis().catch(() => []);
    if (jeton !== etat.jeton) return;   // la personne a commencé une séance entre-temps
    zone.textContent = '';
    const fav = suivis.filter((s) => s.favori).length;
    const rev = suivis.filter((s) => s.aRevoir).length;
    const justes = suivis.reduce((n, s) => n + (s.ok || 0), 0);

    zone.appendChild(element('h2', null, t('quiz.titre')));
    zone.appendChild(element('p', 'discret', t('quiz.intro')));
    const compteurs = element('div', 'compteurs');
    for (const [chiffre, cle, classe] of [[fav, 'quiz.compteur.favoris', ''], [rev, 'quiz.compteur.a-revoir', 'moyen'], [justes, 'quiz.compteur.reussis', 'bien']]) {
      const c = element('div', 'compteur ' + classe);
      c.appendChild(element('span', 'chiffre', String(chiffre)));
      c.appendChild(element('span', 'etiquette-compteur', t(cle)));
      compteurs.appendChild(c);
    }
    zone.appendChild(compteurs);

    // Ce qu'on a déjà ouvert du glossaire : une jauge, pour l'envie d'en voir plus
    const livres = new Set(Glossaire.integres.map((x) => x.id));
    const vus = suivis.filter((s) => s.vu && livres.has(s.ref)).length;
    const decouverte = element('div', 'decouverte');
    decouverte.appendChild(element('p', 'discret', t('quiz.decouverts', { n: vus, total: livres.size })));
    decouverte.appendChild(jauge(vus / (livres.size || 1), 'jauge-decouverte'));
    zone.appendChild(decouverte);

    const message = element('p', 'erreur', '');
    message.hidden = true;
    const lancer = async (source) => {
      const cfg = reglagesDeSeance(source);
      const questions = await construire(cfg);
      if (!questions.length) { message.textContent = t('quiz.trop-peu'); message.hidden = false; return; }
      etat.derniere = cfg;
      commencer(questions);
    };

    // Un raccourci vers ce qu'on a raté, quand il y en a
    if (rev) {
      const carte = bouton('carte-revoir', '', () => lancer('a-revoir'));
      carte.appendChild(element('span', 'carte-revoir-titre', I18n.plur('quiz.revoir-vite', rev)));
      carte.appendChild(element('span', 'carte-revoir-aide', t('quiz.revoir-vite.aide')));
      zone.appendChild(carte);
    }

    const bloc = element('section', 'bloc');
    bloc.appendChild(element('h3', null, t('quiz.mode')));
    bloc.appendChild(segments('mode', ['qcm', 'cartes'], r.quizMode,
      async (v) => { await App.ecrireReglage('quizMode', v); dessinerAccueil(); }, (v) => t('quiz.mode.' + v)));
    bloc.appendChild(element('p', 'discret', t('quiz.mode.aide.' + (r.quizMode === 'cartes' ? 'cartes' : 'qcm'))));

    bloc.appendChild(element('h4', null, t('quiz.source')));
    const options = [['tous', t('quiz.source.tous')], ['favoris', t('quiz.source.favoris') + ' (' + fav + ')'], ['a-revoir', t('quiz.source.a-revoir') + ' (' + rev + ')']];
    for (const c of Glossaire.categories) options.push(['cat:' + c.id, t('quiz.source.cat', { nom: c[I18n.langue === 'en' ? 'en' : 'fr'] })]);
    const sel = element('select', 'saisie-texte');
    sel.setAttribute('aria-label', t('quiz.source'));
    for (const [v, l] of options) {
      const o = element('option', null, l);
      o.value = v;
      if (v === etat.config.source) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener('change', () => { etat.config.source = sel.value; });
    bloc.appendChild(sel);

    bloc.appendChild(element('h4', null, t('quiz.sens')));
    bloc.appendChild(segments('sens', ['mixte', 'def-terme', 'terme-def'], r.quizSens,
      async (v) => { await App.ecrireReglage('quizSens', v); dessinerAccueil(); }, (v) => t('quiz.sens.' + v)));
    bloc.appendChild(element('h4', null, t('quiz.langue')));
    bloc.appendChild(segments('langue', ['interface', 'fr', 'en', 'mixte'], r.quizLangue,
      async (v) => { await App.ecrireReglage('quizLangue', v); dessinerAccueil(); }, (v) => t('quiz.langue.' + v)));
    bloc.appendChild(element('h4', null, t('quiz.nombre')));
    bloc.appendChild(segments('nombre', [5, 10, 20], r.quizNombre,
      async (v) => { await App.ecrireReglage('quizNombre', v); dessinerAccueil(); }, (v) => String(v)));
    zone.appendChild(bloc);

    zone.appendChild(bouton('bouton-principal', t('quiz.commencer'), () => lancer()));
    zone.appendChild(message);
  }

  // ── Une séance ────────────────────────────────────────────────────────────

  function commencer(questions) {
    etat.ecran = 'seance';
    etat.jeton += 1;
    etat.questions = questions;
    etat.i = 0;
    etat.ok = 0;
    etat.ratees = [];
    etat.resultats = [];
    etat.serie = 0;
    etat.meilleureSerie = 0;
    etat.enCours = true;
    dessinerQuestion();
  }

  function arreter() {
    etat.enCours = false;
    finSeance(false);
  }

  function suivante() {
    if (etat.i >= etat.questions.length - 1) finSeance(true);
    else { etat.i += 1; dessinerQuestion(); }
  }

  /* L'en-tête d'une séance : une pastille par question, où l'on en est, la
   * série en cours, et de quoi s'arrêter. */
  function dessinerEntete() {
    const q = etat.questions[etat.i];
    const bloc = element('div', 'seance-tete');
    const pastilles = element('div', 'pastilles');
    pastilles.setAttribute('aria-hidden', 'true');
    etat.questions.forEach((x, i) => {
      const r = etat.resultats[i];
      pastilles.appendChild(element('span', 'pastille-q' + (r === true ? ' juste' : (r === false ? ' faux' : (i === etat.i ? ' courante' : '')))));
    });
    bloc.appendChild(pastilles);
    const infos = element('div', 'seance-infos');
    const ou = { i: etat.i + 1, n: etat.questions.length };
    infos.appendChild(element('span', 'discret', q.type === 'carte' ? t('cartes.progression', ou) : t('quiz.progression', ou)));
    const serie = element('span', 'serie', t('quiz.serie', { n: etat.serie }));
    serie.hidden = etat.serie < 2;
    infos.appendChild(serie);
    infos.appendChild(element('span', 'espace'));
    infos.appendChild(bouton('lien-discret', t('quiz.arreter'), arreter));
    bloc.appendChild(infos);
    zone.appendChild(bloc);
    tete = { pastilles, serie };
  }

  /* Compte la réponse : score, série, pastille, et suivi du terme. */
  async function noter(q, juste) {
    etat.resultats[etat.i] = juste;
    if (juste) {
      etat.ok += 1;
      etat.serie += 1;
      etat.meilleureSerie = Math.max(etat.meilleureSerie, etat.serie);
    } else {
      etat.ratees.push(q.cible.id);
      etat.serie = 0;
    }
    if (tete) {
      const p = tete.pastilles.children[etat.i];
      if (p) p.className = 'pastille-q ' + (juste ? 'juste' : 'faux');
      tete.serie.textContent = t('quiz.serie', { n: etat.serie });
      tete.serie.hidden = etat.serie < 2;
      if (etat.serie >= 2) { tete.serie.classList.remove('pop'); void tete.serie.offsetWidth; tete.serie.classList.add('pop'); }
    }
    try {
      await Store.modifierSuivi(q.cible.id, (s) => {
        if (juste) { s.ok = (s.ok || 0) + 1; s.serie = (s.serie || 0) + 1; if (s.aRevoir && s.serie >= 2) s.aRevoir = false; }
        else { s.ko = (s.ko || 0) + 1; s.serie = 0; s.aRevoir = true; }
      });
    } catch (erreur) { /* le suivi est un plus : le quiz continue sans */ }
  }

  function dessinerQuestion() {
    const q = etat.questions[etat.i];
    etat.repondu = false;
    etat.touches = null;
    zone.textContent = '';
    dessinerEntete();

    if (q.type === 'carte') {
      etat.touches = Cartes.dessiner(zone, q, async (savait) => {
        etat.repondu = true;
        await noter(q, savait);
        suivante();
      });
      racine.scrollTo(0, 0);
      return;
    }

    zone.appendChild(element('p', 'consigne', t('quiz.question.' + q.sens)));
    const enonce = element('div', 'enonce');
    if (q.sens === 'terme-def') {
      enonce.appendChild(element('p', 'enonce-terme', q.enonce));
    } else {
      enonce.appendChild(element('p', 'enonce-definition', q.enonce));
    }
    zone.appendChild(enonce);

    const liste = element('div', 'choix-liste');
    const verdict = element('div', 'verdict');
    verdict.setAttribute('role', 'status');
    verdict.hidden = true;
    q.propositions.forEach((p, i) => {
      const b = element('button', 'choix' + (q.sens === 'def-terme' ? ' choix-terme' : ''));
      b.type = 'button';
      const touche = element('span', 'touche', String(i + 1));
      touche.setAttribute('aria-hidden', 'true');
      b.appendChild(touche);
      b.appendChild(element('span', 'choix-texte', p.texte));
      b.addEventListener('click', () => repondre(q, p, liste, verdict));
      liste.appendChild(b);
    });
    zone.appendChild(liste);
    zone.appendChild(verdict);
    etat.touches = (e) => {
      if (etat.repondu) {
        // Entrée sur un bouton, c'est le bouton qui répond ; ailleurs, on enchaîne
        if ((e.key === 'Enter' || e.key === 'ArrowRight') && e.target.tagName !== 'BUTTON' && !verdict.hidden) { suivante(); return true; }
        return false;
      }
      const i = ['1', '2', '3', '4'].indexOf(e.key);
      if (i === -1 || !liste.children[i]) return false;
      liste.children[i].click();
      return true;
    };
    racine.scrollTo(0, 0);
  }

  async function repondre(q, choisie, liste, verdict) {
    if (etat.repondu) return;
    etat.repondu = true;
    const juste = choisie.terme.id === q.cible.id;
    const boutons = Array.from(liste.children);
    q.propositions.forEach((p, i) => {
      boutons[i].disabled = true;
      if (p.terme.id === q.cible.id) boutons[i].classList.add('bonne');
      else if (p === choisie) boutons[i].classList.add('mauvaise');
    });
    await noter(q, juste);

    verdict.hidden = false;
    verdict.className = 'verdict ' + (juste ? 'juste' : 'faux');
    verdict.appendChild(element('p', 'verdict-texte', t(juste ? 'quiz.juste' : 'quiz.faux')));
    const carte = element('div', 'verdict-fiche');
    if (!juste) carte.appendChild(element('p', 'discret', t('quiz.la-bonne')));
    carte.appendChild(element('p', 'verdict-terme', Glossaire.nom(q.cible, q.langue)));
    carte.appendChild(element('p', 'verdict-def', Glossaire.definition(q.cible.s[0], q.langue)));
    verdict.appendChild(carte);
    const ligne = element('div', 'ligne-boutons');
    const dernier = etat.i === etat.questions.length - 1;
    const suite = bouton('bouton-principal', t(dernier ? 'quiz.terminer' : 'quiz.suivant'), suivante);
    ligne.appendChild(suite);
    ligne.appendChild(bouton('bouton-discret', t('quiz.ouvrir-fiche'), () => Fiche.ouvrir(q.cible.id)));
    verdict.appendChild(ligne);
    verdict.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    // Entrée enchaîne : le bouton « Suivant » a le focus
    suite.focus({ preventScroll: true });
  }

  function finSeance(complete) {
    etat.enCours = false;
    etat.ecran = 'bilan';
    etat.jeton += 1;
    etat.touches = null;
    tete = null;
    document.dispatchEvent(new CustomEvent('suivi-change'));
    zone.textContent = '';
    const repondues = complete ? etat.questions.length : etat.resultats.filter((r) => r !== undefined).length;
    if (!repondues) { dessinerAccueil(); return; }
    const bloc = element('div', 'bilan');
    bloc.appendChild(element('h2', null, t('quiz.bilan')));
    const part = etat.ok / repondues;
    const cle = part === 1 ? 'parfait' : (part >= 0.7 ? 'bien' : (part >= 0.4 ? 'moyen' : 'faible'));
    bloc.appendChild(anneau(part, cle));
    bloc.appendChild(element('p', 'bilan-score', t('quiz.score', { ok: etat.ok, n: repondues })));
    bloc.appendChild(element('p', 'discret', t('quiz.bilan.' + cle)));
    if (etat.meilleureSerie >= 3) bloc.appendChild(element('p', 'serie-bilan', t('quiz.meilleure-serie', { n: etat.meilleureSerie })));
    zone.appendChild(bloc);

    const uniques = Array.from(new Set(etat.ratees));
    if (uniques.length) {
      zone.appendChild(element('h3', 'rubrique', t('quiz.erreurs')));
      const rang = element('div', 'voisins');
      for (const id of uniques) {
        const terme = Glossaire.parId(id);
        if (terme) rang.appendChild(bouton('voisin cat-' + terme.c, terme.n, () => Fiche.ouvrir(id)));
      }
      zone.appendChild(rang);
    }
    zone.appendChild(bouton('bouton-principal espace-haut', t('quiz.rejouer'), async () => {
      // la même séance : même source — « à revoir » si l'on venait du raccourci —, mêmes réglages
      const questions = await construire(etat.derniere || reglagesDeSeance());
      if (questions.length) commencer(questions); else dessinerAccueil();
    }));
    zone.appendChild(bouton('bouton-discret large', t('quiz.retour'), dessinerAccueil));
    racine.scrollTo(0, 0);
  }

  /* Le score en anneau, qui se remplit : la part de bonnes réponses, en
   * pourcentage au centre. */
  function anneau(part, cle) {
    const boite = element('div', 'anneau');
    const dessin = svg('svg', { viewBox: '0 0 120 120', 'aria-hidden': 'true', focusable: 'false' });
    dessin.appendChild(svg('circle', { class: 'anneau-fond', cx: 60, cy: 60, r: 52 }));
    const arc = svg('circle', {
      class: 'anneau-arc ' + cle, cx: 60, cy: 60, r: 52, pathLength: 100,
      'stroke-dasharray': '100 100', 'stroke-dashoffset': '100', transform: 'rotate(-90 60 60)',
    });
    dessin.appendChild(arc);
    boite.appendChild(dessin);
    let pourcent;
    try {
      pourcent = new Intl.NumberFormat(I18n.langue === 'en' ? 'en-GB' : 'fr-FR', { style: 'percent' }).format(part);
    } catch (erreur) {
      pourcent = Math.round(part * 100) + ' %';
    }
    boite.appendChild(element('span', 'anneau-texte', pourcent));
    // deux images plus tard, pour que la transition parte bien de zéro
    requestAnimationFrame(() => requestAnimationFrame(() => { arc.style.strokeDashoffset = String(100 - Math.round(part * 100)); }));
    return boite;
  }

  // ── Le clavier ────────────────────────────────────────────────────────────

  function surTouche(e) {
    if (App.vue !== 'quiz' || etat.ecran !== 'seance' || Fiche.ouverte || Editeur.ouvert) return;
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || Outils.saisieEnCours(e)) return;
    if (etat.touches && etat.touches(e)) e.preventDefault();
  }

  function brancher() {
    zone = document.getElementById('quiz-contenu');
    document.addEventListener('keydown', surTouche);
    document.addEventListener('langue-changee', () => { if (etat.ecran === 'accueil' && App.vue === 'quiz') dessinerAccueil(); });
    document.addEventListener('suivi-change', () => { if (etat.ecran === 'accueil' && App.vue === 'quiz') dessinerAccueil(); });
  }

  function montrer() {
    if (etat.ecran === 'accueil') dessinerAccueil();
  }

  racine.Quiz = { brancher, montrer, construire, courte };

})(window);
