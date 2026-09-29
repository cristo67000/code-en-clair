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
 */
(function (racine) {

  const { element, bouton, svg } = Outils;
  const { t } = I18n;

  const etat = {
    pile: [],          // les références ouvertes, la dernière est à l'écran
    ouverte: false,
    notes: [],         // les notes du terme affiché
    suivi: null,
  };
  let conteneur = null;
  let corps = null;

  // ── Ouverture et fermeture ────────────────────────────────────────────────

  function ouvrir(ref, options) {
    const opt = options || {};
    if (!Glossaire.parId(ref)) return;
    const deja = etat.ouverte;
    if (deja && etat.pile[etat.pile.length - 1] === ref && !opt.forcer) return;
    etat.pile.push(ref);
    try { racine.history.pushState({ fiche: etat.pile.length }, ''); } catch (erreur) { /* historique indisponible */ }
    if (!deja) {
      etat.ouverte = true;
      conteneur.hidden = false;
      document.body.classList.add('fiche-ouverte');
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
    dessiner();
  }

  function fermerSansHistorique() {
    etat.pile = [];
    etat.ouverte = false;
    if (conteneur) conteneur.hidden = true;
    document.body.classList.remove('fiche-ouverte');
    document.dispatchEvent(new CustomEvent('fiche-fermee'));
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

  async function dessiner(defiler) {
    const ref = etat.pile[etat.pile.length - 1];
    const terme = Glossaire.parId(ref);
    corps.textContent = '';
    if (!terme) {
      corps.appendChild(element('p', 'vide', t('fiche.introuvable')));
      return;
    }
    const langue = I18n.langue;

    // Barre du haut : retour, favori, à revoir
    const barre = element('div', 'fiche-tete');
    const precedente = etat.pile.length > 1 ? Glossaire.parId(etat.pile[etat.pile.length - 2]) : null;
    barre.appendChild(bouton('fiche-retour', precedente ? '← ' + precedente.n : '← ' + t('fiche.retour'), retour));
    barre.appendChild(element('span', 'espace'));
    const fermer_ = bouton('fiche-fermer', '✕', fermer);
    fermer_.setAttribute('aria-label', t('fiche.fermer'));
    barre.appendChild(fermer_);
    corps.appendChild(barre);

    // Titre
    const tete = element('header', 'fiche-titre');
    tete.appendChild(element('h2', 'terme-nom', terme.n));
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

    // Actions : favori, à revoir
    const suivi = await Store.lireSuivi(ref).catch(() => null);
    etat.suivi = suivi;
    const actions = element('div', 'actions-fiche');
    const favori = bouton('bouton-etat' + (suivi && suivi.favori ? ' actif' : ''),
      (suivi && suivi.favori ? '★ ' + t('fiche.favori-oui') : '☆ ' + t('fiche.favori')), async () => {
        await Store.modifierSuivi(ref, (s) => { s.favori = !s.favori; });
        document.dispatchEvent(new CustomEvent('suivi-change'));
        dessiner(false);
      });
    favori.setAttribute('aria-pressed', suivi && suivi.favori ? 'true' : 'false');
    const revoir = bouton('bouton-etat' + (suivi && suivi.aRevoir ? ' actif revoir' : ''),
      (suivi && suivi.aRevoir ? '⚑ ' + t('fiche.a-revoir-oui') : '⚐ ' + t('fiche.a-revoir')), async () => {
        await Store.modifierSuivi(ref, (s) => { s.aRevoir = !s.aRevoir; if (!s.aRevoir) s.serie = 0; });
        document.dispatchEvent(new CustomEvent('suivi-change'));
        dessiner(false);
      });
    revoir.setAttribute('aria-pressed', suivi && suivi.aRevoir ? 'true' : 'false');
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
  }

  function brancher() {
    conteneur = document.getElementById('fiche');
    corps = document.getElementById('fiche-contenu');
    document.addEventListener('langue-changee', () => { if (etat.ouverte) dessiner(false); });
    document.addEventListener('notes-changees', () => { if (etat.ouverte) dessiner(false); });
    document.addEventListener('perso-change', () => { if (etat.ouverte) dessiner(false); });
    document.addEventListener('reglages-changes', () => { if (etat.ouverte) dessiner(false); });
  }

  racine.Fiche = {
    brancher, ouvrir, fermer, revenirA, fermerSansHistorique,
    get ouverte() { return etat.ouverte; },
    get ref() { return etat.pile[etat.pile.length - 1] || null; },
    get profondeur() { return etat.pile.length; },
  };

})(window);
