'use strict';
/*
 * Le quiz : retrouver un terme d'après sa définition, ou la définition d'après
 * son terme, à quatre choix.
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
 */
(function (racine) {

  const { element, bouton, melanger } = Outils;
  const { t } = I18n;

  const etat = {
    config: { source: 'tous' },
    questions: [],
    i: 0,
    ok: 0,
    ratees: [],
    repondu: false,
    enCours: false,
    ecran: 'accueil',   // 'accueil' | 'seance' | 'bilan'
    jeton: 0,           // écarte un dessin d'accueil devenu périmé
  };
  let zone = null;

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
      const interdits = voisinsDe(cible);
      const candidats = Glossaire.termes.filter((x) => !interdits.has(x.id) && courte(x, langue));
      if (!courte(cible, langue) || candidats.length < 3) continue;
      const memes = melanger(candidats.filter((x) => x.c === cible.c));
      const autres = melanger(candidats.filter((x) => x.c !== cible.c));
      const leurres = memes.concat(autres).slice(0, 3);
      const propositions = melanger([cible].concat(leurres));
      const concernes = [cible].concat(leurres);
      questions.push({
        cible, langue, sens,
        propositions: propositions.map((x) => ({
          terme: x,
          texte: sens === 'def-terme' ? Glossaire.nom(x, langue) : Glossaire.masquer(courte(x, langue), concernes),
        })),
        enonce: sens === 'def-terme' ? Glossaire.masquer(courte(cible, langue), concernes) : Glossaire.nom(cible, langue),
      });
    }
    return questions;
  }

  // ── Écran d'accueil du quiz ───────────────────────────────────────────────

  function segments(nom, valeurs, actuelle, action, libelle) {
    const g = element('div', 'segments');
    g.setAttribute('role', 'group');
    for (const v of valeurs) {
      const b = bouton('', libelle(v), () => action(v));
      b.setAttribute('aria-pressed', String(v) === String(actuelle) ? 'true' : 'false');
      g.appendChild(b);
    }
    return g;
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

    const bloc = element('section', 'bloc');
    bloc.appendChild(element('h3', null, t('quiz.source')));
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

    const message = element('p', 'erreur', '');
    message.hidden = true;
    zone.appendChild(bouton('bouton-principal', t('quiz.commencer'), async () => {
      const questions = await construire({ source: etat.config.source, sens: r.quizSens, langue: r.quizLangue, n: r.quizNombre });
      if (!questions.length) { message.textContent = t('quiz.trop-peu'); message.hidden = false; return; }
      commencer(questions);
    }));
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
    etat.enCours = true;
    dessinerQuestion();
  }

  function arreter() {
    etat.enCours = false;
    finSeance(false);
  }

  function dessinerQuestion() {
    const q = etat.questions[etat.i];
    etat.repondu = false;
    zone.textContent = '';

    const tete = element('div', 'seance-tete');
    const jauge = element('div', 'jauge');
    const barre = element('div');
    jauge.appendChild(barre);
    tete.appendChild(jauge);
    tete.appendChild(element('span', 'discret', t('quiz.progression', { i: etat.i + 1, n: etat.questions.length })));
    tete.appendChild(bouton('lien-discret', t('quiz.arreter'), arreter));
    zone.appendChild(tete);
    // la jauge se remplit après le premier dessin, pour que la transition se voie
    requestAnimationFrame(() => { barre.style.width = Math.round((etat.i / etat.questions.length) * 100) + '%'; });

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
    verdict.hidden = true;
    q.propositions.forEach((p) => {
      const b = element('button', 'choix' + (q.sens === 'def-terme' ? ' choix-terme' : ''), p.texte);
      b.type = 'button';
      b.addEventListener('click', () => repondre(q, p, liste, verdict));
      liste.appendChild(b);
    });
    zone.appendChild(liste);
    zone.appendChild(verdict);
    window.scrollTo(0, 0);
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
    if (juste) etat.ok += 1; else etat.ratees.push(q.cible.id);
    try {
      await Store.modifierSuivi(q.cible.id, (s) => {
        if (juste) { s.ok = (s.ok || 0) + 1; s.serie = (s.serie || 0) + 1; if (s.aRevoir && s.serie >= 2) s.aRevoir = false; }
        else { s.ko = (s.ko || 0) + 1; s.serie = 0; s.aRevoir = true; }
      });
    } catch (erreur) { /* le suivi est un plus : le quiz continue sans */ }

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
    ligne.appendChild(bouton('bouton-principal', t(dernier ? 'quiz.terminer' : 'quiz.suivant'), () => {
      if (dernier) finSeance(true); else { etat.i += 1; dessinerQuestion(); }
    }));
    ligne.appendChild(bouton('bouton-discret', t('quiz.ouvrir-fiche'), () => Fiche.ouvrir(q.cible.id)));
    verdict.appendChild(ligne);
    verdict.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function finSeance(complete) {
    etat.enCours = false;
    etat.ecran = 'bilan';
    etat.jeton += 1;
    document.dispatchEvent(new CustomEvent('suivi-change'));
    zone.textContent = '';
    const repondues = complete ? etat.questions.length : etat.i + (etat.repondu ? 1 : 0);
    if (!repondues) { dessinerAccueil(); return; }
    const bloc = element('div', 'bilan');
    bloc.appendChild(element('h2', null, t('quiz.bilan')));
    bloc.appendChild(element('p', 'bilan-score', t('quiz.score', { ok: etat.ok, n: repondues })));
    const part = etat.ok / repondues;
    const cle = part === 1 ? 'parfait' : (part >= 0.7 ? 'bien' : (part >= 0.4 ? 'moyen' : 'faible'));
    bloc.appendChild(element('p', 'discret', t('quiz.bilan.' + cle)));
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
      const r = App.reglages;
      const questions = await construire({ source: etat.config.source, sens: r.quizSens, langue: r.quizLangue, n: r.quizNombre });
      if (questions.length) commencer(questions); else dessinerAccueil();
    }));
    zone.appendChild(bouton('bouton-discret large', t('quiz.retour'), dessinerAccueil));
  }

  function brancher() {
    zone = document.getElementById('quiz-contenu');
    document.addEventListener('langue-changee', () => { if (etat.ecran === 'accueil' && App.vue === 'quiz') dessinerAccueil(); });
    document.addEventListener('suivi-change', () => { if (etat.ecran === 'accueil' && App.vue === 'quiz') dessinerAccueil(); });
  }

  function montrer() {
    if (etat.ecran === 'accueil') dessinerAccueil();
  }

  racine.Quiz = { brancher, montrer, construire, courte };

})(window);
