'use strict';
/*
 * La fiche d'un terme : ce qu'on voit en touchant un terme dans la liste.
 *
 * De haut en bas : le terme, sa catégorie, ses traductions ; puis, pour chaque
 * sens, la définition (en français, en anglais, ou les deux), le schéma, un
 * exemple de code, une mise en garde ; les termes voisins ; enfin les notes et
 * les exemples de la personne.
 *
 * ── Le bouton « retour » du téléphone ──────────────────────────────────────
 *
 * Une fiche s'ouvre par-dessus la liste : le geste « retour » d'Android doit la
 * refermer, pas quitter l'application. Chaque ouverture ajoute donc une entrée
 * à l'historique du navigateur (`pushState`), et `popstate` la défait. Passer
 * d'une fiche à une fiche voisine en ajoute une aussi : « retour » ramène à la
 * fiche précédente, comme sur un site.
 *
 * ── La prononciation ───────────────────────────────────────────────────────
 *
 * Ces mots, on les lit en anglais sans toujours savoir les dire : « cache »,
 * « queue », « sudo ». Le bouton « Écouter » les fait prononcer par la synthèse
 * vocale du système — et seulement par une voix *locale* : certaines voix de
 * navigateur envoient le texte à un serveur pour le lire, et l'application
 * promet de ne rien envoyer nulle part. Sans voix anglaise locale, pas de
 * bouton.
 */
(function (racine) {

  const { element, bouton, svg } = Outils;
  const { t } = I18n;

  const etat = {
    pile: [],          // les références ouvertes, la dernière est à l'écran
    ouverte: false,
    notes: [],         // les notes du terme affiché
    suivi: null,
    avant: null,       // ce qui avait le focus avant l'ouverture, pour le lui rendre
  };
  let conteneur = null;
  let corps = null;
  let voix = null;
  let guetteur = null;   // surveille le titre, pour le montrer dans la barre une fois sorti de l'écran

  /* Relance une animation CSS : retirer la classe, forcer un calcul, la remettre. */
  function animer(noeud, classe) {
    noeud.classList.remove(classe);
    void noeud.offsetWidth;
    noeud.classList.add(classe);
  }

  // ── Ouverture et fermeture ────────────────────────────────────────────────

  function ouvrir(ref, options) {
    const opt = options || {};
    if (!Glossaire.parId(ref)) return;
    const deja = etat.ouverte;
    if (deja && etat.pile[etat.pile.length - 1] === ref && !opt.forcer) return;
    etat.pile.push(ref);
    try { racine.history.pushState({ fiche: etat.pile.length }, ''); } catch (erreur) { /* historique indisponible */ }
    if (!deja) {
      const actif = document.activeElement;
      etat.avant = actif && actif.tagName === 'BUTTON' ? { noeud: actif, ref: actif.getAttribute('data-ref') } : null;
      etat.ouverte = true;
      conteneur.hidden = false;
      document.body.classList.add('fiche-ouverte');
      animer(conteneur, 'entree');
    } else {
      animer(corps, 'change');
    }
    dessiner(opt.defiler);
    Store.consulter(ref).catch(() => {});
    Store.modifierSuivi(ref, (s) => { s.vu = (s.vu || 0) + 1; s.dernier = Date.now(); })
      .then(() => document.dispatchEvent(new CustomEvent('suivi-change'))).catch(() => {});
  }

  /* Ramène la pile à `n` entrées (l'historique vient de reculer). */
  function revenirA(n) {
    if (!etat.ouverte) return;
    if (n <= 0) { fermerSansHistorique(); return; }
    etat.pile.length = Math.min(etat.pile.length, n);
    animer(corps, 'change');
    dessiner();
  }

  function fermerSansHistorique() {
    etat.pile = [];
    etat.ouverte = false;
    if (conteneur) conteneur.hidden = true;
    if (guetteur) { guetteur.disconnect(); guetteur = null; }
    if (racine.speechSynthesis) racine.speechSynthesis.cancel();
    document.body.classList.remove('fiche-ouverte');
    document.dispatchEvent(new CustomEvent('fiche-fermee'));
    rendreLeFocus();
  }

  /* Au clavier, on revient là d'où l'on est parti. La liste a pu être
   * redessinée entre-temps : on retrouve alors la ligne par sa référence. */
  function rendreLeFocus() {
    const avant = etat.avant;
    etat.avant = null;
    if (!avant) return;
    let cible = avant.noeud.isConnected ? avant.noeud : null;
    if (!cible && avant.ref) {
      cible = Array.from(document.querySelectorAll('.terme-ligne')).find((b) => b.getAttribute('data-ref') === avant.ref) || null;
    }
    if (cible && !cible.closest('[hidden]')) cible.focus({ preventScroll: true });
  }

  /* Le bouton « Fermer » : on recule d'autant d'entrées que la pile en compte. */
  function fermer(supplement) {
    if (!etat.ouverte) return;
    const n = etat.pile.length + (typeof supplement === 'number' ? supplement : 0);
    fermerSansHistorique();
    Outils.reculer(n);
  }

  function retour() {
    if (etat.pile.length > 1) racine.history.back();
    else fermer();
  }

  // ── Écouter, partager ─────────────────────────────────────────────────────

  function choisirVoix() {
    const synthese = racine.speechSynthesis;
    if (!synthese) return;
    const locales = synthese.getVoices().filter((v) => v.localService && /^en([-_]|$)/i.test(v.lang));
    voix = locales.find((v) => /^en[-_]US/i.test(v.lang)) || locales.find((v) => /^en[-_]GB/i.test(v.lang)) || locales[0] || null;
  }

  /* Le mot à dire en anglais : le terme lui-même, sauf quand son nom est
   * français (« Empreinte ») — on dit alors son équivalent (« fingerprint »). */
  function motAnglais(terme) {
    return terme.ne && !terme.nf ? Glossaire.nom(terme, 'en') : terme.n;
  }

  function boutonEcouter(terme) {
    const mot = motAnglais(terme);
    const b = bouton('bouton-ecouter', '', () => {
      const synthese = racine.speechSynthesis;
      synthese.cancel();
      const phrase = new SpeechSynthesisUtterance(mot);
      phrase.voice = voix;
      phrase.lang = voix.lang;
      phrase.rate = 0.9;
      phrase.onend = () => b.classList.remove('parle');
      phrase.onerror = phrase.onend;
      b.classList.add('parle');
      synthese.speak(phrase);
    });
    b.setAttribute('aria-label', t('fiche.ecouter', { mot }));
    b.setAttribute('title', t('fiche.ecouter', { mot }));
    const icone = svg('svg', { class: 'icone', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' });
    icone.appendChild(svg('path', { d: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4z' }));
    icone.appendChild(svg('path', { class: 'onde onde-1', d: 'M15.5 9.2a4 4 0 0 1 0 5.6' }));
    icone.appendChild(svg('path', { class: 'onde onde-2', d: 'M18.2 6.6a7.6 7.6 0 0 1 0 10.8' }));
    b.appendChild(icone);
    return b;
  }

  /* Le lien d'un terme ouvre sa fiche (`?terme=`), dans l'application si elle
   * est installée. Un terme à soi n'existe que sur cet appareil : pas de lien. */
  async function partager(terme) {
    const adresse = Installer.ADRESSE + '?terme=' + encodeURIComponent(terme.id);
    const contenu = { title: terme.n + ' — ' + t('app.nom'), text: Glossaire.apercu(terme, App.langueDef()), url: adresse };
    if (racine.navigator.share) {
      try { await racine.navigator.share(contenu); return; } catch (erreur) {
        if (erreur && erreur.name === 'AbortError') return;
      }
    }
    const ok = await Outils.copier(adresse);
    Outils.annoncer(ok ? t('fiche.lien-copie') : adresse);
  }

  function boutonPartager(terme) {
    const b = bouton('fiche-partager', '', () => partager(terme));
    b.setAttribute('aria-label', t('fiche.partager'));
    b.setAttribute('title', t('fiche.partager'));
    const icone = svg('svg', { class: 'icone', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' });
    icone.appendChild(svg('path', { d: 'M12 3.5v11' }));
    icone.appendChild(svg('path', { d: 'M7.5 8 12 3.5 16.5 8' }));
    icone.appendChild(svg('path', { d: 'M5.5 12.5v5.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-5.5' }));
    b.appendChild(icone);
    return b;
  }

  /* Le nom du terme vient se loger dans la barre du haut quand le titre sort
   * de l'écran : on sait toujours quelle fiche on lit. */
  function guetterTitre(titre, barre) {
    if (guetteur) guetteur.disconnect();
    if (!racine.IntersectionObserver) return;
    guetteur = new IntersectionObserver(([entree]) => {
      barre.classList.toggle('titre-parti', !entree.isIntersecting && entree.boundingClientRect.top < 80);
    }, { root: conteneur, rootMargin: '-56px 0px 0px 0px' });
    guetteur.observe(titre);
  }

  // ── Dessin ────────────────────────────────────────────────────────────────

  function langueDef() {
    const d = App.reglages.definitions;
    return d === 'les-deux' ? null : d;
  }

  /* Un bloc de définition : une pastille de langue, puis le texte. */
  function blocDefinition(code, texte, plus) {
    const bloc = element('div', 'def def-' + code);
    bloc.appendChild(element('span', 'langue-pastille', code.toUpperCase()));
    const p = element('div', 'def-texte');
    p.appendChild(element('p', 'def-phrase', texte));
    if (plus) p.appendChild(element('p', 'def-plus', plus));
    bloc.appendChild(p);
    return bloc;
  }

  function blocExemple(ex, langueInterface) {
    const bloc = element('div', 'exemple');
    const tete = element('div', 'exemple-tete');
    tete.appendChild(element('span', 'exemple-langage', Surlignage.NOMS[ex.l] || ex.l));
    const copier = bouton('bouton-copier', t('fiche.copier'), async () => {
      const ok = await Outils.copier(ex.c);
      copier.textContent = ok ? t('fiche.copie') : t('fiche.copie-echec');
      copier.classList.toggle('fait', ok);
      setTimeout(() => { copier.textContent = t('fiche.copier'); copier.classList.remove('fait'); }, 1600);
    });
    tete.appendChild(copier);
    bloc.appendChild(tete);
    bloc.appendChild(Surlignage.bloc(ex.c, ex.l));
    return bloc;
  }

  function legendes(ex, fixe) {
    const lignes = [];
    if (fixe !== 'en' && ex.f) lignes.push(['fr', ex.f]);
    if (fixe !== 'fr' && ex.e) lignes.push(['en', ex.e]);
    if (!lignes.length) return null;
    const bloc = element('div', 'exemple-legendes');
    for (const [code, texte] of lignes) {
      const l = element('p', 'exemple-legende');
      if (lignes.length > 1) l.appendChild(element('span', 'langue-pastille petite', code.toUpperCase()));
      l.appendChild(document.createTextNode(texte));
      bloc.appendChild(l);
    }
    return bloc;
  }

  function dessinerSens(terme, sens, plusieurs) {
    const section = element('section', 'sens-bloc');
    const fixe = langueDef();
    if (plusieurs && sens.lb) {
      section.appendChild(element('h3', 'sens-titre', sens.lb[I18n.langue === 'en' ? 1 : 0]));
    }
    const defs = element('div', 'defs');
    if (fixe !== 'en' && sens.f) defs.appendChild(blocDefinition('fr', sens.f, sens.pf));
    if (fixe !== 'fr' && sens.e) defs.appendChild(blocDefinition('en', sens.e, sens.pe));
    if (!defs.childNodes.length) {
      // le seul texte disponible est dans l'autre langue (terme à soi) : on le montre
      if (sens.f) defs.appendChild(blocDefinition('fr', sens.f, sens.pf));
      else if (sens.e) defs.appendChild(blocDefinition('en', sens.e, sens.pe));
    }
    section.appendChild(defs);

    if (sens.sc && racine.Schemas && racine.Schemas[sens.sc]) {
      const spec = racine.Schemas[sens.sc];
      const fig = element('figure', 'schema');
      const etiquette = element('div', 'bloc-etiquette', t('fiche.schema'));
      fig.appendChild(etiquette);
      try {
        fig.appendChild(Schema.dessiner(spec, I18n.langue));
        const leg = Schema.legende(spec, I18n.langue);
        if (leg) fig.appendChild(element('figcaption', null, leg));
      } catch (erreur) {
        fig.appendChild(element('p', 'discret', String(erreur && erreur.message ? erreur.message : erreur)));
      }
      section.appendChild(fig);
    }

    if (sens.ex) {
      const ex = element('div', 'exemple-bloc');
      ex.appendChild(element('div', 'bloc-etiquette', t('fiche.exemple')));
      ex.appendChild(blocExemple(sens.ex));
      const leg = legendes(sens.ex, fixe);
      if (leg) ex.appendChild(leg);
      section.appendChild(ex);
    }

    if ((sens.af || sens.ae)) {
      const a = element('aside', 'attention');
      a.appendChild(element('div', 'attention-titre', t('fiche.attention')));
      if (fixe !== 'en' && sens.af) a.appendChild(element('p', null, sens.af));
      if (fixe !== 'fr' && sens.ae) a.appendChild(element('p', null, sens.ae));
      section.appendChild(a);
    }
    return section;
  }

  function pastilleCategorie(idCat) {
    const cat = Glossaire.categorie(idCat);
    const p = element('span', 'pastille-cat cat-' + cat.id);
    p.appendChild(element('span', 'point'));
    p.appendChild(document.createTextNode(cat[I18n.langue === 'en' ? 'en' : 'fr'] || cat.fr));
    return p;
  }

  function dessinerNotes(terme) {
    const bloc = element('section', 'mes-notes');
    bloc.id = 'mes-notes';
    bloc.appendChild(element('h3', 'rubrique', t('mes.titre')));
    if (!etat.notes.length) {
      bloc.appendChild(element('p', 'discret', t('mes.vide')));
    }
    for (const note of etat.notes) bloc.appendChild(carteNote(note));
    const ligne = element('div', 'ligne-boutons');
    ligne.appendChild(bouton('bouton-discret', '＋ ' + t('mes.ajouter-note'), () => Editeur.ouvrir({ type: 'note', ref: terme.id })));
    ligne.appendChild(bouton('bouton-discret', '＋ ' + t('mes.ajouter-exemple'), () => Editeur.ouvrir({ type: 'exemple', ref: terme.id })));
    bloc.appendChild(ligne);
    return bloc;
  }

  function carteNote(note) {
    const carte = element('article', 'note-carte type-' + note.type);
    const tete = element('div', 'note-tete');
    tete.appendChild(element('span', 'note-type', t(note.type === 'exemple' ? 'mes.exemple' : 'mes.note')));
    if (note.titre) tete.appendChild(element('strong', 'note-titre', note.titre));
    carte.appendChild(tete);
    if (note.type === 'exemple') {
      carte.appendChild(blocExemple({ l: note.langage || 'text', c: note.code || '' }));
      if (note.texte) carte.appendChild(element('p', 'note-texte', note.texte));
    } else {
      carte.appendChild(element('p', 'note-texte', note.texte));
    }
    const pied = element('div', 'note-pied');
    pied.appendChild(element('span', 'discret', t('mes.modifie-le', { date: Outils.dateLisible(note.modifie, I18n.langue) })));
    pied.appendChild(bouton('lien-discret', t('mes.modifier'), () => Editeur.ouvrir({ type: note.type, note })));
    carte.appendChild(pied);
    return carte;
  }

  /* `anime` : le bouton qu'on vient de toucher ('favori', 'revoir'), pour
   * qu'il marque le coup. */
  async function dessiner(defiler, anime) {
    const ref = etat.pile[etat.pile.length - 1];
    const terme = Glossaire.parId(ref);
    corps.textContent = '';
    if (!terme) {
      corps.appendChild(element('p', 'vide', t('fiche.introuvable')));
      return;
    }

    // Barre du haut : retour, le nom (quand le titre a défilé), partager, fermer
    const barre = element('div', 'fiche-tete');
    const precedente = etat.pile.length > 1 ? Glossaire.parId(etat.pile[etat.pile.length - 2]) : null;
    barre.appendChild(bouton('fiche-retour', precedente ? '← ' + precedente.n : '← ' + t('fiche.retour'), retour));
    const nomBarre = element('span', 'espace fiche-tete-nom', terme.n);
    nomBarre.setAttribute('aria-hidden', 'true');
    barre.appendChild(nomBarre);
    if (!terme.perso) barre.appendChild(boutonPartager(terme));
    const fermer_ = bouton('fiche-fermer', '✕', fermer);
    fermer_.setAttribute('aria-label', t('fiche.fermer'));
    barre.appendChild(fermer_);
    corps.appendChild(barre);

    // Titre
    const tete = element('header', 'fiche-titre');
    const ligneTitre = element('div', 'titre-ligne');
    const titre = element('h2', 'terme-nom', terme.n);
    ligneTitre.appendChild(titre);
    if (voix) ligneTitre.appendChild(boutonEcouter(terme));
    tete.appendChild(ligneTitre);
    if (terme.dev) {
      const dev = element('p', 'terme-dev');
      dev.appendChild(element('span', 'discret', t('fiche.sigle') + ' '));
      dev.appendChild(element('span', null, terme.dev));
      tete.appendChild(dev);
    }
    const infos = element('div', 'fiche-infos');
    infos.appendChild(pastilleCategorie(terme.c));
    if (terme.perso) infos.appendChild(element('span', 'pastille', t('perso.pastille')));
    tete.appendChild(infos);
    if (terme.nf || terme.ne) {
      const trad = element('p', 'traductions');
      if (terme.nf) {
        trad.appendChild(element('span', 'trad-cle', t('fiche.en-francais') + ' : '));
        trad.appendChild(element('span', 'trad-val', terme.nf));
      }
      if (terme.nf && terme.ne) trad.appendChild(element('span', 'trad-sep', '  ·  '));
      if (terme.ne) {
        trad.appendChild(element('span', 'trad-cle', t('fiche.en-anglais') + ' : '));
        trad.appendChild(element('span', 'trad-val', terme.ne));
      }
      tete.appendChild(trad);
    }
    corps.appendChild(tete);

    // Actions : favori, à revoir, partager
    const suivi = await Store.lireSuivi(ref).catch(() => null);
    etat.suivi = suivi;
    const actions = element('div', 'actions-fiche');
    const favori = bouton('bouton-etat' + (suivi && suivi.favori ? ' actif' : ''),
      (suivi && suivi.favori ? '★ ' + t('fiche.favori-oui') : '☆ ' + t('fiche.favori')), async () => {
        await Store.modifierSuivi(ref, (s) => { s.favori = !s.favori; });
        document.dispatchEvent(new CustomEvent('suivi-change'));
        dessiner(false, 'favori');
      });
    favori.setAttribute('aria-pressed', suivi && suivi.favori ? 'true' : 'false');
    const revoir = bouton('bouton-etat' + (suivi && suivi.aRevoir ? ' actif revoir' : ''),
      (suivi && suivi.aRevoir ? '⚑ ' + t('fiche.a-revoir-oui') : '⚐ ' + t('fiche.a-revoir')), async () => {
        await Store.modifierSuivi(ref, (s) => { s.aRevoir = !s.aRevoir; if (!s.aRevoir) s.serie = 0; });
        document.dispatchEvent(new CustomEvent('suivi-change'));
        dessiner(false, 'revoir');
      });
    revoir.setAttribute('aria-pressed', suivi && suivi.aRevoir ? 'true' : 'false');
    if (anime === 'favori') favori.classList.add('pop');
    if (anime === 'revoir') revoir.classList.add('pop');
    actions.appendChild(favori);
    actions.appendChild(revoir);
    corps.appendChild(actions);

    // Sens
    const plusieurs = terme.s.length > 1;
    for (const sens of terme.s) corps.appendChild(dessinerSens(terme, sens, plusieurs));

    if (terme.perso) {
      corps.appendChild(bouton('bouton-discret large', '✎ ' + t('fiche.modifier-terme'), () => Editeur.ouvrir({ type: 'terme', id: terme.id.slice(6) })));
    }

    // Voisins
    const voisins = (terme.v || []).map((id) => Glossaire.parId(id)).filter(Boolean);
    if (voisins.length) {
      const bloc = element('section', 'voisins-bloc');
      bloc.appendChild(element('h3', 'rubrique', t('fiche.voir-aussi')));
      const rang = element('div', 'voisins');
      for (const v of voisins) {
        const b = bouton('voisin', v.n, () => ouvrir(v.id));
        b.classList.add('cat-' + v.c);
        rang.appendChild(b);
      }
      bloc.appendChild(rang);
      corps.appendChild(bloc);
    }

    // Notes et exemples
    etat.notes = await Store.notesDe(ref).catch(() => []);
    etat.notes.sort((a, b) => a.cree - b.cree);
    corps.appendChild(dessinerNotes(terme));

    if (defiler !== false) conteneur.scrollTop = defiler === 'notes'
      ? (document.getElementById('mes-notes') ? document.getElementById('mes-notes').offsetTop - 60 : 0) : 0;
    conteneur.setAttribute('aria-label', terme.n);
    guetterTitre(titre, barre);
  }

  function brancher() {
    conteneur = document.getElementById('fiche');
    corps = document.getElementById('fiche-contenu');
    conteneur.addEventListener('animationend', () => conteneur.classList.remove('entree'));
    corps.addEventListener('animationend', () => corps.classList.remove('change'));
    const synthese = racine.speechSynthesis;
    if (synthese && synthese.addEventListener && racine.SpeechSynthesisUtterance) {
      choisirVoix();
      // Les voix arrivent souvent après le démarrage : on redessine si le bouton devient possible.
      synthese.addEventListener('voiceschanged', () => {
        const avant = voix;
        choisirVoix();
        if (!avant !== !voix && etat.ouverte) dessiner(false);
      });
    }
    document.addEventListener('langue-changee', () => { if (etat.ouverte) dessiner(false); });
    document.addEventListener('notes-changees', () => { if (etat.ouverte) dessiner(false); });
    document.addEventListener('perso-change', () => { if (etat.ouverte) dessiner(false); });
    document.addEventListener('reglages-changes', () => { if (etat.ouverte) dessiner(false); });
  }

  racine.Fiche = {
    brancher, ouvrir, fermer, retour, revenirA, fermerSansHistorique,
    get ouverte() { return etat.ouverte; },
    get ref() { return etat.pile[etat.pile.length - 1] || null; },
    get profondeur() { return etat.pile.length; },
  };

})(window);
